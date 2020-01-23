import React, { StrictMode } from 'react';

import ErrorMessage from './ErrorMessage';
import PageInfo from './PageInfo';
import RandomButton from './RandomButton';

const App = () => (
  <StrictMode>
    <PageInfo />
    <RandomButton />
    <ErrorMessage />
  </StrictMode>
);

export default App;
