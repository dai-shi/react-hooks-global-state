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
    const { StateProvider, StateConsumer } = createGlobalState(initialState);
    const Counter = () => (
      <StateConsumer name="counter1">
        {(value, update) => (
          <div>
            <span>{value}</span>
            <button type="button" onClick={() => update(value + 1)}>+1</button>
          </div>
        )}
      </StateConsumer>
    );
    const App = () => (
      <StateProvider>
        <div className="first">
          <Counter />
        </div>
        <div className="second">
          <Counter />
        </div>
      </StateProvider>
    );
    const wrapper = mount(<App />);
    expect(toJson(wrapper)).toMatchSnapshot();
    wrapper.find('.first button').simulate('click');
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
