/* eslint @typescript-eslint/no-explicit-any: off */

import { Reducer, useCallback } from 'react';

import create from 'zustand';
import { redux } from 'zustand/middleware';

const validateStateKey = (keys: string[], stateKey: string) => {
  if (!keys.includes(stateKey)) {
    throw new Error(`'${stateKey}' not found. It must be provided in initialState as a property key.`);
  }
};

type Store<State, Action> = {
  useGlobalState: <StateKey extends keyof State>(stateKey: StateKey) => readonly [State[StateKey]];
  getState: () => State;
  dispatch: (action: Action) => Action;
};

/**
 * create a global store
 *
 * In additon to `useGlobaState` which is the same hook as in createGlobalState,
 * a store has `getState` and `dispatch`.
 * A store works somewhat similarly to Redux, but not the same.
 *
 * @example
 * import { createStore } from 'react-hooks-global-state';
 *
 * const initialState = { count: 0 };
 * const reducer = ...;
 *
 * const store = createStore(reducer, initialState);
 * const { useGlobalState } = store;
 *
 * const Component = () => {
 *   const [count, setCount] = useGlobalState('count');
 *   ...
 * };
 */
export const createStore = <State extends object, Action extends { type: unknown }>(
  reducer: Reducer<State, Action>,
  initialState: State = (reducer as any)(undefined, { type: undefined }),
  enhancer?: any,
): Store<State, Action> => {
  if (enhancer) return enhancer(createStore)(reducer, initialState) as never;

  const useStore = create<State>(redux(reducer, initialState));

  type StateKeys = keyof State;
  const keys = Object.keys(initialState);

  const useGlobalState = <StateKey extends StateKeys>(stateKey: StateKey) => {
    if (process.env.NODE_ENV !== 'production') {
      validateStateKey(keys, stateKey as string);
    }
    const selector = useCallback((state: State) => state[stateKey], [stateKey]);
    const partialState = useStore(selector);
    return [partialState] as const;
  };

  return {
    useGlobalState,
    getState: useStore.getState,
    dispatch: (useStore as any).dispatch,
  };
};
