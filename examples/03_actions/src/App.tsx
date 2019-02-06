import * as React from 'react';

import { GlobalStateProvider } from './state';

import Counter from './Counter';
import Person from './Person';

const App = () => (
  <React.StrictMode>
    <GlobalStateProvider>
      <h1>Counter</h1>
      <Counter />
      <Counter />
      <h1>Person</h1>
      <Person />
      <Person />
    </GlobalStateProvider>
  </React.StrictMode>
);

export default App;
