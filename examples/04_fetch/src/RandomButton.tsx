import * as React from 'react';

import { setErrorMessage, setPageTitle } from './state';

const { useState } = React;

const fetchPageTitle = async (setLoading: (x: boolean) => void) => {
  setLoading(true);
  try {
    const id = Math.floor(100 * Math.random());
    const url = `https://jsonplaceholder.typicode.com/posts/${id}`;
    const response = await fetch(url);
    const body = await response.json();
    setPageTitle(body.title);
  } catch (e) {
    setErrorMessage(`Error: ${e}`);
  }
  setLoading(false);
};

const RandomButton = () => {
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <div>
      {loading ? 'Loading...' : (
        <button type="button" onClick={() => fetchPageTitle(setLoading)}>
          Random
        </button>
      )}
    </div>
  );
};

export default RandomButton;
