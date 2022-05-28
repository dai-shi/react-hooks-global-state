import React, {
  ReactNode,
  createContext,
  useContext,
  useReducer,
} from 'react';

import {
  Action,
  initialState,
  reducer,
  State,
} from './common';

const stateCtx = createContext(initialState);
const dispatchCtx = createContext((() => 0) as React.Dispatch<Action>);

export const Provider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <dispatchCtx.Provider value={dispatch}>
      <stateCtx.Provider value={state}>
        {children}
      </stateCtx.Provider>
    </dispatchCtx.Provider>
  );
};

export const useDispatch = () => {
  const dispatch = useContext(dispatchCtx);
  return dispatch;
};

// eslint-disable-next-line arrow-parens
export const useGlobalState = <K extends keyof State>(property: K) => {
  const state = useContext(stateCtx);
  return state[property]; // only one depth selector for comparison
};
