import * as React from 'react';

import { useGlobalStatePageTitle } from './state';

const PageInfo = () => {
  const [value] = useGlobalStatePageTitle();
  return (
    <div>
      <h1>PageInfo</h1>
      {value}
    </div>
  );
};

export default PageInfo;
