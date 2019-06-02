import * as React from 'react';
import { StrictMode } from 'react';
import { hot } from 'react-hot-loader/root';

import { GlobalStateProvider } from './state';

import Counter from './Counter';
import Person from './Person';

const App = () => (
  <StrictMode>
    <GlobalStateProvider>
      <h1>Counter</h1>
      <Counter />
      <Counter />
      <h1>Person</h1>
      <Person />
      <Person />
    </GlobalStateProvider>
  </StrictMode>
);

export default process.env.NODE_ENV === 'development' ? hot(App) : App;
