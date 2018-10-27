export type StateItemUpdater<T> = (f: ((v: T) => T) | T) => void;

export type StateItemHook<T> = () => [T, StateItemUpdater<T>];

export const createGlobalState: <S extends {}>(initialState: S) => {
  stateItemUpdaters: { [K in keyof S]: StateItemUpdater<S[K]> },
  stateItemHooks: { [K in keyof S]: StateItemHook<S[K]> },
};
