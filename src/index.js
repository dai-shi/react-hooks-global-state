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

const createGlobalStateCommon = (initialState) => {
  const keys = Object.keys(initialState);
  let globalState = initialState;
  let listener = null;

  const calculateChangedBits = (a, b) => {
    let bits = 0;
    keys.forEach((k, i) => {
      if (a[k] !== b[k]) bits |= 1 << i;
    });
    return bits;
  };

  const Context = createContext(initialState, calculateChangedBits);

  const GlobalStateProvider = ({ children }) => {
    const [state, setState] = useState(initialState);
    useEffect(() => {
      if (listener) throw new Error('You cannot use <GlobalStateProvider> more than once.');
      listener = setState;
      if (state !== initialState) {
        // probably state was saved by react-hot-loader, so restore it
        globalState = state;
      } else if (state !== globalState) {
        // globalState was updated during initialization
        setState(globalState);
      }
      const cleanup = () => {
        listener = null;
      };
      return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialState]); // trick for react-hot-loader
    return createElement(Context.Provider, { value: state }, children);
  };

  const setGlobalState = (name, update) => {
    globalState = {
      ...globalState,
      [name]: updateValue(globalState[name], update),
    };
    if (listener) {
      listener(globalState);
    }
  };

  const useGlobalState = (name) => {
    const index = keys.indexOf(name);
    const observedBits = 1 << index;
    const state = useUnstableContextWithoutWarning(Context, observedBits);
    const updater = useCallback(u => setGlobalState(name, u), [name]);
    return [state[name], updater];
  };

  const getState = () => globalState;

  const setState = (state) => {
    globalState = state;
    if (listener) {
      listener(globalState);
    }
  };

  return {
    GlobalStateProvider,
    setGlobalState,
    useGlobalState,
    getState,
    setState,
  };
};

// export functions

export const createGlobalState = (initialState) => {
  const {
    GlobalStateProvider,
    useGlobalState,
    setGlobalState,
  } = createGlobalStateCommon(initialState);
  return {
    GlobalStateProvider,
    useGlobalState,
    setGlobalState,
  };
};

export const createStore = (reducer, initialState, enhancer) => {
  if (!initialState) initialState = reducer(undefined, { type: undefined });
  if (enhancer) return enhancer(createStore)(reducer, initialState);
  const {
    GlobalStateProvider,
    useGlobalState,
    getState,
    setState,
  } = createGlobalStateCommon(initialState);
  const dispatch = (action) => {
    const oldState = getState();
    const newState = reducer(oldState, action);
    setState(newState);
    return action;
  };
  return {
    GlobalStateProvider,
    useGlobalState,
    getState,
    setState, // for devtools.js
    dispatch,
  };
};
