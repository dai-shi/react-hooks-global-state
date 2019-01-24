import * as React from 'react';

import { countDown, countUp, useGlobalState } from './state';

const Counter = () => {
  const [value] = useGlobalState('counter');
  return (
    <div>
      <span>Count:{value}</span>
      <button type="button" onClick={countUp}>+1</button>
      <button type="button" onClick={countDown}>-1</button>
    </div>
  );
};

export default Counter;
