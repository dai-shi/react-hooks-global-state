import * as React from 'react';

import { setErrorMessage, setPageTitle } from './state';

const fetchPageTitle = async () => {
  try {
    const id = Math.floor(100 * Math.random());
    const url = `https://jsonplaceholder.typicode.com/posts/${id}`;
    const response = await fetch(url);
    const body = await response.json();
    setPageTitle(body.title);
  } catch (e) {
    setErrorMessage(`Error: ${e}`);
  }
};

const RandomButton = () => (
  <div>
    <button type="button" onClick={fetchPageTitle}>
      Random
    </button>
  </div>
);

export default RandomButton;
