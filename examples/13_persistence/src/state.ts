import {
  createStore,
  Dispatch,
  Enhancer,
  Store,
} from 'react-hooks-global-state';

type State = {
  count: number;
  person: {
    age: number;
    firstName: string;
    lastName: string;
  };
};

type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'setFirstName'; firstName: string }
  | { type: 'setLastName'; lastName: string }
  | { type: 'setAge'; age: number };

type Middleware = (store: Store<State, Action>) => (next: Dispatch<Action>) => Dispatch<Action>;
type ApplyMiddleware = (...args: Middleware[]) => Enhancer<State, Action>;

const applyMiddleware: ApplyMiddleware = (...args) => (creator) => {
  const [first, ...rest] = args;
  if (!first) return creator;
  creator = applyMiddleware(...rest)(creator);
  return (reducer, initialState) => {
    const store = creator(reducer, initialState);
    const dispatch = first(store)(store.dispatch);
    return { ...store, dispatch };
  };
};

const defaultState: State = {
  count: 0,
  person: {
    age: 0,
    firstName: '',
    lastName: '',
  },
};

const LOCAL_STORAGE_KEY = 'my_local_storage_key';
const parseState = (str: string | null): State | null => {
  try {
    const state = JSON.parse(str || '');
    if (typeof state.count !== 'number') throw new Error();
    if (typeof state.person.age !== 'number') throw new Error();
    if (typeof state.person.firstName !== 'string') throw new Error();
    if (typeof state.person.lastName !== 'string') throw new Error();
    return state as State;
  } catch (e) {
    return null;
  }
};
const stateFromStorage = parseState(localStorage.getItem(LOCAL_STORAGE_KEY));
const initialState: State = stateFromStorage || defaultState;

const reducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case 'increment': return {
      ...state,
      count: state.count + 1,
    };
    case 'decrement': return {
      ...state,
      count: state.count - 1,
    };
    case 'setFirstName': return {
      ...state,
      person: {
        ...state.person,
        firstName: action.firstName,
      },
    };
    case 'setLastName': return {
      ...state,
      person: {
        ...state.person,
        lastName: action.lastName,
      },
    };
    case 'setAge': return {
      ...state,
      person: {
        ...state.person,
        age: action.age,
      },
    };
    default: return state;
  }
};

const saveStateToStorage = (
  { getState }: { getState: () => State },
) => (next: Dispatch<Action>) => (action: Action) => {
  const returnValue = next(action);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(getState()));
  return returnValue;
};

export const { GlobalStateProvider, dispatch, useGlobalState } = createStore(
  reducer,
  initialState,
  applyMiddleware(saveStateToStorage),
);
