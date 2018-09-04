'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  for (var _len = arguments.length, extend = Array(_len), _key = 0; _key < _len; _key++) {
    extend[_key] = arguments[_key];
  }

  var components = [{
    type: 'tabs',
    key: 'tabs',
    components: [{
      label: 'Display',
      key: 'display',
      weight: 0,
      components: _BaseEdit8.default
    }, {
      label: 'Data',
      key: 'data',
      weight: 10,
      components: _BaseEdit4.default
    }, {
      label: 'Validation',
      key: 'validation',
      weight: 20,
      components: _BaseEdit12.default
    }, {
      label: 'API',
      key: 'api',
      weight: 30,
      components: _BaseEdit6.default
    }, {
      label: 'Conditional',
      key: 'conditional',
      weight: 40,
      components: _BaseEdit2.default
    }, {
      label: 'Logic',
      key: 'logic',
      weight: 50,
      components: _BaseEdit10.default
    }]
  }].concat(extend.map(function (items) {
    return {
      type: 'tabs',
      key: 'tabs',
      components: items
    };
  }));
  return {
    components: _lodash2.default.unionWith(components, _utils2.default.unifyComponents).concat({
      type: 'hidden',
      key: 'type'
    })
  };
};

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _BaseEdit = require('./editForm/Base.edit.conditional');

var _BaseEdit2 = _interopRequireDefault(_BaseEdit);

var _BaseEdit3 = require('./editForm/Base.edit.data');

var _BaseEdit4 = _interopRequireDefault(_BaseEdit3);

var _BaseEdit5 = require('./editForm/Base.edit.api');

var _BaseEdit6 = _interopRequireDefault(_BaseEdit5);

var _BaseEdit7 = require('./editForm/Base.edit.display');

var _BaseEdit8 = _interopRequireDefault(_BaseEdit7);

var _BaseEdit9 = require('./editForm/Base.edit.logic');

var _BaseEdit10 = _interopRequireDefault(_BaseEdit9);

var _BaseEdit11 = require('./editForm/Base.edit.validation');

var _BaseEdit12 = _interopRequireDefault(_BaseEdit11);

var _utils = require('./editForm/utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }