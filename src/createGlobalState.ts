import { createAtom } from './createAtom';
import { useAtom } from './useAtom';

/**
 * create a gloal state
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
  const atom = createAtom(initialState);
  return {
    useGlobalState: <StateKey extends keyof State>(stateKey: StateKey) => (
      useAtom<State, StateKey>(atom, stateKey)
    ),
    getGlobalState: atom.getStateByKey,
    setGlobalState: atom.setStateByKey,
  };
};
