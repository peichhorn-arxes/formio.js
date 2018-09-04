'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  type: 'datamap',
  key: 'properties',
  label: 'Properties',
  input: true,
  valueComponent: {
    type: 'textfield',
    key: 'value',
    label: 'Value',
    defaultValue: 'Value',
    input: true
  }
};