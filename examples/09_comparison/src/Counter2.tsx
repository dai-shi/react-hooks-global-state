import React, { useCallback } from 'react';

import { useDispatch, useGlobalState } from './state2';

let numRendered = 0;

const Counter = () => {
  const value = useGlobalState('count');
  const dispatch = useDispatch();
  const increment = useCallback(() => dispatch({ type: 'increment' }), [dispatch]);
  const decrement = useCallback(() => dispatch({ type: 'decrement' }), [dispatch]);
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
