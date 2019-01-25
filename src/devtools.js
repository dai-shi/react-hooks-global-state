const compose = (...fns) => fns.reduce((p, c) => (...args) => p(c(...args)));

const initAction = () => ({ type: '@@redux/INIT' });

const createEnhancers = () => {
  let savedReducer;
  let savedInitialState;
  const before = createStore => (reducer, initialState, enhancer) => {
    savedReducer = reducer;
    savedInitialState = initialState;
    if (enhancer) return enhancer(createStore)(reducer, initialState);
    const store = createStore(reducer, initialState);
    return {
      ...store,
      useGlobalState: (name) => {
        const [value] = store.useGlobalState(name);
        const MESG = 'Update is not allowed when using DevTools';
        return [value, () => { throw new Error(MESG); }];
      },
    };
  };
  const after = createStore => (reducer, initialState, enhancer) => {
    if (enhancer) return enhancer(createStore)(reducer, initialState);
    const store = createStore(savedReducer, savedInitialState);
    let devState = {
      ...reducer(initialState, initAction()),
      ...savedInitialState,
    };
    const getState = () => devState;
    const listeners = [];
    const dispatch = (action) => {
      devState = reducer(devState, action);
      store.setState(devState.computedStates[devState.currentStateIndex].state);
      listeners.forEach(f => f());
      return action;
    };
    const subscribe = (listener) => {
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
  if (!window.__REDUX_DEVTOOLS_EXTENSION__) return f => f;
  const { before, after } = createEnhancers();
  return compose(
    before,
    window.__REDUX_DEVTOOLS_EXTENSION__(),
    after,
  );
};
