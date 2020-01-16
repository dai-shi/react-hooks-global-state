import {
  createContext,
  createElement,
  useCallback,
  useEffect,
  useReducer,
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
} from 'react';

// utility functions

const isFunction = (fn) => (typeof fn === 'function');

const updateValue = (oldValue, newValue) => {
  if (isFunction(newValue)) {
    return newValue(oldValue);
  }
  return newValue;
};

// ref: https://github.com/dai-shi/react-hooks-global-state/issues/5
const useUnstableContextWithoutWarning = (Context, observedBits) => {
  const { ReactCurrentDispatcher } = __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  const dispatcher = ReactCurrentDispatcher.current;
  if (!dispatcher) {
    throw new Error('Hooks can only be called inside the body of a function component. (https://fb.me/react-invalid-hook-call)');
  }
  return dispatcher.useContext(Context, observedBits);
};

// core functions

const EMPTY_OBJECT = {};

const UPDATE_STATE = (
  process.env.NODE_ENV !== 'production' ? Symbol('UPDATE_STATE')
  /* for production */ : Symbol()
);

const PROP_UPDATER = 'r';
const PROP_STATE = 'e';

const PROP_GLOBAL_STATE_PROVIDER = 'p';
const PROP_SET_GLOBAL_STATE = 's';
const PROP_USE_GLOBAL_STATE = 'u';
const PROP_GET_GLOBAL_STATE = 'g';
const PROP_GET_WHOLE_STATE = 'h';
const PROP_SET_WHOLE_STATE = 'i';
const PROP_DISPATCH_ACTION = 'd';

const createGlobalStateCommon = (reducer, initialState) => {
  const keys = Object.keys(initialState);
  let wholeState = initialState;
  let listener = null;

  const patchedReducer = (state, action) => {
    if (action.type === UPDATE_STATE) {
      return action[PROP_UPDATER] ? action[PROP_UPDATER](state) : action[PROP_STATE];
    }
    return reducer(state, action);
  };

  const calculateChangedBits = (a, b) => {
    let bits = 0;
    keys.forEach((k, i) => {
      if (a[k] !== b[k]) bits |= 1 << i;
    });
    return bits;
  };

  const Context = createContext(EMPTY_OBJECT, calculateChangedBits);

  const GlobalStateProvider = ({ children }) => {
    const [state, dispatch] = useReducer(patchedReducer, initialState);
    useEffect(() => {
      if (listener) throw new Error('You cannot use <GlobalStateProvider> more than once.');
      listener = dispatch;
      if (state !== initialState) {
        // probably state was saved by react-hot-loader, so restore it
        wholeState = state;
      } else if (state !== wholeState) {
        // wholeState was updated during initialization
        dispatch({ type: UPDATE_STATE, [PROP_STATE]: wholeState });
      }
      const cleanup = () => {
        listener = null;
      };
      return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialState]); // trick for react-hot-loader
    useEffect(() => {
      // store the latest state
      wholeState = state;
    });
    return createElement(Context.Provider, { value: state }, children);
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
    if (listener) {
      listener({ type: UPDATE_STATE, [PROP_UPDATER]: updater });
    } else {
      wholeState = updater(wholeState);
    }
  };

  const useGlobalState = (name) => {
    if (process.env.NODE_ENV !== 'production') {
      validateName(name);
    }
    const index = keys.indexOf(name);
    const observedBits = 1 << index;
    const state = useUnstableContextWithoutWarning(Context, observedBits);
    if (state === EMPTY_OBJECT) throw new Error('Please use <GlobalStateProvider>');
    const updater = useCallback((u) => setGlobalState(name, u), [name]);
    return [state[name], updater];
  };

  const getGlobalState = (name) => {
    if (process.env.NODE_ENV !== 'production') {
      validateName(name);
    }
    return wholeState[name];
  };

  const getWholeState = () => wholeState;

  const setWholeState = (state) => {
    if (listener) {
      listener({ type: UPDATE_STATE, [PROP_STATE]: state });
    } else {
      wholeState = state;
    }
  };

  const dispatchAction = (action) => {
    if (listener) {
      listener(action);
    } else {
      wholeState = reducer(wholeState, action);
    }
    return action;
  };

  return {
    [PROP_GLOBAL_STATE_PROVIDER]: GlobalStateProvider,
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
    [PROP_GLOBAL_STATE_PROVIDER]: GlobalStateProvider,
    [PROP_USE_GLOBAL_STATE]: useGlobalState,
    [PROP_SET_GLOBAL_STATE]: setGlobalState,
    [PROP_GET_GLOBAL_STATE]: getGlobalState,
  } = createGlobalStateCommon((state) => state, initialState);
  return {
    GlobalStateProvider,
    useGlobalState,
    setGlobalState,
    getGlobalState,
  };
};

export const createStore = (reducer, initialState, enhancer) => {
  if (!initialState) initialState = reducer(undefined, { type: undefined });
  if (enhancer) return enhancer(createStore)(reducer, initialState);
  const {
    [PROP_GLOBAL_STATE_PROVIDER]: GlobalStateProvider,
    [PROP_USE_GLOBAL_STATE]: useGlobalState,
    [PROP_GET_WHOLE_STATE]: getWholeState,
    [PROP_SET_WHOLE_STATE]: setWholeState,
    [PROP_DISPATCH_ACTION]: dispatchAction,
  } = createGlobalStateCommon(reducer, initialState);
  return {
    GlobalStateProvider,
    useGlobalState,
    getState: getWholeState,
    setState: setWholeState, // for devtools.js
    dispatch: dispatchAction,
  };
};
