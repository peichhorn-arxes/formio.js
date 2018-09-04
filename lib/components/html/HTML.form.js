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
    components: _HTMLEdit2.default
  }]].concat(extend));
};

var _Base = require('../base/Base.form');

var _Base2 = _interopRequireDefault(_Base);

var _HTMLEdit = require('./editForm/HTML.edit.display');

var _HTMLEdit2 = _interopRequireDefault(_HTMLEdit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }