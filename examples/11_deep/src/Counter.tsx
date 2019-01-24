import * as React from 'react';

import { dispatch, useGlobalState } from './state';

const increment = () => dispatch({ type: 'increment' });
const decrement = () => dispatch({ type: 'decrement' });

const Counter = () => {
  const [value] = useGlobalState('counter');
  return (
    <div>
      <span>Count:{value}</span>
      <button type="button" onClick={increment}>+1</button>
      <button type="button" onClick={decrement}>-1</button>
    </div>
  );
};

export default Counter;
