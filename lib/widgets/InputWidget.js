'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _Component2 = require('../Component');

var _Component3 = _interopRequireDefault(_Component2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InputWidget = function (_Component) {
  _inherits(InputWidget, _Component);

  function InputWidget(settings, component) {
    _classCallCheck(this, InputWidget);

    var _this = _possibleConstructorReturn(this, (InputWidget.__proto__ || Object.getPrototypeOf(InputWidget)).call(this, settings));

    _this.namespace = 'formio.widget';
    _this.component = component || {};
    _this.settings = _lodash2.default.merge({}, _this.defaultSettings, settings || {});
    return _this;
  }

  _createClass(InputWidget, [{
    key: 'attach',
    value: function attach(input) {
      this._input = input;
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      return this._input.value;
    }
  }, {
    key: 'getView',
    value: function getView(value) {
      return value;
    }
  }, {
    key: 'validationValue',
    value: function validationValue(value) {
      return value;
    }
  }, {
    key: 'addPrefix',
    value: function addPrefix() {
      return null;
    }
  }, {
    key: 'addSuffix',
    value: function addSuffix() {
      return null;
    }
  }, {
    key: 'setValue',
    value: function setValue(value) {
      this._input.value = value;
    }
  }, {
    key: 'defaultSettings',
    get: function get() {
      return {};
    }
  }, {
    key: 'disabled',
    set: function set(disabled) {
      if (disabled) {
        this._input.setAttribute('disabled', 'disabled');
      } else {
        this._input.removeAttribute('disabled');
      }
    }
  }, {
    key: 'input',
    get: function get() {
      return this._input;
    }
  }, {
    key: 'defaultValue',
    get: function get() {
      return '';
    }
  }]);

  return InputWidget;
}(_Component3.default);

exports.default = InputWidget;