import { Reducer } from 'react';
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
    useGlobalState: <StateKey extends keyof State>(stateKey: StateKey) => readonly [State[StateKey], (u: import("react").SetStateAction<State[StateKey]>) => void];
    getGlobalState: <StateKey_1 extends keyof State>(stateKey: StateKey_1) => State[StateKey_1];
    setGlobalState: <StateKey_2 extends keyof State>(stateKey: StateKey_2, update: import("react").SetStateAction<State[StateKey_2]>) => void;
    getState: () => State;
    setState: (nextGlobalState: State) => void;
    dispatch: (action: Action) => Action;
}, ExportFields>;
export {};
