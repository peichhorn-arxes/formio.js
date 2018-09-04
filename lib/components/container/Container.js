'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _NestedComponent2 = require('../nested/NestedComponent');

var _NestedComponent3 = _interopRequireDefault(_NestedComponent2);

var _Base = require('../base/Base');

var _Base2 = _interopRequireDefault(_Base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ContainerComponent = function (_NestedComponent) {
  _inherits(ContainerComponent, _NestedComponent);

  _createClass(ContainerComponent, null, [{
    key: 'schema',
    value: function schema() {
      for (var _len = arguments.length, extend = Array(_len), _key = 0; _key < _len; _key++) {
        extend[_key] = arguments[_key];
      }

      return _NestedComponent3.default.schema.apply(_NestedComponent3.default, [{
        type: 'container',
        key: 'container',
        clearOnHide: true,
        input: true,
        tree: true,
        components: []
      }].concat(extend));
    }
  }, {
    key: 'builderInfo',
    get: function get() {
      return {
        title: 'Container',
        icon: 'fa fa-folder-open',
        group: 'data',
        documentation: 'http://help.form.io/userguide/#container',
        weight: 10,
        schema: ContainerComponent.schema()
      };
    }
  }]);

  function ContainerComponent(component, options, data) {
    _classCallCheck(this, ContainerComponent);

    var _this = _possibleConstructorReturn(this, (ContainerComponent.__proto__ || Object.getPrototypeOf(ContainerComponent)).call(this, component, options, data));

    _this.type = 'container';
    return _this;
  }

  _createClass(ContainerComponent, [{
    key: 'build',
    value: function build() {
      this.createElement();
      var labelAtTheBottom = this.component.labelPosition === 'bottom';
      if (!labelAtTheBottom) {
        this.createLabel(this.element);
      }
      if (!this.hasValue()) {
        this.dataValue = {};
      }
      this.addComponents(this.getContainer(), this.dataValue);
      if (labelAtTheBottom) {
        this.createLabel(this.element);
      }
    }
  }, {
    key: 'hasChanged',
    value: function hasChanged(before, after) {
      return !_lodash2.default.isEqual(before, after);
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      return this.dataValue;
    }
  }, {
    key: 'updateValue',
    value: function updateValue(flags, value) {
      // Intentionally skip over nested component updateValue method to keep recursive update from occurring with sub components.
      return _Base2.default.prototype.updateValue.call(this, flags, value);
    }
  }, {
    key: 'setValue',
    value: function setValue(value, flags) {
      var _this2 = this;

      flags = this.getFlags.apply(this, arguments);
      if (!value || !_lodash2.default.isObject(value)) {
        return;
      }
      var hasValue = this.hasValue();
      if (hasValue && _lodash2.default.isEmpty(this.dataValue)) {
        flags.noValidate = true;
      }
      if (!hasValue) {
        // Set the data value and then reset each component to use the new data object.
        this.dataValue = {};
        this.getComponents().forEach(function (component) {
          return component.data = _this2.dataValue;
        });
      }
      return _get(ContainerComponent.prototype.__proto__ || Object.getPrototypeOf(ContainerComponent.prototype), 'setValue', this).call(this, value, flags);
    }
  }, {
    key: 'defaultSchema',
    get: function get() {
      return ContainerComponent.schema();
    }
  }, {
    key: 'emptyValue',
    get: function get() {
      return {};
    }
  }]);

  return ContainerComponent;
}(_NestedComponent3.default);

exports.default = ContainerComponent;