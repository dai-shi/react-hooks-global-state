import { createGlobalState } from 'react-hooks-global-state';

const { GlobalStateProvider, setGlobalState, useGlobalState } = createGlobalState({
  errorMessage: '',
  pageTitle: '',
});

export const setErrorMessage = (s: string) => {
  setGlobalState('errorMessage', s);
};

export const setPageTitle = (s: string) => {
  setGlobalState('pageTitle', s);
};

export { GlobalStateProvider, useGlobalState };
