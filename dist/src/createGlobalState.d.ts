/// <reference types="react" />
declare type ExportFields = 'useGlobalStateProvider' | 'useGlobalState' | 'getGlobalState' | 'setGlobalState';
/**
 * create a gloal state
 *
 * It returns a set of functions
 * - `useGlobalState`: a custom hook works like React.useState
 * - `getGlobalState`: a function to get a global state by name outside React
 * - `setGlobalState`: a function to set a global state by name outside React
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
    useGlobalState: <Name extends keyof State>(name: Name) => readonly [State[Name], (u: import("react").SetStateAction<State[Name]>) => void];
    getGlobalState: <Name_1 extends keyof State>(name: Name_1) => State[Name_1];
    setGlobalState: <Name_2 extends keyof State>(name: Name_2, update: import("react").SetStateAction<State[Name_2]>) => void;
    getState: () => State;
    setState: (nextGlobalState: State) => void;
    dispatch: (action: never) => never;
}, ExportFields>;
export {};
