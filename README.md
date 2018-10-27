react-hooks-global-state
==========================

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
      <button onClick={() => update(v => v + 1)}>Click</button>
    </div>
  );
};

const App = () => (
  <StateProvider>
    <Counter />
    <Counter />
  </StateProvider>
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
