'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _Base = require('../base/Base');

var _Base2 = _interopRequireDefault(_Base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CheckBoxComponent = function (_BaseComponent) {
  _inherits(CheckBoxComponent, _BaseComponent);

  function CheckBoxComponent() {
    _classCallCheck(this, CheckBoxComponent);

    return _possibleConstructorReturn(this, (CheckBoxComponent.__proto__ || Object.getPrototypeOf(CheckBoxComponent)).apply(this, arguments));
  }

  _createClass(CheckBoxComponent, [{
    key: 'elementInfo',
    value: function elementInfo() {
      var info = _get(CheckBoxComponent.prototype.__proto__ || Object.getPrototypeOf(CheckBoxComponent.prototype), 'elementInfo', this).call(this);
      info.type = 'input';
      info.changeEvent = 'click';
      info.attr.type = this.component.inputType || 'checkbox';
      info.attr.class = 'form-check-input';
      if (this.component.name) {
        info.attr.name = 'data[' + this.component.name + ']';
      }
      info.attr.value = this.component.value ? this.component.value : 0;
      return info;
    }
  }, {
    key: 'build',
    value: function build() {
      if (this.viewOnly) {
        return this.viewOnlyBuild();
      }

      if (!this.component.input) {
        return;
      }
      this.createElement();
      this.input = this.createInput(this.element);
      this.createLabel(this.element, this.input);
      if (!this.labelElement) {
        this.addInput(this.input, this.element);
      }
      this.createDescription(this.element);
      this.restoreValue();
      if (this.shouldDisable) {
        this.disabled = true;
      }
      this.autofocus();
    }
  }, {
    key: 'createElement',
    value: function createElement() {
      var className = this.className;
      if (!this.labelIsHidden()) {
        className += ' ' + (this.component.inputType || 'checkbox');
      }
      this.element = this.ce('div', {
        id: this.id,
        class: className
      });
      this.element.component = this;
    }
  }, {
    key: 'labelOnTheTopOrLeft',
    value: function labelOnTheTopOrLeft() {
      return ['top', 'left'].indexOf(this.component.labelPosition) !== -1;
    }
  }, {
    key: 'labelOnTheTopOrBottom',
    value: function labelOnTheTopOrBottom() {
      return ['top', 'bottom'].indexOf(this.component.labelPosition) !== -1;
    }
  }, {
    key: 'setInputLabelStyle',
    value: function setInputLabelStyle(label) {
      if (this.component.labelPosition === 'left') {
        _lodash2.default.assign(label.style, {
          textAlign: 'center',
          paddingLeft: 0
        });
      }

      if (this.labelOnTheTopOrBottom()) {
        _lodash2.default.assign(label.style, {
          display: 'block',
          textAlign: 'center',
          paddingLeft: 0
        });
      }
    }
  }, {
    key: 'setInputStyle',
    value: function setInputStyle(input) {
      if (!input) {
        return;
      }
      if (this.component.labelPosition === 'left') {
        _lodash2.default.assign(input.style, {
          position: 'initial',
          marginLeft: '7px'
        });
      }

      if (this.labelOnTheTopOrBottom()) {
        _lodash2.default.assign(input.style, {
          width: '100%',
          position: 'initial',
          marginLeft: 0
        });
      }
    }
  }, {
    key: 'isEmpty',
    value: function isEmpty(value) {
      return _get(CheckBoxComponent.prototype.__proto__ || Object.getPrototypeOf(CheckBoxComponent.prototype), 'isEmpty', this).call(this, value) || value === false;
    }
  }, {
    key: 'createLabel',
    value: function createLabel(container, input) {
      var isLabelHidden = this.labelIsHidden();
      var className = 'control-label form-check-label form-check';
      if (this.component.input && !this.options.inputsOnly && this.component.validate && this.component.validate.required) {
        className += ' field-required';
      }

      this.labelElement = this.ce('label', {
        class: className
      });
      this.addShortcut();

      this.setInputStyles(this.labelElement);

      var labelOnTheTopOrOnTheLeft = this.labelOnTheTopOrLeft();
      if (!isLabelHidden) {
        // Create the SPAN around the textNode for better style hooks
        this.labelSpan = this.ce('span');

        if (this.info.attr.id) {
          this.labelElement.setAttribute('for', this.info.attr.id);
        }
      }
      if (!isLabelHidden && labelOnTheTopOrOnTheLeft) {
        this.setInputLabelStyle(this.labelElement);
        this.setInputStyle(input);
        this.labelSpan.appendChild(this.text(this.component.label));
        this.labelElement.appendChild(this.labelSpan);
      }
      this.addInput(input, this.labelElement);
      if (!isLabelHidden && !labelOnTheTopOrOnTheLeft) {
        this.setInputLabelStyle(this.labelElement);
        this.setInputStyle(input);
        this.labelSpan.appendChild(this.text(this.addShortcutToLabel()));
        this.labelElement.appendChild(this.labelSpan);
      }
      this.createTooltip(this.labelElement);
      container.appendChild(this.labelElement);
    }
  }, {
    key: 'createInput',
    value: function createInput(container) {
      if (!this.component.input) {
        return;
      }
      var input = this.ce(this.info.type, this.info.attr);
      this.errorContainer = container;
      return input;
    }
  }, {
    key: 'getValueAt',
    value: function getValueAt(index) {
      if (this.component.name) {
        return this.inputs[index].checked ? this.component.value : '';
      }
      return !!this.inputs[index].checked;
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      var value = _get(CheckBoxComponent.prototype.__proto__ || Object.getPrototypeOf(CheckBoxComponent.prototype), 'getValue', this).call(this);
      if (this.component.name) {
        return value ? this.setCheckedState(value) : this.setCheckedState(this.dataValue);
      } else {
        return value;
      }
    }
  }, {
    key: 'setCheckedState',
    value: function setCheckedState(value) {
      if (!this.input) {
        return;
      }
      if (this.component.name) {
        this.input.value = value === this.component.value ? this.component.value : 0;
        this.input.checked = value === this.component.value ? 1 : 0;
      } else if (value === 'on') {
        this.input.value = 1;
        this.input.checked = 1;
      } else if (value === 'off') {
        this.input.value = 0;
        this.input.checked = 0;
      } else if (value) {
        this.input.value = 1;
        this.input.checked = 1;
      } else {
        this.input.value = 0;
        this.input.checked = 0;
      }
      if (this.input.checked) {
        this.input.setAttribute('checked', true);
      } else {
        this.input.removeAttribute('checked');
      }
      return value;
    }
  }, {
    key: 'setValue',
    value: function setValue(value, flags) {
      flags = this.getFlags.apply(this, arguments);
      if (this.setCheckedState(value) !== undefined) {
        return this.updateValue(flags);
      }
    }
  }, {
    key: 'getView',
    value: function getView(value) {
      return value ? 'Yes' : 'No';
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      _get(CheckBoxComponent.prototype.__proto__ || Object.getPrototypeOf(CheckBoxComponent.prototype), 'destroy', this).apply(this, Array.prototype.slice.apply(arguments));
      this.removeShortcut();
    }
  }, {
    key: 'defaultSchema',
    get: function get() {
      return CheckBoxComponent.schema();
    }
  }, {
    key: 'defaultValue',
    get: function get() {
      return this.component.name ? '' : (this.component.defaultValue || false).toString() === 'true';
    }
  }, {
    key: 'emptyValue',
    get: function get() {
      return false;
    }
  }, {
    key: 'dataValue',
    set: function set(value) {
      var setValue = _set(CheckBoxComponent.prototype.__proto__ || Object.getPrototypeOf(CheckBoxComponent.prototype), 'dataValue', value, this);
      if (this.component.name) {
        _lodash2.default.set(this.data, this.component.key, setValue === this.component.value);
      }
      return setValue;
    },
    get: function get() {
      var getValue = _get(CheckBoxComponent.prototype.__proto__ || Object.getPrototypeOf(CheckBoxComponent.prototype), 'dataValue', this);
      if (this.component.name) {
        _lodash2.default.set(this.data, this.component.key, getValue === this.component.value);
      }
      return getValue;
    }
  }, {
    key: 'key',
    get: function get() {
      return this.component.name ? this.component.name : _get(CheckBoxComponent.prototype.__proto__ || Object.getPrototypeOf(CheckBoxComponent.prototype), 'key', this);
    }
  }], [{
    key: 'schema',
    value: function schema() {
      for (var _len = arguments.length, extend = Array(_len), _key = 0; _key < _len; _key++) {
        extend[_key] = arguments[_key];
      }

      return _Base2.default.schema.apply(_Base2.default, [{
        type: 'checkbox',
        inputType: 'checkbox',
        label: 'Checkbox',
        key: 'checkbox',
        dataGridLabel: true,
        labelPosition: 'right',
        value: '',
        name: ''
      }].concat(extend));
    }
  }, {
    key: 'builderInfo',
    get: function get() {
      return {
        title: 'Checkbox',
        group: 'basic',
        icon: 'fa fa-check-square',
        documentation: 'http://help.form.io/userguide/#checkbox',
        weight: 50,
        schema: CheckBoxComponent.schema()
      };
    }
  }]);

  return CheckBoxComponent;
}(_Base2.default);

exports.default = CheckBoxComponent;