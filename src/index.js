import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useState,
  useEffect,
} from 'react';

// utility functions

const isFunction = fn => (typeof fn === 'function');
const updateValue = (oldValue, newValue) => {
  if (isFunction(newValue)) {
    return newValue(oldValue);
  }
  return newValue;
};

// core functions

const createGlobalStateCommon = (initialState) => {
  const keys = Object.keys(initialState);
  let globalState = initialState;
  const listeners = [];

  const calculateChangedBits = (a, b) => {
    let bits = 0;
    keys.forEach((k, i) => {
      if (a[k] !== b[k]) bits |= 1 << i;
    });
    return bits;
  };

  const context = createContext(initialState, calculateChangedBits);

  const GlobalStateProvider = ({ children }) => {
    const [state, setState] = useState(initialState);
    useEffect(() => {
      listeners.push(setState);
      const cleanup = () => {
        const index = listeners.indexOf(setState);
        listeners.splice(index, 1);
      };
      return cleanup;
    }, []);
    return createElement(context.Provider, { value: state }, children);
  };

  const setGlobalState = (name, update) => {
    globalState = {
      ...globalState,
      [name]: updateValue(globalState[name], update),
    };
    listeners.forEach(f => f(globalState));
  };

  const useGlobalState = (name) => {
    const index = keys.indexOf(name);
    const state = useContext(context, 1 << index);
    const updater = useCallback(u => setGlobalState(name, u), [name]);
    return [state[name], updater];
  };

  const getState = () => globalState;

  const setState = (state) => {
    globalState = state;
    listeners.forEach(f => f(globalState));
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
