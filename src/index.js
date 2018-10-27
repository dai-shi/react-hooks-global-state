import { useState, useEffect } from 'react';

const isFunction = fn => (typeof fn === 'function');

export const createGlobalState = (initialState) => {
  const globalState = { ...initialState };
  const stateItemListeners = {};
  const stateItemUpdaters = {};
  const stateItemHooks = {};
  Object.keys(globalState).forEach((name) => {
    stateItemListeners[name] = [];
    stateItemUpdaters[name] = (func) => {
      if (isFunction(func)) {
        globalState[name] = func(globalState[name]);
      } else {
        globalState[name] = func;
      }
      stateItemListeners[name].forEach(f => f(globalState[name]));
    };
    stateItemHooks[name] = () => {
      const [value, setValue] = useState(globalState[name]);
      useEffect(() => {
        stateItemListeners[name].push(setValue);
        const cleanup = () => {
          const index = stateItemListeners[name].indexOf(setValue);
          stateItemListeners[name].splice(index, 1);
        };
        return cleanup;
      }, []);
      return [value, stateItemUpdaters[name]];
    };
  });
  Object.freeze(stateItemUpdaters);
  Object.freeze(stateItemHooks);
  return { stateItemUpdaters, stateItemHooks };
};
