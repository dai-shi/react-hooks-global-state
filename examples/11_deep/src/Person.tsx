import * as React from 'react';

import { dispatch, useGlobalState } from './state';

const { useMemo } = React;

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

const TextBox: React.SFC<{ text: string }> = ({ text }) => {
  // eslint-disable-next-line no-console
  console.log('rendering text:', text);
  return <span>{text}</span>;
};

const PersonFirstName = () => {
  const [value] = useGlobalState('person');
  const { firstName } = value;
  return useMemo(
    () => (
      <div>
        First Name:
        <TextBox text={firstName} />
        <input value={firstName} onChange={setFirstName} />
      </div>
    ),
    [firstName],
  );
};

const PersonLastName = () => {
  const [value] = useGlobalState('person');
  const { lastName } = value;
  return useMemo(
    () => (
      <div>
        Last Name:
        <TextBox text={lastName} />
        <input value={lastName} onChange={setLastName} />
      </div>
    ),
    [lastName],
  );
};

const PersonAge = () => {
  const [value] = useGlobalState('person');
  const { age } = value;
  const ageDoubled = useMemo(() => age * 2, [age]);
  return useMemo(
    () => (
      <div>
        <div>
          Age:
          <input value={age} onChange={setAge} />
        </div>
        <div>
          Age Doubled:
          <span>{ageDoubled}</span>
        </div>
      </div>
    ),
    [age, ageDoubled], // only `age` is actually fine.
  );
};

const Person = () => (
  <>
    <PersonFirstName />
    <PersonLastName />
    <PersonAge />
  </>
);

export default Person;
