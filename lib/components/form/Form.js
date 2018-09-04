'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _Base = require('../base/Base');

var _Base2 = _interopRequireDefault(_Base);

var _nativePromiseOnly = require('native-promise-only');

var _nativePromiseOnly2 = _interopRequireDefault(_nativePromiseOnly);

var _utils = require('../../utils/utils');

var _Formio = require('../../Formio');

var _Formio2 = _interopRequireDefault(_Formio);

var _Form = require('../../Form');

var _Form2 = _interopRequireDefault(_Form);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FormComponent = function (_BaseComponent) {
  _inherits(FormComponent, _BaseComponent);

  _createClass(FormComponent, null, [{
    key: 'schema',
    value: function schema() {
      for (var _len = arguments.length, extend = Array(_len), _key = 0; _key < _len; _key++) {
        extend[_key] = arguments[_key];
      }

      return _Base2.default.schema.apply(_Base2.default, [{
        type: 'form',
        key: 'form',
        src: '',
        reference: true,
        form: '',
        path: ''
      }].concat(extend));
    }
  }, {
    key: 'builderInfo',
    get: function get() {
      return {
        title: 'Nested Form',
        icon: 'fa fa-wpforms',
        group: 'advanced',
        documentation: 'http://help.form.io/userguide/#form',
        weight: 110,
        schema: FormComponent.schema()
      };
    }
  }]);

  function FormComponent(component, options, data) {
    _classCallCheck(this, FormComponent);

    var _this = _possibleConstructorReturn(this, (FormComponent.__proto__ || Object.getPrototypeOf(FormComponent)).call(this, component, options, data));

    _this.subForm = null;
    _this.formSrc = '';
    _this.subFormReady = new _nativePromiseOnly2.default(function (resolve, reject) {
      _this.subFormReadyResolve = resolve;
      _this.subFormReadyReject = reject;
    });
    return _this;
  }

  _createClass(FormComponent, [{
    key: 'renderSubForm',


    /**
     * Render a subform.
     *
     * @param form
     * @param options
     */
    value: function renderSubForm(form, options) {
      var _this2 = this;

      // Iterate through every component and hide the submit button.
      (0, _utils.eachComponent)(form.components, function (component) {
        if (component.type === 'button' && component.action === 'submit') {
          component.hidden = true;
        }
      });

      new _Form2.default(this.element, form, options).render().then(function (instance) {
        _this2.subForm = instance;
        _this2.subForm.on('change', function () {
          _this2.dataValue = _this2.subForm.getValue();
          _this2.onChange();
        });
        _this2.subForm.url = _this2.formSrc;
        _this2.subForm.nosubmit = false;
        _this2.restoreValue();
        _this2.subFormReadyResolve(_this2.subForm);
        return _this2.subForm;
      });
    }

    /**
     * Load the subform.
     */
    /* eslint-disable max-statements */

  }, {
    key: 'loadSubForm',
    value: function loadSubForm() {
      var _this3 = this;

      // Only load the subform if the subform isn't loaded and the conditions apply.
      if (this.subFormLoaded || !_get(FormComponent.prototype.__proto__ || Object.getPrototypeOf(FormComponent.prototype), 'checkConditions', this).call(this, this.root ? this.root.data : this.data)) {
        return this.subFormReady;
      }
      this.subFormLoaded = true;
      var srcOptions = {};
      if (this.options && this.options.base) {
        srcOptions.base = this.options.base;
      }
      if (this.options && this.options.project) {
        srcOptions.project = this.options.project;
      }
      if (this.options && this.options.readOnly) {
        srcOptions.readOnly = this.options.readOnly;
      }
      if (this.options && this.options.viewAsHtml) {
        srcOptions.viewAsHtml = this.options.viewAsHtml;
      }

      // Make sure that if reference is provided, the form must submit.
      if (this.component.reference) {
        this.component.submit = true;
      }

      if (this.component.src) {
        this.formSrc = this.component.src;
      }

      if (!this.component.src && !this.options.formio && (this.component.form || this.component.path)) {
        this.formSrc = _Formio2.default.getBaseUrl();
        if (this.component.project) {
          // Check to see if it is a MongoID.
          if ((0, _utils.isMongoId)(this.component.project)) {
            this.formSrc += '/project';
          }
          this.formSrc += '/' + this.component.project;
          srcOptions.project = this.formSrc;
        }
        if (this.component.form) {
          this.formSrc += '/form/' + this.component.form;
        } else if (this.component.path) {
          this.formSrc += '/' + this.component.path;
        }
      }

      // Build the source based on the root src path.
      if (!this.formSrc && this.options.formio) {
        var rootSrc = this.options.formio.formsUrl;
        if (this.component.path) {
          var parts = rootSrc.split('/');
          parts.pop();
          this.formSrc = parts.join('/') + '/' + this.component.path;
        }
        if (this.component.form) {
          this.formSrc = rootSrc + '/' + this.component.form;
        }
      }

      // Determine if we already have a loaded form object.
      if (this.component && this.component.components && this.component.components.length) {
        this.renderSubForm(this.component, srcOptions);
      } else {
        new _Formio2.default(this.formSrc).loadForm({ params: { live: 1 } }).then(function (formObj) {
          return _this3.renderSubForm(formObj, srcOptions);
        }).catch(function (err) {
          return _this3.subFormReadyReject(err);
        });
      }
      return this.subFormReady;
    }
    /* eslint-enable max-statements */

  }, {
    key: 'checkValidity',
    value: function checkValidity(data, dirty) {
      if (this.subForm) {
        return this.subForm.checkValidity(this.dataValue.data, dirty);
      }

      return _get(FormComponent.prototype.__proto__ || Object.getPrototypeOf(FormComponent.prototype), 'checkValidity', this).call(this, data, dirty);
    }
  }, {
    key: 'checkConditions',
    value: function checkConditions(data) {
      if (this.subForm) {
        return this.subForm.checkConditions(this.dataValue.data);
      }

      return _get(FormComponent.prototype.__proto__ || Object.getPrototypeOf(FormComponent.prototype), 'checkConditions', this).call(this, data);
    }
  }, {
    key: 'calculateValue',
    value: function calculateValue(data, flags) {
      if (this.subForm) {
        return this.subForm.calculateValue(this.dataValue.data, flags);
      }

      return _get(FormComponent.prototype.__proto__ || Object.getPrototypeOf(FormComponent.prototype), 'calculateValue', this).call(this, data, flags);
    }
  }, {
    key: 'setPristine',
    value: function setPristine(pristine) {
      _get(FormComponent.prototype.__proto__ || Object.getPrototypeOf(FormComponent.prototype), 'setPristine', this).call(this, pristine);
      if (this.subForm) {
        this.subForm.setPristine(pristine);
      }
    }

    /**
     * Submit the form before the next page is triggered.
     */

  }, {
    key: 'beforeNext',
    value: function beforeNext() {
      var _this4 = this;

      // If we wish to submit the form on next page, then do that here.
      if (this.component.submit) {
        return this.loadSubForm().then(function () {
          return _this4.subForm.submitForm().then(function (result) {
            _this4.dataValue = result.submission;
            return _this4.dataValue;
          }).catch(function (err) {
            _this4.subForm.onSubmissionError(err);
            return _nativePromiseOnly2.default.reject(err);
          });
        });
      } else {
        return _get(FormComponent.prototype.__proto__ || Object.getPrototypeOf(FormComponent.prototype), 'beforeNext', this).call(this);
      }
    }

    /**
     * Submit the form before the whole form is triggered.
     */

  }, {
    key: 'beforeSubmit',
    value: function beforeSubmit() {
      var _this5 = this;

      var submission = this.dataValue;

      // This submission has already been submitted, so just return the reference data.
      if (submission && submission._id && submission.form) {
        this.dataValue = this.component.reference ? {
          _id: submission._id,
          form: submission.form
        } : submission;
        return _nativePromiseOnly2.default.resolve(this.dataValue);
      }

      // This submission has not been submitted yet.
      if (this.component.submit) {
        return this.loadSubForm().then(function () {
          return _this5.subForm.submitForm().then(function (result) {
            _this5.subForm.loading = false;
            _this5.dataValue = _this5.component.reference ? {
              _id: result.submission._id,
              form: result.submission.form
            } : result.submission;
            return _this5.dataValue;
          }).catch(function () {});
        });
      } else {
        return _get(FormComponent.prototype.__proto__ || Object.getPrototypeOf(FormComponent.prototype), 'beforeSubmit', this).call(this);
      }
    }
  }, {
    key: 'build',
    value: function build() {
      this.createElement();

      // Do not restore the value when building before submission.
      if (!this.options.beforeSubmit) {
        this.restoreValue();
      }
    }
  }, {
    key: 'setValue',
    value: function setValue(submission, flags) {
      var _this6 = this;

      var changed = _get(FormComponent.prototype.__proto__ || Object.getPrototypeOf(FormComponent.prototype), 'setValue', this).call(this, submission, flags);

      (this.subForm ? _nativePromiseOnly2.default.resolve(this.subForm) : this.loadSubForm()).then(function (form) {
        if (submission && submission._id && form.formio && !flags.noload && _lodash2.default.isEmpty(submission.data)) {
          var submissionUrl = form.formio.formsUrl + '/' + submission.form + '/submission/' + submission._id;
          form.setUrl(submissionUrl, _this6.options);
          form.nosubmit = false;
          form.loadSubmission();
        } else {
          form.setValue(submission, flags);
        }
      });

      return changed;
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      if (this.subForm) {
        return this.subForm.getValue();
      }
      return this.dataValue;
    }
  }, {
    key: 'getAllComponents',
    value: function getAllComponents() {
      if (!this.subForm) {
        return [];
      }
      return this.subForm.getAllComponents();
    }
  }, {
    key: 'defaultSchema',
    get: function get() {
      return FormComponent.schema();
    }
  }, {
    key: 'emptyValue',
    get: function get() {
      return { data: {} };
    }
  }]);

  return FormComponent;
}(_Base2.default);

exports.default = FormComponent;