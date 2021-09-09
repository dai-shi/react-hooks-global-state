import { Dispatch } from 'react';

import { applyMiddleware, combineReducers } from 'redux';

import { createStore } from 'react-hooks-global-state';

const initialState = {
  count: 0,
  person: {
    age: 0,
    firstName: '',
    lastName: '',
  },
};

type State = typeof initialState;

type Action =
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

const logger = (
  { getState }: { getState: () => State },
) => (next: Dispatch<Action>) => (action: Action) => {
  /* eslint-disable no-console */
  console.log('will dispatch', action);
  const returnValue = next(action);
  console.log('state after dispatch', getState());
  /* eslint-enable no-console */
  return returnValue;
};

export const { dispatch, useStoreState } = createStore<State, Action>(
  reducer,
  initialState,
  applyMiddleware(logger),
);
