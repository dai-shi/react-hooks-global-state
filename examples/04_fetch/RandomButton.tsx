import * as React from 'react';
import { useBoolean } from 'react-use';

import { setErrorMessage, setPageTitle } from './state';

type SetLoading = (x: boolean) => void;

const fetchPageTitle = async (setLoading: SetLoading) => {
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
  const [loading, setLoading] = useBoolean(false);
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
