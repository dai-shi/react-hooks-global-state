import * as React from 'react';

import { useGlobalState } from './state';

const Person = () => {
  const [value, update] = useGlobalState('person');
  return (
    <div>
      <div>
        First Name:
        <input
          value={value.firstName}
          onChange={(event) => {
            const firstName = event.target.value;
            update(p => ({ ...p, firstName }));
          }}
        />
      </div>
      <div>
        Last Name:
        <input
          value={value.lastName}
          onChange={(event) => {
            const lastName = event.target.value;
            update(p => ({ ...p, lastName }));
          }}
        />
      </div>
      <div>
        Age:
        <input
          value={value.age}
          onChange={(event) => {
            const age = Number(event.target.value) || 0;
            update(p => ({ ...p, age }));
          }}
        />
      </div>
    </div>
  );
};

export default Person;
