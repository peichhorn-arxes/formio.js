'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _WebformBuilder2 = require('./WebformBuilder');

var _WebformBuilder3 = _interopRequireDefault(_WebformBuilder2);

var _utils = require('./utils/utils');

var _PDF = require('./PDF');

var _PDF2 = _interopRequireDefault(_PDF);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PDFBuilder = function (_WebformBuilder) {
  _inherits(PDFBuilder, _WebformBuilder);

  function PDFBuilder() {
    _classCallCheck(this, PDFBuilder);

    return _possibleConstructorReturn(this, (PDFBuilder.__proto__ || Object.getPrototypeOf(PDFBuilder)).apply(this, arguments));
  }

  _createClass(PDFBuilder, [{
    key: 'addDropZone',
    value: function addDropZone() {
      var _this2 = this;

      if (!this.dropZone) {
        this.dropZone = this.ce('div', {
          class: 'formio-drop-zone'
        });
        this.prepend(this.dropZone);
      }
      this.addEventListener(this.dropZone, 'dragover', function (event) {
        event.preventDefault();
        return false;
      });
      this.addEventListener(this.dropZone, 'drop', function (event) {
        event.preventDefault();
        _this2.dragStop(event);
        return false;
      });
      this.disableDropZone();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      return this.onElement.then(function () {
        _this3.clear();
        _this3.build();
        _this3.isBuilt = true;
        _this3.on('resetForm', function () {
          return _this3.resetValue();
        });
        _this3.on('refreshData', function () {
          return _this3.updateValue();
        });
        setTimeout(function () {
          _this3.onChange();
          _this3.emit('render');
        }, 1);
      });
    }
  }, {
    key: 'enableDropZone',
    value: function enableDropZone() {
      if (this.dropZone) {
        var iframeRect = (0, _utils.getElementRect)(this.pdfForm.element);
        this.dropZone.style.height = iframeRect && iframeRect.height ? iframeRect.height + 'px' : '1000px';
        this.dropZone.style.width = iframeRect && iframeRect.width ? iframeRect.width + 'px' : '100%';
        this.addClass(this.dropZone, 'enabled');
      }
    }
  }, {
    key: 'disableDropZone',
    value: function disableDropZone() {
      if (this.dropZone) {
        this.removeClass(this.dropZone, 'enabled');
      }
    }
  }, {
    key: 'addComponentTo',
    value: function addComponentTo(parent, schema, element, sibling) {
      var comp = _get(PDFBuilder.prototype.__proto__ || Object.getPrototypeOf(PDFBuilder.prototype), 'addComponentTo', this).call(this, parent, schema, element, sibling);
      comp.isNew = true;
      if (this.pdfForm && schema.overlay) {
        this.pdfForm.postMessage({ name: 'addElement', data: schema });
      }
      return comp;
    }
  }, {
    key: 'addComponent',
    value: function addComponent(component, element, data, before) {
      return _get(PDFBuilder.prototype.__proto__ || Object.getPrototypeOf(PDFBuilder.prototype), 'addComponent', this).call(this, component, element, data, before, true);
    }
  }, {
    key: 'deleteComponent',
    value: function deleteComponent(component) {
      if (this.pdfForm && component.component) {
        this.pdfForm.postMessage({ name: 'removeElement', data: component.component });
      }
      return _get(PDFBuilder.prototype.__proto__ || Object.getPrototypeOf(PDFBuilder.prototype), 'deleteComponent', this).call(this, component);
    }
  }, {
    key: 'dragStart',
    value: function dragStart(event, component) {
      event.stopPropagation();
      event.dataTransfer.setData('text/plain', 'true');
      this.currentComponent = component;
      this.enableDropZone();
    }
  }, {
    key: 'removeEventListeners',
    value: function removeEventListeners(all) {
      var _this4 = this;

      _get(PDFBuilder.prototype.__proto__ || Object.getPrototypeOf(PDFBuilder.prototype), 'removeEventListeners', this).call(this, all);
      _lodash2.default.each(this.groups, function (group) {
        _lodash2.default.each(group.components, function (builderComponent) {
          _this4.removeEventListener(builderComponent, 'dragstart');
          _this4.removeEventListener(builderComponent, 'dragend');
        });
      });
    }
  }, {
    key: 'clear',
    value: function clear() {
      this.destroy();
    }
  }, {
    key: 'redraw',
    value: function redraw() {
      if (this.pdfForm) {
        this.pdfForm.postMessage({ name: 'redraw' });
      }
    }
  }, {
    key: 'dragStop',
    value: function dragStop(event) {
      var schema = this.currentComponent ? this.currentComponent.schema : null;
      if (!schema) {
        return false;
      }

      schema.overlay = {
        top: event.offsetY,
        left: event.offsetX,
        width: 100,
        height: 20
      };

      this.addComponentTo(this, schema, this.getContainer());
      this.disableDropZone();
      return false;
    }

    // Don't need to add a submit button here... the pdfForm will already do this.

  }, {
    key: 'addSubmitButton',
    value: function addSubmitButton() {}
  }, {
    key: 'addBuilderComponent',
    value: function addBuilderComponent(component, group) {
      var _this5 = this;

      var builderComponent = _get(PDFBuilder.prototype.__proto__ || Object.getPrototypeOf(PDFBuilder.prototype), 'addBuilderComponent', this).call(this, component, group);
      if (builderComponent) {
        builderComponent.element.draggable = true;
        builderComponent.element.setAttribute('draggable', true);
        this.addEventListener(builderComponent.element, 'dragstart', function (event) {
          return _this5.dragStart(event, component);
        }, true);
        this.addEventListener(builderComponent.element, 'dragend', function () {
          return _this5.disableDropZone();
        }, true);
      }
      return builderComponent;
    }
  }, {
    key: 'refreshDraggable',
    value: function refreshDraggable() {
      this.addSubmitButton();
      this.builderReadyResolve();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.removeEventListeners();
      this.destroyComponents();
    }
  }, {
    key: 'build',
    value: function build() {
      var _this6 = this;

      this.buildSidebar();
      if (!this.pdfForm) {
        this.element.noDrop = true;
        this.pdfForm = new _PDF2.default(this.element, this.options);
        this.addClass(this.pdfForm.element, 'formio-pdf-builder');
      }
      this.pdfForm.removeEventListeners(true);
      this.pdfForm.events.removeAllListeners();
      this.pdfForm.destroyComponents();
      this.pdfForm.on('iframe-elementUpdate', function (schema) {
        var component = _this6.getComponentById(schema.id);
        if (component && component.component) {
          component.component.overlay = {
            page: schema.page,
            left: schema.left,
            top: schema.top,
            height: schema.height,
            width: schema.width
          };
          _this6.editComponent(component);
          _this6.emit('updateComponent', component);
        }
        return component;
      });
      this.pdfForm.on('iframe-componentUpdate', function (schema) {
        var component = _this6.getComponentById(schema.id);
        if (component && component.component) {
          component.component.overlay = {
            page: schema.overlay.page,
            left: schema.overlay.left,
            top: schema.overlay.top,
            height: schema.overlay.height,
            width: schema.overlay.width
          };
          _this6.emit('updateComponent', component);
        }
        return component;
      });
      this.pdfForm.on('iframe-componentClick', function (schema) {
        var component = _this6.getComponentById(schema.id);
        if (component) {
          _this6.editComponent(component);
        }
      });
      this.addComponents();
      this.addDropZone();
      this.updateDraggable();
      this.formReadyResolve();
    }
  }, {
    key: 'setForm',
    value: function setForm(form) {
      var _this7 = this;

      return _get(PDFBuilder.prototype.__proto__ || Object.getPrototypeOf(PDFBuilder.prototype), 'setForm', this).call(this, form).then(function () {
        return _this7.ready.then(function () {
          if (_this7.pdfForm) {
            _this7.pdfForm.postMessage({ name: 'form', data: form });
            return _this7.pdfForm.setForm(form);
          }
          return form;
        });
      });
    }
  }, {
    key: 'defaultComponents',
    get: function get() {
      return {
        pdf: {
          title: 'PDF Fields',
          weight: 0,
          default: true,
          components: {
            textfield: true,
            number: true,
            password: true,
            email: true,
            phoneNumber: true,
            currency: true,
            checkbox: true,
            signature: true,
            select: true,
            textarea: true,
            datetime: true
          }
        },
        basic: false,
        advanced: false,
        layout: false,
        data: false,
        premium: false,
        resource: false
      };
    }
  }]);

  return PDFBuilder;
}(_WebformBuilder3.default);

exports.default = PDFBuilder;