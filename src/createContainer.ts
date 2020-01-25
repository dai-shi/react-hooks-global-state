import {
  Dispatch,
  Reducer,
  SetStateAction,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';

// utility functions

const isFunction = (fn: unknown): fn is Function => (typeof fn === 'function');

const updateValue = <Value>(oldValue: Value, newValue: SetStateAction<Value>) => {
  if (isFunction(newValue)) {
    return newValue(oldValue);
  }
  return newValue;
};

const validateName = (keys: string[], name: string) => {
  if (!keys.includes(name)) {
    throw new Error(`'${name}' not found. It must be provided in initialState as a property key.`);
  }
};

// constants

const UPDATE_STATE = (
  process.env.NODE_ENV !== 'production' ? Symbol('UPDATE_STATE')
  /* for production */ : Symbol()
);

const PROP_UPDATER = 'r';
const PROP_STATE = 'e';

// createContainer

export const createContainer = <State, Action>(
  reducer: Reducer<State, Action>,
  initialState: State,
) => {
  const keys = Object.keys(initialState);

  let globalState = initialState;

  type PA1 = { type: typeof UPDATE_STATE; [PROP_UPDATER]: (prev: State) => State };
  type PA2 = { type: typeof UPDATE_STATE; [PROP_STATE]: State };
  type PatchAction = PA1 | PA2;
  let linkedDispatch: Dispatch<Action | PatchAction> | null = null;

  const listeners = {} as {
    [key in keyof State]: Set<Dispatch<SetStateAction<State[key]>>>;
  };
  keys.forEach((key) => { listeners[key as keyof State] = new Set(); });

  const patchedReducer = (state: State, action: Action | PatchAction) => {
    // how can it be typed more properly?
    if ((action as { type: unknown }).type === UPDATE_STATE) {
      return (action as { [PROP_UPDATER]: unknown })[PROP_UPDATER]
        ? (action as PA1)[PROP_UPDATER](state)
        : (action as PA2)[PROP_STATE];
    }
    return reducer(state, action as Action);
  };

  const setGlobalState = <Name extends keyof State>(
    name: Name,
    update: SetStateAction<State[Name]>,
  ) => {
    if (process.env.NODE_ENV !== 'production') {
      validateName(keys, name as string);
    }
    const updater = (previousState: State): State => ({
      ...previousState,
      [name]: updateValue(previousState[name], update),
    });
    if (linkedDispatch) {
      linkedDispatch({ type: UPDATE_STATE, [PROP_UPDATER]: updater });
    } else {
      globalState = updater(globalState);
      const nextPartialState = globalState[name];
      listeners[name].forEach((listener) => listener(nextPartialState));
    }
  };

  const notifyListeners = (prevState: State, nextState: State) => {
    keys.forEach((key) => {
      const nextPartialState = nextState[key as keyof State];
      if (prevState[key as keyof State] !== nextPartialState) {
        listeners[key as keyof State].forEach((listener) => listener(nextPartialState));
      }
    });
  };

  const useGlobalStateProvider = () => {
    const [state, dispatch] = useReducer(patchedReducer, globalState);
    useEffect(() => {
      if (linkedDispatch) throw new Error('Only one global state provider is allowed');
      linkedDispatch = dispatch;
      // in case it's changed before this effect is handled
      dispatch({ type: UPDATE_STATE, [PROP_STATE]: globalState });
      const cleanup = () => {
        linkedDispatch = null;
      };
      return cleanup;
    }, []);
    const prevGlobalState = useRef(state);
    notifyListeners(prevGlobalState.current, state);
    prevGlobalState.current = state;
    useEffect(() => {
      globalState = state;
    }, [state]);
  };

  const useGlobalState = <Name extends keyof State>(name: Name) => {
    if (process.env.NODE_ENV !== 'production') {
      validateName(keys, name as string);
    }
    const [partialState, setPartialState] = useState(globalState[name]);
    useEffect(() => {
      listeners[name].add(setPartialState);
      setPartialState(globalState[name]); // in case it's changed before this effect is handled
      const cleanup = () => {
        listeners[name].delete(setPartialState);
      };
      return cleanup;
    }, [name]);
    const updater = useCallback(
      (u: SetStateAction<State[Name]>) => setGlobalState(name, u),
      [name],
    );
    return [partialState, updater] as const;
  };

  const getGlobalState = <Name extends keyof State>(name: Name) => {
    if (process.env.NODE_ENV !== 'production') {
      validateName(keys, name as string);
    }
    return globalState[name];
  };

  const getWholeState = () => globalState;

  const setWholeState = (nextGlobalState: State) => {
    if (linkedDispatch) {
      linkedDispatch({ type: UPDATE_STATE, [PROP_STATE]: nextGlobalState });
    } else {
      const prevGlobalState = globalState;
      globalState = nextGlobalState;
      notifyListeners(prevGlobalState, globalState);
    }
  };

  const dispatchAction = (action: Action) => {
    if (linkedDispatch) {
      linkedDispatch(action);
    } else {
      const prevGlobalState = globalState;
      globalState = reducer(globalState, action);
      notifyListeners(prevGlobalState, globalState);
    }
    return action;
  };

  return {
    useGlobalStateProvider,
    useGlobalState,
    getGlobalState,
    setGlobalState,
    getState: getWholeState,
    setState: setWholeState, // for devtools.js
    dispatch: dispatchAction,
  };
};
