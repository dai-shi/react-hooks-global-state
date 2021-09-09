import React, { StrictMode } from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';

import { createGlobalState, createStore } from '../src/index';

describe('basic spec', () => {
  afterEach(cleanup);

  it('should exists exported functions', () => {
    expect(createGlobalState).toBeDefined();
    expect(createStore).toBeDefined();
  });

  it('should be possible to not specify initial state', () => {
    const reducer = (state = { count: 0 }, action: { type: 'INC' }) => {
      if (action.type === 'INC') {
        return { count: state.count + 1 };
      }
      return state;
    };
    const { useStoreState, dispatch } = createStore(reducer);
    const Counter = () => {
      const value = useStoreState('count');
      return (
        <div>
          <span>{value}</span>
          <button type="button" onClick={() => dispatch({ type: 'INC' })}>+1</button>
        </div>
      );
    };
    const App = () => (
      <StrictMode>
        <Counter />
      </StrictMode>
    );
    const { getByText } = render(<App />);
    expect(getByText('0')).toBeDefined();
    fireEvent.click(getByText('+1'));
    expect(getByText('1')).toBeDefined();
  });

  it('should create a component with a global state', () => {
    const initialState = {
      count1: 0,
    };
    const { useGlobalState } = createGlobalState(initialState);
    const Counter = () => {
      const [value, update] = useGlobalState('count1');
      return (
        <div>
          <span>{value}</span>
          <button type="button" onClick={() => update(value + 1)}>+1</button>
        </div>
      );
    };
    const App = () => (
      <StrictMode>
        <Counter />
        <Counter />
      </StrictMode>
    );
    const { getAllByText, container } = render(<App />);
    expect(container).toMatchSnapshot();
    fireEvent.click(getAllByText('+1')[0]);
    expect(container).toMatchSnapshot();
  });
});
