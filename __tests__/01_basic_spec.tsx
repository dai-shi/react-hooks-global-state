import React, { StrictMode } from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';

import { createGlobalState, createStore } from '../src/index';

describe('basic spec', () => {
  afterEach(cleanup);

  it('should exists exported functions', () => {
    expect(createGlobalState).toBeDefined();
    expect(createStore).toBeDefined();
  });

  it('should be possible to not specify initial state', () => {
    const reducer = (state = { count: 0 }, action: { type: 'INC' }) => {
      if (action.type === 'INC') {
        return { count: state.count + 1 };
      }
      return state;
    };
    const { useStoreState, dispatch } = createStore(reducer);
    const Counter = () => {
      const value = useStoreState('count');
      return (
        <div>
          <span>{value}</span>
          <button type="button" onClick={() => dispatch({ type: 'INC' })}>+1</button>
        </div>
      );
    };
    const App = () => (
      <StrictMode>
        <Counter />
      </StrictMode>
    );
    const { getByText } = render(<App />);
    expect(getByText('0')).toBeDefined();
    fireEvent.click(getByText('+1'));
    expect(getByText('1')).toBeDefined();
  });

  it('should create a component with a global state', () => {
    const initialState = {
      count1: 0,
    };
    const { useGlobalState } = createGlobalState(initialState);
    const Counter = () => {
      const [value, update] = useGlobalState('count1');
      return (
        <div>
          <span>{value}</span>
          <button type="button" onClick={() => update(value + 1)}>+1</button>
        </div>
      );
    };
    const App = () => (
      <StrictMode>
        <Counter />
        <Counter />
      </StrictMode>
    );
    const { getAllByText, container } = render(<App />);
    expect(container).toMatchSnapshot();
    fireEvent.click(getAllByText('+1')[0] as HTMLElement);
    expect(container).toMatchSnapshot();
  });

  it('should subscribe to global state change', () => {
    const containerRef : { current: null | HTMLDivElement } = {
      current: null,
    };
    const { useGlobalState, subscribe } = createGlobalState({
      count: 0,
    });
    subscribe((state) => {
      containerRef.current?.setAttribute('data-testid', `count ${state.count}`);
    });

    const Counter = () => {
      const [value, update] = useGlobalState('count');
      return (
        <div
          ref={(ref) => {
            if (ref) {
              containerRef.current = ref;
            }
          }}
        >
          <span>{value}</span>
          <button type="button" onClick={() => update(value + 1)}>+1</button>
        </div>
      );
    };
    const App = () => (
      <StrictMode>
        <Counter />
      </StrictMode>
    );
    const { getByTestId, getAllByText } = render(<App />);
    fireEvent.click(getAllByText('+1')[0] as HTMLElement);
    expect(getByTestId('count 1')).toBeDefined();
  });
});
