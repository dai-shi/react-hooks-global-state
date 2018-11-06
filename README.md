react-hooks-global-state
========================

[![Build Status](https://travis-ci.com/dai-shi/react-hooks-global-state.svg?branch=master)](https://travis-ci.com/dai-shi/react-hooks-global-state)
[![npm version](https://badge.fury.io/js/react-hooks-global-state.svg)](https://badge.fury.io/js/react-hooks-global-state)

Simple global state for React by Hooks API

Background
----------

React Hooks API looks promising.
This is an experimental library to use React Hooks API for global state.

Install
-------

```bash
npm install react-hooks-global-state
```

Usage
-----

### setState style

```javascript
import React from 'react';
import { createGlobalState } from 'react-hooks-global-state';

const initialState = { counter: 0 };
const { stateItemHooks } = createGlobalState(initialState);
const useCounter = stateItemHooks.counter;

const Counter = () => {
  const [value, update] = useCounter();
  return (
    <div>
      <span>Counter: {value}</span>
      <button onClick={() => update(v => v + 1)}>+1</button>
      <button onClick={() => update(v => v - 1)}>-1</button>
    </div>
  );
};

const App = () => (
  <div>
    <Counter />
    <Counter />
  </div>
);
```

### reducer style

```javascript
import React from 'react';
import { createStore } from 'react-hooks-global-state';

const reducer = (state, action) => {
  switch (action.type) {
    case 'increment': return { ...state, counter: state.counter + 1 };
    case 'decrement': return { ...state, counter: state.counter - 1 };
    default: return state;
  }
};
const initialState = { counter: 0 }; // initialState is not optional.
const { dispatch, stateItemHooks } = createStore(reducer, initialState);
const useCounter = stateItemHooks.counter;

const Counter = () => {
  const [value] = useCounter();
  return (
    <div>
      <span>Counter: {value}</span>
      <button onClick={() => dispatch({ type: 'increment' })}>+1</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-1</button>
    </div>
  );
};

const App = () => (
  <div>
    <Counter />
    <Counter />
  </div>
);
```

Example
-------

The [examples](examples) folder contains a working example.
You can run it with

```bash
PORT=8080 npm run examples:minimal
```

and open <http://localhost:8080> in your web browser.

Blogs
-----

- [TypeScript-aware React hooks for global state](https://medium.com/@dai_shi/typescript-aware-react-hooks-for-global-state-b6e2dfc0e9a7)
- [An alternative to React Redux by React Hooks API (For both JavaScript and TypeScript)](https://medium.com/@dai_shi/an-alternative-to-react-redux-by-react-hooks-api-for-both-javascript-and-typescript-c5e9a351ba0b)
