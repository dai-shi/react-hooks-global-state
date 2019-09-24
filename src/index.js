import {
  createContext,
  createElement,
  useCallback,
  useState,
  useEffect,
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
} from 'react';

// utility functions

const isFunction = fn => (typeof fn === 'function');

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

const createGlobalStateCommon = (initialState) => {
  const keys = Object.keys(initialState);
  let wholeGlobalState = initialState;
  let listener = null;

  const calculateChangedBits = (a, b) => {
    let bits = 0;
    keys.forEach((k, i) => {
      if (a[k] !== b[k]) bits |= 1 << i;
    });
    return bits;
  };

  const Context = createContext(EMPTY_OBJECT, calculateChangedBits);

  const GlobalStateProvider = ({ children }) => {
    const [state, setState] = useState(initialState);
    useEffect(() => {
      if (listener) throw new Error('You cannot use <GlobalStateProvider> more than once.');
      listener = setState;
      if (state !== initialState) {
        // probably state was saved by react-hot-loader, so restore it
        wholeGlobalState = state;
      } else if (state !== wholeGlobalState) {
        // wholeGlobalState was updated during initialization
        setState(wholeGlobalState);
      }
      const cleanup = () => {
        listener = null;
      };
      return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialState]); // trick for react-hot-loader
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
    wholeGlobalState = {
      ...wholeGlobalState,
      [name]: updateValue(wholeGlobalState[name], update),
    };
    if (listener) {
      listener(wholeGlobalState);
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
    const updater = useCallback(u => setGlobalState(name, u), [name]);
    return [state[name], updater];
  };

  const getGlobalState = (name) => {
    if (process.env.NODE_ENV !== 'production') {
      validateName(name);
    }
    return wholeGlobalState[name];
  };

  const getWholeGlobalState = () => wholeGlobalState;

  const setWholeGlobalState = (state) => {
    wholeGlobalState = state;
    if (listener) {
      listener(wholeGlobalState);
    }
  };

  return {
    GlobalStateProvider,
    setGlobalState,
    useGlobalState,
    getGlobalState,
    getWholeGlobalState,
    setWholeGlobalState,
  };
};

// export functions

export const createGlobalState = (initialState) => {
  const {
    GlobalStateProvider,
    useGlobalState,
    setGlobalState,
    getGlobalState,
  } = createGlobalStateCommon(initialState);
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
    GlobalStateProvider,
    useGlobalState,
    getWholeGlobalState,
    setWholeGlobalState,
  } = createGlobalStateCommon(initialState);
  const dispatch = (action) => {
    const oldState = getWholeGlobalState();
    const newState = reducer(oldState, action);
    setWholeGlobalState(newState);
    return action;
  };
  return {
    GlobalStateProvider,
    useGlobalState,
    getState: getWholeGlobalState,
    setState: setWholeGlobalState, // for devtools.js
    dispatch,
  };
};
