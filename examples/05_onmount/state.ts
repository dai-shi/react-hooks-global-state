import { createGlobalState } from '../../src/index';

const { setGlobalState, useGlobalState } = createGlobalState({
  errorMessage: '',
  pageTitle: '',
});

export const setErrorMessage = (s: string) => {
  setGlobalState('errorMessage', s);
};

export const setPageTitle = (s: string) => {
  setGlobalState('pageTitle', s);
};

export { useGlobalState };
