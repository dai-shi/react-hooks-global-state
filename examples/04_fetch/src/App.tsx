import React, { StrictMode } from 'react';

import { GlobalStateProvider } from './state';

import ErrorMessage from './ErrorMessage';
import PageInfo from './PageInfo';
import RandomButton from './RandomButton';

const App = () => (
  <StrictMode>
    <GlobalStateProvider>
      <PageInfo />
      <RandomButton />
      <ErrorMessage />
    </GlobalStateProvider>
  </StrictMode>
);

export default App;
