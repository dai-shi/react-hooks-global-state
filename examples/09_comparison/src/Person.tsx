import * as React from 'react';

import { dispatch, useGlobalState } from './state';

const setFirstName = (event: React.FormEvent<HTMLInputElement>) => dispatch({
  firstName: event.currentTarget.value,
  type: 'setFirstName',
});
const setLastName = (event: React.FormEvent<HTMLInputElement>) => dispatch({
  lastName: event.currentTarget.value,
  type: 'setLastName',
});
const setAge = (event: React.FormEvent<HTMLInputElement>) => dispatch({
  age: Number(event.currentTarget.value) || 0,
  type: 'setAge',
});

const Person = () => {
  const [value] = useGlobalState('person');
  return (
    <div>
      <div>
        First Name:
        <input value={value.firstName} onChange={setFirstName} />
      </div>
      <div>
        Last Name:
        <input value={value.lastName} onChange={setLastName} />
      </div>
      <div>
        Age:
        <input value={value.age} onChange={setAge} />
      </div>
    </div>
  );
};

export default Person;
