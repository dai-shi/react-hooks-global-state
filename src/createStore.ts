import { Reducer } from 'react';

import { createContainer } from './createContainer';

type Enhancer<Creator> = (creator: Creator) => Creator;

type ExportFields =
  | 'useGlobalStateProvider'
  | 'useGlobalState'
  | 'getState'
  | 'dispatch';

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
  /* eslint-disable @typescript-eslint/no-explicit-any */
  initialState: State = (reducer as any)(undefined, { type: undefined }),
  enhancer?: Enhancer<any>,
  /* eslint-enable @typescript-eslint/no-explicit-any */
) => {
  if (enhancer) return enhancer(createStore)(reducer, initialState) as never;
  const store = createContainer(reducer, initialState);
  return store as Pick<typeof store, ExportFields>;
};
