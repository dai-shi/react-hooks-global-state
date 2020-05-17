/* eslint @typescript-eslint/no-explicit-any: off */

import { Reducer } from 'react';

import { Atom, createAtom } from './createAtom';
import { useAtom } from './useAtom';

type Enhancer<Creator> = (creator: Creator) => Creator;

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
export const createStore = <State, Action>(
  reducer: Reducer<State, Action>,
  initialState: State = (reducer as any)(undefined, { type: undefined }),
  enhancer?: Enhancer<any>,
) => {
  if (enhancer) return enhancer(createStore)(reducer, initialState) as never;
  const atom = createAtom(initialState, reducer);
  return {
    useGlobalState: <StateKey extends keyof State>(stateKey: StateKey) => (
      useAtom<State, StateKey>(atom as Atom<State, any>, stateKey)
    ),
    getState: atom.getState,
    setState: atom.setState, // for library use
    dispatch: atom.dispatch,
  };
};
