import * as React from 'react';

import Counter from './Counter';
import Person from './Person';

const App = () => (
  <div>
    <h1>Counter</h1>
    <Counter />
    <Counter />
    <h1>Person</h1>
    <Person />
    <Person />
  </div>
);

export default App;
