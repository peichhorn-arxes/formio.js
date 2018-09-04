'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _widgets = require('../../../widgets');

var _widgets2 = _interopRequireDefault(_widgets);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = [{
  weight: 50,
  type: 'select',
  input: true,
  key: 'widget.type',
  label: 'Widget',
  placeholder: 'Select a widget',
  tooltip: 'The widget is the display UI used to input the value of the field.',
  onChange: function onChange(context) {
    context.data.widget = _lodash2.default.pick(context.data.widget, 'type');
  },
  dataSrc: 'values',
  data: {
    values: [{ label: 'Calendar', value: 'calendar' }]
  }
}, {
  weight: 55,
  type: 'textarea',
  key: 'widget',
  label: 'Widget Settings',
  calculateValue: function calculateValue(context) {
    if (_lodash2.default.isEmpty(_lodash2.default.omit(context.data.widget, 'type'))) {
      var settings = {};
      if (context.data.widget && context.data.widget.type) {
        settings = _widgets2.default[context.data.widget.type].defaultSettings;
      }
      return settings;
    }
    return context.data.widget;
  },
  input: true,
  rows: 5,
  editor: 'ace',
  as: 'json',
  conditional: {
    json: { '!!': { var: 'data.widget.type' } }
  }
}, {
  weight: 410,
  type: 'textfield',
  input: true,
  key: 'inputMask',
  label: 'Input Mask',
  tooltip: 'An input mask helps the user with input by ensuring a predefined format.<br><br>9: numeric<br>a: alphabetical<br>*: alphanumeric<br><br>Example telephone mask: (999) 999-9999<br><br>See the <a target=\'_blank\' href=\'https://github.com/RobinHerbots/jquery.inputmask\'>jquery.inputmask documentation</a> for more information.</a>',
  customConditional: 'show = !data.allowMultipleMasks;'
}, {
  weight: 413,
  type: 'checkbox',
  input: true,
  key: 'allowMultipleMasks',
  label: 'Allow Multiple Masks'
}, {
  weight: 417,
  type: 'datagrid',
  input: true,
  key: 'inputMasks',
  label: 'Input Masks',
  customConditional: 'show = data.allowMultipleMasks === true;',
  components: [{
    type: 'textfield',
    key: 'label',
    label: 'Label',
    input: true
  }, {
    type: 'textfield',
    key: 'mask',
    label: 'Mask',
    input: true
  }]
}, {
  weight: 420,
  type: 'textfield',
  input: true,
  key: 'prefix',
  label: 'Prefix'
}, {
  weight: 430,
  type: 'textfield',
  input: true,
  key: 'suffix',
  label: 'Suffix'
}, {
  weight: 710,
  type: 'checkbox',
  input: true,
  key: 'showWordCount',
  label: 'Show Word Counter'
}, {
  weight: 720,
  type: 'checkbox',
  input: true,
  key: 'showCharCount',
  label: 'Show Character Counter'
}];