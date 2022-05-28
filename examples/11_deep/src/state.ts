import { createStore } from 'react-hooks-global-state';

type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'setFirstName'; firstName: string }
  | { type: 'setLastName'; lastName: string }
  | { type: 'setAge'; age: number };

export const { dispatch, useStoreState } = createStore(
  (state, action: Action) => {
    switch (action.type) {
      case 'increment': return {
        ...state,
        count: state.count + 1,
      };
      case 'decrement': return {
        ...state,
        count: state.count - 1,
      };
      case 'setFirstName': return {
        ...state,
        person: {
          ...state.person,
          firstName: action.firstName,
        },
      };
      case 'setLastName': return {
        ...state,
        person: {
          ...state.person,
          lastName: action.lastName,
        },
      };
      case 'setAge': return {
        ...state,
        person: {
          ...state.person,
          age: action.age,
        },
      };
      default: return state;
    }
  },
  {
    count: 0,
    person: {
      age: 0,
      firstName: '',
      lastName: '',
    },
  },
);
