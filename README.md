# react-hooks-global-state

[![Build Status](https://travis-ci.com/dai-shi/react-hooks-global-state.svg?branch=master)](https://travis-ci.com/dai-shi/react-hooks-global-state)
[![npm version](https://badge.fury.io/js/react-hooks-global-state.svg)](https://badge.fury.io/js/react-hooks-global-state)
[![bundle size](https://badgen.net/bundlephobia/minzip/react-hooks-global-state)](https://bundlephobia.com/result?p=react-hooks-global-state)

Simple global state for React with Hooks API

## Introduction

If you ever try to implement a global state with Context and Hooks,
you probably find it straightforward.
This library provide more or less the same functionality
with some following bonuses.

- Optimization for shallow state getter and setter.
  - The library cares the state object only one-level deep.
- TypeScript type definitions
  - A creator function creates hooks with types inferred.
- Redux middleware support to some extent
  - Some of libraries in Redux ecosystem can be used.
  - Redux DevTools Extension could be used in a simple scenario.

Due to the fact that this library utilizes `unstable_observedBits`
for optimization, this library is still in alpha.

## Install

```bash
npm install react-hooks-global-state
```

## Usage

### setState style

```javascript
import React from 'react';
import { createGlobalState } from 'react-hooks-global-state';

const initialState = { count: 0 };
const { GlobalStateProvider, useGlobalState } = createGlobalState(initialState);

const Counter = () => {
  const [count, setCount] = useGlobalState('count');
  return (
    <div>
      <span>Counter: {count}</span>
      {/* update state by passing callback function */}
      <button onClick={() => setCount(v => v + 1)}>+1</button>
      {/* update state by passing new value */}
      <button onClick={() => setCount(count - 1)}>-1</button>
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
    case 'increment': return { ...state, count: state.count + 1 };
    case 'decrement': return { ...state, count: state.count - 1 };
    default: return state;
  }
};
const initialState = { count: 0 };
const { GlobalStateProvider, dispatch, useGlobalState } = createStore(reducer, initialState);

const Counter = () => {
  const [value] = useGlobalState('count');
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

## Examples

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
[13](https://codesandbox.io/s/github/dai-shi/react-hooks-global-state/tree/master/examples/13_persistence)

## Limitations

- Due to the implementation relying on `observedBits` in the Context API,
  the performance may drop down if a state holds more than 30 items.
  Reference: [#1](https://github.com/dai-shi/react-hooks-global-state/issues/1)

## Blogs

- [TypeScript-aware React hooks for global state](https://blog.axlight.com/posts/typescript-aware-react-hooks-for-global-state/)
- [An alternative to React Redux by React Hooks API (For both JavaScript and TypeScript)](https://blog.axlight.com/posts/an-alternative-to-react-redux-by-react-hooks-api-for-both-javascript-and-typescript/)
- [Redux middleware compatible React Hooks library for easy global state management](https://blog.axlight.com/posts/redux-middleware-compatible-react-hooks-library-for-easy-global-state-management/)
- [React Hooks Tutorial on pure useReducer + useContext for global state like Redux and comparison with react-hooks-global-state](https://blog.axlight.com/posts/react-hooks-tutorial-for-pure-usereducer-usecontext-for-global-state-like-redux-and-comparison/)
- [Four patterns for global state with React hooks: Context or Redux](https://blog.axlight.com/posts/four-patterns-for-global-state-with-react-hooks-context-or-redux/)

## Community Wiki

- [Persistence](https://github.com/dai-shi/react-hooks-global-state/wiki/Persistence)
- [Optional initialState](https://github.com/dai-shi/react-hooks-global-state/wiki/Optional-initialState)
