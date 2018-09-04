'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Base = require('../base/Base');

var _Base2 = _interopRequireDefault(_Base);

var _NestedComponent2 = require('../nested/NestedComponent');

var _NestedComponent3 = _interopRequireDefault(_NestedComponent2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _utils = require('../../utils/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DataMapComponent = function (_NestedComponent) {
  _inherits(DataMapComponent, _NestedComponent);

  _createClass(DataMapComponent, [{
    key: 'schema',
    get: function get() {
      var schema = _get(DataMapComponent.prototype.__proto__ || Object.getPrototypeOf(DataMapComponent.prototype), 'schema', this);
      schema.valueComponent = this.components[this.components.length - 1].schema;
      return _lodash2.default.omit(schema, 'components');
    }
  }], [{
    key: 'schema',
    value: function schema() {
      for (var _len = arguments.length, extend = Array(_len), _key = 0; _key < _len; _key++) {
        extend[_key] = arguments[_key];
      }

      return _Base2.default.schema.apply(_Base2.default, [{
        label: 'Data Map',
        key: 'dataMap',
        type: 'datamap',
        clearOnHide: true,
        addAnother: 'Add Another',
        disableAddingRemovingRows: false,
        keyBeforeValue: true,
        valueComponent: {
          type: 'textfield',
          key: 'value',
          label: 'Value',
          defaultValue: 'Value',
          input: true
        },
        input: true,
        validate: {
          maxLength: 0,
          minLength: 0
        }
      }].concat(extend));
    }
  }, {
    key: 'builderInfo',
    get: function get() {
      return {
        title: 'Data Map',
        icon: 'fa fa-th-list',
        group: 'data',
        documentation: 'http://help.form.io/userguide/#datamap',
        weight: 25,
        schema: DataMapComponent.schema()
      };
    }
  }]);

  function DataMapComponent(component, options, data) {
    _classCallCheck(this, DataMapComponent);

    var _this = _possibleConstructorReturn(this, (DataMapComponent.__proto__ || Object.getPrototypeOf(DataMapComponent)).call(this, component, options, data));

    _this.type = 'datamap';
    _this.rows = {};
    return _this;
  }

  _createClass(DataMapComponent, [{
    key: 'hasAddButton',
    value: function hasAddButton() {
      var maxLength = _lodash2.default.get(this.component, 'validate.maxLength');
      return !this.component.disableAddingRemovingRows && !this.shouldDisable && !this.options.builder && !this.options.preview && (!maxLength || Object.keys(this.dataValue).length < maxLength);
    }
  }, {
    key: 'hasRemoveButtons',
    value: function hasRemoveButtons() {
      return !this.component.disableAddingRemovingRows && !this.shouldDisable && !this.options.builder && Object.keys(this.dataValue).length > _lodash2.default.get(this.component, 'validate.minLength', 0);
    }
  }, {
    key: 'hasChanged',
    value: function hasChanged(before, after) {
      return !_lodash2.default.isEqual(before, after);
    }
  }, {
    key: 'build',
    value: function build() {
      var _this2 = this;

      if (this.options.builder) {
        return _get(DataMapComponent.prototype.__proto__ || Object.getPrototypeOf(DataMapComponent.prototype), 'build', this).call(this, true);
      }
      this.createElement();
      this.createLabel(this.element);
      var tableClass = 'table datagrid-table table-bordered form-group formio-data-map ';
      _lodash2.default.each(['striped', 'bordered', 'hover', 'condensed'], function (prop) {
        if (_this2.component[prop]) {
          tableClass += 'table-' + prop + ' ';
        }
      });
      this.tableElement = this.ce('table', {
        class: tableClass
      });
      this.buildRows();
      this.element.appendChild(this.tableElement);
      this.createDescription(this.element);
    }
  }, {
    key: 'addKeyButton',
    value: function addKeyButton() {
      var _this3 = this;

      if (!this.hasAddButton()) {
        return null;
      }
      var addButton = this.ce('button', {
        class: 'btn btn-primary formio-button-add-row'
      });
      this.addEventListener(addButton, 'click', function (event) {
        event.preventDefault();
        _this3.addRow();
      });

      addButton.appendChild(this.ce('i', {
        class: this.iconClass('plus')
      }));
      addButton.appendChild(this.text(this.component.addAnother || ' Add Another'));
      return addButton;
    }
  }, {
    key: 'removeKeyButton',
    value: function removeKeyButton(key) {
      var _this4 = this;

      var removeButton = this.ce('button', {
        type: 'button',
        class: 'btn btn-default btn-secondary formio-button-remove-row'
      });

      this.addEventListener(removeButton, 'click', function (event) {
        event.preventDefault();
        _this4.removeRow(key);
      });
      removeButton.appendChild(this.ce('i', {
        class: this.iconClass('remove-circle')
      }));
      return removeButton;
    }

    // Build the header.

  }, {
    key: 'createHeader',
    value: function createHeader() {
      var valueHeader = this.ce('th', {
        'class': 'col-9 col-sm-8'
      }, this.text(this.component.valueComponent.label));
      if (this.component.valueComponent.tooltip) {
        this.createTooltip(valueHeader, {
          tooltip: this.t(this.component.valueComponent.tooltip)
        });
      }
      var keyHeader = this.ce('th', {
        'class': 'col-2 col-sm-3'
      }, this.text('Key'));
      this.createTooltip(keyHeader, {
        tooltip: this.t('Enter the map "key" for this value.')
      });
      return this.ce('thead', null, this.ce('tr', {
        class: 'd-flex'
      }, [this.component.keyBeforeValue ? keyHeader : valueHeader, this.component.keyBeforeValue ? valueHeader : keyHeader, this.hasRemoveButtons() ? this.ce('th', { 'class': 'col-1 col-sm-1' }, null) : null]));
    }
  }, {
    key: 'buildRows',
    value: function buildRows() {
      var _this5 = this;

      // Do not builder rows when in builder mode.
      if (this.options.builder) {
        return;
      }

      // Destroy all value components before they are recreated.
      this.destroyComponents();
      _lodash2.default.each(this.rows, function (row) {
        return row.value.destroy();
      });
      this.rows = {};
      this.empty(this.tableElement);
      var tableRows = [];
      _lodash2.default.each(this.dataValue, function (value, key) {
        return tableRows.push(_this5.buildRow(value, key));
      });
      this.tableElement.appendChild(this.createHeader());
      this.tableElement.appendChild(this.ce('tbody', null, tableRows));
      this.tableElement.appendChild(this.ce('tfoot', null, this.ce('tr', null, this.ce('td', { colspan: this.hasRemoveButtons() ? 3 : 2 }, this.addKeyButton()))));
    }
  }, {
    key: 'createValueComponent',
    value: function createValueComponent() {
      var _this6 = this;

      var container = this.ce('td', {
        class: 'col-9 col-sm-8'
      });
      var schema = this.component.valueComponent;
      schema.hideLabel = true;
      var value = this.addComponent(schema, container, {}, null, null);
      value.on('change', function () {
        return _this6.updateValue();
      });
      return { value: value, container: container };
    }
  }, {
    key: 'buildRow',
    value: function buildRow(value, key) {
      if (!this.rows[key]) {
        this.rows[key] = this.createValueComponent();
      }
      var row = this.rows[key];

      var lastColumn = null;
      if (this.hasRemoveButtons()) {
        row.remove = this.removeKeyButton(key);
        lastColumn = this.ce('td', { class: 'col-1 col-sm-1' }, row.remove);
      }
      row.element = this.ce('tr', {
        class: 'd-flex',
        id: this.component.id + '-row-' + key
      });

      // Create our key input.
      row.keyInput = this.ce('input', {
        type: 'text',
        class: 'form-control',
        id: this.component.id + '-value-' + key,
        value: key
      });
      this.addInput(row.keyInput);
      if (this.component.keyBeforeValue) {
        row.element.appendChild(this.ce('td', { class: 'col-2 col-sm-3' }, row.keyInput));
        row.element.appendChild(row.container);
      } else {
        row.element.appendChild(row.container);
        row.element.appendChild(this.ce('td', null, row.keyInput));
      }
      row.element.appendChild(lastColumn);

      // Set the value on the value component.
      row.value.setValue(value);
      return row.element;
    }
  }, {
    key: 'addRow',
    value: function addRow() {
      var component = this.createValueComponent();
      var key = (0, _utils.uniqueKey)(this.dataValue, _lodash2.default.camelCase(component.value.defaultValue) || 'key');
      this.rows[key] = component;
      this.dataValue[key] = component.value.defaultValue;
      this.buildRows();
      this.triggerChange();
    }
  }, {
    key: 'removeRow',
    value: function removeRow(key) {
      var value = this.dataValue;
      delete value[key];
      this.dataValue = value;
      this.buildRows();
      this.triggerChange();
    }
  }, {
    key: 'updateValue',
    value: function updateValue(flags, value) {
      return _Base2.default.prototype.updateValue.call(this, flags, value);
    }
  }, {
    key: 'setValue',
    value: function setValue(value) {
      var changed = this.hasChanged(value, this.dataValue);
      this.dataValue = value;
      this.buildRows();
      return changed;
    }

    /**
     * Get the value of this component.
     *
     * @returns {*}
     */

  }, {
    key: 'getValue',
    value: function getValue() {
      var value = {};
      _lodash2.default.each(this.rows, function (row) {
        value[row.keyInput.value] = row.value.getValue();
      });
      return value;
    }
  }, {
    key: 'defaultSchema',
    get: function get() {
      return DataMapComponent.schema();
    }
  }, {
    key: 'emptyValue',
    get: function get() {
      return {};
    }
  }, {
    key: 'componentComponents',
    get: function get() {
      return [this.component.valueComponent];
    }
  }]);

  return DataMapComponent;
}(_NestedComponent3.default);

exports.default = DataMapComponent;