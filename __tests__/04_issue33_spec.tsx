import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';

import { createGlobalState } from '../src/index';

describe('issue #33 spec', () => {
  afterEach(cleanup);

  it('should sync getGlobaState with useGlobalState', () => {
    const initialState = {
      count1: 0,
    };
    const { useGlobalState, getGlobalState } = createGlobalState(initialState);
    const Positive: React.FC<{ count: number }> = ({ count }) => {
      if (count !== getGlobalState('count1')) throw Error('count mismatch');
      return <div>{count} is positive</div>;
    };
    const Counter = () => {
      const [value, update] = useGlobalState('count1');
      return (
        <div>
          <span>{value}</span>
          <button type="button" onClick={() => update(value + 1)}>+1</button>
          {value > 0 && <Positive count={value} />}
        </div>
      );
    };
    const App = () => (
      <>
        <Counter />
      </>
    );
    const { getAllByText, container } = render(<App />);
    expect(container.querySelector('span')?.textContent).toBe('0');
    expect(getGlobalState('count1')).toBe(0);
    fireEvent.click(getAllByText('+1')[0]);
    expect(container.querySelector('span')?.textContent).toBe('1');
    expect(getGlobalState('count1')).toBe(1);
  });
});
