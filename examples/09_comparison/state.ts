import { createStore } from '../../src/index';

import { initialState, reducer } from './common';

export const { GlobalStateProvider, dispatch, useGlobalState } = createStore(reducer, initialState);
