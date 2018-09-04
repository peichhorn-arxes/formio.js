'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  for (var _len = arguments.length, extend = Array(_len), _key = 0; _key < _len; _key++) {
    extend[_key] = arguments[_key];
  }

  return _Base2.default.apply(undefined, [[{
    key: 'display',
    components: _DateTimeEdit6.default
  }, {
    label: 'Date',
    key: 'date',
    weight: 1,
    components: _DateTimeEdit4.default
  }, {
    label: 'Time',
    key: 'time',
    weight: 2,
    components: _DateTimeEdit8.default
  }, {
    key: 'data',
    components: _DateTimeEdit2.default
  }]].concat(extend));
};

var _Base = require('../base/Base.form');

var _Base2 = _interopRequireDefault(_Base);

var _DateTimeEdit = require('./editForm/DateTime.edit.data');

var _DateTimeEdit2 = _interopRequireDefault(_DateTimeEdit);

var _DateTimeEdit3 = require('./editForm/DateTime.edit.date');

var _DateTimeEdit4 = _interopRequireDefault(_DateTimeEdit3);

var _DateTimeEdit5 = require('./editForm/DateTime.edit.display');

var _DateTimeEdit6 = _interopRequireDefault(_DateTimeEdit5);

var _DateTimeEdit7 = require('./editForm/DateTime.edit.time');

var _DateTimeEdit8 = _interopRequireDefault(_DateTimeEdit7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }