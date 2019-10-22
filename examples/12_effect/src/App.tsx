import React, { StrictMode } from 'react';

import { GlobalStateProvider } from './state';

import Counter from './Counter';

const App = () => (
  <StrictMode>
    <GlobalStateProvider>
      <h1>Counter</h1>
      <Counter />
      <Counter />
    </GlobalStateProvider>
  </StrictMode>
);

export default App;
