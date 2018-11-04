import { useState, useEffect } from 'react';

const map = (obj, func) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    newObj[key] = func(obj[key]);
  });
  return newObj;
};
const isFunction = fn => (typeof fn === 'function');
const defaultReducer = state => state;

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

const createDispatch = (stateItemMap, reducer) => {
  const dispatch = (action) => {
    const oldState = {};
    Object.keys(stateItemMap).forEach((name) => {
      oldState[name] = stateItemMap[name].getValue();
    });
    const newState = reducer(oldState, action);
    Object.keys(oldState).forEach((name) => {
      if (oldState[name] !== newState[name]) {
        stateItemMap[name].updater(newState[name]);
      }
    });
  };
  return dispatch;
};

export const createGlobalState = (initialState, reducer = defaultReducer) => {
  const stateItemMap = map(initialState, createStateItem);
  return {
    stateItemUpdaters: Object.freeze(map(stateItemMap, x => x.updater)),
    stateItemHooks: Object.freeze(map(stateItemMap, x => x.hook)),
    dispatch: createDispatch(stateItemMap, reducer),
  };
};
