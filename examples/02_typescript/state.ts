import { createGlobalState } from '../../src/index';

export const { GlobalStateProvider, useGlobalState } = createGlobalState({
  counter: 0,
  person: {
    age: 0,
    firstName: '',
    lastName: '',
  },
});
