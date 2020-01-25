import { Reducer, SetStateAction } from 'react';
export declare const createStoreCommon: <State, Action>(reducer: Reducer<State, Action>, initialState: State) => {
    useGlobalStateProvider: () => void;
    useGlobalState: <Name extends keyof State>(name: Name) => readonly [State[Name], (u: SetStateAction<State[Name]>) => void];
    getGlobalState: <Name_1 extends keyof State>(name: Name_1) => State[Name_1];
    setGlobalState: <Name_2 extends keyof State>(name: Name_2, update: SetStateAction<State[Name_2]>) => void;
    getState: () => State;
    setState: (nextGlobalState: State) => void;
    dispatch: (action: Action) => Action;
};
declare type Enhancer<Creator> = (creator: Creator) => Creator;
declare type ExportFields = 'useGlobalStateProvider' | 'useGlobalState' | 'getState' | 'dispatch';
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
export declare const createStore: <State, Action>(reducer: Reducer<State, Action>, initialState?: State, enhancer?: Enhancer<any> | undefined) => Pick<{
    useGlobalStateProvider: () => void;
    useGlobalState: <Name extends keyof State>(name: Name) => readonly [State[Name], (u: SetStateAction<State[Name]>) => void];
    getGlobalState: <Name_1 extends keyof State>(name: Name_1) => State[Name_1];
    setGlobalState: <Name_2 extends keyof State>(name: Name_2, update: SetStateAction<State[Name_2]>) => void;
    getState: () => State;
    setState: (nextGlobalState: State) => void;
    dispatch: (action: Action) => Action;
}, ExportFields>;
export {};
