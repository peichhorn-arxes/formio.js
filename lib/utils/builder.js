'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  /**
   * Appends a number to a component.key to keep it unique
   *
   * @param {Object} form
   *   The components parent form.
   * @param {Object} component
   *   The component to uniquify
   */
  uniquify: function uniquify(form, component) {
    var changed = false;
    var formKeys = {};
    (0, _utils.eachComponent)(form.components, function (comp) {
      formKeys[comp.key] = true;
    });

    // Recurse into all child components.
    (0, _utils.eachComponent)([component], function (component) {
      // Skip key uniquification if this component doesn't have a key.
      if (!component.key) {
        return;
      }

      var newKey = (0, _utils.uniqueKey)(formKeys, component.key);
      if (newKey !== component.key) {
        component.key = newKey;
        changed = true;
      }
    }, true);
    return changed;
  },


  additionalShortcuts: {
    button: ['Enter', 'Esc']
  },

  getAlphaShortcuts: function getAlphaShortcuts() {
    return _lodash2.default.range('A'.charCodeAt(), 'Z'.charCodeAt() + 1).map(function (charCode) {
      return String.fromCharCode(charCode);
    });
  },
  getAdditionalShortcuts: function getAdditionalShortcuts(type) {
    return this.additionalShortcuts[type] || [];
  },
  getBindedShortcuts: function getBindedShortcuts(components, input) {
    var result = [];

    (0, _utils.eachComponent)(components, function (component) {
      if (component === input) {
        return;
      }

      if (component.shortcut) {
        result.push(component.shortcut);
      }
      if (component.values) {
        component.values.forEach(function (value) {
          if (value.shortcut) {
            result.push(value.shortcut);
          }
        });
      }
    }, true);

    return result;
  },
  getAvailableShortcuts: function getAvailableShortcuts(form, component) {
    if (!component) {
      return [];
    }
    return [''].concat(_lodash2.default.difference(this.getAlphaShortcuts().concat(this.getAdditionalShortcuts(component.type)), this.getBindedShortcuts(form.components, component)));
  }
};