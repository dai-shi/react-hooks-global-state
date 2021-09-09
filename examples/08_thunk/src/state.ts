import { applyMiddleware, combineReducers, compose } from 'redux';
import reduxLogger from 'redux-logger';
import reduxThunk from 'redux-thunk';

import { createStore } from 'react-hooks-global-state';

import { reduxDevToolsExt } from './devtools';

const initialState = {
  count: 0,
  person: {
    age: 0,
    firstName: '',
    lastName: '',
  },
};

export type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'setFirstName'; firstName: string }
  | { type: 'setLastName'; lastName: string }
  | { type: 'setAge'; age: number };

const countReducer = (state = initialState.count, action: Action) => {
  switch (action.type) {
    case 'increment': return state + 1;
    case 'decrement': return state - 1;
    default: return state;
  }
};

const personReducer = (state = initialState.person, action: Action) => {
  switch (action.type) {
    case 'setFirstName': return {
      ...state,
      firstName: action.firstName,
    };
    case 'setLastName': return {
      ...state,
      lastName: action.lastName,
    };
    case 'setAge': return {
      ...state,
      age: action.age,
    };
    default: return state;
  }
};

const reducer = combineReducers({
  count: countReducer,
  person: personReducer,
});

export const { dispatch, useGlobalState } = createStore<
  typeof initialState,
  Action
>(
  reducer,
  initialState,
  compose(
    applyMiddleware(reduxThunk, reduxLogger),
    reduxDevToolsExt(),
  ),
);
