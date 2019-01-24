import * as React from 'react';

import { dispatch, useGlobalState } from './state';

const { useEffect } = React;

const increment = () => dispatch({ type: 'increment' });
const decrement = () => dispatch({ type: 'decrement' });
const addBonus = (value: number) => dispatch({ value, type: 'addBonus' });

const Counter = () => {
  const [value] = useGlobalState('counter');
  const [bonus] = useGlobalState('bonus');
  useEffect(
    () => {
      addBonus(Math.random());
    },
    [value],
  );
  return (
    <div>
      <span>Count:{value}</span>
      <button type="button" onClick={increment}>+1</button>
      <button type="button" onClick={decrement}>-1</button>
      <span>Bonus:{bonus}</span>
    </div>
  );
};

export default Counter;
