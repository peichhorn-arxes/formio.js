'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  for (var _len = arguments.length, extend = Array(_len), _key = 0; _key < _len; _key++) {
    extend[_key] = arguments[_key];
  }

  return _Base2.default.apply(undefined, [[{
    key: 'data',
    components: _SelectEdit2.default
  }, {
    key: 'validation',
    components: _SelectEdit4.default
  }]].concat(extend));
};

var _Base = require('../base/Base.form');

var _Base2 = _interopRequireDefault(_Base);

var _SelectEdit = require('./editForm/Select.edit.data');

var _SelectEdit2 = _interopRequireDefault(_SelectEdit);

var _SelectEdit3 = require('./editForm/Select.edit.validation');

var _SelectEdit4 = _interopRequireDefault(_SelectEdit3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }