import * as React from 'react';

import { useDispatch, useGlobalState } from './state2';

const { useCallback } = React;

const Counter = () => {
  const value = useGlobalState('counter');
  const dispatch = useDispatch();
  const increment = useCallback(() => dispatch({ type: 'increment' }), [dispatch]);
  const decrement = useCallback(() => dispatch({ type: 'decrement' }), [dispatch]);
  return (
    <div>
      <span>Count:{value}</span>
      <button type="button" onClick={increment}>+1</button>
      <button type="button" onClick={decrement}>-1</button>
    </div>
  );
};

export default Counter;
