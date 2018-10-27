import { createGlobalState } from '../../src/index';

const { stateItemHooks } = createGlobalState({
  counter: 0,
  person: {
    age: 0,
    firstName: '',
    lastName: '',
  },
});

export const {
  counter: useGlobalStateCounter,
  person: useGlobalStatePerson,
} = stateItemHooks;
