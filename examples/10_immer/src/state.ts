import { produce } from 'immer';

import { createStore } from 'react-hooks-global-state';

type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'setFirstName'; firstName: string }
  | { type: 'setLastName'; lastName: string }
  | { type: 'setAge'; age: number };

export const { GlobalStateProvider, dispatch, useGlobalState } = createStore(
  (state, action: Action) => produce(state, (draft) => {
    switch (action.type) {
      case 'increment': draft.counter += 1; break;
      case 'decrement': draft.counter -= 1; break;
      case 'setFirstName': draft.person.firstName = action.firstName; break;
      case 'setLastName': draft.person.lastName = action.lastName; break;
      case 'setAge': draft.person.age = action.age; break;
    }
  }),
  {
    counter: 0,
    person: {
      age: 0,
      firstName: '',
      lastName: '',
    },
  },
);
