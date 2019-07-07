import { createGlobalState } from 'react-hooks-global-state';

export const { GlobalStateProvider, useGlobalState } = createGlobalState({
  count: 0,
  person: {
    age: 0,
    firstName: '',
    lastName: '',
  },
});
