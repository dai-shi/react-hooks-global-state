import { createStore } from 'react-hooks-global-state';

type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'addBonus'; value: number };

export const { GlobalStateProvider, dispatch, useGlobalState } = createStore(
  (state, action: Action) => {
    switch (action.type) {
      case 'increment': return {
        ...state,
        counter: state.counter + 1,
      };
      case 'decrement': return {
        ...state,
        counter: state.counter - 1,
      };
      case 'addBonus': return {
        ...state,
        bonus: state.bonus + action.value,
      };
      default: return state;
    }
  },
  {
    bonus: 0,
    counter: 0,
  },
);
