import { createStore } from 'react-hooks-global-state';

type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'addBonus'; value: number };

export const { dispatch, useGlobalState } = createStore(
  (state, action: Action) => {
    switch (action.type) {
      case 'increment': return {
        ...state,
        count: state.count + 1,
      };
      case 'decrement': return {
        ...state,
        count: state.count - 1,
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
    count: 0,
  },
);
