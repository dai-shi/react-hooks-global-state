import React from 'react';

import Counter from './Counter';
import Person from './Person';

const App = () => (
  <React.StrictMode>
    <h1>Counter</h1>
    <Counter />
    <Counter />
    <h1>Person</h1>
    <Person />
    <Person />
  </React.StrictMode>
);

export default App;
