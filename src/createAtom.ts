/* eslint @typescript-eslint/ban-ts-comment: off */
/* eslint @typescript-eslint/no-non-null-assertion: off */

import {
  Reducer,
  SetStateAction,
  // @ts-ignore
  createMutableSource,
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

// createAtom

type Unsubscribe = () => void;

export type Atom<State, Action> = {
  getState: () => State;
  setState: (update: SetStateAction<State>) => void;
  getStateByKey: <StateKey extends keyof State>(
    key: StateKey,
  ) => State[StateKey];
  setStateByKey: <StateKey extends keyof State>(
    key: StateKey,
    update: SetStateAction<State[StateKey]>,
  ) => void;
  dispatch: (action: Action) => Action;
  subscribe: (stateKey: null | keyof State, callback: () => void) => Unsubscribe;
  mutableSource: ReturnType<typeof createMutableSource>;
};

export function createAtom<State>(
  initialState: State,
): Atom<State, unknown>;

export function createAtom<State, Action>(
  initialState: State,
  reducer: Reducer<State, Action>,
): Atom<State, Action>;

/**
 * create an atom
 *
 * It returns a set of functions to be called outside React
 * - `getStateByKey`: a function to get the part of state by key outside React
 * - `setStateByKey`: a function to set the part of state by key outside React
 * - `getState`: a function to get the entire state
 * - `setState`: a function to get the entire state
 * - `dispatch`: an optional function that can be used if reducer is provided
 *
 * @example
 * import { createAtom } from 'react-hooks-global-state';
 *
 * const atom = createAtom({ count: 0 });
 *
 * atom.setStateByKey('count', 1);
 */
export function createAtom<State, Action>(
  initialState: State,
  reducer?: Reducer<State, Action>,
) {
  type StateKeys = keyof State;
  type NullableStateKeys = null | StateKeys;
  const keys = Object.keys(initialState);

  const createListenersMap = () => {
    const listenersMap = new Map<NullableStateKeys, Set<() => void>>();
    keys.forEach((key) => { listenersMap.set(key as StateKeys, new Set()); });
    listenersMap.set(null, new Set());
    return listenersMap;
  };

  let state = initialState;
  const listenersMap = createListenersMap();

  const setStateByKey = <StateKey extends StateKeys>(
    stateKey: StateKey,
    update: SetStateAction<State[StateKey]>,
  ) => {
    if (process.env.NODE_ENV !== 'production') {
      validateStateKey(keys, stateKey as string);
    }
    const updater = (prevState: State): State => ({
      ...prevState,
      [stateKey]: updateValue(prevState[stateKey], update),
    });
    state = updater(state);
    listenersMap.get(stateKey)!.forEach((listener) => {
      listener();
    });
    listenersMap.get(null)!.forEach((listener) => {
      listener();
    });
  };

  const notifyListeners = (prevState: State, nextState: State) => {
    keys.forEach((key) => {
      const nextPartialState = nextState[key as StateKeys];
      if (prevState[key as StateKeys] !== nextPartialState) {
        listenersMap.get(key as StateKeys)!.forEach((listener) => {
          listener();
        });
      }
    });
    listenersMap.get(null)!.forEach((listener) => {
      listener();
    });
  };

  const subscribe = (stateKey: NullableStateKeys, callback: () => void) => {
    const listeners = listenersMap.get(stateKey)!;
    listeners.add(callback);
    const unsubscribe = () => {
      listeners.delete(callback);
    };
    return unsubscribe;
  };

  const getStateByKey = <StateKey extends StateKeys>(stateKey: StateKey) => {
    if (process.env.NODE_ENV !== 'production') {
      validateStateKey(keys, stateKey as string);
    }
    return state[stateKey];
  };

  const getState = () => state;

  const setState = (update: SetStateAction<State>) => {
    const prevState = state;
    state = updateValue(prevState, update);
    notifyListeners(prevState, state);
  };

  const dispatch = (action: Action) => {
    if (!reducer) throw new Error('no reducer specified');
    const prevState = state;
    state = reducer(prevState, action);
    notifyListeners(prevState, state);
    return action;
  };

  const atom = {
    getState,
    setState,
    getStateByKey,
    setStateByKey,
    dispatch,
    subscribe,
    mutableSource: undefined,
  };
  atom.mutableSource = createMutableSource(atom, () => state);

  return atom;
}
