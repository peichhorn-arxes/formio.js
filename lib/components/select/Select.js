'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _choices = require('choices.js/assets/scripts/dist/choices.js');

var _choices2 = _interopRequireDefault(_choices);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _Base = require('../base/Base');

var _Base2 = _interopRequireDefault(_Base);

var _Formio = require('../../Formio');

var _Formio2 = _interopRequireDefault(_Formio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SelectComponent = function (_BaseComponent) {
  _inherits(SelectComponent, _BaseComponent);

  _createClass(SelectComponent, null, [{
    key: 'schema',
    value: function schema() {
      for (var _len = arguments.length, extend = Array(_len), _key = 0; _key < _len; _key++) {
        extend[_key] = arguments[_key];
      }

      return _Base2.default.schema.apply(_Base2.default, [{
        type: 'select',
        label: 'Select',
        key: 'select',
        data: {
          values: [],
          json: '',
          url: '',
          resource: '',
          custom: ''
        },
        dataSrc: 'values',
        valueProperty: '',
        filter: '',
        searchEnabled: true,
        searchField: '',
        minSearch: 0,
        authenticate: false,
        template: '<span>{{ item.label }}</span>',
        selectFields: ''
      }].concat(extend));
    }
  }, {
    key: 'builderInfo',
    get: function get() {
      return {
        title: 'Select',
        group: 'basic',
        icon: 'fa fa-th-list',
        weight: 70,
        documentation: 'http://help.form.io/userguide/#select',
        schema: SelectComponent.schema()
      };
    }
  }]);

  function SelectComponent(component, options, data) {
    _classCallCheck(this, SelectComponent);

    // Trigger an update.
    var _this = _possibleConstructorReturn(this, (SelectComponent.__proto__ || Object.getPrototypeOf(SelectComponent)).call(this, component, options, data));

    _this.triggerUpdate = _lodash2.default.debounce(_this.updateItems.bind(_this), 100);

    // Keep track of the select options.
    _this.selectOptions = [];

    // See if this should use the template.
    _this.useTemplate = _this.component.dataSrc !== 'values' && _this.component.template;

    // If this component has been activated.
    _this.activated = false;

    // Determine when the items have been loaded.
    _this.itemsLoaded = new Promise(function (resolve) {
      _this.itemsLoadedResolve = resolve;
    });
    return _this;
  }

  _createClass(SelectComponent, [{
    key: 'elementInfo',
    value: function elementInfo() {
      var info = _get(SelectComponent.prototype.__proto__ || Object.getPrototypeOf(SelectComponent.prototype), 'elementInfo', this).call(this);
      info.type = 'select';
      info.changeEvent = 'change';
      return info;
    }
  }, {
    key: 'createWrapper',
    value: function createWrapper() {
      return false;
    }
  }, {
    key: 'itemTemplate',
    value: function itemTemplate(data) {
      if (!data) {
        return '';
      }

      // Perform a fast interpretation if we should not use the template.
      if (data && !this.useTemplate) {
        var itemLabel = data.label || data;
        return typeof itemLabel === 'string' ? this.t(itemLabel) : itemLabel;
      }
      if (typeof data === 'string') {
        return this.t(data);
      }

      var template = this.component.template ? this.interpolate(this.component.template, { item: data }) : data.label;
      if (template) {
        var label = template.replace(/<\/?[^>]+(>|$)/g, '');
        return template.replace(label, this.t(label));
      } else {
        return JSON.stringify(data);
      }
    }

    /**
     * @param {*} data
     * @param {boolean} [forceUseValue=false] - if true, return 'value' property of the data
     * @return {*}
     */

  }, {
    key: 'itemValue',
    value: function itemValue(data) {
      var forceUseValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (_lodash2.default.isObject(data)) {
        if (this.component.valueProperty) {
          return _lodash2.default.get(data, this.component.valueProperty);
        }

        if (forceUseValue) {
          return data.value;
        }
      }

      return data;
    }
  }, {
    key: 'createInput',
    value: function createInput(container) {
      this.selectContainer = container;
      this.selectInput = _get(SelectComponent.prototype.__proto__ || Object.getPrototypeOf(SelectComponent.prototype), 'createInput', this).call(this, container);
    }

    /**
     * Adds an option to the select dropdown.
     *
     * @param value
     * @param label
     */

  }, {
    key: 'addOption',
    value: function addOption(value, label, attr) {
      var option = {
        value: value,
        label: label
      };

      this.selectOptions.push(option);
      if (this.choices) {
        return;
      }

      option.element = document.createElement('option');
      if (this.dataValue === option.value) {
        option.element.setAttribute('selected', 'selected');
        option.element.selected = 'selected';
      }
      option.element.innerHTML = label;
      if (attr) {
        _lodash2.default.each(attr, function (value, key) {
          option.element.setAttribute(key, value);
        });
      }
      this.selectInput.appendChild(option.element);
    }
  }, {
    key: 'addValueOptions',
    value: function addValueOptions(items) {
      var _this2 = this;

      items = items || [];
      if (!this.selectOptions.length) {
        if (this.choices) {
          // Add the currently selected choices if they don't already exist.
          var currentChoices = Array.isArray(this.dataValue) ? this.dataValue : [this.dataValue];
          _lodash2.default.each(currentChoices, function (choice) {
            _this2.addCurrentChoices(choice, items);
          });
        } else if (!this.component.multiple) {
          this.addPlaceholder(this.selectInput);
        }
      }
    }

    /* eslint-disable max-statements */

  }, {
    key: 'setItems',
    value: function setItems(items, fromSearch) {
      var _this3 = this;

      // If the items is a string, then parse as JSON.
      if (typeof items == 'string') {
        try {
          items = JSON.parse(items);
        } catch (err) {
          console.warn(err.message);
          items = [];
        }
      }

      // Allow js processing (needed for form builder)
      if (this.component.onSetItems && typeof this.component.onSetItems === 'function') {
        var newItems = this.component.onSetItems(this, items);
        if (newItems) {
          items = newItems;
        }
      }

      if (!this.choices && this.selectInput) {
        if (this.loading) {
          this.removeChildFrom(this.selectInput, this.selectContainer);
        }

        this.selectInput.innerHTML = '';
      }

      this.selectOptions = [];

      // If they provided select values, then we need to get them instead.
      if (this.component.selectValues) {
        items = _lodash2.default.get(items, this.component.selectValues);
      }

      // Add the value options.
      if (!fromSearch) {
        this.addValueOptions(items);
      }

      if (this.component.widget === 'html5' && !this.component.placeholder) {
        this.addOption(null, '');
      }

      // Iterate through each of the items.
      _lodash2.default.each(items, function (item) {
        _this3.addOption(_this3.itemValue(item), _this3.itemTemplate(item));
      });

      if (this.choices) {
        this.choices.setChoices(this.selectOptions, 'value', 'label', true);
      } else if (this.loading) {
        // Re-attach select input.
        this.appendTo(this.selectInput, this.selectContainer);
      }

      // We are no longer loading.
      this.loading = false;

      // If a value is provided, then select it.
      if (this.dataValue) {
        this.setValue(this.dataValue, true);
      } else {
        // If a default value is provided then select it.
        var defaultValue = this.defaultValue;
        if (defaultValue) {
          this.setValue(defaultValue);
        }
      }

      // Say we are done loading the items.
      this.itemsLoadedResolve();
    }
    /* eslint-enable max-statements */

  }, {
    key: 'loadItems',
    value: function loadItems(url, search, headers, options, method, body) {
      var _this4 = this;

      options = options || {};

      // See if they have not met the minimum search requirements.
      var minSearch = parseInt(this.component.minSearch, 10);
      if (this.component.searchField && minSearch > 0 && (!search || search.length < minSearch)) {
        // Set empty items.
        return this.setItems([]);
      }

      // Ensure we have a method and remove any body if method is get
      method = method || 'GET';
      if (method.toUpperCase() === 'GET') {
        body = null;
      }

      var query = this.component.dataSrc === 'url' ? {} : {
        limit: 100,
        skip: 0
      };

      // Allow for url interpolation.
      url = this.interpolate(url, {
        formioBase: _Formio2.default.getBaseUrl()
      });

      // Add search capability.
      if (this.component.searchField && search) {
        if (Array.isArray(search)) {
          query[this.component.searchField + '__in'] = search.join(',');
        } else {
          query[this.component.searchField] = search;
        }
      }

      // Add filter capability
      if (this.component.filter) {
        var filter = this.interpolate(this.component.filter);
        url += (!(url.indexOf('?') !== -1) ? '?' : '&') + filter;
      }

      // If they wish to return only some fields.
      if (this.component.selectFields) {
        query.select = this.component.selectFields;
      }

      if (!_lodash2.default.isEmpty(query)) {
        // Add the query string.
        url += (!(url.indexOf('?') !== -1) ? '?' : '&') + _Formio2.default.serialize(query);
      }

      // Make the request.
      options.header = headers;
      this.loading = true;
      _Formio2.default.makeRequest(this.options.formio, 'select', url, method, body, options).then(function (response) {
        return _this4.setItems(response, !!search);
      }).catch(function (err) {
        _this4.loading = false;
        _this4.itemsLoadedResolve();
        _this4.emit('componentError', {
          component: _this4.component,
          message: err.toString()
        });
        console.warn('Unable to load resources for ' + _this4.key);
      });
    }

    /**
     * Get the request headers for this select dropdown.
     */

  }, {
    key: 'updateCustomItems',
    value: function updateCustomItems() {
      this.setItems(this.evaluate(this.component.data.custom, {
        values: []
      }, 'values') || []);
    }

    /* eslint-disable max-statements */

  }, {
    key: 'updateItems',
    value: function updateItems(searchInput, forceUpdate) {
      if (!this.component.data) {
        console.warn('Select component ' + this.key + ' does not have data configuration.');
        this.itemsLoadedResolve();
        return;
      }

      // Only load the data if it is visible.
      if (!this.checkConditions()) {
        this.itemsLoadedResolve();
        return;
      }

      switch (this.component.dataSrc) {
        case 'values':
          this.component.valueProperty = 'value';
          this.setItems(this.component.data.values);
          break;
        case 'json':
          this.setItems(this.component.data.json);
          break;
        case 'custom':
          this.updateCustomItems();
          break;
        case 'resource':
          {
            // If there is no resource, or we are lazyLoading, wait until active.
            if (!this.component.data.resource || !forceUpdate && !this.active) {
              return;
            }
            var resourceUrl = this.options.formio ? this.options.formio.formsUrl : _Formio2.default.getProjectUrl() + '/form';
            resourceUrl += '/' + this.component.data.resource + '/submission';

            try {
              this.loadItems(resourceUrl, searchInput, this.requestHeaders);
            } catch (err) {
              console.warn('Unable to load resources for ' + this.key);
            }
            break;
          }
        case 'url':
          {
            if (!forceUpdate && !this.active) {
              // If we are lazyLoading, wait until activated.
              return;
            }
            var url = this.component.data.url;
            var method = void 0;
            var body = void 0;

            if (url.substr(0, 1) === '/') {
              var baseUrl = _Formio2.default.getProjectUrl();
              if (!baseUrl) {
                baseUrl = _Formio2.default.getBaseUrl();
              }
              url = baseUrl + this.component.data.url;
            }

            if (!this.component.data.method) {
              method = 'GET';
            } else {
              method = this.component.data.method;
              if (method.toUpperCase() === 'POST') {
                body = this.component.data.body;
              } else {
                body = null;
              }
            }
            this.loadItems(url, searchInput, this.requestHeaders, { noToken: true }, method, body);
            break;
          }
      }
    }
    /* eslint-enable max-statements */

  }, {
    key: 'addPlaceholder',
    value: function addPlaceholder(input) {
      if (!this.component.placeholder || !input) {
        return;
      }
      var placeholder = document.createElement('option');
      placeholder.setAttribute('placeholder', true);
      placeholder.appendChild(this.text(this.component.placeholder));
      input.appendChild(placeholder);
    }

    /**
     * Activate this select control.
     */

  }, {
    key: 'activate',
    value: function activate() {
      if (this.active) {
        return;
      }
      this.activated = true;
      if (this.choices) {
        this.choices.setChoices([{
          value: '',
          label: '<i class="' + this.iconClass('refresh') + '" style="font-size:1.3em;"></i>'
        }], 'value', 'label', true);
      } else {
        this.addOption('', this.t('loading...'));
      }
      this.triggerUpdate();
    }
  }, {
    key: 'addInput',


    /* eslint-disable max-statements */
    value: function addInput(input, container) {
      var _this5 = this;

      _get(SelectComponent.prototype.__proto__ || Object.getPrototypeOf(SelectComponent.prototype), 'addInput', this).call(this, input, container);
      if (this.component.multiple) {
        input.setAttribute('multiple', true);
      }

      if (this.component.widget === 'html5') {
        this.triggerUpdate();
        this.addEventListener(input, 'focus', function () {
          return _this5.update();
        });
        this.addEventListener(input, 'keydown', function (event) {
          var keyCode = event.keyCode;


          if ([8, 46].indexOf(keyCode) !== -1) {
            _this5.setValue(null);
          }
        });
        return;
      }

      var useSearch = this.component.hasOwnProperty('searchEnabled') ? this.component.searchEnabled : true;
      var placeholderValue = this.t(this.component.placeholder);
      var choicesOptions = {
        removeItemButton: _lodash2.default.get(this.component, 'removeItemButton', true),
        itemSelectText: '',
        classNames: {
          containerOuter: 'choices form-group formio-choices',
          containerInner: 'form-control'
        },
        addItemText: false,
        placeholder: !!this.component.placeholder,
        placeholderValue: placeholderValue,
        searchPlaceholderValue: this.t('Type to search'),
        shouldSort: false,
        position: this.component.dropdown || 'auto',
        searchEnabled: useSearch,
        searchChoices: !this.component.searchField,
        searchFields: ['label'],
        fuseOptions: {
          include: 'score',
          threshold: 0.3
        },
        itemComparer: _lodash2.default.isEqual
      };

      var tabIndex = input.tabIndex;
      this.addPlaceholder(input);
      this.choices = new _choices2.default(input, choicesOptions);

      if (this.component.multiple) {
        this.focusableElement = this.choices.input;
      } else {
        this.focusableElement = this.choices.containerInner;
        this.choices.containerOuter.setAttribute('tabIndex', '-1');
        this.addEventListener(this.choices.containerOuter, 'focus', function () {
          return _this5.focusableElement.focus();
        });
      }
      this.addFocusBlurEvents(this.focusableElement);
      this.focusableElement.setAttribute('tabIndex', tabIndex);

      this.setInputStyles(this.choices.containerOuter);

      // If a search field is provided, then add an event listener to update items on search.
      if (this.component.searchField) {
        // Make sure to clear the search when no value is provided.
        if (this.choices && this.choices.input) {
          this.addEventListener(this.choices.input, 'input', function (event) {
            if (!event.target.value) {
              _this5.triggerUpdate();
            }
          });
        }
        this.addEventListener(input, 'search', function (event) {
          return _this5.triggerUpdate(event.detail.value);
        });
        this.addEventListener(input, 'stopSearch', function () {
          return _this5.triggerUpdate();
        });
      }

      this.addEventListener(input, 'showDropdown', function () {
        return _this5.update();
      });
      if (placeholderValue && this.choices.isSelectOneElement) {
        this.addEventListener(input, 'removeItem', function () {
          var items = _this5.choices.store.getItemsFilteredByActive();
          if (!items.length) {
            _this5.choices._addItem(placeholderValue, placeholderValue, 0, -1, null, true, null);
          }
        });
      }

      // Force the disabled state with getters and setters.
      this.disabled = this.disabled;
      this.triggerUpdate();
    }
    /* eslint-enable max-statements */

  }, {
    key: 'update',
    value: function update() {
      if (this.component.dataSrc === 'custom') {
        this.updateCustomItems();
      }

      // Activate the control.
      this.activate();
    }
  }, {
    key: 'show',
    value: function show(_show) {
      // If we go from hidden to visible, trigger a refresh.
      var triggerUpdate = _show && this._visible !== _show;
      _show = _get(SelectComponent.prototype.__proto__ || Object.getPrototypeOf(SelectComponent.prototype), 'show', this).call(this, _show);
      if (triggerUpdate) {
        this.triggerUpdate();
      }
      return _show;
    }

    /**
     * @param {*} value
     * @param {Array} items
     */

  }, {
    key: 'addCurrentChoices',
    value: function addCurrentChoices(value, items) {
      var _this6 = this;

      if (value) {
        var found = false;
        // Make sure that `items` and `this.selectOptions` points
        // to the same reference. Because `this.selectOptions` is
        // internal property and all items are populated by
        // `this.addOption` method, we assume that items has
        // 'label' and 'value' properties. This assumption allows
        // us to read correct value from the item.
        var isSelectOptions = items === this.selectOptions;
        if (items && items.length) {
          _lodash2.default.each(items, function (choice) {
            if (choice._id && value._id && choice._id === value._id || choice.value && value && choice.value === value) {
              found = true;
              return false;
            }
            found |= _lodash2.default.isEqual(_this6.itemValue(choice, isSelectOptions), value);
            return found ? false : true;
          });
        }

        // Add the default option if no item is found.
        if (!found) {
          this.addOption(this.itemValue(value), this.itemTemplate(value));
        }
      }
    }
  }, {
    key: 'getView',
    value: function getView(data) {
      return this.itemTemplate(data);
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      if (this.viewOnly || this.loading || !this.selectOptions.length) {
        return this.dataValue;
      }
      var value = '';
      if (this.choices) {
        value = this.choices.getValue(true);

        // Make sure we don't get the placeholder
        if (!this.component.multiple && this.component.placeholder && value === this.t(this.component.placeholder)) {
          value = '';
        }
      } else {
        var values = [];
        _lodash2.default.each(this.selectOptions, function (selectOption) {
          if (selectOption.element && selectOption.element.selected) {
            values.push(selectOption.value);
          }
        });
        value = this.component.multiple ? values : values.shift();
      }
      // Choices will return undefined if nothing is selected. We really want '' to be empty.
      if (value === undefined || value === null) {
        value = '';
      }
      return value;
    }
  }, {
    key: 'setValue',
    value: function setValue(value, flags) {
      var _this7 = this;

      flags = this.getFlags.apply(this, arguments);
      var previousValue = this.dataValue;
      if (this.component.multiple && !Array.isArray(value)) {
        value = [value];
      }
      var hasPreviousValue = Array.isArray(previousValue) ? previousValue.length : previousValue;
      var hasValue = Array.isArray(value) ? value.length : value;
      var changed = this.hasChanged(value, previousValue);
      this.dataValue = value;

      // Do not set the value if we are loading... that will happen after it is done.
      if (this.loading) {
        return changed;
      }

      // Determine if we need to perform an initial lazyLoad api call if searchField is provided.
      if (this.component.searchField && this.component.lazyLoad && !this.lazyLoadInit && !this.active && !this.selectOptions.length && hasValue) {
        this.loading = true;
        this.lazyLoadInit = true;
        this.triggerUpdate(this.dataValue, true);
        return changed;
      }

      // Add the value options.
      this.addValueOptions();

      if (this.choices) {
        // Now set the value.
        if (hasValue) {
          this.choices.removeActiveItems();
          // Add the currently selected choices if they don't already exist.
          var currentChoices = Array.isArray(this.dataValue) ? this.dataValue : [this.dataValue];
          _lodash2.default.each(currentChoices, function (choice) {
            _this7.addCurrentChoices(choice, _this7.selectOptions);
          });
          this.choices.setChoices(this.selectOptions, 'value', 'label', true).setValueByChoice(value);
        } else if (hasPreviousValue) {
          this.choices.removeActiveItems();
        }
      } else {
        if (hasValue) {
          var values = Array.isArray(value) ? value : [value];
          _lodash2.default.each(this.selectOptions, function (selectOption) {
            _lodash2.default.each(values, function (val) {
              if (_lodash2.default.isEqual(val, selectOption.value)) {
                selectOption.element.selected = true;
                selectOption.element.setAttribute('selected', 'selected');
                return false;
              }
            });
          });
        } else {
          _lodash2.default.each(this.selectOptions, function (selectOption) {
            selectOption.element.selected = false;
            selectOption.element.removeAttribute('selected');
          });
        }
      }

      this.updateOnChange(flags, changed);
      return changed;
    }

    /**
     * Deletes the value of the component.
     */

  }, {
    key: 'deleteValue',
    value: function deleteValue() {
      this.setValue('');
      _lodash2.default.unset(this.data, this.key);
    }

    /**
     * Check if a component is eligible for multiple validation
     *
     * @return {boolean}
     */

  }, {
    key: 'validateMultiple',
    value: function validateMultiple() {
      // Select component will contain one input when flagged as multiple.
      return false;
    }

    /**
     * Ouput this select dropdown as a string value.
     * @return {*}
     */

  }, {
    key: 'asString',
    value: function asString(value) {
      value = value || this.getValue();

      if (this.component.dataSrc === 'values') {
        value = _lodash2.default.find(this.component.data.values, ['value', value]);
      }

      if (_lodash2.default.isString(value)) {
        return value;
      }

      return _lodash2.default.isObject(value) ? this.itemTemplate(value) : '-';
    }
  }, {
    key: 'setupValueElement',
    value: function setupValueElement(element) {
      element.innerHTML = this.asString();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      _get(SelectComponent.prototype.__proto__ || Object.getPrototypeOf(SelectComponent.prototype), 'destroy', this).call(this);
      if (this.choices) {
        this.choices.destroyed = true;
        this.choices.destroy();
        this.choices = null;
      }
    }
  }, {
    key: 'focus',
    value: function focus() {
      this.focusableElement.focus();
    }
  }, {
    key: 'dataReady',
    get: function get() {
      return this.itemsLoaded;
    }
  }, {
    key: 'defaultSchema',
    get: function get() {
      return SelectComponent.schema();
    }
  }, {
    key: 'emptyValue',
    get: function get() {
      return '';
    }
  }, {
    key: 'requestHeaders',
    get: function get() {
      var _this8 = this;

      // Create the headers object.
      var headers = new Headers();

      // Add custom headers to the url.
      if (this.component.data && this.component.data.headers) {
        try {
          _lodash2.default.each(this.component.data.headers, function (header) {
            if (header.key) {
              headers.set(header.key, _this8.interpolate(header.value));
            }
          });
        } catch (err) {
          console.warn(err.message);
        }
      }

      return headers;
    }
  }, {
    key: 'active',
    get: function get() {
      return !this.component.lazyLoad || this.activated;
    }
  }, {
    key: 'disabled',
    set: function set(disabled) {
      _set(SelectComponent.prototype.__proto__ || Object.getPrototypeOf(SelectComponent.prototype), 'disabled', disabled, this);
      if (!this.choices) {
        return;
      }
      if (disabled) {
        this.setDisabled(this.choices.containerInner, true);
        this.focusableElement.removeAttribute('tabIndex');
        this.choices.disable();
      } else {
        this.setDisabled(this.choices.containerInner, false);
        this.focusableElement.setAttribute('tabIndex', this.component.tabindex || 0);
        this.choices.enable();
      }
    }
  }]);

  return SelectComponent;
}(_Base2.default);

exports.default = SelectComponent;