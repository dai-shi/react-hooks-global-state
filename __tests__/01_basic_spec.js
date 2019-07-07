import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';

import { createGlobalState, createStore } from '../src/index';

describe('basic spec', () => {
  afterEach(cleanup);

  it('should have a function', () => {
    expect(createGlobalState).toBeDefined();
  });

  it('should be possible to not specify initial state', () => {
    const reducer = () => ({ count: 0 });
    const { GlobalStateProvider, useGlobalState } = createStore(reducer);
    const Counter = () => {
      const [value, update] = useGlobalState('count');
      return (
        <div>
          <span>{value}</span>
          <button type="button" onClick={() => update(value + 1)}>+1</button>
        </div>
      );
    };
    const App = () => (
      <GlobalStateProvider>
        <Counter />
      </GlobalStateProvider>
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
    const { GlobalStateProvider, useGlobalState } = createGlobalState(initialState);
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
      <GlobalStateProvider>
        <Counter />
        <Counter />
      </GlobalStateProvider>
    );
    const { getAllByText, container } = render(<App />);
    expect(container).toMatchSnapshot();
    fireEvent.click(getAllByText('+1')[0]);
    expect(container).toMatchSnapshot();
  });
});
