'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  for (var _len = arguments.length, extend = Array(_len), _key = 0; _key < _len; _key++) {
    extend[_key] = arguments[_key];
  }

  return _TextField2.default.apply(undefined, [[{
    key: 'display',
    components: _PasswordEdit2.default
  }]].concat(extend));
};

var _TextField = require('../textfield/TextField.form');

var _TextField2 = _interopRequireDefault(_TextField);

var _PasswordEdit = require('./editForm/Password.edit.display');

var _PasswordEdit2 = _interopRequireDefault(_PasswordEdit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }