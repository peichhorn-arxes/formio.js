'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };

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

var DataGridComponent = function (_NestedComponent) {
  _inherits(DataGridComponent, _NestedComponent);

  _createClass(DataGridComponent, null, [{
    key: 'schema',
    value: function schema() {
      for (var _len = arguments.length, extend = Array(_len), _key = 0; _key < _len; _key++) {
        extend[_key] = arguments[_key];
      }

      return _NestedComponent3.default.schema.apply(_NestedComponent3.default, [{
        label: 'Data Grid',
        key: 'dataGrid',
        type: 'datagrid',
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
        title: 'Data Grid',
        icon: 'fa fa-th',
        group: 'data',
        documentation: 'http://help.form.io/userguide/#datagrid',
        weight: 20,
        schema: DataGridComponent.schema()
      };
    }
  }]);

  function DataGridComponent(component, options, data) {
    _classCallCheck(this, DataGridComponent);

    var _this = _possibleConstructorReturn(this, (DataGridComponent.__proto__ || Object.getPrototypeOf(DataGridComponent)).call(this, component, options, data));

    _this.type = 'datagrid';
    _this.numRows = 0;
    _this.numColumns = 0;
    _this.rows = [];
    return _this;
  }

  _createClass(DataGridComponent, [{
    key: 'hasAddButton',
    value: function hasAddButton() {
      var maxLength = _lodash2.default.get(this.component, 'validate.maxLength');
      return !this.component.disableAddingRemovingRows && !this.shouldDisable && !this.options.builder && !this.options.preview && (!maxLength || this.dataValue.length < maxLength);
    }
  }, {
    key: 'hasExtraColumn',
    value: function hasExtraColumn() {
      return this.hasRemoveButtons() || this.options.builder;
    }
  }, {
    key: 'hasRemoveButtons',
    value: function hasRemoveButtons() {
      return !this.component.disableAddingRemovingRows && !this.shouldDisable && !this.options.builder && this.dataValue.length > _lodash2.default.get(this.component, 'validate.minLength', 0);
    }
  }, {
    key: 'hasTopSubmit',
    value: function hasTopSubmit() {
      return this.hasAddButton() && ['top', 'both'].indexOf(this.addAnotherPosition) !== -1;
    }
  }, {
    key: 'hasBottomSubmit',
    value: function hasBottomSubmit() {
      return this.hasAddButton() && ['bottom', 'both'].indexOf(this.addAnotherPosition) !== -1;
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

      this.createElement();
      this.createLabel(this.element);
      var tableClass = 'table datagrid-table form-group formio-data-grid ';
      _lodash2.default.each(['striped', 'bordered', 'hover', 'condensed'], function (prop) {
        if (_this2.component[prop]) {
          tableClass += 'table-' + prop + ' ';
        }
      });
      this.tableElement = this.ce('table', {
        class: tableClass
      });
      this.element.appendChild(this.tableElement);
      if (!this.dataValue.length) {
        this.addNewValue();
      }
      this.visibleColumns = true;
      this.errorContainer = this.element;
      this.restoreValue();
      this.createDescription(this.element);
    }
  }, {
    key: 'setVisibleComponents',
    value: function setVisibleComponents() {
      var _this3 = this;

      // Add new values based on minLength.
      for (var dIndex = this.dataValue.length; dIndex < _lodash2.default.get(this.component, 'validate.minLength', 0); dIndex++) {
        this.dataValue.push({});
      }

      this.numColumns = this.hasExtraColumn() ? 1 : 0;
      this.numRows = this.dataValue.length;

      if (this.visibleColumns === true) {
        this.numColumns += this.component.components.length;
        this.visibleComponents = this.component.components;
        return this.visibleComponents;
      }

      this.visibleComponents = _lodash2.default.filter(this.component.components, function (comp) {
        return _this3.visibleColumns[comp.key];
      });
      this.numColumns += this.visibleComponents.length;
    }
  }, {
    key: 'buildRows',
    value: function buildRows() {
      var _this4 = this;

      this.setVisibleComponents();
      this.destroy();
      this.empty(this.tableElement);

      // Build the rows.
      var tableRows = [];
      this.dataValue.forEach(function (row, rowIndex) {
        return tableRows.push(_this4.buildRow(row, rowIndex));
      });

      // Create the header (must happen after build rows to get correct column length)
      var header = this.createHeader();
      if (header) {
        this.tableElement.appendChild(header);
      }
      this.tableElement.appendChild(this.ce('tbody', null, tableRows));

      // Create the add row button footer element.
      if (this.hasBottomSubmit()) {
        this.tableElement.appendChild(this.ce('tfoot', null, this.ce('tr', null, this.ce('td', { colspan: this.numColumns }, this.addButton()))));
      }
    }

    // Build the header.

  }, {
    key: 'createHeader',
    value: function createHeader() {
      var _this5 = this;

      var hasTopButton = this.hasTopSubmit();
      var hasEnd = this.hasExtraColumn() || hasTopButton;
      var needsHeader = false;
      var thead = this.ce('thead', null, this.ce('tr', null, [this.visibleComponents.map(function (comp) {
        var th = _this5.ce('th');
        if (comp.validate && comp.validate.required) {
          th.setAttribute('class', 'field-required');
        }
        var title = comp.label || comp.title;
        if (title && !comp.dataGridLabel) {
          needsHeader = true;
          th.appendChild(_this5.text(title));
          _this5.createTooltip(th, comp);
        }
        return th;
      }), hasEnd ? this.ce('th', null, hasTopButton ? this.addButton(true) : null) : null]));
      return needsHeader ? thead : null;
    }
  }, {
    key: 'buildRow',
    value: function buildRow(row, index) {
      var _this6 = this;

      this.rows[index] = {};
      var lastColumn = null;
      if (this.hasRemoveButtons()) {
        lastColumn = this.ce('td', null, this.removeButton(index));
      } else if (this.options.builder) {
        lastColumn = this.ce('td', {
          id: this.id + '-drag-container',
          class: 'drag-container'
        }, this.ce('div', {
          id: this.id + '-placeholder',
          class: 'alert alert-info',
          style: 'text-align:center; margin-bottom: 0px;',
          role: 'alert'
        }, this.text('Drag and Drop a form component')));
        this.root.addDragContainer(lastColumn, this);
      }
      return this.ce('tr', null, [this.component.components.map(function (col, colIndex) {
        return _this6.buildComponent(col, colIndex, row, index);
      }), lastColumn]);
    }
  }, {
    key: 'destroyRows',
    value: function destroyRows() {
      var _this7 = this;

      _lodash2.default.each(this.rows, function (row) {
        return _lodash2.default.each(row, function (col) {
          return _this7.removeComponent(col, row);
        });
      });
      this.rows = [];
    }
  }, {
    key: 'destroy',
    value: function destroy(all) {
      _get(DataGridComponent.prototype.__proto__ || Object.getPrototypeOf(DataGridComponent.prototype), 'destroy', this).call(this, all);
      this.destroyRows();
    }
  }, {
    key: 'buildComponent',
    value: function buildComponent(col, colIndex, row, rowIndex) {
      var container;
      var isVisible = this.visibleColumns && (!this.visibleColumns.hasOwnProperty(col.key) || this.visibleColumns[col.key]);
      if (isVisible) {
        container = this.ce('td');
        container.noDrop = true;
      }
      var column = _lodash2.default.clone(col);
      var options = _lodash2.default.clone(this.options);
      options.name += '[' + rowIndex + ']';
      options.row = rowIndex + '-' + colIndex;
      options.inDataGrid = true;
      var comp = this.createComponent(_lodash2.default.assign({}, column, {
        row: options.row
      }), options, row);
      comp.rowIndex = rowIndex;
      this.hook('addComponent', container, comp, this);
      this.rows[rowIndex][column.key] = comp;
      if (isVisible) {
        container.appendChild(comp.getElement());
        return container;
      }
    }
  }, {
    key: 'checkConditions',
    value: function checkConditions(data) {
      var _this8 = this;

      var show = _get(DataGridComponent.prototype.__proto__ || Object.getPrototypeOf(DataGridComponent.prototype), 'checkConditions', this).call(this, data);
      // If table isn't visible, don't bother calculating columns.
      if (!show) {
        return false;
      }
      var rebuild = false;
      if (this.visibleColumns === true) {
        this.visibleColumns = {};
      }
      _lodash2.default.each(this.component.components, function (col) {
        var showColumn = false;
        _lodash2.default.each(_this8.rows, function (comps) {
          if (comps && comps[col.key] && typeof comps[col.key].checkConditions === 'function') {
            showColumn |= comps[col.key].checkConditions(data);
          }
        });
        showColumn = showColumn && col.type !== 'hidden' && !col.hidden;
        if (_this8.visibleColumns[col.key] && !showColumn || !_this8.visibleColumns[col.key] && showColumn) {
          rebuild = true;
        }

        _this8.visibleColumns[col.key] = showColumn;
        show |= showColumn;
      });

      // If a rebuild is needed, then rebuild the table.
      if (rebuild) {
        this.restoreValue();
      }

      // Return if this table should show.
      return show;
    }
  }, {
    key: 'updateValue',
    value: function updateValue(flags, value) {
      // Intentionally skip over nested component updateValue method to keep recursive update from occurring with sub components.
      return _Base2.default.prototype.updateValue.call(this, flags, value);
    }

    /* eslint-disable max-statements */

  }, {
    key: 'setValue',
    value: function setValue(value, flags) {
      var _this9 = this;

      flags = this.getFlags.apply(this, arguments);
      if (!value) {
        this.buildRows();
        return;
      }
      if (!Array.isArray(value)) {
        if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
          value = [value];
        } else {
          this.buildRows();
          return;
        }
      }

      var changed = this.hasChanged(value, this.dataValue);

      //always should build if not built yet OR is trying to set empty value (in order to prevent deleting last row)
      var shouldBuildRows = !this.isBuilt || _lodash2.default.isEqual(this.emptyValue, value) || this.dataValue !== value;
      //check if visible columns changed
      var visibleColumnsAmount = 0;
      _lodash2.default.forEach(this.visibleColumns, function (value) {
        if (value) {
          visibleColumnsAmount++;
        }
      });
      var visibleComponentsAmount = this.visibleComponents ? this.visibleComponents.length : 0;
      //should build if visible columns changed
      shouldBuildRows = shouldBuildRows || visibleColumnsAmount !== visibleComponentsAmount;
      //loop through all rows and check if there is field in new value that differs from current value
      var keys = this.componentComponents.map(function (component) {
        return component.key;
      });
      for (var i = 0; i < value.length; i++) {
        if (shouldBuildRows) {
          break;
        }
        var valueRow = value[i];
        for (var j = 0; j < keys.length; j++) {
          var key = keys[j];
          var newFieldValue = valueRow[key];
          var currentFieldValue = this.rows[i] && this.rows[i][key] ? this.rows[i][key].getValue() : undefined;
          var defaultFieldValue = this.rows[i] && this.rows[i][key] ? this.rows[i][key].defaultValue : undefined;
          var isMissingValue = newFieldValue === undefined && currentFieldValue === defaultFieldValue;
          if (!isMissingValue && !_lodash2.default.isEqual(newFieldValue, currentFieldValue)) {
            shouldBuildRows = true;
            break;
          }
        }
      }
      this.dataValue = value;
      if (shouldBuildRows) {
        this.buildRows();
      }
      _lodash2.default.each(this.rows, function (row, index) {
        if (value.length <= index) {
          return;
        }
        _lodash2.default.each(row, function (component) {
          return _this9.setNestedValue(component, value[index], flags);
        });
      });
      return changed;
    }
    /* eslint-enable max-statements */

    /**
     * Get the value of this component.
     *
     * @returns {*}
     */

  }, {
    key: 'getValue',
    value: function getValue() {
      return this.dataValue;
    }
  }, {
    key: 'defaultSchema',
    get: function get() {
      return DataGridComponent.schema();
    }
  }, {
    key: 'emptyValue',
    get: function get() {
      return [{}];
    }
  }, {
    key: 'addAnotherPosition',
    get: function get() {
      return _lodash2.default.get(this.component, 'addAnotherPosition', 'bottom');
    }
  }, {
    key: 'dataValue',
    get: function get() {
      var dataValue = _get(DataGridComponent.prototype.__proto__ || Object.getPrototypeOf(DataGridComponent.prototype), 'dataValue', this);
      if (!dataValue || !_lodash2.default.isArray(dataValue)) {
        return this.emptyValue;
      }
      return dataValue;
    },
    set: function set(value) {
      _set(DataGridComponent.prototype.__proto__ || Object.getPrototypeOf(DataGridComponent.prototype), 'dataValue', value, this);
    }
  }, {
    key: 'defaultValue',
    get: function get() {
      var value = _get(DataGridComponent.prototype.__proto__ || Object.getPrototypeOf(DataGridComponent.prototype), 'defaultValue', this);
      if (_lodash2.default.isArray(value)) {
        return value;
      }
      if (value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
        return [value];
      }
      return this.emptyValue;
    }
  }]);

  return DataGridComponent;
}(_NestedComponent3.default);

exports.default = DataGridComponent;