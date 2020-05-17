import { Reducer } from 'react';
declare type Enhancer<Creator> = (creator: Creator) => Creator;
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
export declare const createStore: <State, Action>(reducer: Reducer<State, Action>, initialState?: State, enhancer?: Enhancer<any> | undefined) => {
    useGlobalState: <StateKey extends keyof State>(stateKey: StateKey) => [State[StateKey], (u: import("react").SetStateAction<State[StateKey]>) => void];
    getState: () => State;
    setState: (update: import("react").SetStateAction<State>) => void;
    dispatch: (action: Action) => Action;
};
export {};
