'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _Base = require('../base/Base');

var _Base2 = _interopRequireDefault(_Base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TextFieldComponent = function (_BaseComponent) {
  _inherits(TextFieldComponent, _BaseComponent);

  function TextFieldComponent() {
    _classCallCheck(this, TextFieldComponent);

    return _possibleConstructorReturn(this, (TextFieldComponent.__proto__ || Object.getPrototypeOf(TextFieldComponent)).apply(this, arguments));
  }

  _createClass(TextFieldComponent, [{
    key: 'elementInfo',
    value: function elementInfo() {
      var info = _get(TextFieldComponent.prototype.__proto__ || Object.getPrototypeOf(TextFieldComponent.prototype), 'elementInfo', this).call(this);
      info.type = 'input';

      if (this.component.hasOwnProperty('spellcheck')) {
        info.attr.spellcheck = this.component.spellcheck;
      }

      if (this.component.mask) {
        info.attr.type = 'password';
      } else {
        info.attr.type = 'text';
      }
      info.changeEvent = 'input';
      return info;
    }
  }, {
    key: 'createInput',
    value: function createInput(container) {
      if (!this.isMultipleMasksField) {
        var _inputGroup = _get(TextFieldComponent.prototype.__proto__ || Object.getPrototypeOf(TextFieldComponent.prototype), 'createInput', this).call(this, container);
        this.addCounter(container);
        return _inputGroup;
      }
      //if component should have multiple masks
      var id = '' + this.key;
      var attr = this.info.attr;
      attr.class += ' formio-multiple-mask-input';
      attr.id = id;
      var textInput = this.ce('input', attr);

      var inputGroup = this.ce('div', {
        class: 'input-group formio-multiple-mask-container'
      });
      this.addPrefix(textInput, inputGroup);
      var maskInput = this.createMaskInput(textInput);
      this.addTextInputs(textInput, maskInput, inputGroup);
      this.addSuffix(textInput, inputGroup);

      this.errorContainer = container;
      this.setInputStyles(inputGroup);
      this.addCounter(inputGroup);
      container.appendChild(inputGroup);
      return inputGroup;
    }
  }, {
    key: 'addCounter',
    value: function addCounter(container) {
      if (_lodash2.default.get(this.component, 'showWordCount', false)) {
        this.maxWordCount = _lodash2.default.parseInt(_lodash2.default.get(this.component, 'validate.maxWords', 0), 10);
        this.wordCount = this.ce('span', {
          class: 'text-muted pull-right',
          style: 'margin-left: 4px'
        });
        container.appendChild(this.wordCount);
      }
      if (_lodash2.default.get(this.component, 'showCharCount', false)) {
        this.maxCharCount = _lodash2.default.parseInt(_lodash2.default.get(this.component, 'validate.maxLength', 0), 10);
        this.charCount = this.ce('span', {
          class: 'text-muted pull-right'
        });
        container.appendChild(this.charCount);
      }
      return container;
    }
  }, {
    key: 'setCounter',
    value: function setCounter(type, element, count, max) {
      if (max) {
        var remaining = max - count;
        if (remaining > 0) {
          this.removeClass(element, 'text-danger');
        } else {
          this.addClass(element, 'text-danger');
        }
        element.innerHTML = this.t('{{ remaining }} ' + type + ' remaining.', {
          remaining: remaining
        });
      } else {
        element.innerHTML = this.t('{{ count }} ' + type, {
          count: count
        });
      }
    }
  }, {
    key: 'onChange',
    value: function onChange(flags, fromRoot) {
      _get(TextFieldComponent.prototype.__proto__ || Object.getPrototypeOf(TextFieldComponent.prototype), 'onChange', this).call(this, flags, fromRoot);
      if (this.wordCount) {
        this.setCounter('words', this.wordCount, this.dataValue.trim().split(/\s+/).length, this.maxWordCount);
      }
      if (this.charCount) {
        this.setCounter('characters', this.charCount, this.dataValue.length, this.maxCharCount);
      }
    }
  }, {
    key: 'setValueAt',
    value: function setValueAt(index, value) {
      if (!this.isMultipleMasksField) {
        return _get(TextFieldComponent.prototype.__proto__ || Object.getPrototypeOf(TextFieldComponent.prototype), 'setValueAt', this).call(this, index, value);
      }
      var defaultValue = this.defaultValue;
      if (!value) {
        if (defaultValue) {
          value = defaultValue;
        } else {
          value = {
            maskName: this.component.inputMasks[0].label
          };
        }
      }
      //if value is a string, treat it as text value itself and use default mask or first mask in the list
      var defaultMaskName = _lodash2.default.get(defaultValue, 'maskName', '');
      if (typeof value === 'string') {
        value = {
          value: value,
          maskName: defaultMaskName ? defaultMaskName : this.component.inputMasks[0].label
        };
      }
      var maskName = value.maskName || '';
      var textValue = value.value || '';
      var textInput = this.inputs[index] ? this.inputs[index].text : undefined;
      var maskInput = this.inputs[index] ? this.inputs[index].mask : undefined;
      if (textInput && maskInput) {
        maskInput.value = maskName;
        textInput.value = textValue;
        this.updateMask(textInput, maskName);
      }
    }
  }, {
    key: 'getValueAt',
    value: function getValueAt(index) {
      if (!this.isMultipleMasksField) {
        return _get(TextFieldComponent.prototype.__proto__ || Object.getPrototypeOf(TextFieldComponent.prototype), 'getValueAt', this).call(this, index);
      }
      var textField = this.inputs[index];
      return {
        value: textField && textField.text ? textField.text.value : undefined,
        maskName: textField && textField.mask ? textField.mask.value : undefined
      };
    }
  }, {
    key: 'performInputMapping',
    value: function performInputMapping(input) {
      if (!this.isMultipleMasksField) {
        return _get(TextFieldComponent.prototype.__proto__ || Object.getPrototypeOf(TextFieldComponent.prototype), 'performInputMapping', this).call(this, input);
      }
      return input && input.text ? input.text : input;
    }
  }, {
    key: 'buildInput',
    value: function buildInput(container, value, index) {
      if (!this.isMultipleMasksField) {
        return _get(TextFieldComponent.prototype.__proto__ || Object.getPrototypeOf(TextFieldComponent.prototype), 'buildInput', this).call(this, container, value, index);
      }
      this.createInput(container);
      this.setValueAt(index, value);
    }
  }, {
    key: 'isEmpty',
    value: function isEmpty(value) {
      if (!this.isMultipleMasksField) {
        return _get(TextFieldComponent.prototype.__proto__ || Object.getPrototypeOf(TextFieldComponent.prototype), 'isEmpty', this).call(this, value);
      }
      return _get(TextFieldComponent.prototype.__proto__ || Object.getPrototypeOf(TextFieldComponent.prototype), 'isEmpty', this).call(this, value) || (this.component.multiple ? value.length === 0 : !value.maskName || !value.value);
    }
  }, {
    key: 'createMaskInput',
    value: function createMaskInput(textInput) {
      var id = this.key + '-mask';
      var maskInput = this.ce('select', {
        class: 'form-control formio-multiple-mask-select',
        id: id
      });
      var self = this;
      var maskOptions = this.maskOptions;
      this.selectOptions(maskInput, 'maskOption', maskOptions);
      // Change the text field mask when another mask is selected.
      maskInput.onchange = function () {
        self.updateMask(textInput, this.value);
      };
      return maskInput;
    }
  }, {
    key: 'addTextInputs',
    value: function addTextInputs(textInput, maskInput, container) {
      if (textInput && maskInput && container) {
        var input = {
          mask: maskInput,
          text: textInput
        };
        this.inputs.push(input);
        container.appendChild(maskInput);
        container.appendChild(textInput);
      }
      this.hook('input', textInput, container);
      this.addFocusBlurEvents(textInput);
      this.addInputEventListener(textInput);
      this.addInputSubmitListener(textInput);
    }
  }, {
    key: 'updateMask',
    value: function updateMask(textInput, newMaskName) {
      var newMask = this.getMaskByName(newMaskName);
      //destroy previous mask
      if (textInput.mask) {
        textInput.mask.destroy();
      }
      //set new text field mask
      this.setInputMask(textInput, newMask);
      //update text field value after new mask is applied
      this.updateValue();
    }
  }, {
    key: 'getMaskByName',
    value: function getMaskByName(maskName) {
      var inputMask = _lodash2.default.find(this.component.inputMasks, function (inputMask) {
        return inputMask.label === maskName;
      });
      return inputMask ? inputMask.mask : undefined;
    }
  }, {
    key: 'defaultSchema',
    get: function get() {
      return TextFieldComponent.schema();
    }
  }, {
    key: 'emptyValue',
    get: function get() {
      return '';
    }
  }, {
    key: 'maskOptions',
    get: function get() {
      return _lodash2.default.map(this.component.inputMasks, function (mask) {
        return {
          label: mask.label,
          value: mask.label
        };
      });
    }
  }, {
    key: 'isMultipleMasksField',
    get: function get() {
      return this.component.allowMultipleMasks && !!this.component.inputMasks && !!this.component.inputMasks.length;
    }
  }], [{
    key: 'schema',
    value: function schema() {
      for (var _len = arguments.length, extend = Array(_len), _key = 0; _key < _len; _key++) {
        extend[_key] = arguments[_key];
      }

      return _Base2.default.schema.apply(_Base2.default, [{
        label: 'Text Field',
        key: 'textField',
        type: 'textfield',
        mask: false,
        inputType: 'text',
        inputMask: '',
        validate: {
          minLength: '',
          maxLength: '',
          minWords: '',
          maxWords: '',
          pattern: ''
        }
      }].concat(extend));
    }
  }, {
    key: 'builderInfo',
    get: function get() {
      return {
        title: 'Text Field',
        icon: 'fa fa-terminal',
        group: 'basic',
        documentation: 'http://help.form.io/userguide/#textfield',
        weight: 0,
        schema: TextFieldComponent.schema()
      };
    }
  }]);

  return TextFieldComponent;
}(_Base2.default);

exports.default = TextFieldComponent;