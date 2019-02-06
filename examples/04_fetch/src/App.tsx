import * as React from 'react';

import { GlobalStateProvider } from './state';

import ErrorMessage from './ErrorMessage';
import PageInfo from './PageInfo';
import RandomButton from './RandomButton';

const App = () => (
  <React.StrictMode>
    <GlobalStateProvider>
      <PageInfo />
      <RandomButton />
      <ErrorMessage />
    </GlobalStateProvider>
  </React.StrictMode>
);

export default App;
