import { createGlobalState } from '../../src/index';

export const { useGlobalState } = createGlobalState({
  counter: 0,
  person: {
    age: 0,
    firstName: '',
    lastName: '',
  },
});
