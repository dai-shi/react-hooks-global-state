import {
  useCallback,
  useEffect,
  useRef,
  useReducer,
  useState,
} from 'react';

// utility functions

const isFunction = (fn) => (typeof fn === 'function');

const updateValue = (oldValue, newValue) => {
  if (isFunction(newValue)) {
    return newValue(oldValue);
  }
  return newValue;
};

// core functions

const UPDATE_STATE = (
  process.env.NODE_ENV !== 'production' ? Symbol('UPDATE_STATE')
  /* for production */ : Symbol()
);

const PROP_UPDATER = 'r';
const PROP_STATE = 'e';

const PROP_USE_GLOBAL_STATE_PROVIDER = 'p';
const PROP_SET_GLOBAL_STATE = 's';
const PROP_USE_GLOBAL_STATE = 'u';
const PROP_GET_GLOBAL_STATE = 'g';
const PROP_GET_WHOLE_STATE = 'h';
const PROP_SET_WHOLE_STATE = 'i';
const PROP_DISPATCH_ACTION = 'd';

const createGlobalStateCommon = (reducer, initialState) => {
  const keys = Object.keys(initialState);
  let globalState = initialState;
  let linkedDispatch = null;
  const listeners = {};
  keys.forEach((key) => {
    listeners[key] = new Set();
  });

  const patchedReducer = (state, action) => {
    if (action.type === UPDATE_STATE) {
      return action[PROP_UPDATER] ? action[PROP_UPDATER](state) : action[PROP_STATE];
    }
    return reducer(state, action);
  };

  const validateName = (name) => {
    if (!keys.includes(name)) {
      throw new Error(`'${name}' not found. It must be provided in initialState as a property key.`);
    }
  };

  const setGlobalState = (name, update) => {
    if (process.env.NODE_ENV !== 'production') {
      validateName(name);
    }
    const updater = (previousState) => ({
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

  const notifyListeners = (prevState, nextState) => {
    keys.forEach((key) => {
      const nextPartialState = nextState[key];
      if (prevState[key] !== nextPartialState) {
        listeners[key].forEach((listener) => listener(nextPartialState));
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

  const useGlobalState = (name) => {
    if (process.env.NODE_ENV !== 'production') {
      validateName(name);
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
    const updater = useCallback((u) => setGlobalState(name, u), [name]);
    return [partialState, updater];
  };

  const getGlobalState = (name) => {
    if (process.env.NODE_ENV !== 'production') {
      validateName(name);
    }
    return globalState[name];
  };

  const getWholeState = () => globalState;

  const setWholeState = (nextGlobalState) => {
    if (linkedDispatch) {
      linkedDispatch({ type: UPDATE_STATE, [PROP_STATE]: nextGlobalState });
    } else {
      const prevGlobalState = globalState;
      globalState = nextGlobalState;
      notifyListeners(prevGlobalState, globalState);
    }
  };

  const dispatchAction = (action) => {
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
    [PROP_USE_GLOBAL_STATE_PROVIDER]: useGlobalStateProvider,
    [PROP_SET_GLOBAL_STATE]: setGlobalState,
    [PROP_USE_GLOBAL_STATE]: useGlobalState,
    [PROP_GET_GLOBAL_STATE]: getGlobalState,
    [PROP_GET_WHOLE_STATE]: getWholeState,
    [PROP_SET_WHOLE_STATE]: setWholeState,
    [PROP_DISPATCH_ACTION]: dispatchAction,
  };
};

// export functions

export const createGlobalState = (initialState) => {
  const {
    [PROP_USE_GLOBAL_STATE_PROVIDER]: useGlobalStateProvider,
    [PROP_USE_GLOBAL_STATE]: useGlobalState,
    [PROP_SET_GLOBAL_STATE]: setGlobalState,
    [PROP_GET_GLOBAL_STATE]: getGlobalState,
  } = createGlobalStateCommon((state) => state, initialState);
  return {
    useGlobalStateProvider,
    useGlobalState,
    setGlobalState,
    getGlobalState,
  };
};

export const createStore = (reducer, initialState, enhancer) => {
  if (!initialState) initialState = reducer(undefined, { type: undefined });
  if (enhancer) return enhancer(createStore)(reducer, initialState);
  const {
    [PROP_USE_GLOBAL_STATE_PROVIDER]: useGlobalStateProvider,
    [PROP_USE_GLOBAL_STATE]: useGlobalState,
    [PROP_GET_WHOLE_STATE]: getWholeState,
    [PROP_SET_WHOLE_STATE]: setWholeState,
    [PROP_DISPATCH_ACTION]: dispatchAction,
  } = createGlobalStateCommon(reducer, initialState);
  return {
    useGlobalStateProvider,
    useGlobalState,
    getState: getWholeState,
    setState: setWholeState, // for devtools.js
    dispatch: dispatchAction,
  };
};
