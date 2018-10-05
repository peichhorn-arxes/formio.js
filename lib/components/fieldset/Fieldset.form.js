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
    components: [{
      type: 'textfield',
      input: true,
      key: 'legend',
      label: 'Legend',
      placeholder: 'Legend',
      weight: 40
    }, {
      weight: 45,
      type: 'checkbox',
      label: 'Refresh On Change',
      tooltip: 'Rerender the field whenever a value on the form changes.',
      key: 'refreshOnChange',
      input: true
    }]
  }]].concat(extend));
};

var _NestedComponent = require('../nested/NestedComponent.form');

var _NestedComponent2 = _interopRequireDefault(_NestedComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }