'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _flatpickr = require('flatpickr');

var _flatpickr2 = _interopRequireDefault(_flatpickr);

var _InputWidget2 = require('./InputWidget');

var _InputWidget3 = _interopRequireDefault(_InputWidget2);

var _utils = require('../utils/utils');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DEFAULT_FORMAT = 'yyyy-MM-dd hh:mm a';
var ISO_8601_FORMAT = 'yyyy-MM-ddTHH:mm:ssZ';

var CalendarWidget = function (_InputWidget) {
  _inherits(CalendarWidget, _InputWidget);

  _createClass(CalendarWidget, null, [{
    key: 'defaultSettings',

    /* eslint-disable camelcase */
    get: function get() {
      return {
        type: 'calendar',
        altInput: true,
        allowInput: true,
        clickOpens: true,
        enableDate: true,
        enableTime: true,
        mode: 'single',
        noCalendar: false,
        format: DEFAULT_FORMAT,
        dateFormat: ISO_8601_FORMAT,
        useLocaleSettings: false,
        language: 'us-en',
        defaultDate: null,
        hourIncrement: 1,
        minuteIncrement: 5,
        time_24hr: false,
        displayInTimezone: '',
        timezone: '',
        minDate: '',
        maxDate: ''
      };
    }
    /* eslint-enable camelcase */

  }]);

  function CalendarWidget(settings, component) {
    _classCallCheck(this, CalendarWidget);

    var _this = _possibleConstructorReturn(this, (CalendarWidget.__proto__ || Object.getPrototypeOf(CalendarWidget)).call(this, settings, component));

    _this.component.suffix = true;
    return _this;
  }

  _createClass(CalendarWidget, [{
    key: 'attach',
    value: function attach(input) {
      var _this2 = this;

      _get(CalendarWidget.prototype.__proto__ || Object.getPrototypeOf(CalendarWidget.prototype), 'attach', this).call(this, input);
      if (input && !input.getAttribute('placeholder')) {
        input.setAttribute('placeholder', this.settings.format);
      }

      var dateFormatInfo = (0, _utils.getLocaleDateFormatInfo)(this.settings.language);
      this.defaultFormat = {
        date: dateFormatInfo.dayFirst ? 'd/m/Y ' : 'm/d/Y ',
        time: 'h:i K'
      };

      this.closedOn = 0;
      this.valueFormat = this.settings.dateFormat || ISO_8601_FORMAT;
      this.valueMomentFormat = (0, _utils.convertFormatToMoment)(this.valueFormat);
      this.settings.minDate = (0, _utils.getDateSetting)(this.settings.minDate);
      this.settings.maxDate = (0, _utils.getDateSetting)(this.settings.maxDate);
      this.settings.defaultDate = (0, _utils.getDateSetting)(this.settings.defaultDate);
      this.settings.altFormat = (0, _utils.convertFormatToFlatpickr)(this.settings.format);
      this.settings.dateFormat = (0, _utils.convertFormatToFlatpickr)(this.settings.dateFormat);
      this.settings.onChange = function () {
        return _this2.emit('update');
      };
      this.settings.onClose = function () {
        return _this2.closedOn = Date.now();
      };
      this.settings.formatDate = function (date, format) {
        // Only format this if this is the altFormat and the form is readOnly.
        if (_this2.settings.readOnly && format === _this2.settings.altFormat) {
          if (!_moment2.default.zonesLoaded) {
            (0, _utils.loadZones)(_this2.timezone).then(function () {
              return _this2.redraw();
            });
            return _flatpickr2.default.formatDate(date, format);
          }

          return (0, _utils.formatOffset)(_flatpickr2.default.formatDate.bind(_flatpickr2.default), date, format, _this2.timezone, function () {
            return _this2.emit('redraw');
          });
        }

        return _flatpickr2.default.formatDate(date, format);
      };

      if (this._input) {
        // Create a new flatpickr.
        this.calendar = new _flatpickr2.default(this._input, this.settings);

        // Enforce the input mask of the format.
        this.setInputMask(this.calendar._input, (0, _utils.convertFormatToMask)(this.settings.format));

        this.addEventListener(this.calendar._input, 'input', function () {
          return _this2.updateCalendarOnInput();
        });

        // Make sure we commit the value after a blur event occurs.
        this.addEventListener(this.calendar._input, 'blur', function () {
          return _this2.calendar.setDate(_this2.calendar._input.value, true, _this2.settings.altFormat);
        });
      }
    }
  }, {
    key: 'addSuffix',
    value: function addSuffix(container) {
      var _this3 = this;

      var suffix = this.ce('span', {
        class: 'input-group-addon',
        style: 'cursor: pointer'
      });
      suffix.appendChild(this.getIcon(this.settings.enableDate ? 'calendar' : 'time'));
      this.addEventListener(suffix, 'click', function () {
        if (_this3.calendar && !_this3.calendar.isOpen && Date.now() - _this3.closedOn > 200) {
          _this3.calendar.open();
        }
      });
      container.appendChild(suffix);
      return suffix;
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      // Standard output format.
      if (!this.calendar) {
        return _get(CalendarWidget.prototype.__proto__ || Object.getPrototypeOf(CalendarWidget.prototype), 'getValue', this).call(this);
      }

      // Get the selected dates from the calendar widget.
      var dates = this.calendar.selectedDates;
      if (!dates || !dates.length) {
        return _get(CalendarWidget.prototype.__proto__ || Object.getPrototypeOf(CalendarWidget.prototype), 'getValue', this).call(this);
      }

      // Return a formatted version of the date to store in string format.
      return dates[0] instanceof Date ? this.getView(dates[0], this.valueFormat) : 'Invalid Date';
    }
  }, {
    key: 'setValue',
    value: function setValue(value) {
      if (!this.calendar) {
        return _get(CalendarWidget.prototype.__proto__ || Object.getPrototypeOf(CalendarWidget.prototype), 'setValue', this).call(this, value);
      }
      if (value) {
        this.calendar.setDate((0, _moment2.default)(value, this.valueMomentFormat).toDate(), false);
      } else {
        this.calendar.clear(false);
      }
    }
  }, {
    key: 'getView',
    value: function getView(value, format) {
      format = format || this.dateFormat;
      return (0, _utils.formatDate)(value, format, this.timezone);
    }
  }, {
    key: 'validationValue',
    value: function validationValue(value) {
      if (typeof value === 'string') {
        return value ? new Date(value) : value;
      }
      return value.map(function (val) {
        return new Date(val);
      });
    }
  }, {
    key: 'updateCalendarOnInput',
    value: function updateCalendarOnInput() {
      var dates = this.calendar.selectedDates;
      var inputValue = this.calendar._input.value;
      if (!inputValue || !inputValue.trim()) {
        if (dates && dates.length) {
          this.calendar.clear(false);
        }
      } else {
        var format = this.calendar.config.altFormat;
        if (inputValue.trim() === this.calendar.formatDate(this.calendar.parseDate(inputValue, format), format)) {
          this.calendar.setDate(inputValue, true, format);
        }
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.calendar && this.calendar.destroy();
    }
  }, {
    key: 'timezone',
    get: function get() {
      if (this.settings.timezone) {
        return this.settings.timezone;
      }
      if (this.settings.displayInTimezone === 'submission' && this.settings.submissionTimezone) {
        return this.settings.submissionTimezone;
      }
      if (this.settings.displayInTimezone === 'utc') {
        return 'UTC';
      }

      // Return current timezone if none are provided.
      return (0, _utils.currentTimezone)();
    }
  }, {
    key: 'defaultSettings',
    get: function get() {
      return CalendarWidget.defaultSettings;
    }
  }, {
    key: 'disabled',
    set: function set(disabled) {
      _set(CalendarWidget.prototype.__proto__ || Object.getPrototypeOf(CalendarWidget.prototype), 'disabled', disabled, this);
      if (this.calendar) {
        this.disableInput(this.calendar._input, disabled);
        this.calendar.close();
        this.calendar.redraw();
      }
    }
  }, {
    key: 'input',
    get: function get() {
      return this.calendar ? this.calendar.altInput : null;
    }
  }, {
    key: 'localeFormat',
    get: function get() {
      var format = '';

      if (this.settings.enableDate) {
        format += this.defaultFormat.date;
      }

      if (this.settings.enableTime) {
        format += this.defaultFormat.time;
      }

      return format;
    }
  }, {
    key: 'dateTimeFormat',
    get: function get() {
      return this.settings.useLocaleSettings ? this.localeFormat : (0, _utils.convertFormatToFlatpickr)(this.dateFormat);
    }
  }, {
    key: 'dateFormat',
    get: function get() {
      return _lodash2.default.get(this.settings, 'format', DEFAULT_FORMAT);
    }

    /**
     * Get the default date for the calendar.
     * @return {*}
     */

  }, {
    key: 'defaultDate',
    get: function get() {
      return (0, _utils.getDateSetting)(this.settings.defaultDate);
    }
  }, {
    key: 'defaultValue',
    get: function get() {
      var defaultDate = this.defaultDate;
      return defaultDate ? defaultDate.toISOString() : '';
    }
  }]);

  return CalendarWidget;
}(_InputWidget3.default);

exports.default = CalendarWidget;