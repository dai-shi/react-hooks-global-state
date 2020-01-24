import React, { useEffect, StrictMode } from 'react';

import { setPageTitle } from './state';

import ErrorMessage from './ErrorMessage';
import PageInfo from './PageInfo';
import RandomButton from './RandomButton';

const initPageInfo = async () => {
  const url = 'https://jsonplaceholder.typicode.com/posts/1';
  const response = await fetch(url);
  const body = await response.json();
  setPageTitle(body.title);
};

const App = () => {
  useEffect(
    () => {
      initPageInfo();
    },
    [],
  );

  return (
    <StrictMode>
      <PageInfo />
      <RandomButton />
      <ErrorMessage />
    </StrictMode>
  );
};

export default App;
