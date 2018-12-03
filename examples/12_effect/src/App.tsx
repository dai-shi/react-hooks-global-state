import * as React from 'react';

import { GlobalStateProvider } from './state';

import Counter from './Counter';

const App = () => (
  <GlobalStateProvider>
    <h1>Counter</h1>
    <Counter />
    <Counter />
  </GlobalStateProvider>
);

export default App;
