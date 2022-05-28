import React, { useEffect, useRef, StrictMode } from 'react';

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
  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;
    initPageInfo();
  });

  return (
    <StrictMode>
      <PageInfo />
      <RandomButton />
      <ErrorMessage />
    </StrictMode>
  );
};

export default App;
