import React from 'react';

import { dispatch, useGlobalState } from './state';

const increment = () => dispatch({ type: 'increment' });
const decrement = () => dispatch({ type: 'decrement' });

let numRendered = 0;

const Counter = () => {
  const [value] = useGlobalState('count');
  numRendered += 1;
  return (
    <div>
      <span>Count: {value}</span>
      <button type="button" onClick={increment}>+1</button>
      <button type="button" onClick={decrement}>-1</button>
      <span>(numRendered: {numRendered})</span>
    </div>
  );
};

export default Counter;
