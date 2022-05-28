import React, { Dispatch } from 'react';

import { Action, dispatch, useStoreState } from './state';

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

let id = 0;

const setRandomFirstName = () => {
  const dispatchForThunk = dispatch as Dispatch<Action | ((d: Dispatch<Action>) => void)>;
  dispatchForThunk(async (d: Dispatch<Action>) => {
    d({
      firstName: 'Loading...',
      type: 'setFirstName',
    });
    try {
      if (id < 3) {
        id += 1; // fixing for e2e test
      } else {
        id = Math.floor(100 * Math.random());
      }
      const url = `https://jsonplaceholder.typicode.com/posts/${id}`;
      const response = await fetch(url);
      const body = await response.json();
      d({
        firstName: body.title.split(' ')[0],
        type: 'setFirstName',
      });
    } catch (e) {
      d({
        firstName: 'ERROR: fetching',
        type: 'setFirstName',
      });
    }
  });
};

const Person = () => {
  const value = useStoreState('person');
  return (
    <div>
      <button type="button" onClick={setRandomFirstName}>Random First Name</button>
      <div>
        First Name:
        {value.firstName === 'Loading...' ? (
          <span>Loading...</span>
        ) : (
          <input value={value.firstName} onChange={setFirstName} />
        )}
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
