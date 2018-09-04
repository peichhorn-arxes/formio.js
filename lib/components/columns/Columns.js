'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _NestedComponent2 = require('../nested/NestedComponent');

var _NestedComponent3 = _interopRequireDefault(_NestedComponent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ColumnsComponent = function (_NestedComponent) {
  _inherits(ColumnsComponent, _NestedComponent);

  _createClass(ColumnsComponent, [{
    key: 'defaultSchema',
    get: function get() {
      return ColumnsComponent.schema();
    }
  }, {
    key: 'schema',
    get: function get() {
      var _this2 = this;

      var schema = _lodash2.default.omit(_get(ColumnsComponent.prototype.__proto__ || Object.getPrototypeOf(ColumnsComponent.prototype), 'schema', this), 'components');
      schema.columns = [];
      this.eachComponent(function (component, index) {
        _lodash2.default.merge(component.component, _lodash2.default.omit(_this2.component.columns[index], 'components'));
        schema.columns.push(component.schema);
      });
      for (var i = this.components.length; i < this.component.columns.length; i++) {
        schema.columns.push(this.component.columns[i]);
      }
      return schema;
    }
  }], [{
    key: 'schema',
    value: function schema() {
      for (var _len = arguments.length, extend = Array(_len), _key = 0; _key < _len; _key++) {
        extend[_key] = arguments[_key];
      }

      return _NestedComponent3.default.schema.apply(_NestedComponent3.default, [{
        label: 'Columns',
        key: 'columns',
        type: 'columns',
        columns: [{ components: [], width: 6, offset: 0, push: 0, pull: 0 }, { components: [], width: 6, offset: 0, push: 0, pull: 0 }],
        clearOnHide: false,
        input: false,
        tableView: false,
        persistent: false,
        autoAdjust: false
      }].concat(extend));
    }
  }, {
    key: 'builderInfo',
    get: function get() {
      return {
        title: 'Columns',
        icon: 'fa fa-columns',
        group: 'layout',
        documentation: 'http://help.form.io/userguide/#columns',
        weight: 10,
        schema: ColumnsComponent.schema()
      };
    }
  }]);

  function ColumnsComponent(component, options, data) {
    _classCallCheck(this, ColumnsComponent);

    var _this = _possibleConstructorReturn(this, (ColumnsComponent.__proto__ || Object.getPrototypeOf(ColumnsComponent)).call(this, component, options, data));

    _this.rows = [];
    return _this;
  }

  _createClass(ColumnsComponent, [{
    key: 'justifyRow',


    /**
     * Justify columns width according to `this.gridSize`.
     * @param {ColumnComponent[]} columns
     * @return {*}
     */
    value: function justifyRow(columns) {
      var visible = _lodash2.default.filter(columns, 'visible');
      var nbColumns = columns.length;
      var nbVisible = visible.length;

      if (nbColumns > 0 && nbVisible > 0) {
        var w = Math.floor(this.gridSize / nbVisible);
        var totalWidth = w * nbVisible;
        var span = this.gridSize - totalWidth;

        _lodash2.default.each(visible, function (column) {
          column.component.width = w;
        });

        // In case when row is not fully filled,
        // extending last col to fill empty space.
        _lodash2.default.last(visible).component.width += span;

        _lodash2.default.each(visible, function (col) {
          col.element.setAttribute('class', col.className);
        });
      }
    }

    /**
     * Group columns in rows.
     * @return {Array.<ColumnComponent[]>}
     */

  }, {
    key: 'groupByRow',
    value: function groupByRow() {
      var _this3 = this;

      var initVal = { stack: [], rows: [] };
      var width = function width(x) {
        return x.component.width;
      };
      var result = _lodash2.default.reduce(this.components, function (acc, next) {
        var stack = [].concat(_toConsumableArray(acc.stack), [next]);
        if (_lodash2.default.sumBy(stack, width) <= _this3.gridSize) {
          acc.stack = stack;
          return acc;
        } else {
          acc.rows = [].concat(_toConsumableArray(acc.rows), [acc.stack]);
          acc.stack = [next];
          return acc;
        }
      }, initVal);

      return _lodash2.default.concat(result.rows, [result.stack]);
    }
  }, {
    key: 'justify',
    value: function justify() {
      _lodash2.default.each(this.rows, this.justifyRow.bind(this));
    }
  }, {
    key: 'addComponents',
    value: function addComponents() {
      var _this4 = this;

      var container = this.getContainer();
      container.noDrop = true;
      _lodash2.default.each(this.component.columns, function (column) {
        column.type = 'column';
        _this4.addComponent(column, container, _this4.data);
      });
      this.rows = this.groupByRow();
    }
  }, {
    key: 'checkConditions',
    value: function checkConditions(data) {
      if (this.component.autoAdjust) {
        var before = this.nbVisible;
        var result = _get(ColumnsComponent.prototype.__proto__ || Object.getPrototypeOf(ColumnsComponent.prototype), 'checkConditions', this).call(this, data);
        if (before !== this.nbVisible) {
          this.justify();
        }
        return result;
      } else {
        return _get(ColumnsComponent.prototype.__proto__ || Object.getPrototypeOf(ColumnsComponent.prototype), 'checkConditions', this).call(this, data);
      }
    }
  }, {
    key: 'destroy',
    value: function destroy(all) {
      _get(ColumnsComponent.prototype.__proto__ || Object.getPrototypeOf(ColumnsComponent.prototype), 'destroy', this).call(this, all);
      this.rows = [];
    }
  }, {
    key: 'className',
    get: function get() {
      return 'row ' + _get(ColumnsComponent.prototype.__proto__ || Object.getPrototypeOf(ColumnsComponent.prototype), 'className', this);
    }
  }, {
    key: 'gridSize',
    get: function get() {
      return 12;
    }

    /** @type {number} */

  }, {
    key: 'nbVisible',
    get: function get() {
      return _lodash2.default.filter(this.components, 'visible').length;
    }
  }]);

  return ColumnsComponent;
}(_NestedComponent3.default);

exports.default = ColumnsComponent;