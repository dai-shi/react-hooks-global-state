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

// eslint-disable-next-line @typescript-eslint/ban-types
const isFunction = (fn: unknown): fn is Function => (typeof fn === 'function');

const updateValue = <Value>(oldValue: Value, newValue: SetStateAction<Value>) => {
  if (isFunction(newValue)) {
    return newValue(oldValue);
  }
  return newValue;
};

const validateStateKey = (keys: string[], stateKey: string) => {
  if (!keys.includes(stateKey)) {
    throw new Error(`'${stateKey}' not found. It must be provided in initialState as a property key.`);
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
  type StateKeys = keyof State;
  const keys = Object.keys(initialState);

  let globalState = initialState;

  type PA1 = { type: typeof UPDATE_STATE; [PROP_UPDATER]: (prev: State) => State };
  type PA2 = { type: typeof UPDATE_STATE; [PROP_STATE]: State };
  type PatchAction = PA1 | PA2;
  let linkedDispatch: Dispatch<Action | PatchAction> | null = null;

  const listeners = {} as {
    [StateKey in StateKeys]: Set<Dispatch<SetStateAction<State[StateKey]>>>;
  };
  keys.forEach((key) => { listeners[key as StateKeys] = new Set(); });

  const patchedReducer = (state: State, action: Action | PatchAction) => {
    // how can it be typed more properly?
    if ((action as { type: unknown }).type === UPDATE_STATE) {
      return (action as { [PROP_UPDATER]: unknown })[PROP_UPDATER]
        ? (action as PA1)[PROP_UPDATER](state)
        : (action as PA2)[PROP_STATE];
    }
    return reducer(state, action as Action);
  };

  const setGlobalState = <StateKey extends StateKeys>(
    stateKey: StateKey,
    update: SetStateAction<State[StateKey]>,
  ) => {
    if (process.env.NODE_ENV !== 'production') {
      validateStateKey(keys, stateKey as string);
    }
    const updater = (previousState: State): State => ({
      ...previousState,
      [stateKey]: updateValue(previousState[stateKey], update),
    });
    if (linkedDispatch) {
      linkedDispatch({ type: UPDATE_STATE, [PROP_UPDATER]: updater });
    } else {
      globalState = updater(globalState);
      const nextPartialState = globalState[stateKey];
      listeners[stateKey].forEach((listener) => listener(nextPartialState));
    }
  };

  const notifyListeners = (prevState: State, nextState: State) => {
    keys.forEach((key) => {
      const nextPartialState = nextState[key as StateKeys];
      if (prevState[key as StateKeys] !== nextPartialState) {
        listeners[key as StateKeys].forEach((listener) => listener(nextPartialState));
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

  const useGlobalState = <StateKey extends StateKeys>(stateKey: StateKey) => {
    if (process.env.NODE_ENV !== 'production') {
      validateStateKey(keys, stateKey as string);
    }
    const [partialState, setPartialState] = useState(globalState[stateKey]);
    useEffect(() => {
      listeners[stateKey].add(setPartialState);
      setPartialState(globalState[stateKey]); // in case it's changed before this effect is handled
      const cleanup = () => {
        listeners[stateKey].delete(setPartialState);
      };
      return cleanup;
    }, [stateKey]);
    const updater = useCallback(
      (u: SetStateAction<State[StateKey]>) => setGlobalState(stateKey, u),
      [stateKey],
    );
    return [partialState, updater] as const;
  };

  const getGlobalState = <StateKey extends StateKeys>(stateKey: StateKey) => {
    if (process.env.NODE_ENV !== 'production') {
      validateStateKey(keys, stateKey as string);
    }
    return globalState[stateKey];
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
