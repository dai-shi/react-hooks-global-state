import { createGlobalState } from '../../src/index';

type Action = {
  type: 'increment',
} | {
  type: 'decrement',
} | {
  type: 'setFirstName',
  firstName: string,
} | {
  type: 'setLastName',
  lastName: string,
} | {
  type: 'setAge',
  age: number,
};

const { dispatch, stateItemHooks } = createGlobalState(
  {
    counter: 0,
    person: {
      age: 0,
      firstName: '',
      lastName: '',
    },
  },
  (state, action: Action) => {
    switch (action.type) {
      case 'increment': return {
        ...state,
        counter: state.counter + 1,
      };
      case 'decrement': return {
        ...state,
        counter: state.counter - 1,
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
);

export const {
  counter: useGlobalStateCounter,
  person: useGlobalStatePerson,
} = stateItemHooks;

export { dispatch };
