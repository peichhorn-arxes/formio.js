'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _InputWidget = require('./InputWidget');

var _InputWidget2 = _interopRequireDefault(_InputWidget);

var _CalendarWidget = require('./CalendarWidget');

var _CalendarWidget2 = _interopRequireDefault(_CalendarWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  input: _InputWidget2.default,
  calendar: _CalendarWidget2.default
};