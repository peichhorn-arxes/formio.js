'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EditFormUtils = {
  sortAndFilterComponents: function sortAndFilterComponents(components) {
    return _lodash2.default.filter(_lodash2.default.sortBy(components, 'weight'), function (item) {
      return !item.ignore;
    });
  },
  unifyComponents: function unifyComponents(objValue, srcValue) {
    if (objValue.key && srcValue.key) {
      if (objValue.key === srcValue.key) {
        // Create complete objects by including missing keys.
        _lodash2.default.each(objValue, function (value, prop) {
          if (!srcValue.hasOwnProperty(prop)) {
            srcValue[prop] = value;
          }
        });
        _lodash2.default.each(srcValue, function (value, prop) {
          if (!objValue.hasOwnProperty(prop)) {
            objValue[prop] = value;
          }
        });

        if (objValue.components) {
          srcValue.components = EditFormUtils.sortAndFilterComponents(_lodash2.default.unionWith(objValue.components, srcValue.components, EditFormUtils.unifyComponents));
        }
        return true;
      } else {
        return false;
      }
    }
    return _lodash2.default.isEqual(objValue, srcValue);
  },
  logicVariablesTable: function logicVariablesTable(additional) {
    additional = additional || '';
    return {
      type: 'htmlelement',
      tag: 'div',
      /* eslint-disable prefer-template */
      content: '<p>The following variables are available in all scripts.</p>' + '<table class="table table-bordered table-condensed table-striped">' + additional + '<tr><th>form</th><td>The complete form JSON object</td></tr>' + '<tr><th>submission</th><td>The complete submission object.</td></tr>' + '<tr><th>data</th><td>The complete submission data object.</td></tr>' + '<tr><th>row</th><td>Contextual "row" data, used within DataGrid, EditGrid, and Container components</td></tr>' + '<tr><th>component</th><td>The current component JSON</td></tr>' + '<tr><th>instance</th><td>The current component instance.</td></tr>' + '<tr><th>value</th><td>The current value of the component.</td></tr>' + '<tr><th>moment</th><td>The moment.js library for date manipulation.</td></tr>' + '<tr><th>_</th><td>An instance of <a href="https://lodash.com/docs/" target="_blank">Lodash</a>.</td></tr>' + '<tr><th>utils</th><td>An instance of the <a href="http://formio.github.io/formio.js/docs/identifiers.html#utils" target="_blank">FormioUtils</a> object.</td></tr>' + '<tr><th>util</th><td>An alias for "utils".</td></tr>' + '</table><br/>'
      /* eslint-enable prefer-template */
    };
  },
  javaScriptValue: function javaScriptValue(title, property, propertyJSON, weight, exampleHTML, exampleJSON) {
    return {
      type: 'panel',
      title: title,
      theme: 'default',
      collapsible: true,
      collapsed: true,
      key: property + 'Panel',
      weight: weight,
      components: [this.logicVariablesTable(), {
        type: 'panel',
        title: 'JavaScript',
        collapsible: true,
        collapsed: false,
        style: { 'margin-bottom': '10px' },
        key: property + '-js',
        components: [{
          type: 'textarea',
          key: property,
          rows: 5,
          editor: 'ace',
          hideLabel: true,
          input: true
        }, {
          type: 'htmlelement',
          tag: 'div',
          content: '<p>Enter custom javascript code.</p>' + exampleHTML
        }]
      }, {
        type: 'panel',
        title: 'JSONLogic',
        collapsible: true,
        collapsed: true,
        key: property + '-json',
        components: [{
          type: 'htmlelement',
          tag: 'div',
          /* eslint-disable prefer-template */
          content: '<p>Execute custom logic using <a href="http://jsonlogic.com/" target="_blank">JSONLogic</a>.</p>' + '<p>Full <a href="https://lodash.com/docs" target="_blank">Lodash</a> support is provided using an "_" before each operation, such as <code>{"_sum": {var: "data.a"}}</code></p>' + exampleJSON
          /* eslint-enable prefer-template */
        }, {
          type: 'textarea',
          key: propertyJSON,
          rows: 5,
          editor: 'ace',
          hideLabel: true,
          as: 'json',
          input: true
        }]
      }]
    };
  }
};

exports.default = EditFormUtils;