/// <reference types="react" />
declare type ExportFields = 'useGlobalStateProvider' | 'useGlobalState' | 'getGlobalState' | 'setGlobalState';
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
export declare const createGlobalState: <State>(initialState: State) => Pick<{
    useGlobalStateProvider: () => void;
    useGlobalState: <StateKey extends keyof State>(stateKey: StateKey) => readonly [State[StateKey], (u: import("react").SetStateAction<State[StateKey]>) => void];
    getGlobalState: <StateKey_1 extends keyof State>(stateKey: StateKey_1) => State[StateKey_1];
    setGlobalState: <StateKey_2 extends keyof State>(stateKey: StateKey_2, update: import("react").SetStateAction<State[StateKey_2]>) => void;
    getState: () => State;
    setState: (nextGlobalState: State) => void;
    dispatch: (action: never) => never;
}, ExportFields>;
export {};
