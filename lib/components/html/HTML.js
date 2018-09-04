'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _Base = require('../base/Base');

var _Base2 = _interopRequireDefault(_Base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HTMLComponent = function (_BaseComponent) {
  _inherits(HTMLComponent, _BaseComponent);

  function HTMLComponent() {
    _classCallCheck(this, HTMLComponent);

    return _possibleConstructorReturn(this, (HTMLComponent.__proto__ || Object.getPrototypeOf(HTMLComponent)).apply(this, arguments));
  }

  _createClass(HTMLComponent, [{
    key: 'setHTML',
    value: function setHTML() {
      this.element.innerHTML = this.interpolate(this.component.content);
    }
  }, {
    key: 'build',
    value: function build() {
      var _this2 = this;

      this.element = this.ce(this.component.tag, {
        id: this.id,
        class: this.component.className
      });
      this.element.component = this;
      _lodash2.default.each(this.component.attrs, function (attr) {
        if (attr.attr) {
          _this2.element.setAttribute(attr.attr, attr.value);
        }
      });
      if (this.component.content) {
        this.setHTML();
      }

      if (this.component.refreshOnChange) {
        this.on('change', function () {
          return _this2.setHTML();
        });
      }
    }
  }, {
    key: 'defaultSchema',
    get: function get() {
      return HTMLComponent.schema();
    }
  }], [{
    key: 'schema',
    value: function schema() {
      for (var _len = arguments.length, extend = Array(_len), _key = 0; _key < _len; _key++) {
        extend[_key] = arguments[_key];
      }

      return _Base2.default.schema.apply(_Base2.default, [{
        type: 'htmlelement',
        tag: 'p',
        attrs: [],
        content: '',
        input: false,
        persistent: false
      }].concat(extend));
    }
  }, {
    key: 'builderInfo',
    get: function get() {
      return {
        title: 'HTML Element',
        group: 'advanced',
        icon: 'fa fa-code',
        weight: 90,
        documentation: 'http://help.form.io/userguide/#html-element-component',
        schema: HTMLComponent.schema()
      };
    }
  }]);

  return HTMLComponent;
}(_Base2.default);

exports.default = HTMLComponent;