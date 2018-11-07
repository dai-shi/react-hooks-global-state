import { useState, useEffect } from 'react';

// utility functions

const map = (obj, func) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => { newObj[key] = func(obj[key]); });
  return newObj;
};
const isFunction = fn => (typeof fn === 'function');

// core functions

const createStateItem = (initialValue) => {
  let value = initialValue;
  const getValue = () => value;
  const listeners = [];
  const updater = (funcOrVal) => {
    if (isFunction(funcOrVal)) {
      value = funcOrVal(value);
    } else {
      value = funcOrVal;
    }
    listeners.forEach(f => f(value));
  };
  const hook = () => {
    const [val, setVal] = useState(value);
    useEffect(() => {
      listeners.push(setVal);
      const cleanup = () => {
        const index = listeners.indexOf(setVal);
        listeners.splice(index, 1);
      };
      return cleanup;
    }, []);
    return [val, updater];
  };
  return { getValue, updater, hook };
};

const createGetState = (stateItemMap, initialState) => {
  const keys = Object.keys(stateItemMap);
  let globalState = initialState;
  const getState = () => {
    let changed = false;
    const currentState = {};
    // XXX an extra overhead here
    keys.forEach((key) => {
      currentState[key] = stateItemMap[key].getValue();
      if (currentState[key] !== globalState[key]) changed = true;
    });
    if (changed) globalState = currentState;
    return globalState;
  };
  return getState;
};

const createDispatch = (stateItemMap, getState, reducer) => {
  const keys = Object.keys(stateItemMap);
  const dispatch = (action) => {
    const oldState = getState();
    const newState = reducer(oldState, action);
    if (oldState !== newState) {
      keys.forEach((key) => {
        if (oldState[key] !== newState[key]) {
          stateItemMap[key].updater(newState[key]);
        }
      });
    }
    return action;
  };
  return dispatch;
};

// export functions

export const createGlobalState = (initialState) => {
  const stateItemMap = map(initialState, createStateItem);
  return {
    useGlobalState: name => stateItemMap[name].hook(),
    setGlobalState: (name, update) => stateItemMap[name].updater(update),
  };
};

export const createStore = (reducer, initialState, enhancer) => {
  if (enhancer) return enhancer(createStore)(reducer, initialState);
  const stateItemMap = map(initialState, createStateItem);
  const getState = createGetState(stateItemMap, initialState);
  const dispatch = createDispatch(stateItemMap, getState, reducer);
  return {
    useGlobalState: name => stateItemMap[name].hook(),
    getState,
    dispatch,
  };
};
