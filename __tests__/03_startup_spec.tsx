import React, { StrictMode } from 'react';
import { render, cleanup } from '@testing-library/react';

import { createGlobalState, createStore } from '../src/index';

describe('startup spec', () => {
  afterEach(cleanup);

  it('should setSetGlobalState at start up', () => {
    const initialState = {
      count1: 0,
      count2: 0,
    };
    const { setGlobalState, useGlobalState } = createGlobalState(initialState);
    const Counter: React.FC<{ name: 'count1' | 'count2' }> = ({ name }) => {
      setGlobalState(name, 9);
      const [value] = useGlobalState(name);
      return (
        <div>
          <div>{name}</div>
          <div data-testid={name}>{value}</div>
        </div>
      );
    };
    const App = () => (
      <StrictMode>
        <Counter name="count1" />
        <Counter name="count2" />
      </StrictMode>
    );
    const { getByTestId } = render(<App />);
    expect(getByTestId('count1').innerHTML).toBe('9');
    expect(getByTestId('count2').innerHTML).toBe('9');
  });

  it('should dispatch at start up', () => {
    const initialState = {
      count1: 0,
      count2: 0,
    };
    type State = typeof initialState;
    type Action = {
      type: 'setCounter';
      name: 'count1' | 'count2';
      value: number;
    };
    const reducer = (state: State, action: Action) => {
      if (action.type === 'setCounter') {
        return {
          ...state,
          [action.name]: action.value,
        };
      }
      return state;
    };
    const { dispatch, useStoreState } = createStore(reducer, initialState);
    const Counter: React.FC<{ name: 'count1' | 'count2' }> = ({ name }) => {
      dispatch({ type: 'setCounter', name, value: 9 });
      const value = useStoreState(name);
      return (
        <div>
          <div>{name}</div>
          <div data-testid={name}>{value}</div>
        </div>
      );
    };
    const App = () => (
      <StrictMode>
        <Counter name="count1" />
        <Counter name="count2" />
      </StrictMode>
    );
    const { getByTestId } = render(<App />);
    expect(getByTestId('count1').innerHTML).toBe('9');
    expect(getByTestId('count2').innerHTML).toBe('9');
  });
});
