import { createStoreCommon } from './createStore';

type ExportFields =
  | 'useGlobalStateProvider'
  | 'useGlobalState'
  | 'getGlobalState'
  | 'setGlobalState';

/**
 * create gloal state
 *
 */
export const createGlobalState = <State>(initialState: State) => {
  const store = createStoreCommon((state: State) => state, initialState);
  return store as Pick<typeof store, ExportFields>;
};
