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

var DateTimeComponent = function (_BaseComponent) {
  _inherits(DateTimeComponent, _BaseComponent);

  _createClass(DateTimeComponent, null, [{
    key: 'schema',
    value: function schema() {
      for (var _len = arguments.length, extend = Array(_len), _key = 0; _key < _len; _key++) {
        extend[_key] = arguments[_key];
      }

      return _Base2.default.schema.apply(_Base2.default, [{
        type: 'datetime',
        label: 'Date / Time',
        key: 'dateTime',
        format: 'yyyy-MM-dd hh:mm a',
        useLocaleSettings: false,
        allowInput: true,
        enableDate: true,
        enableTime: true,
        defaultDate: '',
        displayInTimezone: 'viewer',
        timezone: '',
        datepickerMode: 'day',
        datePicker: {
          showWeeks: true,
          startingDay: 0,
          initDate: '',
          minMode: 'day',
          maxMode: 'year',
          yearRows: 4,
          yearColumns: 5,
          minDate: null,
          maxDate: null
        },
        timePicker: {
          hourStep: 1,
          minuteStep: 1,
          showMeridian: true,
          readonlyInput: false,
          mousewheel: true,
          arrowkeys: true
        }
      }].concat(extend));
    }
  }, {
    key: 'builderInfo',
    get: function get() {
      return {
        title: 'Date / Time',
        group: 'advanced',
        icon: 'fa fa-calendar-plus-o',
        documentation: 'http://help.form.io/userguide/#datetime',
        weight: 40,
        schema: DateTimeComponent.schema()
      };
    }
  }]);

  function DateTimeComponent(component, options, data) {
    _classCallCheck(this, DateTimeComponent);

    var _this = _possibleConstructorReturn(this, (DateTimeComponent.__proto__ || Object.getPrototypeOf(DateTimeComponent)).call(this, component, options, data));

    var timezone = _this.component.timezone || _this.options.timezone;
    var submissionTimezone = _this.options.submissionTimezone || _lodash2.default.get(_this.root, 'options.submissionTimezone');

    /* eslint-disable camelcase */
    _this.component.widget = {
      type: 'calendar',
      timezone: timezone,
      displayInTimezone: _lodash2.default.get(_this.component, 'displayInTimezone', 'viewer'),
      submissionTimezone: submissionTimezone,
      language: _this.options.language,
      useLocaleSettings: _lodash2.default.get(_this.component, 'useLocaleSettings', false),
      allowInput: _lodash2.default.get(_this.component, 'allowInput', true),
      mode: _this.component.multiple ? 'multiple' : 'single',
      enableTime: _lodash2.default.get(_this.component, 'enableTime', true),
      noCalendar: !_lodash2.default.get(_this.component, 'enableDate', true),
      format: _this.component.format,
      defaultDate: _this.component.defaultDate,
      hourIncrement: _lodash2.default.get(_this.component, 'timePicker.hourStep', 1),
      minuteIncrement: _lodash2.default.get(_this.component, 'timePicker.minuteStep', 5),
      time_24hr: !_lodash2.default.get(_this.component, 'timePicker.showMeridian', true),
      minDate: _lodash2.default.get(_this.component, 'datePicker.minDate'),
      maxDate: _lodash2.default.get(_this.component, 'datePicker.maxDate')
    };
    /* eslint-enable camelcase */

    // Add the validators date.
    _this.validators.push('date');
    return _this;
  }

  _createClass(DateTimeComponent, [{
    key: 'createWrapper',


    // This select component can handle multiple items on its own.
    value: function createWrapper() {
      return false;
    }
  }, {
    key: 'defaultSchema',
    get: function get() {
      return DateTimeComponent.schema();
    }
  }, {
    key: 'emptyValue',
    get: function get() {
      return '';
    }
  }]);

  return DateTimeComponent;
}(_Base2.default);

exports.default = DateTimeComponent;