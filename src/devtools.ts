/* eslint @typescript-eslint/no-explicit-any: off */

const compose = (...fns: any[]) => fns.reduce((p, c) => (...args: any[]) => p(c(...args)));

const initAction = () => ({ type: '@@redux/INIT' });

const createEnhancers = () => {
  let savedReducer: any;
  let savedInitialState: any;
  const before = (createStore: any) => (reducer: any, initialState: any, enhancer: any) => {
    savedReducer = reducer;
    savedInitialState = initialState;
    if (enhancer) return enhancer(createStore)(reducer, initialState);
    const store = createStore(reducer, initialState);
    return {
      ...store,
      useGlobalState: (stateKey: any) => {
        const [value] = store.useGlobalState(stateKey);
        const MESG = 'Update is not allowed when using DevTools';
        return [value, () => { throw new Error(MESG); }];
      },
    };
  };
  const after = (createStore: any) => (reducer: any, initialState: any, enhancer: any) => {
    if (enhancer) return enhancer(createStore)(reducer, initialState);
    const store = createStore(savedReducer, savedInitialState);
    let devState = {
      ...reducer(initialState, initAction()),
      ...savedInitialState,
    };
    const getState = () => devState;
    const listeners: any = [];
    const dispatch = (action: any) => {
      devState = reducer(devState, action);
      store.setState(devState.computedStates[devState.currentStateIndex].state);
      listeners.forEach((f: any) => f());
      return action;
    };
    const subscribe = (listener: any) => {
      listeners.push(listener);
      const unsubscribe = () => {
        const index = listeners.indexOf(listener);
        listeners.splice(index, 1);
      };
      return unsubscribe;
    };
    return {
      ...store,
      getState,
      dispatch,
      subscribe,
    };
  };
  return { before, after };
};

export const reduxDevToolsExt = () => {
  if (!(window as any).__REDUX_DEVTOOLS_EXTENSION__) return (f: any) => f;
  const { before, after } = createEnhancers();
  return compose(
    before,
    (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
    after,
  );
};
