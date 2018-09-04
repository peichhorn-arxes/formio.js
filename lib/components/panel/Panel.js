'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _NestedComponent2 = require('../nested/NestedComponent');

var _NestedComponent3 = _interopRequireDefault(_NestedComponent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PanelComponent = function (_NestedComponent) {
  _inherits(PanelComponent, _NestedComponent);

  _createClass(PanelComponent, null, [{
    key: 'schema',
    value: function schema() {
      for (var _len = arguments.length, extend = Array(_len), _key = 0; _key < _len; _key++) {
        extend[_key] = arguments[_key];
      }

      return _NestedComponent3.default.schema.apply(_NestedComponent3.default, [{
        label: 'Panel',
        type: 'panel',
        key: 'panel',
        title: '',
        theme: 'default',
        breadcrumb: 'default',
        components: [],
        clearOnHide: false,
        input: false,
        tableView: false,
        dataGridLabel: false,
        persistent: false
      }].concat(extend));
    }
  }, {
    key: 'builderInfo',
    get: function get() {
      return {
        title: 'Panel',
        icon: 'fa fa-list-alt',
        group: 'layout',
        documentation: 'http://help.form.io/userguide/#panels',
        weight: 30,
        schema: PanelComponent.schema()
      };
    }
  }]);

  function PanelComponent(component, options, data) {
    _classCallCheck(this, PanelComponent);

    return _possibleConstructorReturn(this, (PanelComponent.__proto__ || Object.getPrototypeOf(PanelComponent)).call(this, component, options, data));
  }

  _createClass(PanelComponent, [{
    key: 'getContainer',
    value: function getContainer() {
      return this.panelBody;
    }
  }, {
    key: 'build',
    value: function build() {
      this.component.theme = this.component.theme || 'default';
      var panelClass = 'card border-' + this.bootstrap4Theme(this.component.theme) + ' ';
      panelClass += 'panel panel-' + this.component.theme + ' ';
      panelClass += this.component.customClass;
      this.element = this.ce('div', {
        id: this.id,
        class: panelClass
      });
      this.element.component = this;
      this.panelBody = this.ce('div', {
        class: 'card-body panel-body'
      });
      if (this.component.title && !this.component.hideLabel) {
        var heading = this.ce('div', {
          class: 'card-header panel-heading'
        });
        var title = this.ce('h4', {
          class: 'mb-0 card-title panel-title'
        });
        title.appendChild(this.text(this.component.title));
        this.createTooltip(title);
        heading.appendChild(title);
        this.setCollapseHeader(heading);
        this.element.appendChild(heading);
      } else {
        this.createTooltip(this.panelBody, this.component, this.iconClass('question-sign') + ' text-muted formio-hide-label-panel-tooltip');
      }

      this.addComponents();
      this.element.appendChild(this.panelBody);
      this.setCollapsed();
    }
  }, {
    key: 'defaultSchema',
    get: function get() {
      return PanelComponent.schema();
    }
  }, {
    key: 'className',
    get: function get() {
      return 'panel panel-' + this.component.theme + ' ' + _get(PanelComponent.prototype.__proto__ || Object.getPrototypeOf(PanelComponent.prototype), 'className', this);
    }
  }]);

  return PanelComponent;
}(_NestedComponent3.default);

exports.default = PanelComponent;