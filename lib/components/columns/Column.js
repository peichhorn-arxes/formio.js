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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ColumnComponent = function (_NestedComponent) {
  _inherits(ColumnComponent, _NestedComponent);

  function ColumnComponent(component, options, data) {
    _classCallCheck(this, ColumnComponent);

    var _this = _possibleConstructorReturn(this, (ColumnComponent.__proto__ || Object.getPrototypeOf(ColumnComponent)).call(this, component, options, data));

    _this.noEdit = true;
    return _this;
  }

  _createClass(ColumnComponent, [{
    key: 'conditionallyVisible',
    value: function conditionallyVisible(data) {
      // Check children components for visibility.
      var allChildrenHidden = _lodash2.default.every(this.getComponents(), ['visible', false]);

      if (allChildrenHidden) {
        return false;
      }

      return _get(ColumnComponent.prototype.__proto__ || Object.getPrototypeOf(ColumnComponent.prototype), 'conditionallyVisible', this).call(this, data);
    }
  }, {
    key: 'className',
    get: function get() {
      var comp = this.component;
      var width = ' col-sm-' + (comp.width ? comp.width : 6);
      var offset = ' col-sm-offset-' + (comp.offset ? comp.offset : 0);
      var push = ' col-sm-push-' + (comp.push ? comp.push : 0);
      var pull = ' col-sm-pull-' + (comp.pull ? comp.pull : 0);
      return 'col' + width + offset + push + pull;
    }
  }]);

  return ColumnComponent;
}(_NestedComponent3.default);

exports.default = ColumnComponent;