"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createGlobalState = void 0;

var _react = require("react");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var isFunction = function isFunction(fn) {
  return typeof fn === 'function';
};

var createGlobalState = function createGlobalState(initialState) {
  var globalState = _objectSpread({}, initialState);

  var stateItemListeners = {};
  var stateItemUpdaters = {};
  var stateItemHooks = {};
  Object.keys(globalState).forEach(function (name) {
    stateItemListeners[name] = [];

    stateItemUpdaters[name] = function (func) {
      if (isFunction(func)) {
        globalState[name] = func(globalState[name]);
      } else {
        globalState[name] = func;
      }

      stateItemListeners[name].forEach(function (f) {
        return f(globalState[name]);
      });
    };

    stateItemHooks[name] = function () {
      var _useState = (0, _react.useState)(globalState[name]),
          _useState2 = _slicedToArray(_useState, 2),
          value = _useState2[0],
          setValue = _useState2[1];

      (0, _react.useEffect)(function () {
        stateItemListeners[name].push(setValue);

        var cleanup = function cleanup() {
          var index = stateItemListeners[name].indexOf(setValue);
          stateItemListeners[name].splice(index, 1);
        };

        return cleanup;
      }, []);
      return [value, stateItemUpdaters[name]];
    };
  });
  Object.freeze(stateItemUpdaters);
  Object.freeze(stateItemHooks);
  return {
    stateItemUpdaters: stateItemUpdaters,
    stateItemHooks: stateItemHooks
  };
};

exports.createGlobalState = createGlobalState;