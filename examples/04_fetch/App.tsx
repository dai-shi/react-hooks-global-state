import * as React from 'react';

import ErrorMessage from './ErrorMessage';
import PageInfo from './PageInfo';
import RandomButton from './RandomButton';

const App = () => (
  <div>
    <PageInfo />
    <RandomButton />
    <ErrorMessage />
  </div>
);

export default App;
