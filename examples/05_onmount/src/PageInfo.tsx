import React from 'react';

import { useGlobalState } from './state';

const PageInfo = () => {
  const [value] = useGlobalState('pageTitle');
  return (
    <div>
      <h1>PageInfo</h1>
      {value && <span>{value}</span>}
    </div>
  );
};

export default PageInfo;
