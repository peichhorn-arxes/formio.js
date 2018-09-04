'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable max-len */
exports.default = [{
  type: 'textfield',
  label: 'Default Value',
  key: 'defaultValue',
  weight: 100,
  placeholder: 'Default Value',
  tooltip: 'The will be the value for this field, before user interaction. Having a default value will override the placeholder text.',
  input: true
}, _utils2.default.javaScriptValue('Custom Default Value', 'customDefaultValue', 'customDefaultValue', 110, '<p><h4>Example:</h4><pre>value = data.firstName + " " + data.lastName;</pre></p>', '<p><h4>Example:</h4><pre>{"cat": [{"var": "data.firstName"}, " ", {"var": "data.lastName"}]}</pre>'), _utils2.default.javaScriptValue('Calculated Value', 'calculateValue', 'calculateValue', 120, '<p><h4>Example:</h4><pre>value = data.a + data.b + data.c;</pre></p>', '<p><h4>Example:</h4><pre>{"sum": [{"var": "data.a"}, {"var": "data.b"}, {"var": "data.c"}]}</pre><p><a target="_blank" href="http://formio.github.io/formio.js/app/examples/calculated.html">Click here for an example</a></p>'), {
  type: 'select',
  input: true,
  key: 'refreshOn',
  label: 'Refresh On',
  weight: 110,
  tooltip: 'Refresh data when another field changes.',
  dataSrc: 'custom',
  data: {
    custom: '\n        values.push({label: \'Any Change\', key: \'data\'});\n        utils.eachComponent(instance.root.editForm.components, function(component, path) {\n          if (component.key !== data.key) {\n            values.push({\n              label: component.label || component.key,\n              value: path\n            });\n          }\n        });\n      '
  }
}, {
  type: 'checkbox',
  input: true,
  weight: 111,
  key: 'clearOnRefresh',
  label: 'Clear Value On Refresh',
  tooltip: 'When the Refresh On field is changed, clear this components value.'
}, {
  weight: 400,
  type: 'checkbox',
  label: 'Encrypt',
  tooltip: 'Encrypt this field on the server. This is two way encryption which is not be suitable for passwords.',
  key: 'autofocus',
  input: true
}, {
  type: 'checkbox',
  input: true,
  weight: 500,
  key: 'dbIndex',
  label: 'Database Index',
  tooltip: 'Set this field as an index within the database. Increases performance for submission queries.'
}];
/* eslint-enable max-len */