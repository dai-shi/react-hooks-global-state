react-hooks-global-state
========================

[![Build Status](https://travis-ci.com/dai-shi/react-hooks-global-state.svg?branch=master)](https://travis-ci.com/dai-shi/react-hooks-global-state)
[![npm version](https://badge.fury.io/js/react-hooks-global-state.svg)](https://badge.fury.io/js/react-hooks-global-state)
[![bundle size](https://badgen.net/bundlephobia/minzip/react-hooks-global-state)](https://bundlephobia.com/result?p=react-hooks-global-state)

Simple global state for React with Hooks API

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
const { GlobalStateProvider, useGlobalState } = createGlobalState(initialState);

const Counter = () => {
  const [value, update] = useGlobalState('counter');
  return (
    <div>
      <span>Counter: {value}</span>
      <button onClick={() => update(v => v + 1)}>+1</button>
      <button onClick={() => update(v => v - 1)}>-1</button>
    </div>
  );
};

const App = () => (
  <GlobalStateProvider>
    <Counter />
    <Counter />
  </GlobalStateProvider>
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
const { GlobalStateProvider, dispatch, useGlobalState } = createStore(reducer, initialState);

const Counter = () => {
  const [value] = useGlobalState('counter');
  return (
    <div>
      <span>Counter: {value}</span>
      <button onClick={() => dispatch({ type: 'increment' })}>+1</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-1</button>
    </div>
  );
};

const App = () => (
  <GlobalStateProvider>
    <Counter />
    <Counter />
  </GlobalStateProvider>
);
```

Example
-------

The [examples](examples) folder contains working examples.
You can run one of them with

```bash
PORT=8080 npm run examples:minimal
```

and open <http://localhost:8080> in your web browser.

You can also try them in codesandbox.io:
[01](https://codesandbox.io/s/github/dai-shi/react-hooks-global-state/tree/master/examples/01_minimal)
[02](https://codesandbox.io/s/github/dai-shi/react-hooks-global-state/tree/master/examples/02_typescript)
[03](https://codesandbox.io/s/github/dai-shi/react-hooks-global-state/tree/master/examples/03_actions)
[04](https://codesandbox.io/s/github/dai-shi/react-hooks-global-state/tree/master/examples/04_fetch)
[05](https://codesandbox.io/s/github/dai-shi/react-hooks-global-state/tree/master/examples/05_onmount)
[06](https://codesandbox.io/s/github/dai-shi/react-hooks-global-state/tree/master/examples/06_reducer)
[07](https://codesandbox.io/s/github/dai-shi/react-hooks-global-state/tree/master/examples/07_middleware)
[08](https://codesandbox.io/s/github/dai-shi/react-hooks-global-state/tree/master/examples/08_thunk)
[09](https://codesandbox.io/s/github/dai-shi/react-hooks-global-state/tree/master/examples/09_comparison)
[10](https://codesandbox.io/s/github/dai-shi/react-hooks-global-state/tree/master/examples/10_immer)
[11](https://codesandbox.io/s/github/dai-shi/react-hooks-global-state/tree/master/examples/11_deep)
[12](https://codesandbox.io/s/github/dai-shi/react-hooks-global-state/tree/master/examples/12_effect)

Limitations
-----------

- Due to the implementation relying on `observedBits` in the Context API,
  the performance may drop down if a state holds more than 31 items.
  Reference: [#1](https://github.com/dai-shi/react-hooks-global-state/issues/1)

Blogs
-----

- [TypeScript-aware React hooks for global state](https://medium.com/@dai_shi/typescript-aware-react-hooks-for-global-state-b6e2dfc0e9a7)
- [An alternative to React Redux by React Hooks API (For both JavaScript and TypeScript)](https://medium.com/@dai_shi/an-alternative-to-react-redux-by-react-hooks-api-for-both-javascript-and-typescript-c5e9a351ba0b)
- [Redux middleware compatible React Hooks library for easy global state management](https://medium.com/@dai_shi/redux-middleware-compatible-react-hooks-library-for-easy-global-state-management-4fe73623e69e)
- [React Hooks Tutorial on pure useReducer + useContext for global state like Redux and comparison with react-hooks-global-state](https://medium.com/@dai_shi/react-hooks-tutorial-for-pure-usereducer-usecontext-for-global-state-like-redux-and-comparison-dd3da5053624)
