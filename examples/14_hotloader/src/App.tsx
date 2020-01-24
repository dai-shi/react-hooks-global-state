import React, { StrictMode } from 'react';
import { hot } from 'react-hot-loader/root';

import Counter from './Counter';
import Person from './Person';

const App = () => (
  <StrictMode>
    <h1>Counter</h1>
    <Counter />
    <Counter />
    <h1>Person</h1>
    <Person />
    <Person />
  </StrictMode>
);

export default process.env.NODE_ENV === 'development' ? hot(App) : App;
