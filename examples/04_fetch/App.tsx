import * as React from 'react';

import { GlobalStateProvider } from './state';

import ErrorMessage from './ErrorMessage';
import PageInfo from './PageInfo';
import RandomButton from './RandomButton';

const App = () => (
  <GlobalStateProvider>
    <PageInfo />
    <RandomButton />
    <ErrorMessage />
  </GlobalStateProvider>
);

export default App;
