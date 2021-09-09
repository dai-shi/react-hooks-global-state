import { createStore } from 'react-hooks-global-state';

import { initialState, reducer } from './common';

export const { dispatch, useStoreState } = createStore(reducer, initialState);
