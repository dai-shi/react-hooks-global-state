import React, { StrictMode } from 'react';

import Counter from './Counter';

const App = () => (
  <StrictMode>
    <h1>Counter</h1>
    <Counter />
    <Counter />
  </StrictMode>
);

export default App;
