import { ComponentType, SetStateAction, Reducer } from 'react';

type SetGlobalState<S> = <N extends keyof S>(
  name: N,
  setStateAction: SetStateAction<S[N]>,
) => void;

type UseGlobalState<S> = <N extends keyof S>(name: N) => [
  S[N],
  (setStateAction: SetStateAction<S[N]>) => void,
];

export type Dispatch<A> = (action: A) => A;

export type Store<S, A> = {
  GlobalStateProvider: ComponentType;
  useGlobalState: UseGlobalState<S>;
  getState: () => S;
  dispatch: Dispatch<A>;
};

export type StoreCreator<S, A> = (reducer: Reducer<S, A>, initialState: S) => Store<S, A>;

export type Enhancer<S, A> = (creator: StoreCreator<S, A>) => StoreCreator<S, A>;

type AnyEnhancer = unknown;

export type CreateGlobalState = <S>(initialState: S) => {
  GlobalStateProvider: ComponentType;
  useGlobalState: UseGlobalState<S>;
  setGlobalState: SetGlobalState<S>;
  getGlobalState: <N extends keyof S>(name: N) => S[N];
};

export type CreateStore = <S, A>(
  reducer: Reducer<S, A>,
  initialState: S,
  enhancer?: Enhancer<S, A> | AnyEnhancer,
) => Store<S, A>;

type ReduxLikeReducer<S, A> = (state: S | undefined, action: A | { type: undefined }) => S;

export type CreateReduxLikeStore = <S, A>(
  reducer: ReduxLikeReducer<S, A>,
  initialState: S | undefined,
  enhancer?: Enhancer<S, A> | AnyEnhancer,
) => Store<S, A>;

type CreateStoreOverloaded = {
  <S, A>(
    reducer: Reducer<S, A>,
    initialState: S,
    enhancer?: Enhancer<S, A> | AnyEnhancer,
  ): Store<S, A>;
  <S, A>(
    reducer: ReduxLikeReducer<S, A>,
    initialState: S | undefined,
    enhancer?: Enhancer<S, A> | AnyEnhancer,
  ): Store<S, A>;
};

export const createGlobalState: CreateGlobalState;
export const createStore: CreateStoreOverloaded;
