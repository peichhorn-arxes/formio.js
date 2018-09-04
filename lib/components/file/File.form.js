'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  for (var _len = arguments.length, extend = Array(_len), _key = 0; _key < _len; _key++) {
    extend[_key] = arguments[_key];
  }

  return _Base2.default.apply(undefined, [[{
    label: 'File',
    key: 'file',
    weight: 5,
    components: _FileEdit2.default
  }]].concat(extend));
};

var _Base = require('../base/Base.form');

var _Base2 = _interopRequireDefault(_Base);

var _FileEdit = require('./editForm/File.edit.file');

var _FileEdit2 = _interopRequireDefault(_FileEdit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }