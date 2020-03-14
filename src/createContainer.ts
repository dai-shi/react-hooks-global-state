/* eslint @typescript-eslint/ban-ts-ignore: off */

import {
  Reducer,
  SetStateAction,
  // @ts-ignore
  createMutableSource,
  useCallback,
  // @ts-ignore
  useMutableSource,
} from 'react';

// utility functions

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

const GLOBAL_STATE_PROPERTY = 'g';
const LISTENERS_PROPERTY = 'l';

// createContainer

export const createContainer = <State, Action>(
  reducer: Reducer<State, Action>,
  initialState: State,
) => {
  type StateKeys = keyof State;
  const keys = Object.keys(initialState);

  const createListeners = () => {
    const listeners = {} as { [StateKey in StateKeys]: Set<() => void> };
    keys.forEach((key) => { listeners[key as StateKeys] = new Set(); });
    return listeners;
  };

  const source = {
    [GLOBAL_STATE_PROPERTY]: initialState,
    [LISTENERS_PROPERTY]: createListeners(),
  };

  const mutableSource = createMutableSource(
    source,
    (s: typeof source) => s[GLOBAL_STATE_PROPERTY],
  );

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
    source[GLOBAL_STATE_PROPERTY] = updater(source[GLOBAL_STATE_PROPERTY]);
    source[LISTENERS_PROPERTY][stateKey].forEach((listener) => {
      listener();
    });
  };

  const notifyListeners = (prevState: State, nextState: State) => {
    keys.forEach((key) => {
      const nextPartialState = nextState[key as StateKeys];
      if (prevState[key as StateKeys] !== nextPartialState) {
        source[LISTENERS_PROPERTY][key as StateKeys].forEach((listener) => {
          listener();
        });
      }
    });
  };

  const useGlobalState = <StateKey extends StateKeys>(stateKey: StateKey) => {
    if (process.env.NODE_ENV !== 'production') {
      validateStateKey(keys, stateKey as string);
    }
    const getSnapshot = useCallback((s: typeof source) => (
      s[GLOBAL_STATE_PROPERTY][stateKey]
    ), [stateKey]);
    const subscribe = useCallback((s: typeof source, callback: () => void) => {
      const listeners = s[LISTENERS_PROPERTY][stateKey];
      listeners.add(callback);
      const unsubscribe = () => {
        listeners.delete(callback);
      };
      return unsubscribe;
    }, [stateKey]);
    const partialState = useMutableSource(mutableSource, getSnapshot, subscribe);
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
    return source[GLOBAL_STATE_PROPERTY][stateKey];
  };

  const getWholeState = () => source[GLOBAL_STATE_PROPERTY];

  const setWholeState = (nextGlobalState: State) => {
    const prevGlobalState = source[GLOBAL_STATE_PROPERTY];
    source[GLOBAL_STATE_PROPERTY] = nextGlobalState;
    notifyListeners(prevGlobalState, nextGlobalState);
  };

  const dispatchAction = (action: Action) => {
    const prevGlobalState = source[GLOBAL_STATE_PROPERTY];
    source[GLOBAL_STATE_PROPERTY] = reducer(prevGlobalState, action);
    notifyListeners(prevGlobalState, source[GLOBAL_STATE_PROPERTY]);
    return action;
  };

  return {
    useGlobalState,
    getGlobalState,
    setGlobalState,
    getState: getWholeState,
    setState: setWholeState, // for devtools.js
    dispatch: dispatchAction,
  };
};
