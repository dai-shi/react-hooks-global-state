/* eslint-env jest */

import React from 'react';
import { configure, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';

import { createGlobalState } from '../src/index';

configure({ adapter: new Adapter() });

describe('basic spec', () => {
  it('should have a function', () => {
    expect(createGlobalState).toBeDefined();
  });

  it.skip('should create a component with a global state', () => {
    const initialState = {
      counter1: 0,
    };
    const { stateItemHooks } = createGlobalState(initialState);
    const useCounter1 = stateItemHooks.counter1;
    const Counter = () => {
      const [value, update] = useCounter1();
      return (
        <div>
          <span>{value}</span>
          <button type="button" onClick={() => update(value + 1)}>+1</button>
        </div>
      );
    };
    const App = () => (
      <div>
        <div className="first">
          <Counter />
        </div>
        <div className="second">
          <Counter />
        </div>
      </div>
    );
    const wrapper = mount(<App />);
    expect(toJson(wrapper)).toMatchSnapshot();
    wrapper.find('.first button').simulate('click');
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
