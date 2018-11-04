export type StateItemUpdater<T> = (f: ((v: T) => T) | T) => void;

export type StateItemHook<T> = () => [T, StateItemUpdater<T>];

export type Reducer<S, A> = (state: S, action: A) => S;

export type CreateGlobalState =
  <S extends {}, A extends {}>(initialState: S, reducer?: Reducer<S, A>) => {
    stateItemUpdaters: { [K in keyof S]: StateItemUpdater<S[K]> },
    stateItemHooks: { [K in keyof S]: StateItemHook<S[K]> },
    dispatch: (action: A) => void;
  };

export const createGlobalState: CreateGlobalState;
