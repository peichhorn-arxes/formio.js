'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _TextField = require('../textfield/TextField');

var _TextField2 = _interopRequireDefault(_TextField);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EmailComponent = function (_TextFieldComponent) {
  _inherits(EmailComponent, _TextFieldComponent);

  _createClass(EmailComponent, null, [{
    key: 'schema',
    value: function schema() {
      for (var _len = arguments.length, extend = Array(_len), _key = 0; _key < _len; _key++) {
        extend[_key] = arguments[_key];
      }

      return _TextField2.default.schema.apply(_TextField2.default, [{
        type: 'email',
        label: 'Email',
        key: 'email',
        inputType: 'email',
        kickbox: {
          enabled: false
        }
      }].concat(extend));
    }
  }, {
    key: 'builderInfo',
    get: function get() {
      return {
        title: 'Email',
        group: 'advanced',
        icon: 'fa fa-at',
        documentation: 'http://help.form.io/userguide/#email',
        weight: 10,
        schema: EmailComponent.schema()
      };
    }
  }]);

  function EmailComponent(component, options, data) {
    _classCallCheck(this, EmailComponent);

    var _this = _possibleConstructorReturn(this, (EmailComponent.__proto__ || Object.getPrototypeOf(EmailComponent)).call(this, component, options, data));

    _this.validators.push('email');
    return _this;
  }

  _createClass(EmailComponent, [{
    key: 'elementInfo',
    value: function elementInfo() {
      var info = _get(EmailComponent.prototype.__proto__ || Object.getPrototypeOf(EmailComponent.prototype), 'elementInfo', this).call(this);
      info.attr.type = this.component.mask ? 'password' : 'email';
      return info;
    }
  }, {
    key: 'defaultSchema',
    get: function get() {
      return EmailComponent.schema();
    }
  }]);

  return EmailComponent;
}(_TextField2.default);

exports.default = EmailComponent;