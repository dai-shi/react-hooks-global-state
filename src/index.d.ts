export type StateItemUpdater<T> = (f: ((v: T) => T) | T) => void;

export type StateItemHook<T> = () => [T, StateItemUpdater<T>];

export type Reducer<S, A> = (state: S, action: A) => S;

export type Dispatch<A> = (action: A) => A;

export type Store<S, A> = {
  useGlobalState: () => { [K in keyof S]: StateItemHook<S[K]> },
  getState: () => S,
  dispatch: Dispatch<A>,
};

export type StoreCreator<S, A> = (reducer: Reducer<S, A>, initialState: S) => Store<S, A>;

export type Enhancer<S, A> = (creator: StoreCreator<S, A>) => StoreCreator<S, A>;

export type CreateGlobalState = <S extends {}, A extends {}>(initialState: S) => {
  stateItemHooks: { [K in keyof S]: StateItemHook<S[K]> },
  stateItemUpdaters: { [K in keyof S]: StateItemUpdater<S[K]> },
};

export type CreateStore = <S extends {}, A extends {}>(
  reducer: Reducer<S, A>,
  initialState: S,
  enhancer?: Enhancer<S, A>,
) => Store<S, A>;

export const createGlobalState: CreateGlobalState;
export const createStore: CreateStore;
