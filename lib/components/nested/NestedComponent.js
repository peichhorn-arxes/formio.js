'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _nativePromiseOnly = require('native-promise-only');

var _nativePromiseOnly2 = _interopRequireDefault(_nativePromiseOnly);

var _utils = require('../../utils/utils');

var _Base = require('../base/Base');

var _Base2 = _interopRequireDefault(_Base);

var _Components = require('../Components');

var _Components2 = _interopRequireDefault(_Components);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NestedComponent = function (_BaseComponent) {
  _inherits(NestedComponent, _BaseComponent);

  _createClass(NestedComponent, null, [{
    key: 'schema',
    value: function schema() {
      for (var _len = arguments.length, extend = Array(_len), _key = 0; _key < _len; _key++) {
        extend[_key] = arguments[_key];
      }

      return _Base2.default.schema.apply(_Base2.default, [{}].concat(extend));
    }
  }]);

  function NestedComponent(component, options, data) {
    _classCallCheck(this, NestedComponent);

    var _this = _possibleConstructorReturn(this, (NestedComponent.__proto__ || Object.getPrototypeOf(NestedComponent)).call(this, component, options, data));

    _this.type = 'components';
    _this.components = [];
    _this.hidden = [];
    _this.collapsed = !!_this.component.collapsed;
    return _this;
  }

  _createClass(NestedComponent, [{
    key: 'build',
    value: function build(showLabel) {
      this.createElement();
      if (showLabel) {
        this.createLabel(this.element);
      }
      this.addComponents();
    }
  }, {
    key: 'getComponents',
    value: function getComponents() {
      return this.components;
    }
  }, {
    key: 'getAllComponents',
    value: function getAllComponents() {
      return this.getComponents().reduce(function (components, component) {
        var result = component;

        if (component && component.getAllComponents) {
          result = component.getAllComponents();
        }

        return components.concat(result);
      }, []);
    }

    /**
     * Perform a deep iteration over every component, including those
     * within other container based components.
     *
     * @param {function} fn - Called for every component.
     */

  }, {
    key: 'everyComponent',
    value: function everyComponent(fn) {
      var components = this.getComponents();
      _lodash2.default.each(components, function (component, index) {
        if (fn(component, components, index) === false) {
          return false;
        }

        if (typeof component.everyComponent === 'function') {
          if (component.everyComponent(fn) === false) {
            return false;
          }
        }
      });
    }

    /**
     * Perform an iteration over each component within this container component.
     *
     * @param {function} fn - Called for each component
     */

  }, {
    key: 'eachComponent',
    value: function eachComponent(fn) {
      _lodash2.default.each(this.getComponents(), function (component, index) {
        if (fn(component, index) === false) {
          return false;
        }
      });
    }

    /**
     * Returns a component provided a key. This performs a deep search within the
     * component tree.
     *
     * @param {string} key - The key of the component to retrieve.
     * @param {function} fn - Called with the component once found.
     * @return {Object} - The component that is located.
     */

  }, {
    key: 'getComponent',
    value: function getComponent(key, fn) {
      var comp = null;
      this.everyComponent(function (component, components) {
        if (component.component.key === key) {
          comp = component;
          if (fn) {
            fn(component, components);
          }
          return false;
        }
      });
      return comp;
    }

    /**
     * Return a component provided the Id of the component.
     *
     * @param {string} id - The Id of the component.
     * @param {function} fn - Called with the component once it is retrieved.
     * @return {Object} - The component retrieved.
     */

  }, {
    key: 'getComponentById',
    value: function getComponentById(id, fn) {
      var comp = null;
      this.everyComponent(function (component, components) {
        if (component.id === id) {
          comp = component;
          if (fn) {
            fn(component, components);
          }
          return false;
        }
      });
      return comp;
    }

    /**
     * Create a new component and add it to the components array.
     *
     * @param component
     * @param data
     */

  }, {
    key: 'createComponent',
    value: function createComponent(component, options, data, before) {
      options = options || this.options;
      data = data || this.data;
      var comp = _Components2.default.create(component, options, data, true);
      comp.parent = this;
      comp.root = this.root || this;
      comp.build();
      comp.isBuilt = true;
      if (component.internal) {
        return comp;
      }

      if (before) {
        var index = _lodash2.default.findIndex(this.components, { id: before.id });
        if (index !== -1) {
          this.components.splice(index, 0, comp);
        } else {
          this.components.push(comp);
        }
      } else {
        this.components.push(comp);
      }
      return comp;
    }
  }, {
    key: 'getContainer',
    value: function getContainer() {
      return this.element;
    }

    /**
     * Add a new component to the components array.
     *
     * @param {Object} component - The component JSON schema to add.
     * @param {HTMLElement} element - The DOM element to append this child to.
     * @param {Object} data - The submission data object to house the data for this component.
     * @param {HTMLElement} before - A DOM element to insert this element before.
     * @return {BaseComponent} - The created component instance.
     */

  }, {
    key: 'addComponent',
    value: function addComponent(component, element, data, before, noAdd) {
      element = element || this.getContainer();
      data = data || this.data;
      var comp = this.createComponent(component, this.options, data, before ? before.component : null);
      if (noAdd) {
        return comp;
      }
      this.setHidden(comp);
      element = this.hook('addComponent', element, comp, this);
      var compElement = comp.getElement();
      if (!compElement) {
        console.warn('Component ' + component.key + ' has no element.');
        return comp;
      }
      if (before) {
        element.insertBefore(compElement, before);
      } else {
        element.appendChild(compElement);
      }
      return comp;
    }

    /**
     * Remove a component from the components array.
     *
     * @param {BaseComponent} component - The component to remove from the components.
     * @param {Array<BaseComponent>} components - An array of components to remove this component from.
     */

  }, {
    key: 'removeComponent',
    value: function removeComponent(component, components) {
      components = components || this.components;
      component.destroy();
      var element = component.getElement();
      if (element && element.parentNode) {
        this.removeChildFrom(element, element.parentNode);
      }
      _lodash2.default.remove(components, { id: component.id });
    }

    /**
     * Removes a component provided the API key of that component.
     *
     * @param {string} key - The API key of the component to remove.
     * @param {function} fn - Called once the component is removed.
     * @return {null}
     */

  }, {
    key: 'removeComponentByKey',
    value: function removeComponentByKey(key, fn) {
      var _this2 = this;

      var comp = this.getComponent(key, function (component, components) {
        _this2.removeComponent(component, components);
        if (fn) {
          fn(component, components);
        }
      });
      if (!comp) {
        if (fn) {
          fn(null);
        }
        return null;
      }
    }

    /**
     * Removes a component provided the Id of the component.
     *
     * @param {string} id - The Id of the component to remove.
     * @param {function} fn - Called when the component is removed.
     * @return {null}
     */

  }, {
    key: 'removeComponentById',
    value: function removeComponentById(id, fn) {
      var _this3 = this;

      var comp = this.getComponentById(id, function (component, components) {
        _this3.removeComponent(component, components);
        if (fn) {
          fn(component, components);
        }
      });
      if (!comp) {
        if (fn) {
          fn(null);
        }
        return null;
      }
    }
  }, {
    key: 'addComponents',


    /**
     *
     * @param element
     * @param data
     */
    value: function addComponents(element, data, options) {
      var _this4 = this;

      element = element || this.getContainer();
      data = data || this.data;
      options = options || this.options;

      if (options.components) {
        this.components = options.components;
      } else {
        var components = this.hook('addComponents', this.componentComponents, this) || [];
        components.forEach(function (component) {
          return _this4.addComponent(component, element, data);
        });
      }
    }
  }, {
    key: 'updateValue',
    value: function updateValue(flags) {
      return this.components.reduce(function (changed, comp) {
        return comp.updateValue(flags) || changed;
      }, false);
    }
  }, {
    key: 'hasChanged',
    value: function hasChanged() {
      return false;
    }

    /**
     * A more performant way to check the conditions, calculations, and validity of
     * a submission once it has been changed.
     *
     * @param data
     * @param flags
     */

  }, {
    key: 'checkData',
    value: function checkData(data, flags) {
      flags = flags || {};
      var valid = true;
      if (flags.noCheck) {
        return;
      }

      // Update the value.
      var changed = this.updateValue({
        noUpdateEvent: true
      });

      // Iterate through all components and check conditions, and calculate values.
      this.getComponents().forEach(function (comp) {
        changed |= comp.calculateValue(data, {
          noUpdateEvent: true
        });
        comp.checkConditions(data);
        if (!flags.noValidate) {
          valid &= comp.checkValidity(data);
        }
      });

      // Trigger the change if the values changed.
      if (changed) {
        this.triggerChange(flags);
      }

      // Return if the value is valid.
      return valid;
    }
  }, {
    key: 'checkConditions',
    value: function checkConditions(data) {
      this.getComponents().forEach(function (comp) {
        return comp.checkConditions(data);
      });
      return _get(NestedComponent.prototype.__proto__ || Object.getPrototypeOf(NestedComponent.prototype), 'checkConditions', this).call(this, data);
    }
  }, {
    key: 'clearOnHide',
    value: function clearOnHide(show) {
      _get(NestedComponent.prototype.__proto__ || Object.getPrototypeOf(NestedComponent.prototype), 'clearOnHide', this).call(this, show);
      this.getComponents().forEach(function (component) {
        return component.clearOnHide(show);
      });
    }
  }, {
    key: 'show',
    value: function show(_show) {
      var shown = _get(NestedComponent.prototype.__proto__ || Object.getPrototypeOf(NestedComponent.prototype), 'show', this).call(this, _show);
      var forceShow = this.options.show && this.options.show[this.component.key];
      var forceHide = this.options.hide && this.options.hide[this.component.key];

      if (forceShow || forceHide) {
        this.getComponents().forEach(function (component) {
          if (forceShow) {
            component.show(true);
          } else if (forceHide) {
            component.show(false);
          }
        });
      }
      return shown;
    }

    /**
     * Allow components to hook into the next page trigger to perform their own logic.
     *
     * @return {*}
     */

  }, {
    key: 'beforeNext',
    value: function beforeNext() {
      return _nativePromiseOnly2.default.all(this.getComponents().map(function (comp) {
        return comp.beforeNext();
      }));
    }

    /**
     * Allow components to hook into the submission to provide their own async data.
     *
     * @return {*}
     */

  }, {
    key: 'beforeSubmit',
    value: function beforeSubmit() {
      return _nativePromiseOnly2.default.all(this.getComponents().map(function (comp) {
        return comp.beforeSubmit();
      }));
    }
  }, {
    key: 'calculateValue',
    value: function calculateValue(data, flags) {
      return this.getComponents().reduce(function (changed, comp) {
        return comp.calculateValue(data, flags) || changed;
      }, _get(NestedComponent.prototype.__proto__ || Object.getPrototypeOf(NestedComponent.prototype), 'calculateValue', this).call(this, data, flags));
    }
  }, {
    key: 'isValid',
    value: function isValid(data, dirty) {
      return this.getComponents().reduce(function (valid, comp) {
        return comp.isValid(data, dirty) && valid;
      }, _get(NestedComponent.prototype.__proto__ || Object.getPrototypeOf(NestedComponent.prototype), 'isValid', this).call(this, data, dirty));
    }
  }, {
    key: 'checkValidity',
    value: function checkValidity(data, dirty) {
      if (!(0, _utils.checkCondition)(this.component, data, this.data, this.root ? this.root._form : {}, this)) {
        this.setCustomValidity('');
        return true;
      }

      return this.getComponents().reduce(function (check, comp) {
        return comp.checkValidity(data, dirty) && check;
      }, _get(NestedComponent.prototype.__proto__ || Object.getPrototypeOf(NestedComponent.prototype), 'checkValidity', this).call(this, data, dirty));
    }
  }, {
    key: 'setPristine',
    value: function setPristine(pristine) {
      _get(NestedComponent.prototype.__proto__ || Object.getPrototypeOf(NestedComponent.prototype), 'setPristine', this).call(this, pristine);
      this.getComponents().forEach(function (comp) {
        return comp.setPristine(pristine);
      });
    }
  }, {
    key: 'destroy',
    value: function destroy(all) {
      _get(NestedComponent.prototype.__proto__ || Object.getPrototypeOf(NestedComponent.prototype), 'destroy', this).call(this, all);
      this.destroyComponents();
    }
  }, {
    key: 'destroyComponents',
    value: function destroyComponents() {
      var _this5 = this;

      var components = this.components.slice();
      components.forEach(function (comp) {
        return _this5.removeComponent(comp, _this5.components);
      });
      this.components = [];
      this.hidden = [];
    }
  }, {
    key: 'setHidden',
    value: function setHidden(component) {
      if (component.components && component.components.length) {
        component.hideComponents(this.hidden);
      } else if (component.component.hidden) {
        component.visible = false;
      } else if (this.hidden && this.hidden.indexOf(component.key) !== -1) {
        component.visible = false;
      } else if (!component.conditionallyVisible()) {
        component.visible = false;
      }
    }
  }, {
    key: 'hideComponents',
    value: function hideComponents(hidden) {
      var _this6 = this;

      this.hidden = hidden;
      this.eachComponent(function (component) {
        return _this6.setHidden(component);
      });
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      return this.data;
    }
  }, {
    key: 'resetValue',
    value: function resetValue() {
      this.getComponents().forEach(function (comp) {
        return comp.resetValue();
      });
      _lodash2.default.unset(this.data, this.key);
      this.setPristine(true);
    }
  }, {
    key: 'setNestedValue',
    value: function setNestedValue(component, value, flags, changed) {
      if (component.type === 'button') {
        return false;
      }

      if (component.type === 'components') {
        return component.setValue(value, flags, value) || changed;
      } else if (value && component.hasValue(value)) {
        return component.setValue(_lodash2.default.get(value, component.key), flags, value) || changed;
      } else {
        flags.noValidate = true;
        return component.setValue(component.defaultValue, flags, value) || changed;
      }
    }
  }, {
    key: 'setValue',
    value: function setValue(value, flags) {
      var _this7 = this;

      if (!value) {
        return false;
      }
      flags = this.getFlags.apply(this, arguments);
      return this.getComponents().reduce(function (changed, component) {
        return _this7.setNestedValue(component, value, flags, changed);
      }, false);
    }
  }, {
    key: 'setCollapseHeader',
    value: function setCollapseHeader(header) {
      var _this8 = this;

      if (this.component.collapsible) {
        this.addClass(header, 'formio-clickable');
        this.addEventListener(header, 'click', function () {
          return _this8.toggleCollapse();
        });
      }
    }
  }, {
    key: 'setCollapsed',
    value: function setCollapsed(element) {
      if (!this.component.collapsible) {
        return;
      }

      var container = element || this.getContainer();

      if (this.collapsed) {
        container.setAttribute('hidden', true);
        container.style.visibility = 'hidden';
      } else {
        container.removeAttribute('hidden');
        container.style.visibility = 'visible';
      }
    }
  }, {
    key: 'toggleCollapse',
    value: function toggleCollapse() {
      this.collapsed = !this.collapsed;
      this.setCollapsed();
    }
  }, {
    key: 'defaultSchema',
    get: function get() {
      return NestedComponent.schema();
    }
  }, {
    key: 'schema',
    get: function get() {
      var schema = _get(NestedComponent.prototype.__proto__ || Object.getPrototypeOf(NestedComponent.prototype), 'schema', this);
      schema.components = [];
      this.eachComponent(function (component) {
        return schema.components.push(component.schema);
      });
      return schema;
    }
  }, {
    key: 'componentComponents',
    get: function get() {
      return this.component.components;
    }
  }, {
    key: 'disabled',
    set: function set(disabled) {
      this.components.forEach(function (component) {
        return component.disabled = disabled;
      });
    }
  }, {
    key: 'errors',
    get: function get() {
      return this.getAllComponents().reduce(function (errors, comp) {
        return errors.concat(comp.errors || []);
      }, []);
    }
  }, {
    key: 'dataReady',
    get: function get() {
      return _nativePromiseOnly2.default.all(this.getComponents().map(function (component) {
        return component.dataReady;
      }));
    }
  }]);

  return NestedComponent;
}(_Base2.default);

exports.default = NestedComponent;