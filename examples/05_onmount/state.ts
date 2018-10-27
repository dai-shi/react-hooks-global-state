import { createGlobalState } from '../../src/index';

const { stateItemHooks, stateItemUpdaters } = createGlobalState({
  errorMessage: '',
  pageTitle: '',
});

export const {
  errorMessage: useGlobalStateErrorMessage,
  pageTitle: useGlobalStatePageTitle,
} = stateItemHooks;

export const setErrorMessage = (s: string) => {
  const update = stateItemUpdaters.errorMessage;
  update(s);
};

export const setPageTitle = (s: string) => {
  const update = stateItemUpdaters.pageTitle;
  update(s);
};
