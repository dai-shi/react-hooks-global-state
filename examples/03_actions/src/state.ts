import { createGlobalState } from 'react-hooks-global-state';

const { GlobalStateProvider, setGlobalState, useGlobalState } = createGlobalState({
  counter: 0,
  person: {
    age: 0,
    firstName: '',
    lastName: '',
  },
});

export const countUp = () => {
  setGlobalState('counter', v => v + 1);
};

export const countDown = () => {
  setGlobalState('counter', v => v - 1);
};

export const setPersonFirstName = (firstName: string) => {
  setGlobalState('person', v => ({ ...v, firstName }));
};

export const setPersonLastName = (lastName: string) => {
  setGlobalState('person', v => ({ ...v, lastName }));
};

export const setPersonAge = (age: number) => {
  setGlobalState('person', v => ({ ...v, age }));
};

export { GlobalStateProvider, useGlobalState };
