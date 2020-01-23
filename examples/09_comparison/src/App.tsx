import React, { StrictMode } from 'react';

import Counter from './Counter';
import Person from './Person';

import Counter2 from './Counter2';
import Person2 from './Person2';
import { Provider } from './state2';

const App = () => (
  <StrictMode>
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <div>
        <h1>useReducer + useContext</h1>
        <Provider>
          <h2>Counter</h2>
          <Counter2 />
          <Counter2 />
          <h2>Person</h2>
          <Person2 />
          <Person2 />
        </Provider>
      </div>
      <div>
        <h1>react-hooks-global-state</h1>
        <h2>Counter</h2>
        <Counter />
        <Counter />
        <h2>Person</h2>
        <Person />
        <Person />
      </div>
    </div>
  </StrictMode>
);

export default App;
