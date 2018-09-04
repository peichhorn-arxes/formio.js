'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Unknown = require('./unknown/Unknown');

var _Unknown2 = _interopRequireDefault(_Unknown);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Components = function () {
  function Components() {
    _classCallCheck(this, Components);
  }

  _createClass(Components, null, [{
    key: 'setComponents',
    value: function setComponents(comps) {
      // Set the tableView method on BaseComponent.
      if (comps.base) {
        // Implement the tableView method.
        comps.base.tableView = function (value, options) {
          var comp = Components.create(options.component, options.options || {}, options.data || {}, true);
          return comp.getView(value);
        };
      }
      _lodash2.default.assign(Components.components, comps);
    }
  }, {
    key: 'addComponent',
    value: function addComponent(name, comp) {
      return Components.setComponent(name, comp);
    }
  }, {
    key: 'setComponent',
    value: function setComponent(name, comp) {
      Components.components[name] = comp;
    }
  }, {
    key: 'create',
    value: function create(component, options, data, nobuild) {
      var comp = null;
      if (component.type && Components.components.hasOwnProperty(component.type)) {
        comp = new Components.components[component.type](component, options, data);
      } else {
        comp = new _Unknown2.default(component, options, data);
      }
      if (!nobuild) {
        comp.build();
        comp.isBuilt = true;
      }
      return comp;
    }
  }, {
    key: 'components',
    get: function get() {
      if (!Components._components) {
        Components._components = {};
      }
      return Components._components;
    }
  }]);

  return Components;
}();

exports.default = Components;