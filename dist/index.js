"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStore = exports.createGlobalState = void 0;

var _react = require("react");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// utility functions
var map = function map(obj, func) {
  var newObj = {};
  Object.keys(obj).forEach(function (key) {
    newObj[key] = func(obj[key]);
  });
  return newObj;
};

var isFunction = function isFunction(fn) {
  return typeof fn === 'function';
}; // core functions


var createStateItem = function createStateItem(initialValue) {
  var value = initialValue;

  var getValue = function getValue() {
    return value;
  };

  var listeners = [];

  var updater = function updater(funcOrVal) {
    if (isFunction(funcOrVal)) {
      value = funcOrVal(value);
    } else {
      value = funcOrVal;
    }

    listeners.forEach(function (f) {
      return f(value);
    });
  };

  var hook = function hook() {
    var _useState = (0, _react.useState)(value),
        _useState2 = _slicedToArray(_useState, 2),
        val = _useState2[0],
        setVal = _useState2[1];

    (0, _react.useEffect)(function () {
      listeners.push(setVal);

      var cleanup = function cleanup() {
        var index = listeners.indexOf(setVal);
        listeners.splice(index, 1);
      };

      return cleanup;
    }, []);
    return [val, updater];
  };

  return {
    getValue: getValue,
    updater: updater,
    hook: hook
  };
};

var createGetState = function createGetState(stateItemMap, initialState) {
  var keys = Object.keys(stateItemMap);
  var globalState = initialState;

  var getState = function getState() {
    var changed = false;
    var currentState = {}; // XXX an extra overhead here

    keys.forEach(function (key) {
      currentState[key] = stateItemMap[key].getValue();
      if (currentState[key] !== globalState[key]) changed = true;
    });
    if (changed) globalState = currentState;
    return globalState;
  };

  return getState;
};

var createDispatch = function createDispatch(stateItemMap, getState, reducer) {
  var keys = Object.keys(stateItemMap);

  var dispatch = function dispatch(action) {
    var oldState = getState();
    var newState = reducer(oldState, action);

    if (oldState !== newState) {
      keys.forEach(function (key) {
        if (oldState[key] !== newState[key]) {
          stateItemMap[key].updater(newState[key]);
        }
      });
    }

    return action;
  };

  return dispatch;
}; // export functions


var createGlobalState = function createGlobalState(initialState) {
  var stateItemMap = map(initialState, createStateItem);
  return {
    useGlobalState: function useGlobalState(name) {
      return stateItemMap[name].hook();
    },
    setGlobalState: function setGlobalState(name, update) {
      return stateItemMap[name].updater(update);
    }
  };
};

exports.createGlobalState = createGlobalState;

var createStore = function createStore(reducer, initialState, enhancer) {
  if (enhancer) return enhancer(createStore)(reducer, initialState);
  var stateItemMap = map(initialState, createStateItem);
  var getState = createGetState(stateItemMap, initialState);
  var dispatch = createDispatch(stateItemMap, getState, reducer);
  return {
    useGlobalState: function useGlobalState(name) {
      return stateItemMap[name].hook();
    },
    getState: getState,
    dispatch: dispatch
  };
};

exports.createStore = createStore;