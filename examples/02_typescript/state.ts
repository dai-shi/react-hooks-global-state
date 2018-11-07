import { createGlobalState } from '../../src/index';

const { useGlobalState } = createGlobalState({
  counter: 0,
  person: {
    age: 0,
    firstName: '',
    lastName: '',
  },
});

export { useGlobalState };
