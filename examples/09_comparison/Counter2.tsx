import * as React from 'react';

import { useDispatch, useGlobalState } from './state2';

const Counter = () => {
  const value = useGlobalState('counter');
  const dispatch = useDispatch();
  const increment = () => dispatch({ type: 'increment' });
  const decrement = () => dispatch({ type: 'decrement' });
  return (
    <div>
      <span>
        Count:
        {value}
      </span>
      <button type="button" onClick={increment}>+1</button>
      <button type="button" onClick={decrement}>-1</button>
    </div>
  );
};

export default Counter;
