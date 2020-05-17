import { Reducer, SetStateAction, createMutableSource } from 'react';
declare type Unsubscribe = () => void;
export declare type Atom<State, Action> = {
    getState: () => State;
    setState: (update: SetStateAction<State>) => void;
    getStateByKey: <StateKey extends keyof State>(key: StateKey) => State[StateKey];
    setStateByKey: <StateKey extends keyof State>(key: StateKey, update: SetStateAction<State[StateKey]>) => void;
    dispatch: (action: Action) => Action;
    subscribe: (stateKey: null | keyof State, callback: () => void) => Unsubscribe;
    mutableSource: ReturnType<typeof createMutableSource>;
};
export declare function createAtom<State>(initialState: State): Atom<State, unknown>;
export declare function createAtom<State, Action>(initialState: State, reducer: Reducer<State, Action>): Atom<State, Action>;
export {};
