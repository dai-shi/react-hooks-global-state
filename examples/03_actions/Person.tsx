import * as React from 'react';

import {
  setPersonAge,
  setPersonFirstName,
  setPersonLastName,
  useGlobalState,
} from './state';

const Person = () => {
  const [{ firstName, lastName, age }] = useGlobalState('person');
  return (
    <div>
      <div>
        First Name:
        <input
          value={firstName}
          onChange={event => setPersonFirstName(event.target.value)}
        />
      </div>
      <div>
        Last Name:
        <input
          value={lastName}
          onChange={event => setPersonLastName(event.target.value)}
        />
      </div>
      <div>
        Age:
        <input
          value={age}
          onChange={event => setPersonAge(Number(event.target.value) || 0)}
        />
      </div>
    </div>
  );
};

export default Person;
