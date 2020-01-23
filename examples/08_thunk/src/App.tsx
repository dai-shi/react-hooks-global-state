import React, { StrictMode } from 'react';

import Counter from './Counter';
import Person from './Person';

const App = () => (
  <StrictMode>
    <h1>Counter</h1>
    <Counter />
    <Counter />
    <h1>Person</h1>
    <Person />
    <Person />
  </StrictMode>
);

export default App;
