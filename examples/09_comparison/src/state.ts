import { createStore } from 'react-hooks-global-state';

import { initialState, reducer } from './common';

export const { GlobalStateProvider, dispatch, useGlobalState } = createStore(reducer, initialState);
