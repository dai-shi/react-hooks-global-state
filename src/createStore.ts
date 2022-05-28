/* eslint @typescript-eslint/no-explicit-any: off */

import { Reducer, SetStateAction, useCallback } from 'react';

import create from 'zustand';
import { redux } from 'zustand/middleware';

type ExtractState<S> = S extends {
  getState: () => infer T;
} ? T : never;

const validateStateKey = (keys: string[], stateKey: string) => {
  if (!keys.includes(stateKey)) {
    throw new Error(`'${stateKey}' not found. It must be provided in initialState as a property key.`);
  }
};

const isFunction = (fn: unknown): fn is Function => (typeof fn === 'function');

const updateValue = <Value>(oldValue: Value, newValue: SetStateAction<Value>) => (
  isFunction(newValue) ? newValue(oldValue) : newValue
);

/**
 * Create a global store.
 *
 * It returns a set of functions
 * - `useStoreState`: a custom hook to read store state by key
 * - `getState`: a function to get store state by key outside React
 * - `dispatch`: a function to dispatch an action to store
 *
 * A store works somewhat similarly to Redux, but not the same.
 *
 * @example
 * import { createStore } from 'react-hooks-global-state';
 *
 * const initialState = { count: 0 };
 * const reducer = ...;
 *
 * const store = createStore(reducer, initialState);
 * const { useStoreState, dispatch } = store;
 *
 * const Component = () => {
 *   const count = useStoreState('count');
 *   ...
 * };
 */
export const createStore = <State extends object, Action extends { type: unknown }>(
  reducer: Reducer<State, Action>,
  initialState: State = (reducer as any)(undefined, { type: undefined }),
  enhancer?: any,
): Store<State, Action> => {
  if (enhancer) return enhancer(createStore)(reducer, initialState);

  const useStore = create(redux(reducer, initialState));

  type BoundState = ExtractState<typeof useStore>;
  type StateKeys = keyof BoundState;
  const keys = Object.keys(initialState);

  const useStoreState = <StateKey extends StateKeys>(stateKey: StateKey) => {
    if (process.env.NODE_ENV !== 'production') {
      validateStateKey(keys, stateKey as string);
    }
    const selector = useCallback(
      (state: BoundState) => state[stateKey],
      [stateKey],
    );
    return useStore(selector);
  };

  const useGlobalState = <StateKey extends StateKeys>(stateKey: StateKey) => {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('[DEPRECATED] useStoreState instead');
    }
    const partialState = useStoreState(stateKey);
    const updater = useCallback(
      (update: SetStateAction<BoundState[StateKey]>) => {
        useStore.setState((previousState) => ({
          [stateKey]: updateValue(previousState[stateKey], update),
        } as Pick<BoundState, StateKey> as Partial<BoundState>));
      },
      [stateKey],
    );
    return [partialState, updater] as const;
  };

  return {
    useStoreState,
    useGlobalState,
    getState: useStore.getState,
    dispatch: useStore.dispatch,
  } as unknown as Store<State, Action>;
};

type Store<State, Action> = {
  useStoreState: <StateKey extends keyof State>(stateKey: StateKey) => State[StateKey];
  /**
   * useGlobalState created by createStore is deprecated.
   *
   * @deprecated useStoreState instead
   */
  useGlobalState: <StateKey extends keyof State>(stateKey: StateKey) => readonly [
    State[StateKey],
    (u: SetStateAction<State[StateKey]>) => void,
  ];
  getState: () => State;
  dispatch: (action: Action) => Action;
};
