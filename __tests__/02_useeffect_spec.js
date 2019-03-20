import React, { useEffect } from 'react';
import { render, cleanup } from 'react-testing-library';

import { createGlobalState } from '../src/index';

describe('useeffect spec', () => {
  afterEach(cleanup);

  it('should update a global state with useEffect', () => {
    const initialState = {
      counter1: 0,
    };
    const { GlobalStateProvider, useGlobalState } = createGlobalState(initialState);
    const Counter = () => {
      const [value, update] = useGlobalState('counter1');
      useEffect(() => {
        update(9);
      }, [update]);
      return (
        <div>
          <span>{value}</span>
        </div>
      );
    };
    const App = () => (
      <GlobalStateProvider>
        <Counter />
      </GlobalStateProvider>
    );
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
  });
});
