import * as React from 'react';

import { useDispatch, useGlobalState } from './state2';

const { useCallback } = React;

const Person = () => {
  const value = useGlobalState('person');
  const dispatch = useDispatch();
  const setFirstName = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => dispatch({
      firstName: event.currentTarget.value,
      type: 'setFirstName',
    }),
    [dispatch],
  );
  const setLastName = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => dispatch({
      lastName: event.currentTarget.value,
      type: 'setLastName',
    }),
    [dispatch],
  );
  const setAge = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => dispatch({
      age: Number(event.currentTarget.value) || 0,
      type: 'setAge',
    }),
    [dispatch],
  );
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
