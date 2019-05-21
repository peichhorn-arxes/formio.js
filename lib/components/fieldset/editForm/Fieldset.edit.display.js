"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = [{
  key: 'label',
  hidden: true,
  calculateValue: 'value = data.legend'
}, {
  weight: 1,
  type: 'textfield',
  input: true,
  key: 'legend',
  label: 'Legend',
  placeholder: 'Legend',
  tooltip: 'The legend for this Fieldset.'
}, {
  weight: 45,
  type: 'checkbox',
  label: 'Refresh On Change',
  tooltip: 'Rerender the field whenever a value on the form changes.',
  key: 'refreshOnChange',
  input: true
}];
exports.default = _default;