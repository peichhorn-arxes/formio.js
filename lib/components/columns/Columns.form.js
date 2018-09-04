'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  for (var _len = arguments.length, extend = Array(_len), _key = 0; _key < _len; _key++) {
    extend[_key] = arguments[_key];
  }

  return _NestedComponent2.default.apply(undefined, [[{
    key: 'display',
    components: _ColumnsEdit2.default
  }]].concat(extend));
};

var _NestedComponent = require('../nested/NestedComponent.form');

var _NestedComponent2 = _interopRequireDefault(_NestedComponent);

var _ColumnsEdit = require('./editForm/Columns.edit.display');

var _ColumnsEdit2 = _interopRequireDefault(_ColumnsEdit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }