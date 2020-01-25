import { Reducer, SetStateAction } from 'react';
export declare const createContainer: <State, Action>(reducer: Reducer<State, Action>, initialState: State) => {
    useGlobalStateProvider: () => void;
    useGlobalState: <Name extends keyof State>(name: Name) => readonly [State[Name], (u: SetStateAction<State[Name]>) => void];
    getGlobalState: <Name_1 extends keyof State>(name: Name_1) => State[Name_1];
    setGlobalState: <Name_2 extends keyof State>(name: Name_2, update: SetStateAction<State[Name_2]>) => void;
    getState: () => State;
    setState: (nextGlobalState: State) => void;
    dispatch: (action: Action) => Action;
};
