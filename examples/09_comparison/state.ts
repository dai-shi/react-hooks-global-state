import { createStore } from '../../src/index';

import { initialState, reducer } from './common';

export const { dispatch, useGlobalState } = createStore(reducer, initialState);
