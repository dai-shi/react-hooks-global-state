# react-hooks-global-state

[![CI](https://img.shields.io/github/workflow/status/dai-shi/react-hooks-global-state/CI)](https://github.com/dai-shi/react-hooks-global-state/actions?query=workflow%3ACI)
[![npm](https://img.shields.io/npm/v/react-hooks-global-state)](https://www.npmjs.com/package/react-hooks-global-state)
[![size](https://img.shields.io/bundlephobia/minzip/react-hooks-global-state)](https://bundlephobia.com/result?p=react-hooks-global-state)
[![discord](https://img.shields.io/discord/627656437971288081)](https://discord.gg/MrQdmzd)

Simple global state for React with Hooks API without Context API

## Introduction

This is a library to provide a global state with React Hooks.
It has following characteristics.

*   Optimization for shallow state getter and setter.
    *   The library cares the state object only one-level deep.
*   TypeScript type definitions
    *   A creator function creates hooks with types inferred.
*   Redux middleware support to some extent
    *   Some of libraries in Redux ecosystem can be used.

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
const { useGlobalState } = createGlobalState(initialState);

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
  <>
    <Counter />
    <Counter />
  </>
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
const { dispatch, useStoreState } = createStore(reducer, initialState);

const Counter = () => {
  const value = useStoreState('count');
  return (
    <div>
      <span>Counter: {value}</span>
      <button onClick={() => dispatch({ type: 'increment' })}>+1</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-1</button>
    </div>
  );
};

const App = () => (
  <>
    <Counter />
    <Counter />
  </>
);
```

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### createGlobalState

Create a global state.

It returns a set of functions

*   `useGlobalState`: a custom hook works like React.useState
*   `getGlobalState`: a function to get a global state by key outside React
*   `setGlobalState`: a function to set a global state by key outside React
*   `subscribe`: a function that subscribes to state changes

#### Parameters

*   `initialState` **State** 

#### Examples

```javascript
import { createGlobalState } from 'react-hooks-global-state';

const { useGlobalState } = createGlobalState({ count: 0 });

const Component = () => {
  const [count, setCount] = useGlobalState('count');
  ...
};
```

### createStore

Create a global store.

It returns a set of functions

*   `useStoreState`: a custom hook to read store state by key
*   `getState`: a function to get store state by key outside React
*   `dispatch`: a function to dispatch an action to store

A store works somewhat similarly to Redux, but not the same.

#### Parameters

*   `reducer` **Reducer\<State, Action>** 
*   `initialState` **State**  (optional, default `(reducer as any)(undefined,{type:undefined})`)
*   `enhancer` **any?** 

#### Examples

```javascript
import { createStore } from 'react-hooks-global-state';

const initialState = { count: 0 };
const reducer = ...;

const store = createStore(reducer, initialState);
const { useStoreState, dispatch } = store;

const Component = () => {
  const count = useStoreState('count');
  ...
};
```

Returns **Store\<State, Action>** 

### useGlobalState

useGlobalState created by createStore is deprecated.

Type: function (stateKey: StateKey): any

**Meta**

*   **deprecated**: useStoreState instead

## Examples

The [examples](examples) folder contains working examples.
You can run one of them with

```bash
PORT=8080 npm run examples:01_minimal
```

and open <http://localhost:8080> in your web browser.

You can also try them in codesandbox.io:
[01](https://codesandbox.io/s/github/dai-shi/react-hooks-global-state/tree/main/examples/01\_minimal)
[02](https://codesandbox.io/s/github/dai-shi/react-hooks-global-state/tree/main/examples/02\_typescript)
[03](https://codesandbox.io/s/github/dai-shi/react-hooks-global-state/tree/main/examples/03\_actions)
[04](https://codesandbox.io/s/github/dai-shi/react-hooks-global-state/tree/main/examples/04\_fetch)
[05](https://codesandbox.io/s/github/dai-shi/react-hooks-global-state/tree/main/examples/05\_onmount)
[06](https://codesandbox.io/s/github/dai-shi/react-hooks-global-state/tree/main/examples/06\_reducer)
[07](https://codesandbox.io/s/github/dai-shi/react-hooks-global-state/tree/main/examples/07\_middleware)
[08](https://codesandbox.io/s/github/dai-shi/react-hooks-global-state/tree/main/examples/08\_thunk)
[09](https://codesandbox.io/s/github/dai-shi/react-hooks-global-state/tree/main/examples/09\_comparison)
[10](https://codesandbox.io/s/github/dai-shi/react-hooks-global-state/tree/main/examples/10\_immer)
[11](https://codesandbox.io/s/github/dai-shi/react-hooks-global-state/tree/main/examples/11\_deep)
[13](https://codesandbox.io/s/github/dai-shi/react-hooks-global-state/tree/main/examples/13\_persistence)

## Blogs

*   [TypeScript-aware React hooks for global state](https://blog.axlight.com/posts/typescript-aware-react-hooks-for-global-state/)
*   [An alternative to React Redux by React Hooks API (For both JavaScript and TypeScript)](https://blog.axlight.com/posts/an-alternative-to-react-redux-by-react-hooks-api-for-both-javascript-and-typescript/)
*   [Redux middleware compatible React Hooks library for easy global state management](https://blog.axlight.com/posts/redux-middleware-compatible-react-hooks-library-for-easy-global-state-management/)
*   [React Hooks Tutorial on pure useReducer + useContext for global state like Redux and comparison with react-hooks-global-state](https://blog.axlight.com/posts/react-hooks-tutorial-for-pure-usereducer-usecontext-for-global-state-like-redux-and-comparison/)
*   [Four patterns for global state with React hooks: Context or Redux](https://blog.axlight.com/posts/four-patterns-for-global-state-with-react-hooks-context-or-redux/)
*   [Steps to Develop Global State for React With Hooks Without Context](https://blog.axlight.com/posts/steps-to-develop-global-state-for-react/)

## Community Wiki

*   [Persistence](https://github.com/dai-shi/react-hooks-global-state/wiki/Persistence)
*   [Optional initialState](https://github.com/dai-shi/react-hooks-global-state/wiki/Optional-initialState)
