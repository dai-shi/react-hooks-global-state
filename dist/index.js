"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStore = exports.createGlobalState = void 0;

var _react = require("react");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// utility functions
var isFunction = function isFunction(fn) {
  return typeof fn === 'function';
};

var updateValue = function updateValue(oldValue, newValue) {
  if (isFunction(newValue)) {
    return newValue(oldValue);
  }

  return newValue;
}; // ref: https://github.com/dai-shi/react-hooks-global-state/issues/5


var useUnstableContextWithoutWarning = function useUnstableContextWithoutWarning(Context, observedBits) {
  var ReactCurrentDispatcher = _react.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher;
  var dispatcher = ReactCurrentDispatcher.current;

  if (!dispatcher) {
    throw new Error('Hooks can only be called inside the body of a function component. (https://fb.me/react-invalid-hook-call)');
  }

  return dispatcher.useContext(Context, observedBits);
}; // core functions


var createGlobalStateCommon = function createGlobalStateCommon(initialState) {
  var keys = Object.keys(initialState);
  var wholeGlobalState = initialState;
  var listener = null;

  var calculateChangedBits = function calculateChangedBits(a, b) {
    var bits = 0;
    keys.forEach(function (k, i) {
      if (a[k] !== b[k]) bits |= 1 << i;
    });
    return bits;
  };

  var Context = (0, _react.createContext)(initialState, calculateChangedBits);

  var GlobalStateProvider = function GlobalStateProvider(_ref) {
    var children = _ref.children;

    var _useState = (0, _react.useState)(initialState),
        _useState2 = _slicedToArray(_useState, 2),
        state = _useState2[0],
        setState = _useState2[1];

    (0, _react.useEffect)(function () {
      if (listener) throw new Error('You cannot use <GlobalStateProvider> more than once.');
      listener = setState;

      if (state !== initialState) {
        // probably state was saved by react-hot-loader, so restore it
        wholeGlobalState = state;
      } else if (state !== wholeGlobalState) {
        // wholeGlobalState was updated during initialization
        setState(wholeGlobalState);
      }

      var cleanup = function cleanup() {
        listener = null;
      };

      return cleanup; // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialState]); // trick for react-hot-loader

    return (0, _react.createElement)(Context.Provider, {
      value: state
    }, children);
  };

  var setGlobalState = function setGlobalState(name, update) {
    wholeGlobalState = _objectSpread({}, wholeGlobalState, _defineProperty({}, name, updateValue(wholeGlobalState[name], update)));

    if (listener) {
      listener(wholeGlobalState);
    }
  };

  var useGlobalState = function useGlobalState(name) {
    var index = keys.indexOf(name);
    var observedBits = 1 << index;
    var state = useUnstableContextWithoutWarning(Context, observedBits);
    var updater = (0, _react.useCallback)(function (u) {
      return setGlobalState(name, u);
    }, [name]);
    return [state[name], updater];
  };

  var getGlobalState = function getGlobalState(name) {
    var ReactCurrentDispatcher = _react.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher;
    var dispatcher = ReactCurrentDispatcher.current;

    if (dispatcher) {
      throw new Error('getGlobalState should not be used in render. Consider useGlobalState.');
    }

    return wholeGlobalState[name];
  };

  var getWholeGlobalState = function getWholeGlobalState() {
    return wholeGlobalState;
  };

  var setWholeGlobalState = function setWholeGlobalState(state) {
    wholeGlobalState = state;

    if (listener) {
      listener(wholeGlobalState);
    }
  };

  return {
    GlobalStateProvider: GlobalStateProvider,
    setGlobalState: setGlobalState,
    useGlobalState: useGlobalState,
    getGlobalState: getGlobalState,
    getWholeGlobalState: getWholeGlobalState,
    setWholeGlobalState: setWholeGlobalState
  };
}; // export functions


var createGlobalState = function createGlobalState(initialState) {
  var _createGlobalStateCom = createGlobalStateCommon(initialState),
      GlobalStateProvider = _createGlobalStateCom.GlobalStateProvider,
      useGlobalState = _createGlobalStateCom.useGlobalState,
      setGlobalState = _createGlobalStateCom.setGlobalState,
      getGlobalState = _createGlobalStateCom.getGlobalState;

  return {
    GlobalStateProvider: GlobalStateProvider,
    useGlobalState: useGlobalState,
    setGlobalState: setGlobalState,
    getGlobalState: getGlobalState
  };
};

exports.createGlobalState = createGlobalState;

var createStore = function createStore(reducer, initialState, enhancer) {
  if (!initialState) initialState = reducer(undefined, {
    type: undefined
  });
  if (enhancer) return enhancer(createStore)(reducer, initialState);

  var _createGlobalStateCom2 = createGlobalStateCommon(initialState),
      GlobalStateProvider = _createGlobalStateCom2.GlobalStateProvider,
      useGlobalState = _createGlobalStateCom2.useGlobalState,
      getWholeGlobalState = _createGlobalStateCom2.getWholeGlobalState,
      setWholeGlobalState = _createGlobalStateCom2.setWholeGlobalState;

  var dispatch = function dispatch(action) {
    var oldState = getWholeGlobalState();
    var newState = reducer(oldState, action);
    setWholeGlobalState(newState);
    return action;
  };

  return {
    GlobalStateProvider: GlobalStateProvider,
    useGlobalState: useGlobalState,
    getState: getWholeGlobalState,
    setState: setWholeGlobalState,
    // for devtools.js
    dispatch: dispatch
  };
};

exports.createStore = createStore;