import { Reducer, SetStateAction } from 'react';
export declare const createContainer: <State, Action>(reducer: Reducer<State, Action>, initialState: State) => {
    useGlobalStateProvider: () => void;
    useGlobalState: <StateKey extends keyof State>(stateKey: StateKey) => readonly [State[StateKey], (u: SetStateAction<State[StateKey]>) => void];
    getGlobalState: <StateKey_1 extends keyof State>(stateKey: StateKey_1) => State[StateKey_1];
    setGlobalState: <StateKey_2 extends keyof State>(stateKey: StateKey_2, update: SetStateAction<State[StateKey_2]>) => void;
    getState: () => State;
    setState: (nextGlobalState: State) => void;
    dispatch: (action: Action) => Action;
};
