import { createGlobalState } from 'react-hooks-global-state';

const { setGlobalState, useGlobalState } = createGlobalState({
  count: 0,
  person: {
    age: 0,
    firstName: '',
    lastName: '',
  },
});

export const countUp = () => {
  setGlobalState('count', (v) => v + 1);
};

export const countDown = () => {
  setGlobalState('count', (v) => v - 1);
};

export const setPersonFirstName = (firstName: string) => {
  setGlobalState('person', (v) => ({ ...v, firstName }));
};

export const setPersonLastName = (lastName: string) => {
  setGlobalState('person', (v) => ({ ...v, lastName }));
};

export const setPersonAge = (age: number) => {
  setGlobalState('person', (v) => ({ ...v, age }));
};

export { useGlobalState };
