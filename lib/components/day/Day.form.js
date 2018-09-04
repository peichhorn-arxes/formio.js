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
    components: _DayEdit2.default
  }, {
    key: 'validation',
    components: _DayEdit4.default
  }]].concat(extend));
};

var _Base = require('../base/Base.form');

var _Base2 = _interopRequireDefault(_Base);

var _DayEdit = require('./editForm/Day.edit.display');

var _DayEdit2 = _interopRequireDefault(_DayEdit);

var _DayEdit3 = require('./editForm/Day.edit.validation');

var _DayEdit4 = _interopRequireDefault(_DayEdit3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }