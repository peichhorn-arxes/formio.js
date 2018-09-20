'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /* globals OktaAuth */

// Intentionally use native-promise-only here... Other promise libraries (es6-promise)
// duck-punch the global Promise definition which messes up Angular 2 since it
// also duck-punches the global Promise definition. For now, keep native-promise-only.


var _nativePromiseOnly = require('native-promise-only');

var _nativePromiseOnly2 = _interopRequireDefault(_nativePromiseOnly);

require('whatwg-fetch');

var _eventemitter = require('eventemitter2');

var _browserCookies = require('browser-cookies');

var _browserCookies2 = _interopRequireDefault(_browserCookies);

var _shallowCopy = require('shallow-copy');

var _shallowCopy2 = _interopRequireDefault(_shallowCopy);

var _providers = require('./providers');

var providers = _interopRequireWildcard(_providers);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var isBoolean = function isBoolean(val) {
  return (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === _typeof(true);
};
var isNil = function isNil(val) {
  return val === null || val === undefined;
};
var isObject = function isObject(val) {
  return val && (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object';
};

/**
 * The Formio interface class.
 *
 *   let formio = new Formio('https://examples.form.io/example');
 */

var Formio = function () {
  /* eslint-disable max-statements */
  function Formio(path) {
    var _this = this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Formio);

    // Ensure we have an instance of Formio.
    if (!(this instanceof Formio)) {
      return new Formio(path);
    }

    // Initialize our variables.
    this.base = '';
    this.projectsUrl = '';
    this.projectUrl = '';
    this.projectId = '';
    this.formUrl = '';
    this.formsUrl = '';
    this.formId = '';
    this.submissionsUrl = '';
    this.submissionUrl = '';
    this.submissionId = '';
    this.actionsUrl = '';
    this.actionId = '';
    this.actionUrl = '';
    this.vsUrl = '';
    this.vId = '';
    this.vUrl = '';
    this.query = '';

    // Store the original path and options.
    this.path = path;
    this.options = options;

    if (options.hasOwnProperty('base')) {
      this.base = options.base;
    } else if (Formio.baseUrl) {
      this.base = Formio.baseUrl;
    } else {
      this.base = window.location.href.match(/http[s]?:\/\/api./)[0];
    }

    if (!path) {
      // Allow user to create new projects if this was instantiated without
      // a url
      this.projectUrl = this.base + '/project';
      this.projectsUrl = this.base + '/project';
      this.projectId = false;
      this.query = '';
      return;
    }

    if (options.hasOwnProperty('project')) {
      this.projectUrl = options.project;
    }

    var project = this.projectUrl || Formio.projectUrl;
    var projectRegEx = /(^|\/)(project)($|\/[^/]+)/;
    var isProjectUrl = path.search(projectRegEx) !== -1;

    // The baseURL is the same as the projectUrl, and does not contain "/project/MONGO_ID" in
    // its domain. This is almost certainly against the Open Source server.
    if (project && this.base === project && !isProjectUrl) {
      this.noProject = true;
      this.projectUrl = this.base;
    }

    // Normalize to an absolute path.
    if (path.indexOf('http') !== 0 && path.indexOf('//') !== 0) {
      path = this.base + path;
    }

    var hostparts = this.getUrlParts(path);
    var parts = [];
    var hostName = hostparts[1] + hostparts[2];
    path = hostparts.length > 3 ? hostparts[3] : '';
    var queryparts = path.split('?');
    if (queryparts.length > 1) {
      path = queryparts[0];
      this.query = '?' + queryparts[1];
    }

    // Register a specific path.
    var registerPath = function registerPath(name, base) {
      _this[name + 'sUrl'] = base + '/' + name;
      var regex = new RegExp('/' + name + '/([^/]+)');
      if (path.search(regex) !== -1) {
        parts = path.match(regex);
        _this[name + 'Url'] = parts ? base + parts[0] : '';
        _this[name + 'Id'] = parts.length > 1 ? parts[1] : '';
        base += parts[0];
      }
      return base;
    };

    // Register an array of items.
    var registerItems = function registerItems(items, base, staticBase) {
      for (var i in items) {
        if (items.hasOwnProperty(i)) {
          var item = items[i];
          if (Array.isArray(item)) {
            registerItems(item, base, true);
          } else {
            var newBase = registerPath(item, base);
            base = staticBase ? base : newBase;
          }
        }
      }
    };

    if (!this.projectUrl || this.projectUrl === this.base) {
      this.projectUrl = hostName;
    }

    if (!this.noProject) {
      // Determine the projectUrl and projectId
      if (isProjectUrl) {
        // Get project id as project/:projectId.
        registerItems(['project'], hostName);
        path = path.replace(projectRegEx, '');
      } else if (hostName === this.base) {
        // Get project id as first part of path (subdirectory).
        if (hostparts.length > 3 && path.split('/').length > 1) {
          var pathParts = path.split('/');
          pathParts.shift(); // Throw away the first /.
          this.projectId = pathParts.shift();
          path = '/' + pathParts.join('/');
          this.projectUrl = hostName + '/' + this.projectId;
        }
      } else {
        // Get project id from subdomain.
        if (hostparts.length > 2 && (hostparts[2].split('.').length > 2 || hostName.indexOf('localhost') !== -1)) {
          this.projectUrl = hostName;
          this.projectId = hostparts[2].split('.')[0];
        }
      }
      this.projectsUrl = this.projectsUrl || this.base + '/project';
    }

    // Configure Form urls and form ids.
    if (path.search(/(^|\/)(form)($|\/)/) !== -1) {
      registerItems(['form', ['submission', 'action', 'v']], this.projectUrl);
    } else {
      var subRegEx = new RegExp('/(submission|action|v)($|/.*)');
      var subs = path.match(subRegEx);
      this.pathType = subs && subs.length > 1 ? subs[1] : '';
      path = path.replace(subRegEx, '');
      path = path.replace(/\/$/, '');
      this.formsUrl = this.projectUrl + '/form';
      this.formUrl = path ? this.projectUrl + path : '';
      this.formId = path.replace(/^\/+|\/+$/g, '');
      var items = ['submission', 'action', 'v'];
      for (var i in items) {
        if (items.hasOwnProperty(i)) {
          var item = items[i];
          this[item + 'sUrl'] = this.projectUrl + path + '/' + item;
          if (this.pathType === item && subs.length > 2 && subs[2]) {
            this[item + 'Id'] = subs[2].replace(/^\/+|\/+$/g, '');
            this[item + 'Url'] = this.projectUrl + path + subs[0];
          }
        }
      }
    }

    // Set the app url if it is not set.
    if (!Formio.projectUrlSet) {
      Formio.projectUrl = this.projectUrl;
    }
  }
  /* eslint-enable max-statements */

  _createClass(Formio, [{
    key: 'delete',
    value: function _delete(type, opts) {
      var _id = type + 'Id';
      var _url = type + 'Url';
      if (!this[_id]) {
        _nativePromiseOnly2.default.reject('Nothing to delete');
      }
      Formio.cache = {};
      return this.makeRequest(type, this[_url], 'delete', null, opts);
    }
  }, {
    key: 'index',
    value: function index(type, query, opts) {
      var _url = type + 'Url';
      query = query || '';
      if (query && isObject(query)) {
        query = '?' + Formio.serialize(query.params);
      }
      return this.makeRequest(type, this[_url] + query, 'get', null, opts);
    }
  }, {
    key: 'save',
    value: function save(type, data, opts) {
      var _id = type + 'Id';
      var _url = type + 'Url';
      var method = this[_id] || data._id ? 'put' : 'post';
      var reqUrl = this[_id] ? this[_url] : this[type + 'sUrl'];
      if (!this[_id] && data._id && method === 'put' && !(reqUrl.indexOf(data._id) !== -1)) {
        reqUrl += '/' + data._id;
      }
      Formio.cache = {};
      return this.makeRequest(type, reqUrl + this.query, method, data, opts);
    }
  }, {
    key: 'load',
    value: function load(type, query, opts) {
      var _id = type + 'Id';
      var _url = type + 'Url';
      if (query && isObject(query)) {
        query = Formio.serialize(query.params);
      }
      if (query) {
        query = this.query ? this.query + '&' + query : '?' + query;
      } else {
        query = this.query;
      }
      if (!this[_id]) {
        return _nativePromiseOnly2.default.reject('Missing ' + _id);
      }
      return this.makeRequest(type, this[_url] + query, 'get', null, opts);
    }
  }, {
    key: 'makeRequest',
    value: function makeRequest() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return Formio.makeRequest.apply(Formio, [this].concat(args));
    }
  }, {
    key: 'loadProject',
    value: function loadProject(query, opts) {
      return this.load('project', query, opts);
    }
  }, {
    key: 'saveProject',
    value: function saveProject(data, opts) {
      return this.save('project', data, opts);
    }
  }, {
    key: 'deleteProject',
    value: function deleteProject(opts) {
      return this.delete('project', opts);
    }
  }, {
    key: 'loadForm',
    value: function loadForm(query, opts) {
      var _this2 = this;

      return this.load('form', query, opts).then(function (currentForm) {
        // Check to see if there isn't a number in vId.
        if (!currentForm.revisions || isNaN(parseInt(_this2.vId))) {
          return currentForm;
        }
        // If a submission already exists but form is marked to load current version of form.
        if (currentForm.revisions === 'current' && _this2.submissionId) {
          return currentForm;
        }
        // If they specified a revision form, load the revised form components.
        if (query && isObject(query)) {
          query = Formio.serialize(query.params);
        }
        if (query) {
          query = _this2.query ? _this2.query + '&' + query : '?' + query;
        } else {
          query = _this2.query;
        }
        return _this2.makeRequest('form', _this2.vUrl + query, 'get', null, opts).then(function (revisionForm) {
          currentForm.components = revisionForm.components;
          // Using object.assign so we don't cross polinate multiple form loads.
          return Object.assign({}, currentForm);
        })
        // If we couldn't load the revision, just return the original form.
        .catch(function () {
          return Object.assign({}, currentForm);
        });
      });
    }
  }, {
    key: 'saveForm',
    value: function saveForm(data, opts) {
      return this.save('form', data, opts);
    }
  }, {
    key: 'deleteForm',
    value: function deleteForm(opts) {
      return this.delete('form', opts);
    }
  }, {
    key: 'loadForms',
    value: function loadForms(query, opts) {
      return this.index('forms', query, opts);
    }
  }, {
    key: 'loadSubmission',
    value: function loadSubmission(query, opts) {
      var _this3 = this;

      return this.load('submission', query, opts).then(function (submission) {
        _this3.vId = submission._fvid;
        _this3.vUrl = _this3.formUrl + '/v/' + _this3.vId;
        return submission;
      });
    }
  }, {
    key: 'saveSubmission',
    value: function saveSubmission(data, opts) {
      if (!isNaN(parseInt(this.vId))) {
        data._fvid = this.vId;
      }
      return this.save('submission', data, opts);
    }
  }, {
    key: 'deleteSubmission',
    value: function deleteSubmission(opts) {
      return this.delete('submission', opts);
    }
  }, {
    key: 'loadSubmissions',
    value: function loadSubmissions(query, opts) {
      return this.index('submissions', query, opts);
    }
  }, {
    key: 'loadAction',
    value: function loadAction(query, opts) {
      return this.load('action', query, opts);
    }
  }, {
    key: 'saveAction',
    value: function saveAction(data, opts) {
      return this.save('action', data, opts);
    }
  }, {
    key: 'deleteAction',
    value: function deleteAction(opts) {
      return this.delete('action', opts);
    }
  }, {
    key: 'loadActions',
    value: function loadActions(query, opts) {
      return this.index('actions', query, opts);
    }
  }, {
    key: 'availableActions',
    value: function availableActions() {
      return this.makeRequest('availableActions', this.formUrl + '/actions');
    }
  }, {
    key: 'actionInfo',
    value: function actionInfo(name) {
      return this.makeRequest('actionInfo', this.formUrl + '/actions/' + name);
    }
  }, {
    key: 'isObjectId',
    value: function isObjectId(id) {
      var checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$');
      return checkForHexRegExp.test(id);
    }
  }, {
    key: 'getProjectId',
    value: function getProjectId() {
      if (!this.projectId) {
        return _nativePromiseOnly2.default.resolve('');
      }
      if (this.isObjectId(this.projectId)) {
        return _nativePromiseOnly2.default.resolve(this.projectId);
      } else {
        return this.loadProject().then(function (project) {
          return project._id;
        });
      }
    }
  }, {
    key: 'getFormId',
    value: function getFormId() {
      if (!this.formId) {
        return _nativePromiseOnly2.default.resolve('');
      }
      if (this.isObjectId(this.formId)) {
        return _nativePromiseOnly2.default.resolve(this.formId);
      } else {
        return this.loadForm().then(function (form) {
          return form._id;
        });
      }
    }
  }, {
    key: 'currentUser',
    value: function currentUser(options) {
      return Formio.currentUser(this, options);
    }
  }, {
    key: 'accessInfo',
    value: function accessInfo() {
      return Formio.accessInfo(this);
    }

    /**
     * Returns the JWT token for this instance.
     *
     * @return {*}
     */

  }, {
    key: 'getToken',
    value: function getToken(options) {
      return Formio.getToken(options);
    }

    /**
     * Returns a temporary authentication token for single purpose token generation.
     */

  }, {
    key: 'getTempToken',
    value: function getTempToken(expire, allowed, options) {
      var token = Formio.getToken(options);
      if (!token) {
        return _nativePromiseOnly2.default.reject('You must be authenticated to generate a temporary auth token.');
      }
      return this.makeRequest('tempToken', this.projectUrl + '/token', 'GET', null, {
        ignoreCache: true,
        header: new Headers({
          'x-expire': expire,
          'x-allow': allowed
        })
      });
    }

    /**
     * Get a download url for a submission PDF of this submission.
     *
     * @return {*}
     */

  }, {
    key: 'getDownloadUrl',
    value: function getDownloadUrl(form) {
      var _this4 = this;

      if (!this.submissionId) {
        return _nativePromiseOnly2.default.resolve('');
      }

      if (!form) {
        // Make sure to load the form first.
        return this.loadForm().then(function (_form) {
          if (!_form) {
            return '';
          }
          return _this4.getDownloadUrl(_form);
        });
      }

      var apiUrl = '/project/' + form.project;
      apiUrl += '/form/' + form._id;
      apiUrl += '/submission/' + this.submissionId;
      apiUrl += '/download';

      var download = this.base + apiUrl;
      return new _nativePromiseOnly2.default(function (resolve, reject) {
        _this4.getTempToken(3600, 'GET:' + apiUrl).then(function (tempToken) {
          download += '?token=' + tempToken.key;
          resolve(download);
        }, function () {
          resolve(download);
        }).catch(reject);
      });
    }
  }, {
    key: 'uploadFile',
    value: function uploadFile(storage, file, fileName, dir, progressCallback, url) {
      var _this5 = this;

      var requestArgs = {
        provider: storage,
        method: 'upload',
        file: file,
        fileName: fileName,
        dir: dir
      };
      var request = Formio.pluginWait('preRequest', requestArgs).then(function () {
        return Formio.pluginGet('fileRequest', requestArgs).then(function (result) {
          if (storage && isNil(result)) {
            if (Formio.providers.storage.hasOwnProperty(storage)) {
              var provider = new Formio.providers.storage[storage](_this5);
              return provider.uploadFile(file, fileName, dir, progressCallback, url);
            } else {
              throw 'Storage provider not found';
            }
          }
          return result || { url: '' };
        });
      });

      return Formio.pluginAlter('wrapFileRequestPromise', request, requestArgs);
    }
  }, {
    key: 'downloadFile',
    value: function downloadFile(file) {
      var _this6 = this;

      var requestArgs = {
        method: 'download',
        file: file
      };

      var request = Formio.pluginWait('preRequest', requestArgs).then(function () {
        return Formio.pluginGet('fileRequest', requestArgs).then(function (result) {
          if (file.storage && isNil(result)) {
            if (Formio.providers.storage.hasOwnProperty(file.storage)) {
              var provider = new Formio.providers.storage[file.storage](_this6);
              return provider.downloadFile(file);
            } else {
              throw 'Storage provider not found';
            }
          }
          return result || { url: '' };
        });
      });

      return Formio.pluginAlter('wrapFileRequestPromise', request, requestArgs);
    }

    // Determine if the user can submit the form.

  }, {
    key: 'canSubmit',
    value: function canSubmit() {
      /* eslint-disable max-statements, max-depth */
      return _nativePromiseOnly2.default.all([this.loadForm(), this.currentUser(), this.accessInfo()]).then(function (results) {
        var form = results.shift();
        var user = results.shift();
        var access = results.shift();

        // Get the anonymous and admin roles.
        var anonRole = {};
        var adminRole = {};
        for (var roleName in access.roles) {
          if (access.roles.hasOwnProperty(roleName)) {
            var role = access.roles[roleName];
            if (role.default) {
              anonRole = role;
            }
            if (role.admin) {
              adminRole = role;
            }
          }
        }

        var canSubmit = false;
        var canSubmitAnonymously = false;

        // If the user is an admin, then they can submit this form.
        if (user && user.roles.indexOf(adminRole._id) !== -1) {
          return true;
        }

        for (var i in form.submissionAccess) {
          if (form.submissionAccess.hasOwnProperty(i)) {
            var subRole = form.submissionAccess[i];
            if (subRole.type === 'create_all' || subRole.type === 'create_own') {
              for (var j in subRole.roles) {
                if (subRole.roles.hasOwnProperty(j)) {
                  // Check if anonymous is allowed.
                  if (anonRole._id === subRole.roles[j]) {
                    canSubmitAnonymously = true;
                  }
                  // Check if the logged in user has the appropriate role.
                  if (user && user.roles.indexOf(subRole.roles[j]) !== -1) {
                    canSubmit = true;
                    break;
                  }
                }
              }
              if (canSubmit) {
                break;
              }
            }
          }
        }
        // If their user cannot submit, but anonymous can, then delete token and allow submission.
        if (!canSubmit && canSubmitAnonymously) {
          canSubmit = true;
          Formio.setUser(null);
        }
        return canSubmit;
      });
      /* eslint-enable max-statements, max-depth */
    }
  }, {
    key: 'getUrlParts',
    value: function getUrlParts(url) {
      return Formio.getUrlParts(url, this);
    }
  }], [{
    key: 'loadProjects',
    value: function loadProjects(query, opts) {
      query = query || '';
      if (isObject(query)) {
        query = '?' + Formio.serialize(query.params);
      }
      return Formio.makeStaticRequest(Formio.baseUrl + '/project' + query, 'GET', null, opts);
    }
  }, {
    key: 'getUrlParts',
    value: function getUrlParts(url, formio) {
      var base = formio && formio.base ? formio.base : Formio.baseUrl;
      var regex = '^(http[s]?:\\/\\/)';
      if (base && url.indexOf(base) === 0) {
        regex += '(' + base.replace(/^http[s]?:\/\//, '') + ')';
      } else {
        regex += '([^/]+)';
      }
      regex += '($|\\/.*)';
      return url.match(new RegExp(regex));
    }
  }, {
    key: 'serialize',
    value: function serialize(obj) {
      var str = [];
      for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
          str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
        }
      }
      return str.join('&');
    }
  }, {
    key: 'getRequestArgs',
    value: function getRequestArgs(formio, type, url, method, data, opts) {
      method = (method || 'GET').toUpperCase();
      if (!opts || !isObject(opts)) {
        opts = {};
      }

      var requestArgs = {
        url: url,
        method: method,
        data: data || null,
        opts: opts
      };

      if (type) {
        requestArgs.type = type;
      }

      if (formio) {
        requestArgs.formio = formio;
      }
      return requestArgs;
    }
  }, {
    key: 'makeStaticRequest',
    value: function makeStaticRequest(url, method, data, opts) {
      var requestArgs = Formio.getRequestArgs(null, '', url, method, data, opts);
      var request = Formio.pluginWait('preRequest', requestArgs).then(function () {
        return Formio.pluginGet('staticRequest', requestArgs).then(function (result) {
          if (isNil(result)) {
            return Formio.request(url, method, requestArgs.data, requestArgs.opts.header, requestArgs.opts);
          }
          return result;
        });
      });

      return Formio.pluginAlter('wrapStaticRequestPromise', request, requestArgs);
    }
  }, {
    key: 'makeRequest',
    value: function makeRequest(formio, type, url, method, data, opts) {
      if (!formio) {
        return Formio.makeStaticRequest(url, method, data, opts);
      }

      var requestArgs = Formio.getRequestArgs(formio, type, url, method, data, opts);
      requestArgs.opts = requestArgs.opts || {};
      requestArgs.opts.formio = formio;
      var request = Formio.pluginWait('preRequest', requestArgs).then(function () {
        return Formio.pluginGet('request', requestArgs).then(function (result) {
          if (isNil(result)) {
            return Formio.request(url, method, requestArgs.data, requestArgs.opts.header, requestArgs.opts);
          }
          return result;
        });
      });

      return Formio.pluginAlter('wrapRequestPromise', request, requestArgs);
    }
  }, {
    key: 'request',
    value: function request(url, method, data, header, opts) {
      if (!url) {
        return _nativePromiseOnly2.default.reject('No url provided');
      }
      method = (method || 'GET').toUpperCase();

      // For reverse compatibility, if they provided the ignoreCache parameter,
      // then change it back to the options format where that is a parameter.
      if (isBoolean(opts)) {
        opts = { ignoreCache: opts };
      }
      if (!opts || !isObject(opts)) {
        opts = {};
      }

      // Generate a cachekey.
      var cacheKey = btoa(url);

      // Get the cached promise to save multiple loads.
      if (!opts.ignoreCache && method === 'GET' && Formio.cache.hasOwnProperty(cacheKey)) {
        return _nativePromiseOnly2.default.resolve(Formio.cache[cacheKey]);
      }

      // Set up and fetch request
      var headers = header || new Headers(opts.headers || {
        'Accept': 'application/json',
        'Content-type': 'application/json; charset=UTF-8'
      });
      var token = Formio.getToken(opts);
      if (token && !opts.noToken) {
        headers.append('x-jwt-token', token);
      }

      var options = {
        method: method,
        headers: headers,
        mode: 'cors'
      };
      if (data) {
        options.body = JSON.stringify(data);
      }

      // Allow plugins to alter the options.
      options = Formio.pluginAlter('requestOptions', options, url);
      if (options.namespace) {
        opts.namespace = options.namespace;
      }

      var requestToken = options.headers.get('x-jwt-token');
      return fetch(url, options).then(function (response) {
        // Allow plugins to respond.
        response = Formio.pluginAlter('requestResponse', response, Formio);

        if (!response.ok) {
          if (response.status === 440) {
            Formio.setToken(null, opts);
            Formio.events.emit('formio.sessionExpired', response.body);
          } else if (response.status === 401) {
            Formio.events.emit('formio.unauthorized', response.body);
          }
          // Parse and return the error as a rejected promise to reject this promise
          var _contentType = response.headers.get('content-type');
          return (_contentType && _contentType.indexOf('application/json') !== -1 ? response.json() : response.text()).then(function (error) {
            return _nativePromiseOnly2.default.reject(error);
          });
        }

        // Handle fetch results
        var token = response.headers.get('x-jwt-token');

        // In some strange cases, the fetch library will return an x-jwt-token without sending
        // one to the server. This has even been debugged on the server to verify that no token
        // was introduced with the request, but the response contains a token. This is an Invalid
        // case where we do not send an x-jwt-token and get one in return for any GET request.
        var tokenIntroduced = false;
        if (method === 'GET' && !requestToken && token && !opts.external && !(url.indexOf('token=') !== -1) && !(url.indexOf('x-jwt-token=') !== -1)) {
          console.warn('Token was introduced in request.');
          tokenIntroduced = true;
        }

        if (response.status >= 200 && response.status < 300 && token && token !== '' && !tokenIntroduced) {
          Formio.setToken(token, opts);
        }
        // 204 is no content. Don't try to .json() it.
        if (response.status === 204) {
          return {};
        }

        var contentType = response.headers.get('content-type');
        var getResult = contentType && contentType.indexOf('application/json') !== -1 ? response.json() : response.text();
        return getResult.then(function (result) {
          // Add some content-range metadata to the result here
          var range = response.headers.get('content-range');
          if (range && isObject(result)) {
            range = range.split('/');
            if (range[0] !== '*') {
              var skipLimit = range[0].split('-');
              result.skip = Number(skipLimit[0]);
              result.limit = skipLimit[1] - skipLimit[0] + 1;
            }
            result.serverCount = range[1] === '*' ? range[1] : Number(range[1]);
          }

          if (!opts.getHeaders) {
            return result;
          }

          var headers = {};
          response.headers.forEach(function (item, key) {
            headers[key] = item;
          });

          // Return the result with the headers.
          return {
            result: result,
            headers: headers
          };
        });
      }).then(function (result) {
        if (opts.getHeaders) {
          return result;
        }

        var resultCopy = {};

        // Shallow copy result so modifications don't end up in cache
        if (Array.isArray(result)) {
          resultCopy = result.map(_shallowCopy2.default);
          resultCopy.skip = result.skip;
          resultCopy.limit = result.limit;
          resultCopy.serverCount = result.serverCount;
        } else {
          resultCopy = (0, _shallowCopy2.default)(result);
        }

        // Cache the response.
        if (method === 'GET') {
          Formio.cache[cacheKey] = resultCopy;
        }

        return resultCopy;
      }).catch(function (err) {
        if (err === 'Bad Token') {
          Formio.setToken(null, opts);
          Formio.events.emit('formio.badToken', err);
        }
        if (err.message) {
          err.message = 'Could not connect to API server (' + err.message + ')';
          err.networkError = true;
        }
        return _nativePromiseOnly2.default.reject(err);
      });
    }

    // Needed to maintain reverse compatability...

  }, {
    key: 'setToken',
    value: function setToken(token, opts) {
      token = token || '';
      opts = typeof opts === 'string' ? { namespace: opts } : opts || {};
      var tokenName = (opts.namespace || 'formio') + 'Token';
      if (!Formio.tokens) {
        Formio.tokens = {};
      }

      if (Formio.tokens[tokenName] === token) {
        return;
      }

      Formio.tokens[tokenName] = token;
      if (!token) {
        Formio.setUser(null, opts);
        // iOS in private browse mode will throw an error but we can't detect ahead of time that we are in private mode.
        try {
          return localStorage.removeItem(tokenName);
        } catch (err) {
          return _browserCookies2.default.erase(tokenName, { path: '/' });
        }
      }
      // iOS in private browse mode will throw an error but we can't detect ahead of time that we are in private mode.
      try {
        localStorage.setItem(tokenName, token);
      } catch (err) {
        _browserCookies2.default.set(tokenName, token, { path: '/' });
      }
      return Formio.currentUser(opts.formio, opts); // Run this so user is updated if null
    }
  }, {
    key: 'getToken',
    value: function getToken(options) {
      options = typeof options === 'string' ? { namespace: options } : options || {};
      var tokenName = (options.namespace || 'formio') + 'Token';
      if (!Formio.tokens) {
        Formio.tokens = {};
      }

      if (Formio.tokens[tokenName]) {
        return Formio.tokens[tokenName];
      }
      try {
        Formio.tokens[tokenName] = localStorage.getItem(tokenName) || '';
        return Formio.tokens[tokenName];
      } catch (e) {
        Formio.tokens[tokenName] = _browserCookies2.default.get(tokenName);
        return Formio.tokens[tokenName];
      }
    }
  }, {
    key: 'setUser',
    value: function setUser(user, opts) {
      opts = opts || {};
      var userName = (opts.namespace || 'formio') + 'User';
      if (!user) {
        this.setToken(null, opts);
        // iOS in private browse mode will throw an error but we can't detect ahead of time that we are in private mode.
        try {
          return localStorage.removeItem(userName);
        } catch (err) {
          return _browserCookies2.default.erase(userName, { path: '/' });
        }
      }
      // iOS in private browse mode will throw an error but we can't detect ahead of time that we are in private mode.
      try {
        localStorage.setItem(userName, JSON.stringify(user));
      } catch (err) {
        _browserCookies2.default.set(userName, JSON.stringify(user), { path: '/' });
      }
    }
  }, {
    key: 'getUser',
    value: function getUser(options) {
      options = options || {};
      var userName = (options.namespace || 'formio') + 'User';
      try {
        return JSON.parse(localStorage.getItem(userName) || null);
      } catch (e) {
        return JSON.parse(_browserCookies2.default.get(userName));
      }
    }
  }, {
    key: 'setBaseUrl',
    value: function setBaseUrl(url) {
      Formio.baseUrl = url;
      if (!Formio.projectUrlSet) {
        Formio.projectUrl = url;
      }
    }
  }, {
    key: 'getBaseUrl',
    value: function getBaseUrl() {
      return Formio.baseUrl;
    }
  }, {
    key: 'setApiUrl',
    value: function setApiUrl(url) {
      return Formio.setBaseUrl(url);
    }
  }, {
    key: 'getApiUrl',
    value: function getApiUrl() {
      return Formio.getBaseUrl();
    }
  }, {
    key: 'setAppUrl',
    value: function setAppUrl(url) {
      console.warn('Formio.setAppUrl() is deprecated. Use Formio.setProjectUrl instead.');
      Formio.projectUrl = url;
      Formio.projectUrlSet = true;
    }
  }, {
    key: 'setProjectUrl',
    value: function setProjectUrl(url) {
      Formio.projectUrl = url;
      Formio.projectUrlSet = true;
    }
  }, {
    key: 'getAppUrl',
    value: function getAppUrl() {
      console.warn('Formio.getAppUrl() is deprecated. Use Formio.getProjectUrl instead.');
      return Formio.projectUrl;
    }
  }, {
    key: 'getProjectUrl',
    value: function getProjectUrl() {
      return Formio.projectUrl;
    }
  }, {
    key: 'clearCache',
    value: function clearCache() {
      Formio.cache = {};
    }
  }, {
    key: 'noop',
    value: function noop() {}
  }, {
    key: 'identity',
    value: function identity(value) {
      return value;
    }
  }, {
    key: 'deregisterPlugin',
    value: function deregisterPlugin(plugin) {
      var beforeLength = Formio.plugins.length;
      Formio.plugins = Formio.plugins.filter(function (p) {
        if (p !== plugin && p.__name !== plugin) {
          return true;
        }

        (p.deregister || Formio.noop).call(plugin, Formio);
        return false;
      });
      return beforeLength !== Formio.plugins.length;
    }
  }, {
    key: 'registerPlugin',
    value: function registerPlugin(plugin, name) {
      Formio.plugins.push(plugin);
      Formio.plugins.sort(function (a, b) {
        return (b.priority || 0) - (a.priority || 0);
      });
      plugin.__name = name;
      (plugin.init || Formio.noop).call(plugin, Formio);
    }
  }, {
    key: 'getPlugin',
    value: function getPlugin(name) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Formio.plugins[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var plugin = _step.value;

          if (plugin.__name === name) {
            return plugin;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return null;
    }
  }, {
    key: 'pluginWait',
    value: function pluginWait(pluginFn) {
      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      return _nativePromiseOnly2.default.all(Formio.plugins.map(function (plugin) {
        var _ref;

        return (_ref = plugin[pluginFn] || Formio.noop).call.apply(_ref, [plugin].concat(args));
      }));
    }
  }, {
    key: 'pluginGet',
    value: function pluginGet(pluginFn) {
      for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }

      var callPlugin = function callPlugin(index) {
        var _ref2;

        var plugin = Formio.plugins[index];

        if (!plugin) {
          return _nativePromiseOnly2.default.resolve(null);
        }

        return _nativePromiseOnly2.default.resolve((_ref2 = plugin[pluginFn] || Formio.noop).call.apply(_ref2, [plugin].concat(args))).then(function (result) {
          if (!isNil(result)) {
            return result;
          }

          return callPlugin(index + 1);
        });
      };
      return callPlugin(0);
    }
  }, {
    key: 'pluginAlter',
    value: function pluginAlter(pluginFn, value) {
      for (var _len4 = arguments.length, args = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
        args[_key4 - 2] = arguments[_key4];
      }

      return Formio.plugins.reduce(function (value, plugin) {
        return (plugin[pluginFn] || Formio.identity).apply(undefined, [value].concat(args));
      }, value);
    }
  }, {
    key: 'accessInfo',
    value: function accessInfo(formio) {
      var projectUrl = formio ? formio.projectUrl : Formio.projectUrl;
      return Formio.makeRequest(formio, 'accessInfo', projectUrl + '/access');
    }
  }, {
    key: 'currentUser',
    value: function currentUser(formio, options) {
      var projectUrl = formio ? formio.projectUrl : Formio.projectUrl || Formio.baseUrl;
      projectUrl += '/current';
      var user = this.getUser(options);
      if (user) {
        return Formio.pluginAlter('wrapStaticRequestPromise', _nativePromiseOnly2.default.resolve(user), {
          url: projectUrl,
          method: 'GET',
          options: options
        });
      }
      var token = Formio.getToken(options);
      if ((!options || !options.external) && !token) {
        return Formio.pluginAlter('wrapStaticRequestPromise', _nativePromiseOnly2.default.resolve(null), {
          url: projectUrl,
          method: 'GET',
          options: options
        });
      }
      return Formio.makeRequest(formio, 'currentUser', projectUrl, 'GET', null, options).then(function (response) {
        Formio.setUser(response, options);
        return response;
      });
    }
  }, {
    key: 'logout',
    value: function logout(formio, options) {
      options = options || {};
      options.formio = formio;
      Formio.setToken(null, options);
      Formio.setUser(null, options);
      Formio.clearCache();
      var projectUrl = formio ? formio.projectUrl : Formio.baseUrl;
      return Formio.makeRequest(formio, 'logout', projectUrl + '/logout');
    }
  }, {
    key: 'oAuthCurrentUser',
    value: function oAuthCurrentUser(formio, token) {
      return Formio.currentUser(formio, {
        external: true,
        headers: {
          Authorization: 'Bearer ' + token
        }
      });
    }
  }, {
    key: 'oktaInit',
    value: function oktaInit(options) {
      options = options || {};
      if ((typeof OktaAuth === 'undefined' ? 'undefined' : _typeof(OktaAuth)) !== undefined) {
        options.OktaAuth = OktaAuth;
      }

      if (_typeof(options.OktaAuth) === undefined) {
        var errorMessage = 'Cannot find OktaAuth. Please include the Okta JavaScript SDK within your application. See https://developer.okta.com/code/javascript/okta_auth_sdk for an example.';
        console.warn(errorMessage);
        return _nativePromiseOnly2.default.reject(errorMessage);
      }
      return new _nativePromiseOnly2.default(function (resolve, reject) {
        var Okta = options.OktaAuth;
        delete options.OktaAuth;
        var authClient = new Okta(options);
        var accessToken = authClient.tokenManager.get('accessToken');
        if (accessToken) {
          resolve(Formio.oAuthCurrentUser(options.formio, accessToken.accessToken));
        } else if (location.hash) {
          authClient.token.parseFromUrl().then(function (token) {
            authClient.tokenManager.add('accessToken', token);
            resolve(Formio.oAuthCurrentUser(options.formio, token.accessToken));
          }).catch(function (err) {
            console.warn(err);
            reject(err);
          });
        } else {
          authClient.token.getWithRedirect({
            responseType: 'token',
            scopes: options.scopes
          });
          resolve(false);
        }
      });
    }
  }, {
    key: 'ssoInit',
    value: function ssoInit(type, options) {
      switch (type) {
        case 'okta':
          return Formio.oktaInit(options);
        default:
          console.warn('Unknown SSO type');
          return _nativePromiseOnly2.default.reject('Unknown SSO type');
      }
    }
  }, {
    key: 'requireLibrary',
    value: function requireLibrary(name, property, src, polling) {
      if (!Formio.libraries.hasOwnProperty(name)) {
        Formio.libraries[name] = {};
        Formio.libraries[name].ready = new _nativePromiseOnly2.default(function (resolve, reject) {
          Formio.libraries[name].resolve = resolve;
          Formio.libraries[name].reject = reject;
        });

        var callbackName = name + 'Callback';

        if (!polling && !window[callbackName]) {
          window[callbackName] = function () {
            return Formio.libraries[name].resolve();
          };
        }

        // See if the plugin already exists.
        var plugin = (0, _get3.default)(window, property);
        if (plugin) {
          Formio.libraries[name].resolve(plugin);
        } else {
          src = Array.isArray(src) ? src : [src];
          src.forEach(function (lib) {
            var attrs = {};
            var elementType = '';
            if (typeof lib === 'string') {
              lib = {
                type: 'script',
                src: lib
              };
            }
            switch (lib.type) {
              case 'script':
                elementType = 'script';
                attrs = {
                  src: lib.src,
                  type: 'text/javascript',
                  defer: true,
                  async: true
                };
                break;
              case 'styles':
                elementType = 'link';
                attrs = {
                  href: lib.src,
                  rel: 'stylesheet'
                };
                break;
            }

            // Add the script to the top page.
            var script = document.createElement(elementType);
            for (var attr in attrs) {
              script.setAttribute(attr, attrs[attr]);
            }
            document.getElementsByTagName('head')[0].appendChild(script);
          });

          // if no callback is provided, then check periodically for the script.
          if (polling) {
            var interval = setInterval(function () {
              var plugin = (0, _get3.default)(window, property);
              if (plugin) {
                clearInterval(interval);
                Formio.libraries[name].resolve(plugin);
              }
            }, 200);
          }
        }
      }
      return Formio.libraries[name].ready;
    }
  }, {
    key: 'libraryReady',
    value: function libraryReady(name) {
      if (Formio.libraries.hasOwnProperty(name) && Formio.libraries[name].ready) {
        return Formio.libraries[name].ready;
      }

      return _nativePromiseOnly2.default.reject(name + ' library was not required.');
    }
  }, {
    key: 'token',
    get: function get() {
      if (!Formio.tokens) {
        Formio.tokens = {};
      }

      return Formio.tokens.formioToken ? Formio.tokens.formioToken : '';
    }

    // Needed to maintain reverse compatability...
    ,
    set: function set(token) {
      if (!Formio.tokens) {
        Formio.tokens = {};
      }

      return Formio.tokens.formioToken = token || '';
    }
  }]);

  return Formio;
}();

// Define all the static properties.


exports.default = Formio;
Formio.libraries = {};
Formio.Promise = _nativePromiseOnly2.default;
Formio.Headers = Headers;
Formio.baseUrl = 'https://api.form.io';
Formio.projectUrl = Formio.baseUrl;
Formio.projectUrlSet = false;
Formio.plugins = [];
Formio.cache = {};
Formio.providers = providers;
Formio.events = new _eventemitter.EventEmitter2({
  wildcard: false,
  maxListeners: 0
});

if ((typeof global === 'undefined' ? 'undefined' : _typeof(global)) === 'object' && !global.Formio) {
  global.Formio = Formio;
}