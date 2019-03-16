import * as React from 'react';

export type GlobalStateProviderProps = {
  children?: React.ReactNode;
};

export type Update<T> = ((v: T) => T) | T;

export type SetGlobalState<S> = <N extends keyof S>(
  name: N,
  update: Update<S[N]>,
) => void;

export type HookResult<T> = [T, (u: Update<T>) => void];

export type Reducer<S, A> = (state: S, action: A) => S;
export type ReduxLikeReducer<S, A> = (state: S | undefined, action: A | { type: undefined }) => S;

export type Dispatch<A> = (action: A) => A;

export type UseGlobalState<S> = <N extends keyof S>(name: N) => HookResult<S[N]>;

export type Store<S, A> = {
  GlobalStateProvider: React.ComponentType<GlobalStateProviderProps>;
  useGlobalState: UseGlobalState<S>;
  getState: () => S;
  dispatch: Dispatch<A>;
};

export type StoreCreator<S, A> = (reducer: Reducer<S, A>, initialState: S) => Store<S, A>;

export type Enhancer<S, A> = (creator: StoreCreator<S, A>) => StoreCreator<S, A>;

type AnyEnhancer = unknown;

export type CreateGlobalState = <S>(initialState: S) => {
  GlobalStateProvider: React.ComponentType<GlobalStateProviderProps>;
  useGlobalState: UseGlobalState<S>;
  setGlobalState: SetGlobalState<S>;
};

export type CreateStore = <S, A>(
  reducer: Reducer<S, A>,
  initialState: S,
  enhancer?: Enhancer<S, A> | AnyEnhancer,
) => Store<S, A>;

export type CreateReduxLikeStore = <S, A>(
  reducer: ReduxLikeReducer<S, A>,
  enhancer?: Enhancer<S, A> | AnyEnhancer,
) => Store<S, A>;

export const createGlobalState: CreateGlobalState;
export const createStore: CreateStore;
export const createReduxLikeStore: CreateReduxLikeStore;
