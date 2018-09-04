'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jsonLogic = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.evaluate = evaluate;
exports.getRandomComponentId = getRandomComponentId;
exports.getPropertyValue = getPropertyValue;
exports.getElementRect = getElementRect;
exports.boolValue = boolValue;
exports.isMongoId = isMongoId;
exports.isLayoutComponent = isLayoutComponent;
exports.eachComponent = eachComponent;
exports.matchComponent = matchComponent;
exports.getComponent = getComponent;
exports.findComponents = findComponents;
exports.flattenComponents = flattenComponents;
exports.hasCondition = hasCondition;
exports.parseFloatExt = parseFloatExt;
exports.formatAsCurrency = formatAsCurrency;
exports.escapeRegExCharacters = escapeRegExCharacters;
exports.checkCalculated = checkCalculated;
exports.checkSimpleConditional = checkSimpleConditional;
exports.checkCustomConditional = checkCustomConditional;
exports.checkJsonConditional = checkJsonConditional;
exports.checkCondition = checkCondition;
exports.checkTrigger = checkTrigger;
exports.setActionProperty = setActionProperty;
exports.getValue = getValue;
exports.interpolate = interpolate;
exports.uniqueName = uniqueName;
exports.guid = guid;
exports.getDateSetting = getDateSetting;
exports.isValidDate = isValidDate;
exports.currentTimezone = currentTimezone;
exports.offsetDate = offsetDate;
exports.loadZones = loadZones;
exports.timezoneText = timezoneText;
exports.formatDate = formatDate;
exports.formatOffset = formatOffset;
exports.getLocaleDateFormatInfo = getLocaleDateFormatInfo;
exports.convertFormatToFlatpickr = convertFormatToFlatpickr;
exports.convertFormatToMoment = convertFormatToMoment;
exports.convertFormatToMask = convertFormatToMask;
exports.getInputMask = getInputMask;
exports.matchInputMask = matchInputMask;
exports.getNumberSeparators = getNumberSeparators;
exports.getNumberDecimalLimit = getNumberDecimalLimit;
exports.getCurrencyAffixes = getCurrencyAffixes;
exports.fieldData = fieldData;
exports.delay = delay;
exports.iterateKey = iterateKey;
exports.uniqueKey = uniqueKey;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

require('whatwg-fetch');

var _jsonLogicJs = require('json-logic-js');

var _jsonLogicJs2 = _interopRequireDefault(_jsonLogicJs);

var _momentTimezone = require('moment-timezone/moment-timezone');

var _momentTimezone2 = _interopRequireDefault(_momentTimezone);

var _jstimezonedetect = require('jstimezonedetect');

var _jstimezonedetect2 = _interopRequireDefault(_jstimezonedetect);

var _operators = require('./jsonlogic/operators');

var _nativePromiseOnly = require('native-promise-only');

var _nativePromiseOnly2 = _interopRequireDefault(_nativePromiseOnly);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// Configure JsonLogic
_operators.lodashOperators.forEach(function (name) {
  return _jsonLogicJs2.default.add_operation('_' + name, _lodash2.default[name]);
});

// Retrieve Any Date
_jsonLogicJs2.default.add_operation('getDate', function (date) {
  return (0, _momentTimezone2.default)(date).toISOString();
});

// Set Relative Minimum Date
_jsonLogicJs2.default.add_operation('relativeMinDate', function (relativeMinDate) {
  return (0, _momentTimezone2.default)().subtract(relativeMinDate, 'days').toISOString();
});

// Set Relative Maximum Date
_jsonLogicJs2.default.add_operation('relativeMaxDate', function (relativeMaxDate) {
  return (0, _momentTimezone2.default)().add(relativeMaxDate, 'days').toISOString();
});

exports.jsonLogic = _jsonLogicJs2.default;

/**
 * Evaluate a method.
 *
 * @param func
 * @param args
 * @return {*}
 */

function evaluate(func, args, ret, tokenize) {
  var returnVal = null;
  var component = args.component ? args.component : { key: 'unknown' };
  if (!args.form && args.instance) {
    args.form = _lodash2.default.get(args.instance, 'root._form', {});
  }
  if (typeof func === 'string') {
    if (ret) {
      func += ';return ' + ret;
    }
    var params = _lodash2.default.keys(args);

    if (tokenize) {
      // Replace all {{ }} references with actual data.
      func = func.replace(/({{\s+(.*)\s+}})/, function (match, $1, $2) {
        if ($2.indexOf('data.') === 0) {
          return _lodash2.default.get(args.data, $2.replace('data.', ''));
        } else if ($2.indexOf('row.') === 0) {
          return _lodash2.default.get(args.row, $2.replace('row.', ''));
        }

        // Support legacy...
        return _lodash2.default.get(args.data, $2);
      });
    }

    try {
      func = new (Function.prototype.bind.apply(Function, [null].concat(_toConsumableArray(params), [func])))();
      args = _lodash2.default.values(args);
    } catch (err) {
      console.warn('An error occured within the custom function for ' + component.key, err);
      returnVal = null;
      func = false;
    }
  }
  if (typeof func === 'function') {
    try {
      returnVal = Array.isArray(args) ? func.apply(undefined, _toConsumableArray(args)) : func(args);
    } catch (err) {
      returnVal = null;
      console.warn('An error occured within custom function for ' + component.key, err);
    }
  } else if ((typeof func === 'undefined' ? 'undefined' : _typeof(func)) === 'object') {
    try {
      returnVal = _jsonLogicJs2.default.apply(func, args);
    } catch (err) {
      returnVal = null;
      console.warn('An error occured within custom function for ' + component.key, err);
    }
  } else if (func) {
    console.warn('Unknown function type for ' + component.key);
  }
  return returnVal;
}

function getRandomComponentId() {
  return 'e' + Math.random().toString(36).substring(7);
}

/**
 * Get a property value of an element.
 *
 * @param style
 * @param prop
 * @return {number}
 */
function getPropertyValue(style, prop) {
  var value = style.getPropertyValue(prop);
  value = value ? value.replace(/[^0-9.]/g, '') : '0';
  return parseFloat(value);
}

/**
 * Get an elements bounding rectagle.
 *
 * @param element
 * @return {{x: string, y: string, width: string, height: string}}
 */
function getElementRect(element) {
  var style = window.getComputedStyle(element, null);
  return {
    x: getPropertyValue(style, 'left'),
    y: getPropertyValue(style, 'top'),
    width: getPropertyValue(style, 'width'),
    height: getPropertyValue(style, 'height')
  };
}

/**
 * Determines the boolean value of a setting.
 *
 * @param value
 * @return {boolean}
 */
function boolValue(value) {
  if (_lodash2.default.isBoolean(value)) {
    return value;
  } else if (_lodash2.default.isString(value)) {
    return value.toLowerCase() === 'true';
  } else {
    return !!value;
  }
}

/**
 * Check to see if an ID is a mongoID.
 * @param text
 * @return {Array|{index: number, input: string}|Boolean|*}
 */
function isMongoId(text) {
  return text.toString().match(/^[0-9a-fA-F]{24}$/);
}

/**
 * Determine if a component is a layout component or not.
 *
 * @param {Object} component
 *   The component to check.
 *
 * @returns {Boolean}
 *   Whether or not the component is a layout component.
 */
function isLayoutComponent(component) {
  return Boolean(component.columns && Array.isArray(component.columns) || component.rows && Array.isArray(component.rows) || component.components && Array.isArray(component.components));
}

/**
 * Iterate through each component within a form.
 *
 * @param {Object} components
 *   The components to iterate.
 * @param {Function} fn
 *   The iteration function to invoke for each component.
 * @param {Boolean} includeAll
 *   Whether or not to include layout components.
 * @param {String} path
 *   The current data path of the element. Example: data.user.firstName
 * @param {Object} parent
 *   The parent object.
 */
function eachComponent(components, fn, includeAll, path, parent) {
  if (!components) return;
  path = path || '';
  components.forEach(function (component) {
    if (!component) {
      return;
    }
    var hasColumns = component.columns && Array.isArray(component.columns);
    var hasRows = component.rows && Array.isArray(component.rows);
    var hasComps = component.components && Array.isArray(component.components);
    var noRecurse = false;
    var newPath = component.key ? path ? path + '.' + component.key : component.key : '';

    // Keep track of parent references.
    if (parent) {
      // Ensure we don't create infinite JSON structures.
      component.parent = _lodash2.default.clone(parent);
      delete component.parent.components;
      delete component.parent.componentMap;
      delete component.parent.columns;
      delete component.parent.rows;
    }

    if (includeAll || component.tree || !hasColumns && !hasRows && !hasComps) {
      noRecurse = fn(component, newPath);
    }

    var subPath = function subPath() {
      if (component.key && !(['panel', 'table', 'well', 'columns', 'fieldset', 'tabs', 'form'].indexOf(component.type) !== -1) && (['datagrid', 'container', 'editgrid'].indexOf(component.type) !== -1 || component.tree)) {
        return newPath;
      } else if (component.key && component.type === 'form') {
        return newPath + '.data';
      }
      return path;
    };

    if (!noRecurse) {
      if (hasColumns) {
        component.columns.forEach(function (column) {
          return eachComponent(column.components, fn, includeAll, subPath(), parent ? component : null);
        });
      } else if (hasRows) {
        component.rows.forEach(function (row) {
          if (Array.isArray(row)) {
            row.forEach(function (column) {
              return eachComponent(column.components, fn, includeAll, subPath(), parent ? component : null);
            });
          }
        });
      } else if (hasComps) {
        eachComponent(component.components, fn, includeAll, subPath(), parent ? component : null);
      }
    }
  });
}

/**
 * Matches if a component matches the query.
 *
 * @param component
 * @param query
 * @return {boolean}
 */
function matchComponent(component, query) {
  if (_lodash2.default.isString(query)) {
    return component.key === query;
  } else {
    var matches = false;
    _lodash2.default.forOwn(query, function (value, key) {
      matches = _lodash2.default.get(component, key) === value;
      if (!matches) {
        return false;
      }
    });
    return matches;
  }
}

/**
 * Get a component by its key
 *
 * @param {Object} components
 *   The components to iterate.
 * @param {String|Object} key
 *   The key of the component to get, or a query of the component to search.
 *
 * @returns {Object}
 *   The component that matches the given key, or undefined if not found.
 */
function getComponent(components, key, includeAll) {
  var result = void 0;
  eachComponent(components, function (component, path) {
    if (path === key) {
      component.path = path;
      result = component;
      return true;
    }
  }, includeAll);
  return result;
}

/**
 * Finds a component provided a query of properties of that component.
 *
 * @param components
 * @param query
 * @return {*}
 */
function findComponents(components, query) {
  var results = [];
  eachComponent(components, function (component, path) {
    if (matchComponent(component, query)) {
      component.path = path;
      results.push(component);
    }
  }, true);
  return results;
}

/**
 * Flatten the form components for data manipulation.
 *
 * @param {Object} components
 *   The components to iterate.
 * @param {Boolean} includeAll
 *   Whether or not to include layout components.
 *
 * @returns {Object}
 *   The flattened components map.
 */
function flattenComponents(components, includeAll) {
  var flattened = {};
  eachComponent(components, function (component, path) {
    flattened[path] = component;
  }, includeAll);
  return flattened;
}

/**
 * Returns if this component has a conditional statement.
 *
 * @param component - The component JSON schema.
 *
 * @returns {boolean} - TRUE - This component has a conditional, FALSE - No conditional provided.
 */
function hasCondition(component) {
  return Boolean(component.customConditional || component.conditional && component.conditional.when || component.conditional && component.conditional.json);
}

/**
 * Extension of standard #parseFloat(value) function, that also clears input string.
 *
 * @param {any} value
 *   The value to parse.
 *
 * @returns {Number}
 *   Parsed value.
 */
function parseFloatExt(value) {
  return parseFloat(_lodash2.default.isString(value) ? value.replace(/[^\de.+-]/gi, '') : value);
}

/**
 * Formats provided value in way how Currency component uses it.
 *
 * @param {any} value
 *   The value to format.
 *
 * @returns {String}
 *   Value formatted for Currency component.
 */
function formatAsCurrency(value) {
  var parsedValue = parseFloatExt(value);

  if (_lodash2.default.isNaN(parsedValue)) {
    return '';
  }

  var parts = _lodash2.default.round(parsedValue, 2).toString().split('.');
  parts[0] = _lodash2.default.chunk(Array.from(parts[0]).reverse(), 3).reverse().map(function (part) {
    return part.reverse().join('');
  }).join(',');
  parts[1] = _lodash2.default.pad(parts[1], 2, '0');
  return parts.join('.');
}

/**
 * Escapes RegEx characters in provided String value.
 *
 * @param {String} value
 *   String for escaping RegEx characters.
 * @returns {string}
 *   String with escaped RegEx characters.
 */
function escapeRegExCharacters(value) {
  return value.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
}

/**
 * Checks the calculated value for a provided component and data.
 *
 * @param {Object} component
 *   The component to check for the calculated value.
 * @param {Object} submission
 *   A submission object.
 * @param data
 *   The full submission data.
 */
function checkCalculated(component, submission, rowData) {
  // Process calculated value stuff if present.
  if (component.calculateValue) {
    _lodash2.default.set(rowData, component.key, evaluate(component.calculateValue, {
      value: undefined,
      data: submission ? submission.data : rowData,
      row: rowData,
      util: this,
      component: component
    }, 'value'));
  }
}

/**
 * Check if a simple conditional evaluates to true.
 *
 * @param condition
 * @param condition
 * @param row
 * @param data
 * @returns {boolean}
 */
function checkSimpleConditional(component, condition, row, data) {
  var value = null;
  if (row) {
    value = getValue({ data: row }, condition.when);
  }
  if (data && _lodash2.default.isNil(value)) {
    value = getValue({ data: data }, condition.when);
  }
  // FOR-400 - Fix issue where falsey values were being evaluated as show=true
  if (_lodash2.default.isNil(value)) {
    value = '';
  }

  var eq = String(condition.eq);
  var show = String(condition.show);

  // Special check for selectboxes component.
  if (_lodash2.default.isObject(value) && _lodash2.default.has(value, condition.eq)) {
    return String(value[condition.eq]) === show;
  }
  // FOR-179 - Check for multiple values.
  if (Array.isArray(value) && value.map(String).indexOf(eq) !== -1) {
    return show === 'true';
  }

  return String(value) === eq === (show === 'true');
}

/**
 * Check custom javascript conditional.
 *
 * @param component
 * @param custom
 * @param row
 * @param data
 * @returns {*}
 */
function checkCustomConditional(component, custom, row, data, form, variable, onError, instance) {
  if (typeof custom === 'string') {
    custom = 'var ' + variable + ' = true; ' + custom + '; return ' + variable + ';';
  }
  var value = instance && instance.evaluate ? instance.evaluate(custom) : evaluate(custom, { row: row, data: data, form: form });
  if (value === null) {
    return onError;
  }
  return value;
}

function checkJsonConditional(component, json, row, data, form, onError) {
  try {
    return _jsonLogicJs2.default.apply(json, {
      data: data,
      row: row,
      form: form,
      _: _lodash2.default
    });
  } catch (err) {
    console.warn('An error occurred in jsonLogic advanced condition for ' + component.key, err);
    return onError;
  }
}

/**
 * Checks the conditions for a provided component and data.
 *
 * @param component
 *   The component to check for the condition.
 * @param row
 *   The data within a row
 * @param data
 *   The full submission data.
 *
 * @returns {boolean}
 */
function checkCondition(component, row, data, form, instance) {
  if (component.customConditional) {
    return checkCustomConditional(component, component.customConditional, row, data, form, 'show', true, instance);
  } else if (component.conditional && component.conditional.when) {
    return checkSimpleConditional(component, component.conditional, row, data, true);
  } else if (component.conditional && component.conditional.json) {
    return checkJsonConditional(component, component.conditional.json, row, data, form, instance);
  }

  // Default to show.
  return true;
}

/**
 * Test a trigger on a component.
 *
 * @param component
 * @param action
 * @param data
 * @param row
 * @returns {mixed}
 */
function checkTrigger(component, trigger, row, data, form, instance) {
  switch (trigger.type) {
    case 'simple':
      return checkSimpleConditional(component, trigger.simple, row, data);
    case 'javascript':
      return checkCustomConditional(component, trigger.javascript, row, data, form, 'result', false, instance);
    case 'json':
      return checkJsonConditional(component, trigger.json, row, data, form, false);
  }
  // If none of the types matched, don't fire the trigger.
  return false;
}

function setActionProperty(component, action, row, data, result, instance) {
  switch (action.property.type) {
    case 'boolean':
      if (_lodash2.default.get(component, action.property.value, false).toString() !== action.state.toString()) {
        _lodash2.default.set(component, action.property.value, action.state.toString() === 'true');
      }
      break;
    case 'string':
      {
        var evalData = {
          data: data,
          row: row,
          component: component,
          result: result
        };
        var newValue = instance && instance.interpolate ? instance.interpolate(action.text, evalData) : interpolate(action.text, evalData);
        if (newValue !== _lodash2.default.get(component, action.property.value, '')) {
          _lodash2.default.set(component, action.property.value, newValue);
        }
        break;
      }
  }
  return component;
}

/**
 * Get the value for a component key, in the given submission.
 *
 * @param {Object} submission
 *   A submission object to search.
 * @param {String} key
 *   A for components API key to search for.
 */
function getValue(submission, key) {
  var search = function search(data) {
    if (_lodash2.default.isPlainObject(data)) {
      if (_lodash2.default.has(data, key)) {
        return data[key];
      }

      var value = null;

      _lodash2.default.forOwn(data, function (prop) {
        var result = search(prop);
        if (!_lodash2.default.isNil(result)) {
          value = result;
          return false;
        }
      });

      return value;
    } else {
      return null;
    }
  };

  return search(submission.data);
}

/**
 * Interpolate a string and add data replacements.
 *
 * @param string
 * @param data
 * @returns {XML|string|*|void}
 */
function interpolate(string, data) {
  var templateSettings = {
    evaluate: /\{%(.+?)%\}/g,
    interpolate: /\{\{(.+?)\}\}/g,
    escape: /\{\{\{(.+?)\}\}\}/g
  };
  try {
    return _lodash2.default.template(string, templateSettings)(data);
  } catch (err) {
    console.warn('Error interpolating template', err, string, data);
  }
}

/**
 * Make a filename guaranteed to be unique.
 * @param name
 * @returns {string}
 */
function uniqueName(name) {
  var parts = name.toLowerCase().replace(/[^0-9a-z.]/g, '').split('.');
  var fileName = parts[0];
  var ext = parts.length > 1 ? '.' + _lodash2.default.last(parts) : '';
  return fileName.substr(0, 10) + '-' + guid() + ext;
}

function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
}

/**
 * Return a translated date setting.
 *
 * @param date
 * @return {*}
 */
function getDateSetting(date) {
  if (_lodash2.default.isNil(date) || _lodash2.default.isNaN(date) || date === '') {
    return null;
  }

  if (date instanceof Date) {
    return date;
  } else if (typeof date.toDate === 'function') {
    return date.isValid() ? date.toDate() : null;
  }

  var dateSetting = typeof date !== 'string' || date.indexOf('moment(') === -1 ? (0, _momentTimezone2.default)(date) : null;
  if (dateSetting && dateSetting.isValid()) {
    return dateSetting.toDate();
  }

  dateSetting = null;
  try {
    var value = new Function('moment', 'return ' + date + ';')(_momentTimezone2.default);
    if (typeof value === 'string') {
      dateSetting = (0, _momentTimezone2.default)(value);
    } else if (typeof value.toDate === 'function') {
      dateSetting = (0, _momentTimezone2.default)(value.toDate().toUTCString());
    } else if (value instanceof Date) {
      dateSetting = (0, _momentTimezone2.default)(value);
    }
  } catch (e) {
    return null;
  }

  if (!dateSetting) {
    return null;
  }

  // Ensure this is a date.
  if (!dateSetting.isValid()) {
    return null;
  }

  return dateSetting.toDate();
}

function isValidDate(date) {
  return _lodash2.default.isDate(date) && !_lodash2.default.isNaN(date.getDate());
}

/**
 * Get the current timezone string.
 *
 * @return {string}
 */
function currentTimezone() {
  if (_momentTimezone2.default.currentTimezone) {
    return _momentTimezone2.default.currentTimezone;
  }
  _momentTimezone2.default.currentTimezone = _jstimezonedetect2.default.determine().name();
  return _momentTimezone2.default.currentTimezone;
}

/**
 * Get an offset date provided a date object and timezone object.
 *
 * @param date
 * @param timezone
 * @return {Date}
 */
function offsetDate(date, timezone) {
  if (timezone === 'UTC') {
    return {
      date: new Date(date.getTime() + date.getTimezoneOffset() * 60000),
      abbr: 'UTC'
    };
  }
  var dateMoment = (0, _momentTimezone2.default)(date).tz(timezone);
  return {
    date: new Date(date.getTime() + (dateMoment.utcOffset() + date.getTimezoneOffset()) * 60000),
    abbr: dateMoment.format('z')
  };
}

/**
 * Externally load the timezone data.
 *
 * @return {Promise<any> | *}
 */
function loadZones(timezone) {
  if (timezone === currentTimezone()) {
    // Return non-resolving promise.
    return new _nativePromiseOnly2.default(_lodash2.default.noop);
  }
  if (timezone === 'UTC') {
    // Return non-resolving promise.
    return new _nativePromiseOnly2.default(_lodash2.default.noop);
  }

  if (_momentTimezone2.default.zonesPromise) {
    return _momentTimezone2.default.zonesPromise;
  }
  return _momentTimezone2.default.zonesPromise = fetch('https://cdn.rawgit.com/moment/moment-timezone/develop/data/packed/latest.json').then(function (resp) {
    return resp.json().then(function (zones) {
      _momentTimezone2.default.tz.load(zones);
      _momentTimezone2.default.zonesLoaded = true;
    });
  });
}

/**
 * Set the timezone text and replace once timezones have loaded.
 *
 * @param offsetFormat
 * @param stdFormat
 * @return {*}
 */
function timezoneText(offsetFormat, stdFormat) {
  loadZones();
  if (_momentTimezone2.default.zonesLoaded) {
    return offsetFormat();
  }
  var id = getRandomComponentId();
  var tries = 0;
  _momentTimezone2.default.zonesPromise.then(function replaceZone() {
    var element = document.getElementById(id);
    if (element) {
      element.innerHTML = offsetFormat();
    } else if (tries++ < 5) {
      setTimeout(replaceZone, 100);
    }
  });
  // For now just return the current format, and replace once zones are loaded.
  return '<span id=\'' + id + '\'>' + stdFormat() + '</span>';
}

/**
 * Format a date provided a value, format, and timezone object.
 *
 * @param value
 * @param format
 * @param timezone
 * @return {string}
 */
function formatDate(value, format, timezone) {
  var momentDate = (0, _momentTimezone2.default)(value);
  if (timezone === currentTimezone()) {
    // See if our format contains a "z" timezone character.
    if (format.match(/\s(z$|z\s)/)) {
      // Return the timezoneText.
      return timezoneText(function () {
        return momentDate.tz(timezone).format(convertFormatToMoment(format));
      }, function () {
        return momentDate.format(convertFormatToMoment(format.replace(/\s(z$|z\s)/, '')));
      });
    }

    // Return the standard format.
    return momentDate.format(convertFormatToMoment(format));
  }
  if (timezone === 'UTC') {
    var offset = offsetDate(momentDate.toDate(), 'UTC');
    return (0, _momentTimezone2.default)(offset.date).format(convertFormatToMoment(format)) + ' UTC';
  }

  // Return the timezoneText.
  return timezoneText(function () {
    return momentDate.tz(timezone).format(convertFormatToMoment(format) + ' z');
  }, function () {
    return momentDate.format(convertFormatToMoment(format));
  });
}

/**
 * Pass a format function to format within a timezone.
 *
 * @param formatFn
 * @param date
 * @param format
 * @param timezone
 * @return {string}
 */
function formatOffset(formatFn, date, format, timezone) {
  if (timezone === currentTimezone()) {
    return formatFn(date, format);
  }
  if (timezone === 'UTC') {
    return formatFn(offsetDate(date, 'UTC').date, format) + ' UTC';
  }

  // Return the timezone text.
  return timezoneText(function () {
    var offset = offsetDate(date, timezone);
    return formatFn(offset.date, format) + ' ' + offset.abbr;
  }, function () {
    return formatFn(date, format);
  });
}

function getLocaleDateFormatInfo(locale) {
  var formatInfo = {};

  var day = 21;
  var exampleDate = new Date(2017, 11, day);
  var localDateString = exampleDate.toLocaleDateString(locale);

  formatInfo.dayFirst = localDateString.slice(0, 2) === day.toString();

  return formatInfo;
}

/**
 * Convert the format from the angular-datepicker module to flatpickr format.
 * @param format
 * @return {string}
 */
function convertFormatToFlatpickr(format) {
  return format
  // Remove the Z timezone offset, not supported by flatpickr.
  .replace(/Z/g, '')

  // Year conversion.
  .replace(/y/g, 'Y').replace('YYYY', 'Y').replace('YY', 'y')

  // Month conversion.
  .replace('MMMM', 'F').replace(/M/g, 'n').replace('nnn', 'M').replace('nn', 'm')

  // Day in month.
  .replace(/d/g, 'j').replace(/jj/g, 'd')

  // Day in week.
  .replace('EEEE', 'l').replace('EEE', 'D')

  // Hours, minutes, seconds
  .replace('HH', 'H').replace('hh', 'h').replace('mm', 'i').replace('ss', 'S').replace(/a/g, 'K');
}

/**
 * Convert the format from the angular-datepicker module to moment format.
 * @param format
 * @return {string}
 */
function convertFormatToMoment(format) {
  return format
  // Year conversion.
  .replace(/y/g, 'Y')
  // Day in month.
  .replace(/d/g, 'D')
  // Day in week.
  .replace(/E/g, 'd')
  // AM/PM marker
  .replace(/a/g, 'A');
}

function convertFormatToMask(format) {
  return format
  // Short and long month replacement.
  .replace(/(MMM|MMMM)/g, 'MM')
  // Year conversion
  .replace(/[ydhmsHM]/g, '9')
  // AM/PM conversion
  .replace(/a/g, 'AA');
}

/**
 * Returns an input mask that is compatible with the input mask library.
 * @param {string} mask - The Form.io input mask.
 * @returns {Array} - The input mask for the mask library.
 */
function getInputMask(mask) {
  if (mask instanceof Array) {
    return mask;
  }
  var maskArray = [];
  maskArray.numeric = true;
  for (var i = 0; i < mask.length; i++) {
    switch (mask[i]) {
      case '9':
        maskArray.push(/\d/);
        break;
      case 'A':
        maskArray.numeric = false;
        maskArray.push(/[a-zA-Z]/);
        break;
      case 'a':
        maskArray.numeric = false;
        maskArray.push(/[a-z]/);
        break;
      case '*':
        maskArray.numeric = false;
        maskArray.push(/[a-zA-Z0-9]/);
        break;
      default:
        maskArray.push(mask[i]);
        break;
    }
  }
  return maskArray;
}

function matchInputMask(value, inputMask) {
  if (!inputMask) {
    return true;
  }
  for (var i = 0; i < inputMask.length; i++) {
    var char = value[i];
    var charPart = inputMask[i];

    if (!(_lodash2.default.isRegExp(charPart) && charPart.test(char) || charPart === char)) {
      return false;
    }
  }

  return true;
}

function getNumberSeparators() {
  var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'en';

  var formattedNumberString = 12345.6789.toLocaleString(lang);
  var delimeters = formattedNumberString.match(/..(.)...(.)../);
  if (!delimeters) {
    return {
      delimiter: ',',
      decimalSeparator: '.'
    };
  }
  return {
    delimiter: delimeters.length > 1 ? delimeters[1] : ',',
    decimalSeparator: delimeters.length > 2 ? delimeters[2] : '.'
  };
}

function getNumberDecimalLimit(component) {
  // Determine the decimal limit. Defaults to 20 but can be overridden by validate.step or decimalLimit settings.
  var decimalLimit = 20;
  var step = _lodash2.default.get(component, 'validate.step', 'any');

  if (step !== 'any') {
    var parts = step.toString().split('.');
    if (parts.length > 1) {
      decimalLimit = parts[1].length;
    }
  }

  return decimalLimit;
}

function getCurrencyAffixes(_ref) {
  var _ref$currency = _ref.currency,
      currency = _ref$currency === undefined ? 'USD' : _ref$currency,
      decimalLimit = _ref.decimalLimit,
      decimalSeparator = _ref.decimalSeparator,
      lang = _ref.lang;

  // Get the prefix and suffix from the localized string.
  var regex = '(.*)?100';
  if (decimalLimit) {
    regex += (decimalSeparator === '.' ? '\\.' : decimalSeparator) + '0{' + decimalLimit + '}';
  }
  regex += '(.*)?';
  var parts = 100 .toLocaleString(lang, {
    style: 'currency',
    currency: currency,
    useGrouping: true,
    maximumFractionDigits: decimalLimit,
    minimumFractionDigits: decimalLimit
  }).replace('.', decimalSeparator).match(new RegExp(regex));
  return {
    prefix: parts[1] || '',
    suffix: parts[2] || ''
  };
}

/**
 * Fetch the field data provided a component.
 *
 * @param data
 * @param component
 * @return {*}
 */
function fieldData(data, component) {
  if (!data) {
    return '';
  }
  if (!component || !component.key) {
    return data;
  }
  if (component.key.indexOf('.') !== -1) {
    var value = data;
    var parts = component.key.split('.');
    var key = '';
    for (var i = 0; i < parts.length; i++) {
      key = parts[i];

      // Handle nested resources
      if (value.hasOwnProperty('_id')) {
        value = value.data;
      }

      // Return if the key is not found on the value.
      if (!value.hasOwnProperty(key)) {
        return;
      }

      // Convert old single field data in submissions to multiple
      if (key === parts[parts.length - 1] && component.multiple && !Array.isArray(value[key])) {
        value[key] = [value[key]];
      }

      // Set the value of this key.
      value = value[key];
    }
    return value;
  } else {
    // Convert old single field data in submissions to multiple
    if (component.multiple && !Array.isArray(data[component.key])) {
      data[component.key] = [data[component.key]];
    }
    return data[component.key];
  }
}

/**
 * Delays function execution with possibility to execute function synchronously or cancel it.
 *
 * @param fn Function to delay
 * @param delay Delay time
 * @return {*}
 */
function delay(fn) {
  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  var timer = setTimeout.apply(undefined, [fn, delay].concat(args));

  function cancel() {
    clearTimeout(timer);
  }

  function earlyCall() {
    cancel();
    return fn.apply(undefined, args);
  }

  earlyCall.timer = timer;
  earlyCall.cancel = cancel;

  return earlyCall;
}

/**
 * Iterate the given key to make it unique.
 *
 * @param {String} key
 *   Modify the component key to be unique.
 *
 * @returns {String}
 *   The new component key.
 */
function iterateKey(key) {
  if (!key.match(/(\d+)$/)) {
    return key + '2';
  }

  return key.replace(/(\d+)$/, function (suffix) {
    return Number(suffix) + 1;
  });
}

/**
 * Determines a unique key within a map provided the base key.
 *
 * @param map
 * @param base
 * @return {*}
 */
function uniqueKey(map, base) {
  var newKey = base;
  while (map.hasOwnProperty(newKey)) {
    newKey = iterateKey(newKey);
  }
  return newKey;
}