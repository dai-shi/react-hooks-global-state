import { createContainer } from './createContainer';

type ExportFields =
  | 'useGlobalStateProvider'
  | 'useGlobalState'
  | 'getGlobalState'
  | 'setGlobalState';

/**
 * create a global state
 *
 * It returns a set of functions
 * - `useGlobalState`: a custom hook works like React.useState
 * - `getGlobalState`: a function to get a global state by key outside React
 * - `setGlobalState`: a function to set a global state by key outside React
 *
 * @example
 * import { createGlobalState } from 'react-hooks-global-state';
 *
 * const { useGlobalState } = createGlobalState({ count: 0 });
 *
 * const Component = () => {
 *   const [count, setCount] = useGlobalState('count');
 *   ...
 * };
 */
export const createGlobalState = <State>(initialState: State) => {
  const store = createContainer((state: State, _action: never) => state, initialState);
  return store as Pick<typeof store, ExportFields>;
};
