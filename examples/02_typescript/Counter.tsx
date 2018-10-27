import * as React from 'react';

import { useGlobalStateCounter } from './state';

const Counter = () => {
  const [value, update] = useGlobalStateCounter();
  return (
    <div>
      <span>
        Count:
        {value}
      </span>
      <button type="button" onClick={() => update(v => v + 1)}>+1</button>
      <button type="button" onClick={() => update(v => v - 1)}>-1</button>
    </div>
  );
};

export default Counter;
