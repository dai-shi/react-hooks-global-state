import * as React from 'react';

import { useGlobalState } from './state';

const ErrorMessage = () => {
  const [value] = useGlobalState('errorMessage');
  return (
    <div style={{ color: 'red' }}>
      {value}
    </div>
  );
};

export default ErrorMessage;
