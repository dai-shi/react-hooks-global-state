import React from 'react';
import { render, cleanup } from '@testing-library/react';

import { createGlobalState, createStore } from '../src/index';

describe('startup spec', () => {
  afterEach(cleanup);

  it('should setSetGlobalState at start up', () => {
    const initialState = {
      count1: 0,
      count2: 0,
    };
    const { GlobalStateProvider, setGlobalState, useGlobalState } = createGlobalState(initialState);
    const Counter = ({ name }) => {
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
      <GlobalStateProvider>
        <Counter name="count1" />
        <Counter name="count2" />
      </GlobalStateProvider>
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
    const reducer = (state, action) => {
      if (action.type === 'setCounter') {
        return {
          ...state,
          [action.name]: action.value,
        };
      }
      return state;
    };
    const {
      GlobalStateProvider,
      dispatch,
      useGlobalState,
    } = createStore(reducer, initialState);
    const Counter = ({ name }) => {
      dispatch({ type: 'setCounter', name, value: 9 });
      const [value] = useGlobalState(name);
      return (
        <div>
          <div>{name}</div>
          <div data-testid={name}>{value}</div>
        </div>
      );
    };
    const App = () => (
      <GlobalStateProvider>
        <Counter name="count1" />
        <Counter name="count2" />
      </GlobalStateProvider>
    );
    const { getByTestId } = render(<App />);
    expect(getByTestId('count1').innerHTML).toBe('9');
    expect(getByTestId('count2').innerHTML).toBe('9');
  });
});
