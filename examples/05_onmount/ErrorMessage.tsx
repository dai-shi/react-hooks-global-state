import * as React from 'react';

import { useGlobalStateErrorMessage } from './state';

const ErrorMessage = () => {
  const [value] = useGlobalStateErrorMessage();
  return (
    <div style={{ color: 'red' }}>
      {value}
    </div>
  );
};

export default ErrorMessage;
