import React, { useEffect } from 'react';
import { configure, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';

import { createGlobalState } from '../src/index';

configure({ adapter: new Adapter() });

describe('useeffect spec', () => {
  it.skip('should update a global state with useEffect', () => {
    const initialState = {
      counter1: 0,
    };
    const { GlobalStateProvider, useGlobalState } = createGlobalState(initialState);
    const Counter = () => {
      const [value, update] = useGlobalState('counter1');
      useEffect(() => {
        update(9);
      }, []);
      return (
        <div>
          <span>{value}</span>
        </div>
      );
    };
    const App = () => (
      <GlobalStateProvider>
        <Counter />
      </GlobalStateProvider>
    );
    const wrapper = mount(<App />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
