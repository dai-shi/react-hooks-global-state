import React, { StrictMode, useEffect } from 'react';
import { render, cleanup } from '@testing-library/react';

import { createGlobalState } from '../src/index';

describe('useeffect spec', () => {
  afterEach(cleanup);

  it('should update a global state with useEffect', () => {
    const initialState = {
      count1: 0,
    };
    const { useGlobalState } = createGlobalState(initialState);
    const Counter = () => {
      const [value, update] = useGlobalState('count1');
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
      <StrictMode>
        <Counter />
      </StrictMode>
    );
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
  });
});
