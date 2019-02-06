import * as React from 'react';

import { GlobalStateProvider } from './state';

import Counter from './Counter';

const App = () => (
  <React.StrictMode>
    <GlobalStateProvider>
      <h1>Counter</h1>
      <Counter />
      <Counter />
    </GlobalStateProvider>
  </React.StrictMode>
);

export default App;
