import React from 'react';
import { render, fireEvent, cleanup } from 'react-testing-library';

import { createGlobalState, createStore } from '../src/index';

describe('basic spec', () => {
  afterEach(cleanup);

  it('should have a function', () => {
    expect(createGlobalState).toBeDefined();
  });

  it('should be possible to not specify initial state', () => {
    const reducer = () => ({ counter: 0 });
    const { GlobalStateProvider, useGlobalState } = createStore(reducer);
    const Counter = () => {
      const [value, update] = useGlobalState('counter');
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
      counter1: 0,
    };
    const { GlobalStateProvider, useGlobalState } = createGlobalState(initialState);
    const Counter = () => {
      const [value, update] = useGlobalState('counter1');
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
    const { getByText, container } = render(<App />);
    expect(container).toMatchSnapshot();
    fireEvent.click(getByText('+1'));
    expect(container).toMatchSnapshot();
  });
});
