/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/node.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/http.js":
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/adapters/http.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var http = __webpack_require__(/*! http */ "http");
var https = __webpack_require__(/*! https */ "https");
var httpFollow = __webpack_require__(/*! follow-redirects */ "./node_modules/follow-redirects/index.js").http;
var httpsFollow = __webpack_require__(/*! follow-redirects */ "./node_modules/follow-redirects/index.js").https;
var url = __webpack_require__(/*! url */ "url");
var zlib = __webpack_require__(/*! zlib */ "zlib");
var pkg = __webpack_require__(/*! ./../../package.json */ "./node_modules/axios/package.json");
var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/axios/lib/core/createError.js");
var enhanceError = __webpack_require__(/*! ../core/enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

/*eslint consistent-return:0*/
module.exports = function httpAdapter(config) {
  return new Promise(function dispatchHttpRequest(resolve, reject) {
    var data = config.data;
    var headers = config.headers;
    var timer;

    // Set User-Agent (required by some servers)
    // Only set header if it hasn't been set in config
    // See https://github.com/axios/axios/issues/69
    if (!headers['User-Agent'] && !headers['user-agent']) {
      headers['User-Agent'] = 'axios/' + pkg.version;
    }

    if (data && !utils.isStream(data)) {
      if (Buffer.isBuffer(data)) {
        // Nothing to do...
      } else if (utils.isArrayBuffer(data)) {
        data = new Buffer(new Uint8Array(data));
      } else if (utils.isString(data)) {
        data = new Buffer(data, 'utf-8');
      } else {
        return reject(createError(
          'Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream',
          config
        ));
      }

      // Add Content-Length header if data exists
      headers['Content-Length'] = data.length;
    }

    // HTTP basic authentication
    var auth = undefined;
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      auth = username + ':' + password;
    }

    // Parse url
    var parsed = url.parse(config.url);
    var protocol = parsed.protocol || 'http:';

    if (!auth && parsed.auth) {
      var urlAuth = parsed.auth.split(':');
      var urlUsername = urlAuth[0] || '';
      var urlPassword = urlAuth[1] || '';
      auth = urlUsername + ':' + urlPassword;
    }

    if (auth) {
      delete headers.Authorization;
    }

    var isHttps = protocol === 'https:';
    var agent = isHttps ? config.httpsAgent : config.httpAgent;

    var options = {
      path: buildURL(parsed.path, config.params, config.paramsSerializer).replace(/^\?/, ''),
      method: config.method,
      headers: headers,
      agent: agent,
      auth: auth
    };

    if (config.socketPath) {
      options.socketPath = config.socketPath;
    } else {
      options.hostname = parsed.hostname;
      options.port = parsed.port;
    }

    var proxy = config.proxy;
    if (!proxy && proxy !== false) {
      var proxyEnv = protocol.slice(0, -1) + '_proxy';
      var proxyUrl = process.env[proxyEnv] || process.env[proxyEnv.toUpperCase()];
      if (proxyUrl) {
        var parsedProxyUrl = url.parse(proxyUrl);
        proxy = {
          host: parsedProxyUrl.hostname,
          port: parsedProxyUrl.port
        };

        if (parsedProxyUrl.auth) {
          var proxyUrlAuth = parsedProxyUrl.auth.split(':');
          proxy.auth = {
            username: proxyUrlAuth[0],
            password: proxyUrlAuth[1]
          };
        }
      }
    }

    if (proxy) {
      options.hostname = proxy.host;
      options.host = proxy.host;
      options.headers.host = parsed.hostname + (parsed.port ? ':' + parsed.port : '');
      options.port = proxy.port;
      options.path = protocol + '//' + parsed.hostname + (parsed.port ? ':' + parsed.port : '') + options.path;

      // Basic proxy authorization
      if (proxy.auth) {
        var base64 = new Buffer(proxy.auth.username + ':' + proxy.auth.password, 'utf8').toString('base64');
        options.headers['Proxy-Authorization'] = 'Basic ' + base64;
      }
    }

    var transport;
    if (config.transport) {
      transport = config.transport;
    } else if (config.maxRedirects === 0) {
      transport = isHttps ? https : http;
    } else {
      if (config.maxRedirects) {
        options.maxRedirects = config.maxRedirects;
      }
      transport = isHttps ? httpsFollow : httpFollow;
    }

    if (config.maxContentLength && config.maxContentLength > -1) {
      options.maxBodyLength = config.maxContentLength;
    }

    // Create the request
    var req = transport.request(options, function handleResponse(res) {
      if (req.aborted) return;

      // Response has been received so kill timer that handles request timeout
      clearTimeout(timer);
      timer = null;

      // uncompress the response body transparently if required
      var stream = res;
      switch (res.headers['content-encoding']) {
      /*eslint default-case:0*/
      case 'gzip':
      case 'compress':
      case 'deflate':
        // add the unzipper to the body stream processing pipeline
        stream = stream.pipe(zlib.createUnzip());

        // remove the content-encoding in order to not confuse downstream operations
        delete res.headers['content-encoding'];
        break;
      }

      // return the last request in case of redirects
      var lastRequest = res.req || req;

      var response = {
        status: res.statusCode,
        statusText: res.statusMessage,
        headers: res.headers,
        config: config,
        request: lastRequest
      };

      if (config.responseType === 'stream') {
        response.data = stream;
        settle(resolve, reject, response);
      } else {
        var responseBuffer = [];
        stream.on('data', function handleStreamData(chunk) {
          responseBuffer.push(chunk);

          // make sure the content length is not over the maxContentLength if specified
          if (config.maxContentLength > -1 && Buffer.concat(responseBuffer).length > config.maxContentLength) {
            reject(createError('maxContentLength size of ' + config.maxContentLength + ' exceeded',
              config, null, lastRequest));
          }
        });

        stream.on('error', function handleStreamError(err) {
          if (req.aborted) return;
          reject(enhanceError(err, config, null, lastRequest));
        });

        stream.on('end', function handleStreamEnd() {
          var responseData = Buffer.concat(responseBuffer);
          if (config.responseType !== 'arraybuffer') {
            responseData = responseData.toString('utf8');
          }

          response.data = responseData;
          settle(resolve, reject, response);
        });
      }
    });

    // Handle errors
    req.on('error', function handleRequestError(err) {
      if (req.aborted) return;
      reject(enhanceError(err, config, null, req));
    });

    // Handle request timeout
    if (config.timeout && !timer) {
      timer = setTimeout(function handleRequestTimeout() {
        req.abort();
        reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED', req));
      }, config.timeout);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (req.aborted) return;

        req.abort();
        reject(cancel);
      });
    }

    // Send the request
    if (utils.isStream(data)) {
      data.pipe(req);
    } else {
      req.end(data);
    }
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/axios/lib/helpers/parseHeaders.js");
var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");
var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/axios/lib/core/createError.js");
var btoa = (typeof window !== 'undefined' && window.btoa && window.btoa.bind(window)) || __webpack_require__(/*! ./../helpers/btoa */ "./node_modules/axios/lib/helpers/btoa.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();
    var loadEvent = 'onreadystatechange';
    var xDomain = false;

    // For IE 8/9 CORS support
    // Only supports POST and GET calls and doesn't returns the response headers.
    // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
    if ( true &&
        typeof window !== 'undefined' &&
        window.XDomainRequest && !('withCredentials' in request) &&
        !isURLSameOrigin(config.url)) {
      request = new window.XDomainRequest();
      loadEvent = 'onload';
      xDomain = true;
      request.onprogress = function handleProgress() {};
      request.ontimeout = function handleTimeout() {};
    }

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request[loadEvent] = function handleLoad() {
      if (!request || (request.readyState !== 4 && !xDomain)) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        // IE sends 1223 instead of 204 (https://github.com/axios/axios/issues/201)
        status: request.status === 1223 ? 204 : request.status,
        statusText: request.status === 1223 ? 'No Content' : request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/axios/lib/helpers/cookies.js");

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
          cookies.read(config.xsrfCookieName) :
          undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (config.withCredentials) {
      request.withCredentials = true;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/axios/lib/core/Axios.js");
var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(utils.merge(defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/axios/lib/helpers/spread.js");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/Cancel.js":
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/cancel/Cancel.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__(/*! ./Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var defaults = __webpack_require__(/*! ./../defaults */ "./node_modules/axios/lib/defaults.js");
var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/axios/lib/core/InterceptorManager.js");
var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/axios/lib/core/dispatchRequest.js");

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = utils.merge({
      url: arguments[0]
    }, arguments[1]);
  }

  config = utils.merge(defaults, {method: 'get'}, this.defaults, config);
  config.method = config.method.toLowerCase();

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "./node_modules/axios/lib/core/createError.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/createError.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__(/*! ./enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/axios/lib/core/transformData.js");
var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults.js");
var isAbsoluteURL = __webpack_require__(/*! ./../helpers/isAbsoluteURL */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");
var combineURLs = __webpack_require__(/*! ./../helpers/combineURLs */ "./node_modules/axios/lib/helpers/combineURLs.js");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers || {}
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/core/enhanceError.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/enhanceError.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }
  error.request = request;
  error.response = response;
  return error;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__(/*! ./createError */ "./node_modules/axios/lib/core/createError.js");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  // Note: status is not exposed by XDomainRequest
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),

/***/ "./node_modules/axios/lib/defaults.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/defaults.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var normalizeHeaderName = __webpack_require__(/*! ./helpers/normalizeHeaderName */ "./node_modules/axios/lib/helpers/normalizeHeaderName.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ./adapters/xhr */ "./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ./adapters/http */ "./node_modules/axios/lib/adapters/http.js");
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;


/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/btoa.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/btoa.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function E() {
  this.message = 'String contains an invalid character';
}
E.prototype = new Error;
E.prototype.code = 5;
E.prototype.name = 'InvalidCharacterError';

function btoa(input) {
  var str = String(input);
  var output = '';
  for (
    // initialize result and counter
    var block, charCode, idx = 0, map = chars;
    // if the next str index does not exist:
    //   change the mapping table to "="
    //   check if d has no fractional digits
    str.charAt(idx | 0) || (map = '=', idx % 1);
    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
  ) {
    charCode = str.charCodeAt(idx += 3 / 4);
    if (charCode > 0xFF) {
      throw new E();
    }
    block = block << 8 | charCode;
  }
  return output;
}

module.exports = btoa;


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
  (function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        var cookie = [];
        cookie.push(name + '=' + encodeURIComponent(value));

        if (utils.isNumber(expires)) {
          cookie.push('expires=' + new Date(expires).toGMTString());
        }

        if (utils.isString(path)) {
          cookie.push('path=' + path);
        }

        if (utils.isString(domain)) {
          cookie.push('domain=' + domain);
        }

        if (secure === true) {
          cookie.push('secure');
        }

        document.cookie = cookie.join('; ');
      },

      read: function read(name) {
        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return (match ? decodeURIComponent(match[3]) : null);
      },

      remove: function remove(name) {
        this.write(name, '', Date.now() - 86400000);
      }
    };
  })() :

  // Non standard browser env (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return {
      write: function write() {},
      read: function read() { return null; },
      remove: function remove() {}
    };
  })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    var msie = /(msie|trident)/i.test(navigator.userAgent);
    var urlParsingNode = document.createElement('a');
    var originURL;

    /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url) {
      var href = url;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                  urlParsingNode.pathname :
                  '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!***************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var isBuffer = __webpack_require__(/*! is-buffer */ "./node_modules/is-buffer/index.js");

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim
};


/***/ }),

/***/ "./node_modules/axios/package.json":
/*!*****************************************!*\
  !*** ./node_modules/axios/package.json ***!
  \*****************************************/
/*! exports provided: _from, _id, _inBundle, _integrity, _location, _phantomChildren, _requested, _requiredBy, _resolved, _shasum, _spec, _where, author, browser, bugs, bundleDependencies, bundlesize, dependencies, deprecated, description, devDependencies, homepage, keywords, license, main, name, repository, scripts, typings, version, default */
/***/ (function(module) {

module.exports = {"_from":"axios","_id":"axios@0.18.0","_inBundle":false,"_integrity":"sha1-MtU+SFHv3AoRmTts0AB4nXDAUQI=","_location":"/axios","_phantomChildren":{},"_requested":{"type":"tag","registry":true,"raw":"axios","name":"axios","escapedName":"axios","rawSpec":"","saveSpec":null,"fetchSpec":"latest"},"_requiredBy":["#USER","/"],"_resolved":"http://registry.npmjs.org/axios/-/axios-0.18.0.tgz","_shasum":"32d53e4851efdc0a11993b6cd000789d70c05102","_spec":"axios","_where":"/Users/kyle/repos/arweave-js","author":{"name":"Matt Zabriskie"},"browser":{"./lib/adapters/http.js":"./lib/adapters/xhr.js"},"bugs":{"url":"https://github.com/axios/axios/issues"},"bundleDependencies":false,"bundlesize":[{"path":"./dist/axios.min.js","threshold":"5kB"}],"dependencies":{"follow-redirects":"^1.3.0","is-buffer":"^1.1.5"},"deprecated":false,"description":"Promise based HTTP client for the browser and node.js","devDependencies":{"bundlesize":"^0.5.7","coveralls":"^2.11.9","es6-promise":"^4.0.5","grunt":"^1.0.1","grunt-banner":"^0.6.0","grunt-cli":"^1.2.0","grunt-contrib-clean":"^1.0.0","grunt-contrib-nodeunit":"^1.0.0","grunt-contrib-watch":"^1.0.0","grunt-eslint":"^19.0.0","grunt-karma":"^2.0.0","grunt-ts":"^6.0.0-beta.3","grunt-webpack":"^1.0.18","istanbul-instrumenter-loader":"^1.0.0","jasmine-core":"^2.4.1","karma":"^1.3.0","karma-chrome-launcher":"^2.0.0","karma-coverage":"^1.0.0","karma-firefox-launcher":"^1.0.0","karma-jasmine":"^1.0.2","karma-jasmine-ajax":"^0.1.13","karma-opera-launcher":"^1.0.0","karma-safari-launcher":"^1.0.0","karma-sauce-launcher":"^1.1.0","karma-sinon":"^1.0.5","karma-sourcemap-loader":"^0.3.7","karma-webpack":"^1.7.0","load-grunt-tasks":"^3.5.2","minimist":"^1.2.0","sinon":"^1.17.4","typescript":"^2.0.3","url-search-params":"^0.6.1","webpack":"^1.13.1","webpack-dev-server":"^1.14.1"},"homepage":"https://github.com/axios/axios","keywords":["xhr","http","ajax","promise","node"],"license":"MIT","main":"index.js","name":"axios","repository":{"type":"git","url":"git+https://github.com/axios/axios.git"},"scripts":{"build":"NODE_ENV=production grunt build","coveralls":"cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js","examples":"node ./examples/server.js","postversion":"git push && git push --tags","preversion":"npm test","start":"node ./sandbox/server.js","test":"grunt test && bundlesize","version":"npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json"},"typings":"./index.d.ts","version":"0.18.0"};

/***/ }),

/***/ "./node_modules/base64-js/index.js":
/*!*****************************************!*\
  !*** ./node_modules/base64-js/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  for (var i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}


/***/ }),

/***/ "./node_modules/bignumber.js/bignumber.mjs":
/*!*************************************************!*\
  !*** ./node_modules/bignumber.js/bignumber.mjs ***!
  \*************************************************/
/*! exports provided: BigNumber, default */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BigNumber", function() { return BigNumber; });
/*
 *      bignumber.js v8.0.1
 *      A JavaScript library for arbitrary-precision arithmetic.
 *      https://github.com/MikeMcl/bignumber.js
 *      Copyright (c) 2018 Michael Mclaughlin <M8ch88l@gmail.com>
 *      MIT Licensed.
 *
 *      BigNumber.prototype methods     |  BigNumber methods
 *                                      |
 *      absoluteValue            abs    |  clone
 *      comparedTo                      |  config               set
 *      decimalPlaces            dp     |      DECIMAL_PLACES
 *      dividedBy                div    |      ROUNDING_MODE
 *      dividedToIntegerBy       idiv   |      EXPONENTIAL_AT
 *      exponentiatedBy          pow    |      RANGE
 *      integerValue                    |      CRYPTO
 *      isEqualTo                eq     |      MODULO_MODE
 *      isFinite                        |      POW_PRECISION
 *      isGreaterThan            gt     |      FORMAT
 *      isGreaterThanOrEqualTo   gte    |      ALPHABET
 *      isInteger                       |  isBigNumber
 *      isLessThan               lt     |  maximum              max
 *      isLessThanOrEqualTo      lte    |  minimum              min
 *      isNaN                           |  random
 *      isNegative                      |  sum
 *      isPositive                      |
 *      isZero                          |
 *      minus                           |
 *      modulo                   mod    |
 *      multipliedBy             times  |
 *      negated                         |
 *      plus                            |
 *      precision                sd     |
 *      shiftedBy                       |
 *      squareRoot               sqrt   |
 *      toExponential                   |
 *      toFixed                         |
 *      toFormat                        |
 *      toFraction                      |
 *      toJSON                          |
 *      toNumber                        |
 *      toPrecision                     |
 *      toString                        |
 *      valueOf                         |
 *
 */


var isNumeric = /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i,

  mathceil = Math.ceil,
  mathfloor = Math.floor,

  bignumberError = '[BigNumber Error] ',
  tooManyDigits = bignumberError + 'Number primitive has more than 15 significant digits: ',

  BASE = 1e14,
  LOG_BASE = 14,
  MAX_SAFE_INTEGER = 0x1fffffffffffff,         // 2^53 - 1
  // MAX_INT32 = 0x7fffffff,                   // 2^31 - 1
  POWS_TEN = [1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13],
  SQRT_BASE = 1e7,

  // EDITABLE
  // The limit on the value of DECIMAL_PLACES, TO_EXP_NEG, TO_EXP_POS, MIN_EXP, MAX_EXP, and
  // the arguments to toExponential, toFixed, toFormat, and toPrecision.
  MAX = 1E9;                                   // 0 to MAX_INT32


/*
 * Create and return a BigNumber constructor.
 */
function clone(configObject) {
  var div, convertBase, parseNumeric,
    P = BigNumber.prototype = { constructor: BigNumber, toString: null, valueOf: null },
    ONE = new BigNumber(1),


    //----------------------------- EDITABLE CONFIG DEFAULTS -------------------------------


    // The default values below must be integers within the inclusive ranges stated.
    // The values can also be changed at run-time using BigNumber.set.

    // The maximum number of decimal places for operations involving division.
    DECIMAL_PLACES = 20,                     // 0 to MAX

    // The rounding mode used when rounding to the above decimal places, and when using
    // toExponential, toFixed, toFormat and toPrecision, and round (default value).
    // UP         0 Away from zero.
    // DOWN       1 Towards zero.
    // CEIL       2 Towards +Infinity.
    // FLOOR      3 Towards -Infinity.
    // HALF_UP    4 Towards nearest neighbour. If equidistant, up.
    // HALF_DOWN  5 Towards nearest neighbour. If equidistant, down.
    // HALF_EVEN  6 Towards nearest neighbour. If equidistant, towards even neighbour.
    // HALF_CEIL  7 Towards nearest neighbour. If equidistant, towards +Infinity.
    // HALF_FLOOR 8 Towards nearest neighbour. If equidistant, towards -Infinity.
    ROUNDING_MODE = 4,                       // 0 to 8

    // EXPONENTIAL_AT : [TO_EXP_NEG , TO_EXP_POS]

    // The exponent value at and beneath which toString returns exponential notation.
    // Number type: -7
    TO_EXP_NEG = -7,                         // 0 to -MAX

    // The exponent value at and above which toString returns exponential notation.
    // Number type: 21
    TO_EXP_POS = 21,                         // 0 to MAX

    // RANGE : [MIN_EXP, MAX_EXP]

    // The minimum exponent value, beneath which underflow to zero occurs.
    // Number type: -324  (5e-324)
    MIN_EXP = -1e7,                          // -1 to -MAX

    // The maximum exponent value, above which overflow to Infinity occurs.
    // Number type:  308  (1.7976931348623157e+308)
    // For MAX_EXP > 1e7, e.g. new BigNumber('1e100000000').plus(1) may be slow.
    MAX_EXP = 1e7,                           // 1 to MAX

    // Whether to use cryptographically-secure random number generation, if available.
    CRYPTO = false,                          // true or false

    // The modulo mode used when calculating the modulus: a mod n.
    // The quotient (q = a / n) is calculated according to the corresponding rounding mode.
    // The remainder (r) is calculated as: r = a - n * q.
    //
    // UP        0 The remainder is positive if the dividend is negative, else is negative.
    // DOWN      1 The remainder has the same sign as the dividend.
    //             This modulo mode is commonly known as 'truncated division' and is
    //             equivalent to (a % n) in JavaScript.
    // FLOOR     3 The remainder has the same sign as the divisor (Python %).
    // HALF_EVEN 6 This modulo mode implements the IEEE 754 remainder function.
    // EUCLID    9 Euclidian division. q = sign(n) * floor(a / abs(n)).
    //             The remainder is always positive.
    //
    // The truncated division, floored division, Euclidian division and IEEE 754 remainder
    // modes are commonly used for the modulus operation.
    // Although the other rounding modes can also be used, they may not give useful results.
    MODULO_MODE = 1,                         // 0 to 9

    // The maximum number of significant digits of the result of the exponentiatedBy operation.
    // If POW_PRECISION is 0, there will be unlimited significant digits.
    POW_PRECISION = 0,                    // 0 to MAX

    // The format specification used by the BigNumber.prototype.toFormat method.
    FORMAT = {
      prefix: '',
      groupSize: 3,
      secondaryGroupSize: 0,
      groupSeparator: ',',
      decimalSeparator: '.',
      fractionGroupSize: 0,
      fractionGroupSeparator: '\xA0',      // non-breaking space
      suffix: ''
    },

    // The alphabet used for base conversion. It must be at least 2 characters long, with no '+',
    // '-', '.', whitespace, or repeated character.
    // '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_'
    ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz';


  //------------------------------------------------------------------------------------------


  // CONSTRUCTOR


  /*
   * The BigNumber constructor and exported function.
   * Create and return a new instance of a BigNumber object.
   *
   * n {number|string|BigNumber} A numeric value.
   * [b] {number} The base of n. Integer, 2 to ALPHABET.length inclusive.
   */
  function BigNumber(n, b) {
    var alphabet, c, caseChanged, e, i, isNum, len, str,
      x = this;

    // Enable constructor usage without new.
    if (!(x instanceof BigNumber)) {

      // Don't throw on constructor call without new (#81).
      // '[BigNumber Error] Constructor call without new: {n}'
      //throw Error(bignumberError + ' Constructor call without new: ' + n);
      return new BigNumber(n, b);
    }

    if (b == null) {

      // Duplicate.
      if (n instanceof BigNumber) {
        x.s = n.s;
        x.e = n.e;
        x.c = (n = n.c) ? n.slice() : n;
        return;
      }

      isNum = typeof n == 'number';

      if (isNum && n * 0 == 0) {

        // Use `1 / n` to handle minus zero also.
        x.s = 1 / n < 0 ? (n = -n, -1) : 1;

        // Faster path for integers.
        if (n === ~~n) {
          for (e = 0, i = n; i >= 10; i /= 10, e++);
          x.e = e;
          x.c = [n];
          return;
        }

        str = String(n);
      } else {
        str = String(n);
        if (!isNumeric.test(str)) return parseNumeric(x, str, isNum);
        x.s = str.charCodeAt(0) == 45 ? (str = str.slice(1), -1) : 1;
      }

      // Decimal point?
        if ((e = str.indexOf('.')) > -1) str = str.replace('.', '');

        // Exponential form?
        if ((i = str.search(/e/i)) > 0) {

          // Determine exponent.
          if (e < 0) e = i;
          e += +str.slice(i + 1);
          str = str.substring(0, i);
        } else if (e < 0) {

          // Integer.
          e = str.length;
        }

    } else {

      // '[BigNumber Error] Base {not a primitive number|not an integer|out of range}: {b}'
      intCheck(b, 2, ALPHABET.length, 'Base');
      str = String(n);

      // Allow exponential notation to be used with base 10 argument, while
      // also rounding to DECIMAL_PLACES as with other bases.
      if (b == 10) {
        x = new BigNumber(n instanceof BigNumber ? n : str);
        return round(x, DECIMAL_PLACES + x.e + 1, ROUNDING_MODE);
      }

      isNum = typeof n == 'number';

      if (isNum) {

        // Avoid potential interpretation of Infinity and NaN as base 44+ values.
        if (n * 0 != 0) return parseNumeric(x, str, isNum, b);

        x.s = 1 / n < 0 ? (str = str.slice(1), -1) : 1;

        // '[BigNumber Error] Number primitive has more than 15 significant digits: {n}'
        if (BigNumber.DEBUG && str.replace(/^0\.0*|\./, '').length > 15) {
          throw Error
           (tooManyDigits + n);
        }

        // Prevent later check for length on converted number.
        isNum = false;
      } else {
        x.s = str.charCodeAt(0) === 45 ? (str = str.slice(1), -1) : 1;
      }

      alphabet = ALPHABET.slice(0, b);
      e = i = 0;

      // Check that str is a valid base b number.
      // Don't use RegExp so alphabet can contain special characters.
      for (len = str.length; i < len; i++) {
        if (alphabet.indexOf(c = str.charAt(i)) < 0) {
          if (c == '.') {

            // If '.' is not the first character and it has not be found before.
            if (i > e) {
              e = len;
              continue;
            }
          } else if (!caseChanged) {

            // Allow e.g. hexadecimal 'FF' as well as 'ff'.
            if (str == str.toUpperCase() && (str = str.toLowerCase()) ||
                str == str.toLowerCase() && (str = str.toUpperCase())) {
              caseChanged = true;
              i = -1;
              e = 0;
              continue;
            }
          }

          return parseNumeric(x, String(n), isNum, b);
        }
      }

      str = convertBase(str, b, 10, x.s);

      // Decimal point?
      if ((e = str.indexOf('.')) > -1) str = str.replace('.', '');
      else e = str.length;
    }

    // Determine leading zeros.
    for (i = 0; str.charCodeAt(i) === 48; i++);

    // Determine trailing zeros.
    for (len = str.length; str.charCodeAt(--len) === 48;);

    str = str.slice(i, ++len);

    if (str) {
      len -= i;

      // '[BigNumber Error] Number primitive has more than 15 significant digits: {n}'
      if (isNum && BigNumber.DEBUG &&
        len > 15 && (n > MAX_SAFE_INTEGER || n !== mathfloor(n))) {
          throw Error
           (tooManyDigits + (x.s * n));
      }

      e = e - i - 1;

       // Overflow?
      if (e > MAX_EXP) {

        // Infinity.
        x.c = x.e = null;

      // Underflow?
      } else if (e < MIN_EXP) {

        // Zero.
        x.c = [x.e = 0];
      } else {
        x.e = e;
        x.c = [];

        // Transform base

        // e is the base 10 exponent.
        // i is where to slice str to get the first element of the coefficient array.
        i = (e + 1) % LOG_BASE;
        if (e < 0) i += LOG_BASE;

        if (i < len) {
          if (i) x.c.push(+str.slice(0, i));

          for (len -= LOG_BASE; i < len;) {
            x.c.push(+str.slice(i, i += LOG_BASE));
          }

          str = str.slice(i);
          i = LOG_BASE - str.length;
        } else {
          i -= len;
        }

        for (; i--; str += '0');
        x.c.push(+str);
      }
    } else {

      // Zero.
      x.c = [x.e = 0];
    }
  }


  // CONSTRUCTOR PROPERTIES


  BigNumber.clone = clone;

  BigNumber.ROUND_UP = 0;
  BigNumber.ROUND_DOWN = 1;
  BigNumber.ROUND_CEIL = 2;
  BigNumber.ROUND_FLOOR = 3;
  BigNumber.ROUND_HALF_UP = 4;
  BigNumber.ROUND_HALF_DOWN = 5;
  BigNumber.ROUND_HALF_EVEN = 6;
  BigNumber.ROUND_HALF_CEIL = 7;
  BigNumber.ROUND_HALF_FLOOR = 8;
  BigNumber.EUCLID = 9;


  /*
   * Configure infrequently-changing library-wide settings.
   *
   * Accept an object with the following optional properties (if the value of a property is
   * a number, it must be an integer within the inclusive range stated):
   *
   *   DECIMAL_PLACES   {number}           0 to MAX
   *   ROUNDING_MODE    {number}           0 to 8
   *   EXPONENTIAL_AT   {number|number[]}  -MAX to MAX  or  [-MAX to 0, 0 to MAX]
   *   RANGE            {number|number[]}  -MAX to MAX (not zero)  or  [-MAX to -1, 1 to MAX]
   *   CRYPTO           {boolean}          true or false
   *   MODULO_MODE      {number}           0 to 9
   *   POW_PRECISION       {number}           0 to MAX
   *   ALPHABET         {string}           A string of two or more unique characters which does
   *                                     not contain '.'.
   *   FORMAT           {object}           An object with some of the following properties:
   *     prefix                 {string}
   *     groupSize              {number}
   *     secondaryGroupSize     {number}
   *     groupSeparator         {string}
   *     decimalSeparator       {string}
   *     fractionGroupSize      {number}
   *     fractionGroupSeparator {string}
   *     suffix                 {string}
   *
   * (The values assigned to the above FORMAT object properties are not checked for validity.)
   *
   * E.g.
   * BigNumber.config({ DECIMAL_PLACES : 20, ROUNDING_MODE : 4 })
   *
   * Ignore properties/parameters set to null or undefined, except for ALPHABET.
   *
   * Return an object with the properties current values.
   */
  BigNumber.config = BigNumber.set = function (obj) {
    var p, v;

    if (obj != null) {

      if (typeof obj == 'object') {

        // DECIMAL_PLACES {number} Integer, 0 to MAX inclusive.
        // '[BigNumber Error] DECIMAL_PLACES {not a primitive number|not an integer|out of range}: {v}'
        if (obj.hasOwnProperty(p = 'DECIMAL_PLACES')) {
          v = obj[p];
          intCheck(v, 0, MAX, p);
          DECIMAL_PLACES = v;
        }

        // ROUNDING_MODE {number} Integer, 0 to 8 inclusive.
        // '[BigNumber Error] ROUNDING_MODE {not a primitive number|not an integer|out of range}: {v}'
        if (obj.hasOwnProperty(p = 'ROUNDING_MODE')) {
          v = obj[p];
          intCheck(v, 0, 8, p);
          ROUNDING_MODE = v;
        }

        // EXPONENTIAL_AT {number|number[]}
        // Integer, -MAX to MAX inclusive or
        // [integer -MAX to 0 inclusive, 0 to MAX inclusive].
        // '[BigNumber Error] EXPONENTIAL_AT {not a primitive number|not an integer|out of range}: {v}'
        if (obj.hasOwnProperty(p = 'EXPONENTIAL_AT')) {
          v = obj[p];
          if (v && v.pop) {
            intCheck(v[0], -MAX, 0, p);
            intCheck(v[1], 0, MAX, p);
            TO_EXP_NEG = v[0];
            TO_EXP_POS = v[1];
          } else {
            intCheck(v, -MAX, MAX, p);
            TO_EXP_NEG = -(TO_EXP_POS = v < 0 ? -v : v);
          }
        }

        // RANGE {number|number[]} Non-zero integer, -MAX to MAX inclusive or
        // [integer -MAX to -1 inclusive, integer 1 to MAX inclusive].
        // '[BigNumber Error] RANGE {not a primitive number|not an integer|out of range|cannot be zero}: {v}'
        if (obj.hasOwnProperty(p = 'RANGE')) {
          v = obj[p];
          if (v && v.pop) {
            intCheck(v[0], -MAX, -1, p);
            intCheck(v[1], 1, MAX, p);
            MIN_EXP = v[0];
            MAX_EXP = v[1];
          } else {
            intCheck(v, -MAX, MAX, p);
            if (v) {
              MIN_EXP = -(MAX_EXP = v < 0 ? -v : v);
            } else {
              throw Error
               (bignumberError + p + ' cannot be zero: ' + v);
            }
          }
        }

        // CRYPTO {boolean} true or false.
        // '[BigNumber Error] CRYPTO not true or false: {v}'
        // '[BigNumber Error] crypto unavailable'
        if (obj.hasOwnProperty(p = 'CRYPTO')) {
          v = obj[p];
          if (v === !!v) {
            if (v) {
              if (typeof crypto != 'undefined' && crypto &&
               (crypto.getRandomValues || crypto.randomBytes)) {
                CRYPTO = v;
              } else {
                CRYPTO = !v;
                throw Error
                 (bignumberError + 'crypto unavailable');
              }
            } else {
              CRYPTO = v;
            }
          } else {
            throw Error
             (bignumberError + p + ' not true or false: ' + v);
          }
        }

        // MODULO_MODE {number} Integer, 0 to 9 inclusive.
        // '[BigNumber Error] MODULO_MODE {not a primitive number|not an integer|out of range}: {v}'
        if (obj.hasOwnProperty(p = 'MODULO_MODE')) {
          v = obj[p];
          intCheck(v, 0, 9, p);
          MODULO_MODE = v;
        }

        // POW_PRECISION {number} Integer, 0 to MAX inclusive.
        // '[BigNumber Error] POW_PRECISION {not a primitive number|not an integer|out of range}: {v}'
        if (obj.hasOwnProperty(p = 'POW_PRECISION')) {
          v = obj[p];
          intCheck(v, 0, MAX, p);
          POW_PRECISION = v;
        }

        // FORMAT {object}
        // '[BigNumber Error] FORMAT not an object: {v}'
        if (obj.hasOwnProperty(p = 'FORMAT')) {
          v = obj[p];
          if (typeof v == 'object') FORMAT = v;
          else throw Error
           (bignumberError + p + ' not an object: ' + v);
        }

        // ALPHABET {string}
        // '[BigNumber Error] ALPHABET invalid: {v}'
        if (obj.hasOwnProperty(p = 'ALPHABET')) {
          v = obj[p];

          // Disallow if only one character,
          // or if it contains '+', '-', '.', whitespace, or a repeated character.
          if (typeof v == 'string' && !/^.$|[+-.\s]|(.).*\1/.test(v)) {
            ALPHABET = v;
          } else {
            throw Error
             (bignumberError + p + ' invalid: ' + v);
          }
        }

      } else {

        // '[BigNumber Error] Object expected: {v}'
        throw Error
         (bignumberError + 'Object expected: ' + obj);
      }
    }

    return {
      DECIMAL_PLACES: DECIMAL_PLACES,
      ROUNDING_MODE: ROUNDING_MODE,
      EXPONENTIAL_AT: [TO_EXP_NEG, TO_EXP_POS],
      RANGE: [MIN_EXP, MAX_EXP],
      CRYPTO: CRYPTO,
      MODULO_MODE: MODULO_MODE,
      POW_PRECISION: POW_PRECISION,
      FORMAT: FORMAT,
      ALPHABET: ALPHABET
    };
  };


  /*
   * Return true if v is a BigNumber instance, otherwise return false.
   *
   * v {any}
   */
  BigNumber.isBigNumber = function (v) {
    return Object.prototype.toString.call(v) == '[object BigNumber]';
  };


  /*
   * Return a new BigNumber whose value is the maximum of the arguments.
   *
   * arguments {number|string|BigNumber}
   */
  BigNumber.maximum = BigNumber.max = function () {
    return maxOrMin(arguments, P.lt);
  };


  /*
   * Return a new BigNumber whose value is the minimum of the arguments.
   *
   * arguments {number|string|BigNumber}
   */
  BigNumber.minimum = BigNumber.min = function () {
    return maxOrMin(arguments, P.gt);
  };


  /*
   * Return a new BigNumber with a random value equal to or greater than 0 and less than 1,
   * and with dp, or DECIMAL_PLACES if dp is omitted, decimal places (or less if trailing
   * zeros are produced).
   *
   * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
   *
   * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp}'
   * '[BigNumber Error] crypto unavailable'
   */
  BigNumber.random = (function () {
    var pow2_53 = 0x20000000000000;

    // Return a 53 bit integer n, where 0 <= n < 9007199254740992.
    // Check if Math.random() produces more than 32 bits of randomness.
    // If it does, assume at least 53 bits are produced, otherwise assume at least 30 bits.
    // 0x40000000 is 2^30, 0x800000 is 2^23, 0x1fffff is 2^21 - 1.
    var random53bitInt = (Math.random() * pow2_53) & 0x1fffff
     ? function () { return mathfloor(Math.random() * pow2_53); }
     : function () { return ((Math.random() * 0x40000000 | 0) * 0x800000) +
       (Math.random() * 0x800000 | 0); };

    return function (dp) {
      var a, b, e, k, v,
        i = 0,
        c = [],
        rand = new BigNumber(ONE);

      if (dp == null) dp = DECIMAL_PLACES;
      else intCheck(dp, 0, MAX);

      k = mathceil(dp / LOG_BASE);

      if (CRYPTO) {

        // Browsers supporting crypto.getRandomValues.
        if (crypto.getRandomValues) {

          a = crypto.getRandomValues(new Uint32Array(k *= 2));

          for (; i < k;) {

            // 53 bits:
            // ((Math.pow(2, 32) - 1) * Math.pow(2, 21)).toString(2)
            // 11111 11111111 11111111 11111111 11100000 00000000 00000000
            // ((Math.pow(2, 32) - 1) >>> 11).toString(2)
            //                                     11111 11111111 11111111
            // 0x20000 is 2^21.
            v = a[i] * 0x20000 + (a[i + 1] >>> 11);

            // Rejection sampling:
            // 0 <= v < 9007199254740992
            // Probability that v >= 9e15, is
            // 7199254740992 / 9007199254740992 ~= 0.0008, i.e. 1 in 1251
            if (v >= 9e15) {
              b = crypto.getRandomValues(new Uint32Array(2));
              a[i] = b[0];
              a[i + 1] = b[1];
            } else {

              // 0 <= v <= 8999999999999999
              // 0 <= (v % 1e14) <= 99999999999999
              c.push(v % 1e14);
              i += 2;
            }
          }
          i = k / 2;

        // Node.js supporting crypto.randomBytes.
        } else if (crypto.randomBytes) {

          // buffer
          a = crypto.randomBytes(k *= 7);

          for (; i < k;) {

            // 0x1000000000000 is 2^48, 0x10000000000 is 2^40
            // 0x100000000 is 2^32, 0x1000000 is 2^24
            // 11111 11111111 11111111 11111111 11111111 11111111 11111111
            // 0 <= v < 9007199254740992
            v = ((a[i] & 31) * 0x1000000000000) + (a[i + 1] * 0x10000000000) +
               (a[i + 2] * 0x100000000) + (a[i + 3] * 0x1000000) +
               (a[i + 4] << 16) + (a[i + 5] << 8) + a[i + 6];

            if (v >= 9e15) {
              crypto.randomBytes(7).copy(a, i);
            } else {

              // 0 <= (v % 1e14) <= 99999999999999
              c.push(v % 1e14);
              i += 7;
            }
          }
          i = k / 7;
        } else {
          CRYPTO = false;
          throw Error
           (bignumberError + 'crypto unavailable');
        }
      }

      // Use Math.random.
      if (!CRYPTO) {

        for (; i < k;) {
          v = random53bitInt();
          if (v < 9e15) c[i++] = v % 1e14;
        }
      }

      k = c[--i];
      dp %= LOG_BASE;

      // Convert trailing digits to zeros according to dp.
      if (k && dp) {
        v = POWS_TEN[LOG_BASE - dp];
        c[i] = mathfloor(k / v) * v;
      }

      // Remove trailing elements which are zero.
      for (; c[i] === 0; c.pop(), i--);

      // Zero?
      if (i < 0) {
        c = [e = 0];
      } else {

        // Remove leading elements which are zero and adjust exponent accordingly.
        for (e = -1 ; c[0] === 0; c.splice(0, 1), e -= LOG_BASE);

        // Count the digits of the first element of c to determine leading zeros, and...
        for (i = 1, v = c[0]; v >= 10; v /= 10, i++);

        // adjust the exponent accordingly.
        if (i < LOG_BASE) e -= LOG_BASE - i;
      }

      rand.e = e;
      rand.c = c;
      return rand;
    };
  })();


   /*
   * Return a BigNumber whose value is the sum of the arguments.
   *
   * arguments {number|string|BigNumber}
   */
  BigNumber.sum = function () {
    var i = 1,
      args = arguments,
      sum = new BigNumber(args[0]);
    for (; i < args.length;) sum = sum.plus(args[i++]);
    return sum;
  };  

  
  // PRIVATE FUNCTIONS


  // Called by BigNumber and BigNumber.prototype.toString.
  convertBase = (function () {
    var decimal = '0123456789';

    /*
     * Convert string of baseIn to an array of numbers of baseOut.
     * Eg. toBaseOut('255', 10, 16) returns [15, 15].
     * Eg. toBaseOut('ff', 16, 10) returns [2, 5, 5].
     */
    function toBaseOut(str, baseIn, baseOut, alphabet) {
      var j,
        arr = [0],
        arrL,
        i = 0,
        len = str.length;

      for (; i < len;) {
        for (arrL = arr.length; arrL--; arr[arrL] *= baseIn);

        arr[0] += alphabet.indexOf(str.charAt(i++));

        for (j = 0; j < arr.length; j++) {

          if (arr[j] > baseOut - 1) {
            if (arr[j + 1] == null) arr[j + 1] = 0;
            arr[j + 1] += arr[j] / baseOut | 0;
            arr[j] %= baseOut;
          }
        }
      }

      return arr.reverse();
    }

    // Convert a numeric string of baseIn to a numeric string of baseOut.
    // If the caller is toString, we are converting from base 10 to baseOut.
    // If the caller is BigNumber, we are converting from baseIn to base 10.
    return function (str, baseIn, baseOut, sign, callerIsToString) {
      var alphabet, d, e, k, r, x, xc, y,
        i = str.indexOf('.'),
        dp = DECIMAL_PLACES,
        rm = ROUNDING_MODE;

      // Non-integer.
      if (i >= 0) {
        k = POW_PRECISION;

        // Unlimited precision.
        POW_PRECISION = 0;
        str = str.replace('.', '');
        y = new BigNumber(baseIn);
        x = y.pow(str.length - i);
        POW_PRECISION = k;

        // Convert str as if an integer, then restore the fraction part by dividing the
        // result by its base raised to a power.

        y.c = toBaseOut(toFixedPoint(coeffToString(x.c), x.e, '0'),
         10, baseOut, decimal);
        y.e = y.c.length;
      }

      // Convert the number as integer.

      xc = toBaseOut(str, baseIn, baseOut, callerIsToString
       ? (alphabet = ALPHABET, decimal)
       : (alphabet = decimal, ALPHABET));

      // xc now represents str as an integer and converted to baseOut. e is the exponent.
      e = k = xc.length;

      // Remove trailing zeros.
      for (; xc[--k] == 0; xc.pop());

      // Zero?
      if (!xc[0]) return alphabet.charAt(0);

      // Does str represent an integer? If so, no need for the division.
      if (i < 0) {
        --e;
      } else {
        x.c = xc;
        x.e = e;

        // The sign is needed for correct rounding.
        x.s = sign;
        x = div(x, y, dp, rm, baseOut);
        xc = x.c;
        r = x.r;
        e = x.e;
      }

      // xc now represents str converted to baseOut.

      // THe index of the rounding digit.
      d = e + dp + 1;

      // The rounding digit: the digit to the right of the digit that may be rounded up.
      i = xc[d];

      // Look at the rounding digits and mode to determine whether to round up.

      k = baseOut / 2;
      r = r || d < 0 || xc[d + 1] != null;

      r = rm < 4 ? (i != null || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2))
            : i > k || i == k &&(rm == 4 || r || rm == 6 && xc[d - 1] & 1 ||
             rm == (x.s < 0 ? 8 : 7));

      // If the index of the rounding digit is not greater than zero, or xc represents
      // zero, then the result of the base conversion is zero or, if rounding up, a value
      // such as 0.00001.
      if (d < 1 || !xc[0]) {

        // 1^-dp or 0
        str = r ? toFixedPoint(alphabet.charAt(1), -dp, alphabet.charAt(0)) : alphabet.charAt(0);
      } else {

        // Truncate xc to the required number of decimal places.
        xc.length = d;

        // Round up?
        if (r) {

          // Rounding up may mean the previous digit has to be rounded up and so on.
          for (--baseOut; ++xc[--d] > baseOut;) {
            xc[d] = 0;

            if (!d) {
              ++e;
              xc = [1].concat(xc);
            }
          }
        }

        // Determine trailing zeros.
        for (k = xc.length; !xc[--k];);

        // E.g. [4, 11, 15] becomes 4bf.
        for (i = 0, str = ''; i <= k; str += alphabet.charAt(xc[i++]));

        // Add leading zeros, decimal point and trailing zeros as required.
        str = toFixedPoint(str, e, alphabet.charAt(0));
      }

      // The caller will add the sign.
      return str;
    };
  })();


  // Perform division in the specified base. Called by div and convertBase.
  div = (function () {

    // Assume non-zero x and k.
    function multiply(x, k, base) {
      var m, temp, xlo, xhi,
        carry = 0,
        i = x.length,
        klo = k % SQRT_BASE,
        khi = k / SQRT_BASE | 0;

      for (x = x.slice(); i--;) {
        xlo = x[i] % SQRT_BASE;
        xhi = x[i] / SQRT_BASE | 0;
        m = khi * xlo + xhi * klo;
        temp = klo * xlo + ((m % SQRT_BASE) * SQRT_BASE) + carry;
        carry = (temp / base | 0) + (m / SQRT_BASE | 0) + khi * xhi;
        x[i] = temp % base;
      }

      if (carry) x = [carry].concat(x);

      return x;
    }

    function compare(a, b, aL, bL) {
      var i, cmp;

      if (aL != bL) {
        cmp = aL > bL ? 1 : -1;
      } else {

        for (i = cmp = 0; i < aL; i++) {

          if (a[i] != b[i]) {
            cmp = a[i] > b[i] ? 1 : -1;
            break;
          }
        }
      }

      return cmp;
    }

    function subtract(a, b, aL, base) {
      var i = 0;

      // Subtract b from a.
      for (; aL--;) {
        a[aL] -= i;
        i = a[aL] < b[aL] ? 1 : 0;
        a[aL] = i * base + a[aL] - b[aL];
      }

      // Remove leading zeros.
      for (; !a[0] && a.length > 1; a.splice(0, 1));
    }

    // x: dividend, y: divisor.
    return function (x, y, dp, rm, base) {
      var cmp, e, i, more, n, prod, prodL, q, qc, rem, remL, rem0, xi, xL, yc0,
        yL, yz,
        s = x.s == y.s ? 1 : -1,
        xc = x.c,
        yc = y.c;

      // Either NaN, Infinity or 0?
      if (!xc || !xc[0] || !yc || !yc[0]) {

        return new BigNumber(

         // Return NaN if either NaN, or both Infinity or 0.
         !x.s || !y.s || (xc ? yc && xc[0] == yc[0] : !yc) ? NaN :

          // Return ±0 if x is ±0 or y is ±Infinity, or return ±Infinity as y is ±0.
          xc && xc[0] == 0 || !yc ? s * 0 : s / 0
       );
      }

      q = new BigNumber(s);
      qc = q.c = [];
      e = x.e - y.e;
      s = dp + e + 1;

      if (!base) {
        base = BASE;
        e = bitFloor(x.e / LOG_BASE) - bitFloor(y.e / LOG_BASE);
        s = s / LOG_BASE | 0;
      }

      // Result exponent may be one less then the current value of e.
      // The coefficients of the BigNumbers from convertBase may have trailing zeros.
      for (i = 0; yc[i] == (xc[i] || 0); i++);

      if (yc[i] > (xc[i] || 0)) e--;

      if (s < 0) {
        qc.push(1);
        more = true;
      } else {
        xL = xc.length;
        yL = yc.length;
        i = 0;
        s += 2;

        // Normalise xc and yc so highest order digit of yc is >= base / 2.

        n = mathfloor(base / (yc[0] + 1));

        // Not necessary, but to handle odd bases where yc[0] == (base / 2) - 1.
        // if (n > 1 || n++ == 1 && yc[0] < base / 2) {
        if (n > 1) {
          yc = multiply(yc, n, base);
          xc = multiply(xc, n, base);
          yL = yc.length;
          xL = xc.length;
        }

        xi = yL;
        rem = xc.slice(0, yL);
        remL = rem.length;

        // Add zeros to make remainder as long as divisor.
        for (; remL < yL; rem[remL++] = 0);
        yz = yc.slice();
        yz = [0].concat(yz);
        yc0 = yc[0];
        if (yc[1] >= base / 2) yc0++;
        // Not necessary, but to prevent trial digit n > base, when using base 3.
        // else if (base == 3 && yc0 == 1) yc0 = 1 + 1e-15;

        do {
          n = 0;

          // Compare divisor and remainder.
          cmp = compare(yc, rem, yL, remL);

          // If divisor < remainder.
          if (cmp < 0) {

            // Calculate trial digit, n.

            rem0 = rem[0];
            if (yL != remL) rem0 = rem0 * base + (rem[1] || 0);

            // n is how many times the divisor goes into the current remainder.
            n = mathfloor(rem0 / yc0);

            //  Algorithm:
            //  product = divisor multiplied by trial digit (n).
            //  Compare product and remainder.
            //  If product is greater than remainder:
            //    Subtract divisor from product, decrement trial digit.
            //  Subtract product from remainder.
            //  If product was less than remainder at the last compare:
            //    Compare new remainder and divisor.
            //    If remainder is greater than divisor:
            //      Subtract divisor from remainder, increment trial digit.

            if (n > 1) {

              // n may be > base only when base is 3.
              if (n >= base) n = base - 1;

              // product = divisor * trial digit.
              prod = multiply(yc, n, base);
              prodL = prod.length;
              remL = rem.length;

              // Compare product and remainder.
              // If product > remainder then trial digit n too high.
              // n is 1 too high about 5% of the time, and is not known to have
              // ever been more than 1 too high.
              while (compare(prod, rem, prodL, remL) == 1) {
                n--;

                // Subtract divisor from product.
                subtract(prod, yL < prodL ? yz : yc, prodL, base);
                prodL = prod.length;
                cmp = 1;
              }
            } else {

              // n is 0 or 1, cmp is -1.
              // If n is 0, there is no need to compare yc and rem again below,
              // so change cmp to 1 to avoid it.
              // If n is 1, leave cmp as -1, so yc and rem are compared again.
              if (n == 0) {

                // divisor < remainder, so n must be at least 1.
                cmp = n = 1;
              }

              // product = divisor
              prod = yc.slice();
              prodL = prod.length;
            }

            if (prodL < remL) prod = [0].concat(prod);

            // Subtract product from remainder.
            subtract(rem, prod, remL, base);
            remL = rem.length;

             // If product was < remainder.
            if (cmp == -1) {

              // Compare divisor and new remainder.
              // If divisor < new remainder, subtract divisor from remainder.
              // Trial digit n too low.
              // n is 1 too low about 5% of the time, and very rarely 2 too low.
              while (compare(yc, rem, yL, remL) < 1) {
                n++;

                // Subtract divisor from remainder.
                subtract(rem, yL < remL ? yz : yc, remL, base);
                remL = rem.length;
              }
            }
          } else if (cmp === 0) {
            n++;
            rem = [0];
          } // else cmp === 1 and n will be 0

          // Add the next digit, n, to the result array.
          qc[i++] = n;

          // Update the remainder.
          if (rem[0]) {
            rem[remL++] = xc[xi] || 0;
          } else {
            rem = [xc[xi]];
            remL = 1;
          }
        } while ((xi++ < xL || rem[0] != null) && s--);

        more = rem[0] != null;

        // Leading zero?
        if (!qc[0]) qc.splice(0, 1);
      }

      if (base == BASE) {

        // To calculate q.e, first get the number of digits of qc[0].
        for (i = 1, s = qc[0]; s >= 10; s /= 10, i++);

        round(q, dp + (q.e = i + e * LOG_BASE - 1) + 1, rm, more);

      // Caller is convertBase.
      } else {
        q.e = e;
        q.r = +more;
      }

      return q;
    };
  })();


  /*
   * Return a string representing the value of BigNumber n in fixed-point or exponential
   * notation rounded to the specified decimal places or significant digits.
   *
   * n: a BigNumber.
   * i: the index of the last digit required (i.e. the digit that may be rounded up).
   * rm: the rounding mode.
   * id: 1 (toExponential) or 2 (toPrecision).
   */
  function format(n, i, rm, id) {
    var c0, e, ne, len, str;

    if (rm == null) rm = ROUNDING_MODE;
    else intCheck(rm, 0, 8);

    if (!n.c) return n.toString();

    c0 = n.c[0];
    ne = n.e;

    if (i == null) {
      str = coeffToString(n.c);
      str = id == 1 || id == 2 && ne <= TO_EXP_NEG
       ? toExponential(str, ne)
       : toFixedPoint(str, ne, '0');
    } else {
      n = round(new BigNumber(n), i, rm);

      // n.e may have changed if the value was rounded up.
      e = n.e;

      str = coeffToString(n.c);
      len = str.length;

      // toPrecision returns exponential notation if the number of significant digits
      // specified is less than the number of digits necessary to represent the integer
      // part of the value in fixed-point notation.

      // Exponential notation.
      if (id == 1 || id == 2 && (i <= e || e <= TO_EXP_NEG)) {

        // Append zeros?
        for (; len < i; str += '0', len++);
        str = toExponential(str, e);

      // Fixed-point notation.
      } else {
        i -= ne;
        str = toFixedPoint(str, e, '0');

        // Append zeros?
        if (e + 1 > len) {
          if (--i > 0) for (str += '.'; i--; str += '0');
        } else {
          i += e - len;
          if (i > 0) {
            if (e + 1 == len) str += '.';
            for (; i--; str += '0');
          }
        }
      }
    }

    return n.s < 0 && c0 ? '-' + str : str;
  }


  // Handle BigNumber.max and BigNumber.min.
  function maxOrMin(args, method) {
    var n,
      i = 1,
      m = new BigNumber(args[0]);

    for (; i < args.length; i++) {
      n = new BigNumber(args[i]);

      // If any number is NaN, return NaN.
      if (!n.s) {
        m = n;
        break;
      } else if (method.call(m, n)) {
        m = n;
      }
    }

    return m;
  }


  /*
   * Strip trailing zeros, calculate base 10 exponent and check against MIN_EXP and MAX_EXP.
   * Called by minus, plus and times.
   */
  function normalise(n, c, e) {
    var i = 1,
      j = c.length;

     // Remove trailing zeros.
    for (; !c[--j]; c.pop());

    // Calculate the base 10 exponent. First get the number of digits of c[0].
    for (j = c[0]; j >= 10; j /= 10, i++);

    // Overflow?
    if ((e = i + e * LOG_BASE - 1) > MAX_EXP) {

      // Infinity.
      n.c = n.e = null;

    // Underflow?
    } else if (e < MIN_EXP) {

      // Zero.
      n.c = [n.e = 0];
    } else {
      n.e = e;
      n.c = c;
    }

    return n;
  }


  // Handle values that fail the validity test in BigNumber.
  parseNumeric = (function () {
    var basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i,
      dotAfter = /^([^.]+)\.$/,
      dotBefore = /^\.([^.]+)$/,
      isInfinityOrNaN = /^-?(Infinity|NaN)$/,
      whitespaceOrPlus = /^\s*\+(?=[\w.])|^\s+|\s+$/g;

    return function (x, str, isNum, b) {
      var base,
        s = isNum ? str : str.replace(whitespaceOrPlus, '');

      // No exception on ±Infinity or NaN.
      if (isInfinityOrNaN.test(s)) {
        x.s = isNaN(s) ? null : s < 0 ? -1 : 1;
        x.c = x.e = null;
      } else {
        if (!isNum) {

          // basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i
          s = s.replace(basePrefix, function (m, p1, p2) {
            base = (p2 = p2.toLowerCase()) == 'x' ? 16 : p2 == 'b' ? 2 : 8;
            return !b || b == base ? p1 : m;
          });

          if (b) {
            base = b;

            // E.g. '1.' to '1', '.1' to '0.1'
            s = s.replace(dotAfter, '$1').replace(dotBefore, '0.$1');
          }

          if (str != s) return new BigNumber(s, base);
        }

        // '[BigNumber Error] Not a number: {n}'
        // '[BigNumber Error] Not a base {b} number: {n}'
        if (BigNumber.DEBUG) {
          throw Error
            (bignumberError + 'Not a' + (b ? ' base ' + b : '') + ' number: ' + str);
        }

        // NaN
        x.c = x.e = x.s = null;
      }
    }
  })();


  /*
   * Round x to sd significant digits using rounding mode rm. Check for over/under-flow.
   * If r is truthy, it is known that there are more digits after the rounding digit.
   */
  function round(x, sd, rm, r) {
    var d, i, j, k, n, ni, rd,
      xc = x.c,
      pows10 = POWS_TEN;

    // if x is not Infinity or NaN...
    if (xc) {

      // rd is the rounding digit, i.e. the digit after the digit that may be rounded up.
      // n is a base 1e14 number, the value of the element of array x.c containing rd.
      // ni is the index of n within x.c.
      // d is the number of digits of n.
      // i is the index of rd within n including leading zeros.
      // j is the actual index of rd within n (if < 0, rd is a leading zero).
      out: {

        // Get the number of digits of the first element of xc.
        for (d = 1, k = xc[0]; k >= 10; k /= 10, d++);
        i = sd - d;

        // If the rounding digit is in the first element of xc...
        if (i < 0) {
          i += LOG_BASE;
          j = sd;
          n = xc[ni = 0];

          // Get the rounding digit at index j of n.
          rd = n / pows10[d - j - 1] % 10 | 0;
        } else {
          ni = mathceil((i + 1) / LOG_BASE);

          if (ni >= xc.length) {

            if (r) {

              // Needed by sqrt.
              for (; xc.length <= ni; xc.push(0));
              n = rd = 0;
              d = 1;
              i %= LOG_BASE;
              j = i - LOG_BASE + 1;
            } else {
              break out;
            }
          } else {
            n = k = xc[ni];

            // Get the number of digits of n.
            for (d = 1; k >= 10; k /= 10, d++);

            // Get the index of rd within n.
            i %= LOG_BASE;

            // Get the index of rd within n, adjusted for leading zeros.
            // The number of leading zeros of n is given by LOG_BASE - d.
            j = i - LOG_BASE + d;

            // Get the rounding digit at index j of n.
            rd = j < 0 ? 0 : n / pows10[d - j - 1] % 10 | 0;
          }
        }

        r = r || sd < 0 ||

        // Are there any non-zero digits after the rounding digit?
        // The expression  n % pows10[d - j - 1]  returns all digits of n to the right
        // of the digit at j, e.g. if n is 908714 and j is 2, the expression gives 714.
         xc[ni + 1] != null || (j < 0 ? n : n % pows10[d - j - 1]);

        r = rm < 4
         ? (rd || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2))
         : rd > 5 || rd == 5 && (rm == 4 || r || rm == 6 &&

          // Check whether the digit to the left of the rounding digit is odd.
          ((i > 0 ? j > 0 ? n / pows10[d - j] : 0 : xc[ni - 1]) % 10) & 1 ||
           rm == (x.s < 0 ? 8 : 7));

        if (sd < 1 || !xc[0]) {
          xc.length = 0;

          if (r) {

            // Convert sd to decimal places.
            sd -= x.e + 1;

            // 1, 0.1, 0.01, 0.001, 0.0001 etc.
            xc[0] = pows10[(LOG_BASE - sd % LOG_BASE) % LOG_BASE];
            x.e = -sd || 0;
          } else {

            // Zero.
            xc[0] = x.e = 0;
          }

          return x;
        }

        // Remove excess digits.
        if (i == 0) {
          xc.length = ni;
          k = 1;
          ni--;
        } else {
          xc.length = ni + 1;
          k = pows10[LOG_BASE - i];

          // E.g. 56700 becomes 56000 if 7 is the rounding digit.
          // j > 0 means i > number of leading zeros of n.
          xc[ni] = j > 0 ? mathfloor(n / pows10[d - j] % pows10[j]) * k : 0;
        }

        // Round up?
        if (r) {

          for (; ;) {

            // If the digit to be rounded up is in the first element of xc...
            if (ni == 0) {

              // i will be the length of xc[0] before k is added.
              for (i = 1, j = xc[0]; j >= 10; j /= 10, i++);
              j = xc[0] += k;
              for (k = 1; j >= 10; j /= 10, k++);

              // if i != k the length has increased.
              if (i != k) {
                x.e++;
                if (xc[0] == BASE) xc[0] = 1;
              }

              break;
            } else {
              xc[ni] += k;
              if (xc[ni] != BASE) break;
              xc[ni--] = 0;
              k = 1;
            }
          }
        }

        // Remove trailing zeros.
        for (i = xc.length; xc[--i] === 0; xc.pop());
      }

      // Overflow? Infinity.
      if (x.e > MAX_EXP) {
        x.c = x.e = null;

      // Underflow? Zero.
      } else if (x.e < MIN_EXP) {
        x.c = [x.e = 0];
      }
    }

    return x;
  }


  function valueOf(n) {
    var str,
      e = n.e;

    if (e === null) return n.toString();

    str = coeffToString(n.c);

    str = e <= TO_EXP_NEG || e >= TO_EXP_POS
      ? toExponential(str, e)
      : toFixedPoint(str, e, '0');

    return n.s < 0 ? '-' + str : str;
  }


  // PROTOTYPE/INSTANCE METHODS


  /*
   * Return a new BigNumber whose value is the absolute value of this BigNumber.
   */
  P.absoluteValue = P.abs = function () {
    var x = new BigNumber(this);
    if (x.s < 0) x.s = 1;
    return x;
  };


  /*
   * Return
   *   1 if the value of this BigNumber is greater than the value of BigNumber(y, b),
   *   -1 if the value of this BigNumber is less than the value of BigNumber(y, b),
   *   0 if they have the same value,
   *   or null if the value of either is NaN.
   */
  P.comparedTo = function (y, b) {
    return compare(this, new BigNumber(y, b));
  };


  /*
   * If dp is undefined or null or true or false, return the number of decimal places of the
   * value of this BigNumber, or null if the value of this BigNumber is ±Infinity or NaN.
   *
   * Otherwise, if dp is a number, return a new BigNumber whose value is the value of this
   * BigNumber rounded to a maximum of dp decimal places using rounding mode rm, or
   * ROUNDING_MODE if rm is omitted.
   *
   * [dp] {number} Decimal places: integer, 0 to MAX inclusive.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
   */
  P.decimalPlaces = P.dp = function (dp, rm) {
    var c, n, v,
      x = this;

    if (dp != null) {
      intCheck(dp, 0, MAX);
      if (rm == null) rm = ROUNDING_MODE;
      else intCheck(rm, 0, 8);

      return round(new BigNumber(x), dp + x.e + 1, rm);
    }

    if (!(c = x.c)) return null;
    n = ((v = c.length - 1) - bitFloor(this.e / LOG_BASE)) * LOG_BASE;

    // Subtract the number of trailing zeros of the last number.
    if (v = c[v]) for (; v % 10 == 0; v /= 10, n--);
    if (n < 0) n = 0;

    return n;
  };


  /*
   *  n / 0 = I
   *  n / N = N
   *  n / I = 0
   *  0 / n = 0
   *  0 / 0 = N
   *  0 / N = N
   *  0 / I = 0
   *  N / n = N
   *  N / 0 = N
   *  N / N = N
   *  N / I = N
   *  I / n = I
   *  I / 0 = I
   *  I / N = N
   *  I / I = N
   *
   * Return a new BigNumber whose value is the value of this BigNumber divided by the value of
   * BigNumber(y, b), rounded according to DECIMAL_PLACES and ROUNDING_MODE.
   */
  P.dividedBy = P.div = function (y, b) {
    return div(this, new BigNumber(y, b), DECIMAL_PLACES, ROUNDING_MODE);
  };


  /*
   * Return a new BigNumber whose value is the integer part of dividing the value of this
   * BigNumber by the value of BigNumber(y, b).
   */
  P.dividedToIntegerBy = P.idiv = function (y, b) {
    return div(this, new BigNumber(y, b), 0, 1);
  };


  /*
   * Return a BigNumber whose value is the value of this BigNumber exponentiated by n.
   *
   * If m is present, return the result modulo m.
   * If n is negative round according to DECIMAL_PLACES and ROUNDING_MODE.
   * If POW_PRECISION is non-zero and m is not present, round to POW_PRECISION using ROUNDING_MODE.
   *
   * The modular power operation works efficiently when x, n, and m are integers, otherwise it
   * is equivalent to calculating x.exponentiatedBy(n).modulo(m) with a POW_PRECISION of 0.
   *
   * n {number|string|BigNumber} The exponent. An integer.
   * [m] {number|string|BigNumber} The modulus.
   *
   * '[BigNumber Error] Exponent not an integer: {n}'
   */
  P.exponentiatedBy = P.pow = function (n, m) {
    var half, isModExp, i, k, more, nIsBig, nIsNeg, nIsOdd, y,
      x = this;

    n = new BigNumber(n);

    // Allow NaN and ±Infinity, but not other non-integers.
    if (n.c && !n.isInteger()) {
      throw Error
        (bignumberError + 'Exponent not an integer: ' + valueOf(n));
    }

    if (m != null) m = new BigNumber(m);

    // Exponent of MAX_SAFE_INTEGER is 15.
    nIsBig = n.e > 14;

    // If x is NaN, ±Infinity, ±0 or ±1, or n is ±Infinity, NaN or ±0.
    if (!x.c || !x.c[0] || x.c[0] == 1 && !x.e && x.c.length == 1 || !n.c || !n.c[0]) {

      // The sign of the result of pow when x is negative depends on the evenness of n.
      // If +n overflows to ±Infinity, the evenness of n would be not be known.
      y = new BigNumber(Math.pow(+valueOf(x), nIsBig ? 2 - isOdd(n) : +valueOf(n)));
      return m ? y.mod(m) : y;
    }

    nIsNeg = n.s < 0;

    if (m) {

      // x % m returns NaN if abs(m) is zero, or m is NaN.
      if (m.c ? !m.c[0] : !m.s) return new BigNumber(NaN);

      isModExp = !nIsNeg && x.isInteger() && m.isInteger();

      if (isModExp) x = x.mod(m);

    // Overflow to ±Infinity: >=2**1e10 or >=1.0000024**1e15.
    // Underflow to ±0: <=0.79**1e10 or <=0.9999975**1e15.
    } else if (n.e > 9 && (x.e > 0 || x.e < -1 || (x.e == 0
      // [1, 240000000]
      ? x.c[0] > 1 || nIsBig && x.c[1] >= 24e7
      // [80000000000000]  [99999750000000]
      : x.c[0] < 8e13 || nIsBig && x.c[0] <= 9999975e7))) {

      // If x is negative and n is odd, k = -0, else k = 0.
      k = x.s < 0 && isOdd(n) ? -0 : 0;

      // If x >= 1, k = ±Infinity.
      if (x.e > -1) k = 1 / k;

      // If n is negative return ±0, else return ±Infinity.
      return new BigNumber(nIsNeg ? 1 / k : k);

    } else if (POW_PRECISION) {

      // Truncating each coefficient array to a length of k after each multiplication
      // equates to truncating significant digits to POW_PRECISION + [28, 41],
      // i.e. there will be a minimum of 28 guard digits retained.
      k = mathceil(POW_PRECISION / LOG_BASE + 2);
    }

    if (nIsBig) {
      half = new BigNumber(0.5);
      if (nIsNeg) n.s = 1;
      nIsOdd = isOdd(n);
    } else {
      i = Math.abs(+valueOf(n));
      nIsOdd = i % 2;
    }

    y = new BigNumber(ONE);

    // Performs 54 loop iterations for n of 9007199254740991.
    for (; ;) {

      if (nIsOdd) {
        y = y.times(x);
        if (!y.c) break;

        if (k) {
          if (y.c.length > k) y.c.length = k;
        } else if (isModExp) {
          y = y.mod(m);    //y = y.minus(div(y, m, 0, MODULO_MODE).times(m));
        }
      }

      if (i) {
        i = mathfloor(i / 2);
        if (i === 0) break;
        nIsOdd = i % 2;
      } else {
        n = n.times(half);
        round(n, n.e + 1, 1);

        if (n.e > 14) {
          nIsOdd = isOdd(n);
        } else {
          i = +valueOf(n);
          if (i === 0) break;
          nIsOdd = i % 2;
        }
      }

      x = x.times(x);

      if (k) {
        if (x.c && x.c.length > k) x.c.length = k;
      } else if (isModExp) {
        x = x.mod(m);    //x = x.minus(div(x, m, 0, MODULO_MODE).times(m));
      }
    }

    if (isModExp) return y;
    if (nIsNeg) y = ONE.div(y);

    return m ? y.mod(m) : k ? round(y, POW_PRECISION, ROUNDING_MODE, more) : y;
  };


  /*
   * Return a new BigNumber whose value is the value of this BigNumber rounded to an integer
   * using rounding mode rm, or ROUNDING_MODE if rm is omitted.
   *
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {rm}'
   */
  P.integerValue = function (rm) {
    var n = new BigNumber(this);
    if (rm == null) rm = ROUNDING_MODE;
    else intCheck(rm, 0, 8);
    return round(n, n.e + 1, rm);
  };


  /*
   * Return true if the value of this BigNumber is equal to the value of BigNumber(y, b),
   * otherwise return false.
   */
  P.isEqualTo = P.eq = function (y, b) {
    return compare(this, new BigNumber(y, b)) === 0;
  };


  /*
   * Return true if the value of this BigNumber is a finite number, otherwise return false.
   */
  P.isFinite = function () {
    return !!this.c;
  };


  /*
   * Return true if the value of this BigNumber is greater than the value of BigNumber(y, b),
   * otherwise return false.
   */
  P.isGreaterThan = P.gt = function (y, b) {
    return compare(this, new BigNumber(y, b)) > 0;
  };


  /*
   * Return true if the value of this BigNumber is greater than or equal to the value of
   * BigNumber(y, b), otherwise return false.
   */
  P.isGreaterThanOrEqualTo = P.gte = function (y, b) {
    return (b = compare(this, new BigNumber(y, b))) === 1 || b === 0;

  };


  /*
   * Return true if the value of this BigNumber is an integer, otherwise return false.
   */
  P.isInteger = function () {
    return !!this.c && bitFloor(this.e / LOG_BASE) > this.c.length - 2;
  };


  /*
   * Return true if the value of this BigNumber is less than the value of BigNumber(y, b),
   * otherwise return false.
   */
  P.isLessThan = P.lt = function (y, b) {
    return compare(this, new BigNumber(y, b)) < 0;
  };


  /*
   * Return true if the value of this BigNumber is less than or equal to the value of
   * BigNumber(y, b), otherwise return false.
   */
  P.isLessThanOrEqualTo = P.lte = function (y, b) {
    return (b = compare(this, new BigNumber(y, b))) === -1 || b === 0;
  };


  /*
   * Return true if the value of this BigNumber is NaN, otherwise return false.
   */
  P.isNaN = function () {
    return !this.s;
  };


  /*
   * Return true if the value of this BigNumber is negative, otherwise return false.
   */
  P.isNegative = function () {
    return this.s < 0;
  };


  /*
   * Return true if the value of this BigNumber is positive, otherwise return false.
   */
  P.isPositive = function () {
    return this.s > 0;
  };


  /*
   * Return true if the value of this BigNumber is 0 or -0, otherwise return false.
   */
  P.isZero = function () {
    return !!this.c && this.c[0] == 0;
  };


  /*
   *  n - 0 = n
   *  n - N = N
   *  n - I = -I
   *  0 - n = -n
   *  0 - 0 = 0
   *  0 - N = N
   *  0 - I = -I
   *  N - n = N
   *  N - 0 = N
   *  N - N = N
   *  N - I = N
   *  I - n = I
   *  I - 0 = I
   *  I - N = N
   *  I - I = N
   *
   * Return a new BigNumber whose value is the value of this BigNumber minus the value of
   * BigNumber(y, b).
   */
  P.minus = function (y, b) {
    var i, j, t, xLTy,
      x = this,
      a = x.s;

    y = new BigNumber(y, b);
    b = y.s;

    // Either NaN?
    if (!a || !b) return new BigNumber(NaN);

    // Signs differ?
    if (a != b) {
      y.s = -b;
      return x.plus(y);
    }

    var xe = x.e / LOG_BASE,
      ye = y.e / LOG_BASE,
      xc = x.c,
      yc = y.c;

    if (!xe || !ye) {

      // Either Infinity?
      if (!xc || !yc) return xc ? (y.s = -b, y) : new BigNumber(yc ? x : NaN);

      // Either zero?
      if (!xc[0] || !yc[0]) {

        // Return y if y is non-zero, x if x is non-zero, or zero if both are zero.
        return yc[0] ? (y.s = -b, y) : new BigNumber(xc[0] ? x :

         // IEEE 754 (2008) 6.3: n - n = -0 when rounding to -Infinity
         ROUNDING_MODE == 3 ? -0 : 0);
      }
    }

    xe = bitFloor(xe);
    ye = bitFloor(ye);
    xc = xc.slice();

    // Determine which is the bigger number.
    if (a = xe - ye) {

      if (xLTy = a < 0) {
        a = -a;
        t = xc;
      } else {
        ye = xe;
        t = yc;
      }

      t.reverse();

      // Prepend zeros to equalise exponents.
      for (b = a; b--; t.push(0));
      t.reverse();
    } else {

      // Exponents equal. Check digit by digit.
      j = (xLTy = (a = xc.length) < (b = yc.length)) ? a : b;

      for (a = b = 0; b < j; b++) {

        if (xc[b] != yc[b]) {
          xLTy = xc[b] < yc[b];
          break;
        }
      }
    }

    // x < y? Point xc to the array of the bigger number.
    if (xLTy) t = xc, xc = yc, yc = t, y.s = -y.s;

    b = (j = yc.length) - (i = xc.length);

    // Append zeros to xc if shorter.
    // No need to add zeros to yc if shorter as subtract only needs to start at yc.length.
    if (b > 0) for (; b--; xc[i++] = 0);
    b = BASE - 1;

    // Subtract yc from xc.
    for (; j > a;) {

      if (xc[--j] < yc[j]) {
        for (i = j; i && !xc[--i]; xc[i] = b);
        --xc[i];
        xc[j] += BASE;
      }

      xc[j] -= yc[j];
    }

    // Remove leading zeros and adjust exponent accordingly.
    for (; xc[0] == 0; xc.splice(0, 1), --ye);

    // Zero?
    if (!xc[0]) {

      // Following IEEE 754 (2008) 6.3,
      // n - n = +0  but  n - n = -0  when rounding towards -Infinity.
      y.s = ROUNDING_MODE == 3 ? -1 : 1;
      y.c = [y.e = 0];
      return y;
    }

    // No need to check for Infinity as +x - +y != Infinity && -x - -y != Infinity
    // for finite x and y.
    return normalise(y, xc, ye);
  };


  /*
   *   n % 0 =  N
   *   n % N =  N
   *   n % I =  n
   *   0 % n =  0
   *  -0 % n = -0
   *   0 % 0 =  N
   *   0 % N =  N
   *   0 % I =  0
   *   N % n =  N
   *   N % 0 =  N
   *   N % N =  N
   *   N % I =  N
   *   I % n =  N
   *   I % 0 =  N
   *   I % N =  N
   *   I % I =  N
   *
   * Return a new BigNumber whose value is the value of this BigNumber modulo the value of
   * BigNumber(y, b). The result depends on the value of MODULO_MODE.
   */
  P.modulo = P.mod = function (y, b) {
    var q, s,
      x = this;

    y = new BigNumber(y, b);

    // Return NaN if x is Infinity or NaN, or y is NaN or zero.
    if (!x.c || !y.s || y.c && !y.c[0]) {
      return new BigNumber(NaN);

    // Return x if y is Infinity or x is zero.
    } else if (!y.c || x.c && !x.c[0]) {
      return new BigNumber(x);
    }

    if (MODULO_MODE == 9) {

      // Euclidian division: q = sign(y) * floor(x / abs(y))
      // r = x - qy    where  0 <= r < abs(y)
      s = y.s;
      y.s = 1;
      q = div(x, y, 0, 3);
      y.s = s;
      q.s *= s;
    } else {
      q = div(x, y, 0, MODULO_MODE);
    }

    y = x.minus(q.times(y));

    // To match JavaScript %, ensure sign of zero is sign of dividend.
    if (!y.c[0] && MODULO_MODE == 1) y.s = x.s;

    return y;
  };


  /*
   *  n * 0 = 0
   *  n * N = N
   *  n * I = I
   *  0 * n = 0
   *  0 * 0 = 0
   *  0 * N = N
   *  0 * I = N
   *  N * n = N
   *  N * 0 = N
   *  N * N = N
   *  N * I = N
   *  I * n = I
   *  I * 0 = N
   *  I * N = N
   *  I * I = I
   *
   * Return a new BigNumber whose value is the value of this BigNumber multiplied by the value
   * of BigNumber(y, b).
   */
  P.multipliedBy = P.times = function (y, b) {
    var c, e, i, j, k, m, xcL, xlo, xhi, ycL, ylo, yhi, zc,
      base, sqrtBase,
      x = this,
      xc = x.c,
      yc = (y = new BigNumber(y, b)).c;

    // Either NaN, ±Infinity or ±0?
    if (!xc || !yc || !xc[0] || !yc[0]) {

      // Return NaN if either is NaN, or one is 0 and the other is Infinity.
      if (!x.s || !y.s || xc && !xc[0] && !yc || yc && !yc[0] && !xc) {
        y.c = y.e = y.s = null;
      } else {
        y.s *= x.s;

        // Return ±Infinity if either is ±Infinity.
        if (!xc || !yc) {
          y.c = y.e = null;

        // Return ±0 if either is ±0.
        } else {
          y.c = [0];
          y.e = 0;
        }
      }

      return y;
    }

    e = bitFloor(x.e / LOG_BASE) + bitFloor(y.e / LOG_BASE);
    y.s *= x.s;
    xcL = xc.length;
    ycL = yc.length;

    // Ensure xc points to longer array and xcL to its length.
    if (xcL < ycL) zc = xc, xc = yc, yc = zc, i = xcL, xcL = ycL, ycL = i;

    // Initialise the result array with zeros.
    for (i = xcL + ycL, zc = []; i--; zc.push(0));

    base = BASE;
    sqrtBase = SQRT_BASE;

    for (i = ycL; --i >= 0;) {
      c = 0;
      ylo = yc[i] % sqrtBase;
      yhi = yc[i] / sqrtBase | 0;

      for (k = xcL, j = i + k; j > i;) {
        xlo = xc[--k] % sqrtBase;
        xhi = xc[k] / sqrtBase | 0;
        m = yhi * xlo + xhi * ylo;
        xlo = ylo * xlo + ((m % sqrtBase) * sqrtBase) + zc[j] + c;
        c = (xlo / base | 0) + (m / sqrtBase | 0) + yhi * xhi;
        zc[j--] = xlo % base;
      }

      zc[j] = c;
    }

    if (c) {
      ++e;
    } else {
      zc.splice(0, 1);
    }

    return normalise(y, zc, e);
  };


  /*
   * Return a new BigNumber whose value is the value of this BigNumber negated,
   * i.e. multiplied by -1.
   */
  P.negated = function () {
    var x = new BigNumber(this);
    x.s = -x.s || null;
    return x;
  };


  /*
   *  n + 0 = n
   *  n + N = N
   *  n + I = I
   *  0 + n = n
   *  0 + 0 = 0
   *  0 + N = N
   *  0 + I = I
   *  N + n = N
   *  N + 0 = N
   *  N + N = N
   *  N + I = N
   *  I + n = I
   *  I + 0 = I
   *  I + N = N
   *  I + I = I
   *
   * Return a new BigNumber whose value is the value of this BigNumber plus the value of
   * BigNumber(y, b).
   */
  P.plus = function (y, b) {
    var t,
      x = this,
      a = x.s;

    y = new BigNumber(y, b);
    b = y.s;

    // Either NaN?
    if (!a || !b) return new BigNumber(NaN);

    // Signs differ?
     if (a != b) {
      y.s = -b;
      return x.minus(y);
    }

    var xe = x.e / LOG_BASE,
      ye = y.e / LOG_BASE,
      xc = x.c,
      yc = y.c;

    if (!xe || !ye) {

      // Return ±Infinity if either ±Infinity.
      if (!xc || !yc) return new BigNumber(a / 0);

      // Either zero?
      // Return y if y is non-zero, x if x is non-zero, or zero if both are zero.
      if (!xc[0] || !yc[0]) return yc[0] ? y : new BigNumber(xc[0] ? x : a * 0);
    }

    xe = bitFloor(xe);
    ye = bitFloor(ye);
    xc = xc.slice();

    // Prepend zeros to equalise exponents. Faster to use reverse then do unshifts.
    if (a = xe - ye) {
      if (a > 0) {
        ye = xe;
        t = yc;
      } else {
        a = -a;
        t = xc;
      }

      t.reverse();
      for (; a--; t.push(0));
      t.reverse();
    }

    a = xc.length;
    b = yc.length;

    // Point xc to the longer array, and b to the shorter length.
    if (a - b < 0) t = yc, yc = xc, xc = t, b = a;

    // Only start adding at yc.length - 1 as the further digits of xc can be ignored.
    for (a = 0; b;) {
      a = (xc[--b] = xc[b] + yc[b] + a) / BASE | 0;
      xc[b] = BASE === xc[b] ? 0 : xc[b] % BASE;
    }

    if (a) {
      xc = [a].concat(xc);
      ++ye;
    }

    // No need to check for zero, as +x + +y != 0 && -x + -y != 0
    // ye = MAX_EXP + 1 possible
    return normalise(y, xc, ye);
  };


  /*
   * If sd is undefined or null or true or false, return the number of significant digits of
   * the value of this BigNumber, or null if the value of this BigNumber is ±Infinity or NaN.
   * If sd is true include integer-part trailing zeros in the count.
   *
   * Otherwise, if sd is a number, return a new BigNumber whose value is the value of this
   * BigNumber rounded to a maximum of sd significant digits using rounding mode rm, or
   * ROUNDING_MODE if rm is omitted.
   *
   * sd {number|boolean} number: significant digits: integer, 1 to MAX inclusive.
   *                     boolean: whether to count integer-part trailing zeros: true or false.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {sd|rm}'
   */
  P.precision = P.sd = function (sd, rm) {
    var c, n, v,
      x = this;

    if (sd != null && sd !== !!sd) {
      intCheck(sd, 1, MAX);
      if (rm == null) rm = ROUNDING_MODE;
      else intCheck(rm, 0, 8);

      return round(new BigNumber(x), sd, rm);
    }

    if (!(c = x.c)) return null;
    v = c.length - 1;
    n = v * LOG_BASE + 1;

    if (v = c[v]) {

      // Subtract the number of trailing zeros of the last element.
      for (; v % 10 == 0; v /= 10, n--);

      // Add the number of digits of the first element.
      for (v = c[0]; v >= 10; v /= 10, n++);
    }

    if (sd && x.e + 1 > n) n = x.e + 1;

    return n;
  };


  /*
   * Return a new BigNumber whose value is the value of this BigNumber shifted by k places
   * (powers of 10). Shift to the right if n > 0, and to the left if n < 0.
   *
   * k {number} Integer, -MAX_SAFE_INTEGER to MAX_SAFE_INTEGER inclusive.
   *
   * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {k}'
   */
  P.shiftedBy = function (k) {
    intCheck(k, -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER);
    return this.times('1e' + k);
  };


  /*
   *  sqrt(-n) =  N
   *  sqrt(N) =  N
   *  sqrt(-I) =  N
   *  sqrt(I) =  I
   *  sqrt(0) =  0
   *  sqrt(-0) = -0
   *
   * Return a new BigNumber whose value is the square root of the value of this BigNumber,
   * rounded according to DECIMAL_PLACES and ROUNDING_MODE.
   */
  P.squareRoot = P.sqrt = function () {
    var m, n, r, rep, t,
      x = this,
      c = x.c,
      s = x.s,
      e = x.e,
      dp = DECIMAL_PLACES + 4,
      half = new BigNumber('0.5');

    // Negative/NaN/Infinity/zero?
    if (s !== 1 || !c || !c[0]) {
      return new BigNumber(!s || s < 0 && (!c || c[0]) ? NaN : c ? x : 1 / 0);
    }

    // Initial estimate.
    s = Math.sqrt(+valueOf(x));

    // Math.sqrt underflow/overflow?
    // Pass x to Math.sqrt as integer, then adjust the exponent of the result.
    if (s == 0 || s == 1 / 0) {
      n = coeffToString(c);
      if ((n.length + e) % 2 == 0) n += '0';
      s = Math.sqrt(+n);
      e = bitFloor((e + 1) / 2) - (e < 0 || e % 2);

      if (s == 1 / 0) {
        n = '1e' + e;
      } else {
        n = s.toExponential();
        n = n.slice(0, n.indexOf('e') + 1) + e;
      }

      r = new BigNumber(n);
    } else {
      r = new BigNumber(s + '');
    }

    // Check for zero.
    // r could be zero if MIN_EXP is changed after the this value was created.
    // This would cause a division by zero (x/t) and hence Infinity below, which would cause
    // coeffToString to throw.
    if (r.c[0]) {
      e = r.e;
      s = e + dp;
      if (s < 3) s = 0;

      // Newton-Raphson iteration.
      for (; ;) {
        t = r;
        r = half.times(t.plus(div(x, t, dp, 1)));

        if (coeffToString(t.c).slice(0, s) === (n = coeffToString(r.c)).slice(0, s)) {

          // The exponent of r may here be one less than the final result exponent,
          // e.g 0.0009999 (e-4) --> 0.001 (e-3), so adjust s so the rounding digits
          // are indexed correctly.
          if (r.e < e) --s;
          n = n.slice(s - 3, s + 1);

          // The 4th rounding digit may be in error by -1 so if the 4 rounding digits
          // are 9999 or 4999 (i.e. approaching a rounding boundary) continue the
          // iteration.
          if (n == '9999' || !rep && n == '4999') {

            // On the first iteration only, check to see if rounding up gives the
            // exact result as the nines may infinitely repeat.
            if (!rep) {
              round(t, t.e + DECIMAL_PLACES + 2, 0);

              if (t.times(t).eq(x)) {
                r = t;
                break;
              }
            }

            dp += 4;
            s += 4;
            rep = 1;
          } else {

            // If rounding digits are null, 0{0,4} or 50{0,3}, check for exact
            // result. If not, then there are further digits and m will be truthy.
            if (!+n || !+n.slice(1) && n.charAt(0) == '5') {

              // Truncate to the first rounding digit.
              round(r, r.e + DECIMAL_PLACES + 2, 1);
              m = !r.times(r).eq(x);
            }

            break;
          }
        }
      }
    }

    return round(r, r.e + DECIMAL_PLACES + 1, ROUNDING_MODE, m);
  };


  /*
   * Return a string representing the value of this BigNumber in exponential notation and
   * rounded using ROUNDING_MODE to dp fixed decimal places.
   *
   * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
   */
  P.toExponential = function (dp, rm) {
    if (dp != null) {
      intCheck(dp, 0, MAX);
      dp++;
    }
    return format(this, dp, rm, 1);
  };


  /*
   * Return a string representing the value of this BigNumber in fixed-point notation rounding
   * to dp fixed decimal places using rounding mode rm, or ROUNDING_MODE if rm is omitted.
   *
   * Note: as with JavaScript's number type, (-0).toFixed(0) is '0',
   * but e.g. (-0.00001).toFixed(0) is '-0'.
   *
   * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
   */
  P.toFixed = function (dp, rm) {
    if (dp != null) {
      intCheck(dp, 0, MAX);
      dp = dp + this.e + 1;
    }
    return format(this, dp, rm);
  };


  /*
   * Return a string representing the value of this BigNumber in fixed-point notation rounded
   * using rm or ROUNDING_MODE to dp decimal places, and formatted according to the properties
   * of the format or FORMAT object (see BigNumber.set).
   *
   * The formatting object may contain some or all of the properties shown below.
   *
   * FORMAT = {
   *   prefix: '',
   *   groupSize: 3,
   *   secondaryGroupSize: 0,
   *   groupSeparator: ',',
   *   decimalSeparator: '.',
   *   fractionGroupSize: 0,
   *   fractionGroupSeparator: '\xA0',      // non-breaking space
   *   suffix: ''
   * };
   *
   * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   * [format] {object} Formatting options. See FORMAT pbject above.
   *
   * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
   * '[BigNumber Error] Argument not an object: {format}'
   */
  P.toFormat = function (dp, rm, format) {
    var str,
      x = this;

    if (format == null) {
      if (dp != null && rm && typeof rm == 'object') {
        format = rm;
        rm = null;
      } else if (dp && typeof dp == 'object') {
        format = dp;
        dp = rm = null;
      } else {
        format = FORMAT;
      }
    } else if (typeof format != 'object') {
      throw Error
        (bignumberError + 'Argument not an object: ' + format);
    }

    str = x.toFixed(dp, rm);

    if (x.c) {
      var i,
        arr = str.split('.'),
        g1 = +format.groupSize,
        g2 = +format.secondaryGroupSize,
        groupSeparator = format.groupSeparator || '',
        intPart = arr[0],
        fractionPart = arr[1],
        isNeg = x.s < 0,
        intDigits = isNeg ? intPart.slice(1) : intPart,
        len = intDigits.length;

      if (g2) i = g1, g1 = g2, g2 = i, len -= i;

      if (g1 > 0 && len > 0) {
        i = len % g1 || g1;
        intPart = intDigits.substr(0, i);
        for (; i < len; i += g1) intPart += groupSeparator + intDigits.substr(i, g1);
        if (g2 > 0) intPart += groupSeparator + intDigits.slice(i);
        if (isNeg) intPart = '-' + intPart;
      }

      str = fractionPart
       ? intPart + (format.decimalSeparator || '') + ((g2 = +format.fractionGroupSize)
        ? fractionPart.replace(new RegExp('\\d{' + g2 + '}\\B', 'g'),
         '$&' + (format.fractionGroupSeparator || ''))
        : fractionPart)
       : intPart;
    }

    return (format.prefix || '') + str + (format.suffix || '');
  };


  /*
   * Return an array of two BigNumbers representing the value of this BigNumber as a simple
   * fraction with an integer numerator and an integer denominator.
   * The denominator will be a positive non-zero value less than or equal to the specified
   * maximum denominator. If a maximum denominator is not specified, the denominator will be
   * the lowest value necessary to represent the number exactly.
   *
   * [md] {number|string|BigNumber} Integer >= 1, or Infinity. The maximum denominator.
   *
   * '[BigNumber Error] Argument {not an integer|out of range} : {md}'
   */
  P.toFraction = function (md) {
    var d, d0, d1, d2, e, exp, n, n0, n1, q, r, s,
      x = this,
      xc = x.c;

    if (md != null) {
      n = new BigNumber(md);

      // Throw if md is less than one or is not an integer, unless it is Infinity.
      if (!n.isInteger() && (n.c || n.s !== 1) || n.lt(ONE)) {
        throw Error
          (bignumberError + 'Argument ' +
            (n.isInteger() ? 'out of range: ' : 'not an integer: ') + valueOf(n));
      }
    }

    if (!xc) return new BigNumber(x);

    d = new BigNumber(ONE);
    n1 = d0 = new BigNumber(ONE);
    d1 = n0 = new BigNumber(ONE);
    s = coeffToString(xc);

    // Determine initial denominator.
    // d is a power of 10 and the minimum max denominator that specifies the value exactly.
    e = d.e = s.length - x.e - 1;
    d.c[0] = POWS_TEN[(exp = e % LOG_BASE) < 0 ? LOG_BASE + exp : exp];
    md = !md || n.comparedTo(d) > 0 ? (e > 0 ? d : n1) : n;

    exp = MAX_EXP;
    MAX_EXP = 1 / 0;
    n = new BigNumber(s);

    // n0 = d1 = 0
    n0.c[0] = 0;

    for (; ;)  {
      q = div(n, d, 0, 1);
      d2 = d0.plus(q.times(d1));
      if (d2.comparedTo(md) == 1) break;
      d0 = d1;
      d1 = d2;
      n1 = n0.plus(q.times(d2 = n1));
      n0 = d2;
      d = n.minus(q.times(d2 = d));
      n = d2;
    }

    d2 = div(md.minus(d0), d1, 0, 1);
    n0 = n0.plus(d2.times(n1));
    d0 = d0.plus(d2.times(d1));
    n0.s = n1.s = x.s;
    e = e * 2;

    // Determine which fraction is closer to x, n0/d0 or n1/d1
    r = div(n1, d1, e, ROUNDING_MODE).minus(x).abs().comparedTo(
        div(n0, d0, e, ROUNDING_MODE).minus(x).abs()) < 1 ? [n1, d1] : [n0, d0];

    MAX_EXP = exp;

    return r;
  };


  /*
   * Return the value of this BigNumber converted to a number primitive.
   */
  P.toNumber = function () {
    return +valueOf(this);
  };


  /*
   * Return a string representing the value of this BigNumber rounded to sd significant digits
   * using rounding mode rm or ROUNDING_MODE. If sd is less than the number of digits
   * necessary to represent the integer part of the value in fixed-point notation, then use
   * exponential notation.
   *
   * [sd] {number} Significant digits. Integer, 1 to MAX inclusive.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {sd|rm}'
   */
  P.toPrecision = function (sd, rm) {
    if (sd != null) intCheck(sd, 1, MAX);
    return format(this, sd, rm, 2);
  };


  /*
   * Return a string representing the value of this BigNumber in base b, or base 10 if b is
   * omitted. If a base is specified, including base 10, round according to DECIMAL_PLACES and
   * ROUNDING_MODE. If a base is not specified, and this BigNumber has a positive exponent
   * that is equal to or greater than TO_EXP_POS, or a negative exponent equal to or less than
   * TO_EXP_NEG, return exponential notation.
   *
   * [b] {number} Integer, 2 to ALPHABET.length inclusive.
   *
   * '[BigNumber Error] Base {not a primitive number|not an integer|out of range}: {b}'
   */
  P.toString = function (b) {
    var str,
      n = this,
      s = n.s,
      e = n.e;

    // Infinity or NaN?
    if (e === null) {
      if (s) {
        str = 'Infinity';
        if (s < 0) str = '-' + str;
      } else {
        str = 'NaN';
      }
    } else {
      str = coeffToString(n.c);

      if (b == null) {
        str = e <= TO_EXP_NEG || e >= TO_EXP_POS
         ? toExponential(str, e)
         : toFixedPoint(str, e, '0');
      } else {
        intCheck(b, 2, ALPHABET.length, 'Base');
        str = convertBase(toFixedPoint(str, e, '0'), 10, b, s, true);
      }

      if (s < 0 && n.c[0]) str = '-' + str;
    }

    return str;
  };


  /*
   * Return as toString, but do not accept a base argument, and include the minus sign for
   * negative zero.
   */
  P.valueOf = P.toJSON = P[Symbol.for('nodejs.util.inspect.custom')] = function () {
    return valueOf(this);
  };

  P[Symbol.toStringTag] = 'BigNumber';

  if (configObject != null) BigNumber.set(configObject);

  return BigNumber;
}


// PRIVATE HELPER FUNCTIONS


function bitFloor(n) {
  var i = n | 0;
  return n > 0 || n === i ? i : i - 1;
}


// Return a coefficient array as a string of base 10 digits.
function coeffToString(a) {
  var s, z,
    i = 1,
    j = a.length,
    r = a[0] + '';

  for (; i < j;) {
    s = a[i++] + '';
    z = LOG_BASE - s.length;
    for (; z--; s = '0' + s);
    r += s;
  }

  // Determine trailing zeros.
  for (j = r.length; r.charCodeAt(--j) === 48;);

  return r.slice(0, j + 1 || 1);
}


// Compare the value of BigNumbers x and y.
function compare(x, y) {
  var a, b,
    xc = x.c,
    yc = y.c,
    i = x.s,
    j = y.s,
    k = x.e,
    l = y.e;

  // Either NaN?
  if (!i || !j) return null;

  a = xc && !xc[0];
  b = yc && !yc[0];

  // Either zero?
  if (a || b) return a ? b ? 0 : -j : i;

  // Signs differ?
  if (i != j) return i;

  a = i < 0;
  b = k == l;

  // Either Infinity?
  if (!xc || !yc) return b ? 0 : !xc ^ a ? 1 : -1;

  // Compare exponents.
  if (!b) return k > l ^ a ? 1 : -1;

  j = (k = xc.length) < (l = yc.length) ? k : l;

  // Compare digit by digit.
  for (i = 0; i < j; i++) if (xc[i] != yc[i]) return xc[i] > yc[i] ^ a ? 1 : -1;

  // Compare lengths.
  return k == l ? 0 : k > l ^ a ? 1 : -1;
}


/*
 * Check that n is a primitive number, an integer, and in range, otherwise throw.
 */
function intCheck(n, min, max, name) {
  if (n < min || n > max || n !== (n < 0 ? mathceil(n) : mathfloor(n))) {
    throw Error
     (bignumberError + (name || 'Argument') + (typeof n == 'number'
       ? n < min || n > max ? ' out of range: ' : ' not an integer: '
       : ' not a primitive number: ') + String(n));
  }
}


// Assumes finite n.
function isOdd(n) {
  var k = n.c.length - 1;
  return bitFloor(n.e / LOG_BASE) == k && n.c[k] % 2 != 0;
}


function toExponential(str, e) {
  return (str.length > 1 ? str.charAt(0) + '.' + str.slice(1) : str) +
   (e < 0 ? 'e' : 'e+') + e;
}


function toFixedPoint(str, e, z) {
  var len, zs;

  // Negative exponent?
  if (e < 0) {

    // Prepend zeros.
    for (zs = z + '.'; ++e; zs += z);
    str = zs + str;

  // Positive exponent
  } else {
    len = str.length;

    // Append zeros.
    if (++e > len) {
      for (zs = z, e -= len; --e; zs += z);
      str += zs;
    } else if (e < len) {
      str = str.slice(0, e) + '.' + str.slice(e);
    }
  }

  return str;
}


// EXPORT


var BigNumber = clone();

/* harmony default export */ __webpack_exports__["default"] = (BigNumber);


/***/ }),

/***/ "./node_modules/follow-redirects/index.js":
/*!************************************************!*\
  !*** ./node_modules/follow-redirects/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var url = __webpack_require__(/*! url */ "url");
var http = __webpack_require__(/*! http */ "http");
var https = __webpack_require__(/*! https */ "https");
var assert = __webpack_require__(/*! assert */ "assert");
var Writable = __webpack_require__(/*! stream */ "stream").Writable;
var debug = __webpack_require__(/*! debug */ "./node_modules/follow-redirects/node_modules/debug/src/index.js")("follow-redirects");

// RFC7231§4.2.1: Of the request methods defined by this specification,
// the GET, HEAD, OPTIONS, and TRACE methods are defined to be safe.
var SAFE_METHODS = { GET: true, HEAD: true, OPTIONS: true, TRACE: true };

// Create handlers that pass events from native requests
var eventHandlers = Object.create(null);
["abort", "aborted", "error", "socket", "timeout"].forEach(function (event) {
  eventHandlers[event] = function (arg) {
    this._redirectable.emit(event, arg);
  };
});

// An HTTP(S) request that can be redirected
function RedirectableRequest(options, responseCallback) {
  // Initialize the request
  Writable.call(this);
  options.headers = options.headers || {};
  this._options = options;
  this._redirectCount = 0;
  this._redirects = [];
  this._requestBodyLength = 0;
  this._requestBodyBuffers = [];

  // Attach a callback if passed
  if (responseCallback) {
    this.on("response", responseCallback);
  }

  // React to responses of native requests
  var self = this;
  this._onNativeResponse = function (response) {
    self._processResponse(response);
  };

  // Complete the URL object when necessary
  if (!options.pathname && options.path) {
    var searchPos = options.path.indexOf("?");
    if (searchPos < 0) {
      options.pathname = options.path;
    }
    else {
      options.pathname = options.path.substring(0, searchPos);
      options.search = options.path.substring(searchPos);
    }
  }

  // Perform the first request
  this._performRequest();
}
RedirectableRequest.prototype = Object.create(Writable.prototype);

// Writes buffered data to the current native request
RedirectableRequest.prototype.write = function (data, encoding, callback) {
  // Validate input and shift parameters if necessary
  if (!(typeof data === "string" || typeof data === "object" && ("length" in data))) {
    throw new Error("data should be a string, Buffer or Uint8Array");
  }
  if (typeof encoding === "function") {
    callback = encoding;
    encoding = null;
  }

  // Ignore empty buffers, since writing them doesn't invoke the callback
  // https://github.com/nodejs/node/issues/22066
  if (data.length === 0) {
    if (callback) {
      callback();
    }
    return;
  }
  // Only write when we don't exceed the maximum body length
  if (this._requestBodyLength + data.length <= this._options.maxBodyLength) {
    this._requestBodyLength += data.length;
    this._requestBodyBuffers.push({ data: data, encoding: encoding });
    this._currentRequest.write(data, encoding, callback);
  }
  // Error when we exceed the maximum body length
  else {
    this.emit("error", new Error("Request body larger than maxBodyLength limit"));
    this.abort();
  }
};

// Ends the current native request
RedirectableRequest.prototype.end = function (data, encoding, callback) {
  // Shift parameters if necessary
  if (typeof data === "function") {
    callback = data;
    data = encoding = null;
  }
  else if (typeof encoding === "function") {
    callback = encoding;
    encoding = null;
  }

  // Write data and end
  var currentRequest = this._currentRequest;
  this.write(data || "", encoding, function () {
    currentRequest.end(null, null, callback);
  });
};

// Sets a header value on the current native request
RedirectableRequest.prototype.setHeader = function (name, value) {
  this._options.headers[name] = value;
  this._currentRequest.setHeader(name, value);
};

// Clears a header value on the current native request
RedirectableRequest.prototype.removeHeader = function (name) {
  delete this._options.headers[name];
  this._currentRequest.removeHeader(name);
};

// Proxy all other public ClientRequest methods
[
  "abort", "flushHeaders", "getHeader",
  "setNoDelay", "setSocketKeepAlive", "setTimeout",
].forEach(function (method) {
  RedirectableRequest.prototype[method] = function (a, b) {
    return this._currentRequest[method](a, b);
  };
});

// Proxy all public ClientRequest properties
["aborted", "connection", "socket"].forEach(function (property) {
  Object.defineProperty(RedirectableRequest.prototype, property, {
    get: function () { return this._currentRequest[property]; },
  });
});

// Executes the next native request (initial or redirect)
RedirectableRequest.prototype._performRequest = function () {
  // Load the native protocol
  var protocol = this._options.protocol;
  var nativeProtocol = this._options.nativeProtocols[protocol];
  if (!nativeProtocol) {
    this.emit("error", new Error("Unsupported protocol " + protocol));
    return;
  }

  // If specified, use the agent corresponding to the protocol
  // (HTTP and HTTPS use different types of agents)
  if (this._options.agents) {
    var scheme = protocol.substr(0, protocol.length - 1);
    this._options.agent = this._options.agents[scheme];
  }

  // Create the native request
  var request = this._currentRequest =
        nativeProtocol.request(this._options, this._onNativeResponse);
  this._currentUrl = url.format(this._options);

  // Set up event handlers
  request._redirectable = this;
  for (var event in eventHandlers) {
    /* istanbul ignore else */
    if (event) {
      request.on(event, eventHandlers[event]);
    }
  }

  // End a redirected request
  // (The first request must be ended explicitly with RedirectableRequest#end)
  if (this._isRedirect) {
    // Write the request entity and end.
    var i = 0;
    var buffers = this._requestBodyBuffers;
    (function writeNext() {
      if (i < buffers.length) {
        var buffer = buffers[i++];
        request.write(buffer.data, buffer.encoding, writeNext);
      }
      else {
        request.end();
      }
    }());
  }
};

// Processes a response from the current native request
RedirectableRequest.prototype._processResponse = function (response) {
  // Store the redirected response
  if (this._options.trackRedirects) {
    this._redirects.push({
      url: this._currentUrl,
      headers: response.headers,
      statusCode: response.statusCode,
    });
  }

  // RFC7231§6.4: The 3xx (Redirection) class of status code indicates
  // that further action needs to be taken by the user agent in order to
  // fulfill the request. If a Location header field is provided,
  // the user agent MAY automatically redirect its request to the URI
  // referenced by the Location field value,
  // even if the specific status code is not understood.
  var location = response.headers.location;
  if (location && this._options.followRedirects !== false &&
      response.statusCode >= 300 && response.statusCode < 400) {
    // RFC7231§6.4: A client SHOULD detect and intervene
    // in cyclical redirections (i.e., "infinite" redirection loops).
    if (++this._redirectCount > this._options.maxRedirects) {
      this.emit("error", new Error("Max redirects exceeded."));
      return;
    }

    // RFC7231§6.4: Automatic redirection needs to done with
    // care for methods not known to be safe […],
    // since the user might not wish to redirect an unsafe request.
    // RFC7231§6.4.7: The 307 (Temporary Redirect) status code indicates
    // that the target resource resides temporarily under a different URI
    // and the user agent MUST NOT change the request method
    // if it performs an automatic redirection to that URI.
    var header;
    var headers = this._options.headers;
    if (response.statusCode !== 307 && !(this._options.method in SAFE_METHODS)) {
      this._options.method = "GET";
      // Drop a possible entity and headers related to it
      this._requestBodyBuffers = [];
      for (header in headers) {
        if (/^content-/i.test(header)) {
          delete headers[header];
        }
      }
    }

    // Drop the Host header, as the redirect might lead to a different host
    if (!this._isRedirect) {
      for (header in headers) {
        if (/^host$/i.test(header)) {
          delete headers[header];
        }
      }
    }

    // Perform the redirected request
    var redirectUrl = url.resolve(this._currentUrl, location);
    debug("redirecting to", redirectUrl);
    Object.assign(this._options, url.parse(redirectUrl));
    this._isRedirect = true;
    this._performRequest();

    // Discard the remainder of the response to avoid waiting for data
    response.destroy();
  }
  else {
    // The response is not a redirect; return it as-is
    response.responseUrl = this._currentUrl;
    response.redirects = this._redirects;
    this.emit("response", response);

    // Clean up
    this._requestBodyBuffers = [];
  }
};

// Wraps the key/value object of protocols with redirect functionality
function wrap(protocols) {
  // Default settings
  var exports = {
    maxRedirects: 21,
    maxBodyLength: 10 * 1024 * 1024,
  };

  // Wrap each protocol
  var nativeProtocols = {};
  Object.keys(protocols).forEach(function (scheme) {
    var protocol = scheme + ":";
    var nativeProtocol = nativeProtocols[protocol] = protocols[scheme];
    var wrappedProtocol = exports[scheme] = Object.create(nativeProtocol);

    // Executes a request, following redirects
    wrappedProtocol.request = function (options, callback) {
      if (typeof options === "string") {
        options = url.parse(options);
        options.maxRedirects = exports.maxRedirects;
      }
      else {
        options = Object.assign({
          protocol: protocol,
          maxRedirects: exports.maxRedirects,
          maxBodyLength: exports.maxBodyLength,
        }, options);
      }
      options.nativeProtocols = nativeProtocols;
      assert.equal(options.protocol, protocol, "protocol mismatch");
      debug("options", options);
      return new RedirectableRequest(options, callback);
    };

    // Executes a GET request, following redirects
    wrappedProtocol.get = function (options, callback) {
      var request = wrappedProtocol.request(options, callback);
      request.end();
      return request;
    };
  });
  return exports;
}

// Exports
module.exports = wrap({ http: http, https: https });
module.exports.wrap = wrap;


/***/ }),

/***/ "./node_modules/follow-redirects/node_modules/debug/src/browser.js":
/*!*************************************************************************!*\
  !*** ./node_modules/follow-redirects/node_modules/debug/src/browser.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(/*! ./debug */ "./node_modules/follow-redirects/node_modules/debug/src/debug.js");
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  '#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC',
  '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF',
  '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC',
  '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF',
  '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC',
  '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033',
  '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366',
  '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933',
  '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC',
  '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF',
  '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // Internet Explorer and Edge do not support colors.
  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit')

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}


/***/ }),

/***/ "./node_modules/follow-redirects/node_modules/debug/src/debug.js":
/*!***********************************************************************!*\
  !*** ./node_modules/follow-redirects/node_modules/debug/src/debug.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = __webpack_require__(/*! ms */ "./node_modules/ms/index.js");

/**
 * Active `debug` instances.
 */
exports.instances = [];

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  var prevTime;

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);
  debug.destroy = destroy;

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  exports.instances.push(debug);

  return debug;
}

function destroy () {
  var index = exports.instances.indexOf(this);
  if (index !== -1) {
    exports.instances.splice(index, 1);
    return true;
  } else {
    return false;
  }
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var i;
  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }

  for (i = 0; i < exports.instances.length; i++) {
    var instance = exports.instances[i];
    instance.enabled = exports.enabled(instance.namespace);
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  if (name[name.length - 1] === '*') {
    return true;
  }
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}


/***/ }),

/***/ "./node_modules/follow-redirects/node_modules/debug/src/index.js":
/*!***********************************************************************!*\
  !*** ./node_modules/follow-redirects/node_modules/debug/src/index.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Detect Electron renderer process, which is node, but we should
 * treat as a browser.
 */

if (typeof process === 'undefined' || process.type === 'renderer') {
  module.exports = __webpack_require__(/*! ./browser.js */ "./node_modules/follow-redirects/node_modules/debug/src/browser.js");
} else {
  module.exports = __webpack_require__(/*! ./node.js */ "./node_modules/follow-redirects/node_modules/debug/src/node.js");
}


/***/ }),

/***/ "./node_modules/follow-redirects/node_modules/debug/src/node.js":
/*!**********************************************************************!*\
  !*** ./node_modules/follow-redirects/node_modules/debug/src/node.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Module dependencies.
 */

var tty = __webpack_require__(/*! tty */ "tty");
var util = __webpack_require__(/*! util */ "util");

/**
 * This is the Node.js implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(/*! ./debug */ "./node_modules/follow-redirects/node_modules/debug/src/debug.js");
exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;

/**
 * Colors.
 */

exports.colors = [ 6, 2, 3, 4, 5, 1 ];

try {
  var supportsColor = __webpack_require__(/*! supports-color */ "./node_modules/supports-color/index.js");
  if (supportsColor && supportsColor.level >= 2) {
    exports.colors = [
      20, 21, 26, 27, 32, 33, 38, 39, 40, 41, 42, 43, 44, 45, 56, 57, 62, 63, 68,
      69, 74, 75, 76, 77, 78, 79, 80, 81, 92, 93, 98, 99, 112, 113, 128, 129, 134,
      135, 148, 149, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171,
      172, 173, 178, 179, 184, 185, 196, 197, 198, 199, 200, 201, 202, 203, 204,
      205, 206, 207, 208, 209, 214, 215, 220, 221
    ];
  }
} catch (err) {
  // swallow - we only care if `supports-color` is available; it doesn't have to be.
}

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(process.env).filter(function (key) {
  return /^debug_/i.test(key);
}).reduce(function (obj, key) {
  // camel-case
  var prop = key
    .substring(6)
    .toLowerCase()
    .replace(/_([a-z])/g, function (_, k) { return k.toUpperCase() });

  // coerce string value into JS value
  var val = process.env[key];
  if (/^(yes|on|true|enabled)$/i.test(val)) val = true;
  else if (/^(no|off|false|disabled)$/i.test(val)) val = false;
  else if (val === 'null') val = null;
  else val = Number(val);

  obj[prop] = val;
  return obj;
}, {});

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
  return 'colors' in exports.inspectOpts
    ? Boolean(exports.inspectOpts.colors)
    : tty.isatty(process.stderr.fd);
}

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

exports.formatters.o = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts)
    .split('\n').map(function(str) {
      return str.trim()
    }).join(' ');
};

/**
 * Map %o to `util.inspect()`, allowing multiple lines if needed.
 */

exports.formatters.O = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts);
};

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var name = this.namespace;
  var useColors = this.useColors;

  if (useColors) {
    var c = this.color;
    var colorCode = '\u001b[3' + (c < 8 ? c : '8;5;' + c);
    var prefix = '  ' + colorCode + ';1m' + name + ' ' + '\u001b[0m';

    args[0] = prefix + args[0].split('\n').join('\n' + prefix);
    args.push(colorCode + 'm+' + exports.humanize(this.diff) + '\u001b[0m');
  } else {
    args[0] = getDate() + name + ' ' + args[0];
  }
}

function getDate() {
  if (exports.inspectOpts.hideDate) {
    return '';
  } else {
    return new Date().toISOString() + ' ';
  }
}

/**
 * Invokes `util.format()` with the specified arguments and writes to stderr.
 */

function log() {
  return process.stderr.write(util.format.apply(util, arguments) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  if (null == namespaces) {
    // If you set a process.env field to null or undefined, it gets cast to the
    // string 'null' or 'undefined'. Just delete instead.
    delete process.env.DEBUG;
  } else {
    process.env.DEBUG = namespaces;
  }
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  return process.env.DEBUG;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init (debug) {
  debug.inspectOpts = {};

  var keys = Object.keys(exports.inspectOpts);
  for (var i = 0; i < keys.length; i++) {
    debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
  }
}

/**
 * Enable namespaces listed in `process.env.DEBUG` initially.
 */

exports.enable(load());


/***/ }),

/***/ "./node_modules/has-flag/index.js":
/*!****************************************!*\
  !*** ./node_modules/has-flag/index.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = (flag, argv) => {
	argv = argv || process.argv;
	const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
	const pos = argv.indexOf(prefix + flag);
	const terminatorPos = argv.indexOf('--');
	return pos !== -1 && (terminatorPos === -1 ? true : pos < terminatorPos);
};


/***/ }),

/***/ "./node_modules/inherits/inherits.js":
/*!*******************************************!*\
  !*** ./node_modules/inherits/inherits.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

try {
  var util = __webpack_require__(/*! util */ "util");
  if (typeof util.inherits !== 'function') throw '';
  module.exports = util.inherits;
} catch (e) {
  module.exports = __webpack_require__(/*! ./inherits_browser.js */ "./node_modules/inherits/inherits_browser.js");
}


/***/ }),

/***/ "./node_modules/inherits/inherits_browser.js":
/*!***************************************************!*\
  !*** ./node_modules/inherits/inherits_browser.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}


/***/ }),

/***/ "./node_modules/is-buffer/index.js":
/*!*****************************************!*\
  !*** ./node_modules/is-buffer/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}


/***/ }),

/***/ "./node_modules/minimalistic-assert/index.js":
/*!***************************************************!*\
  !*** ./node_modules/minimalistic-assert/index.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = assert;

function assert(val, msg) {
  if (!val)
    throw new Error(msg || 'Assertion failed');
}

assert.equal = function assertEqual(l, r, msg) {
  if (l != r)
    throw new Error(msg || ('Assertion failed: ' + l + ' != ' + r));
};


/***/ }),

/***/ "./node_modules/ms/index.js":
/*!**********************************!*\
  !*** ./node_modules/ms/index.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}


/***/ }),

/***/ "./node_modules/pem-jwk/factor.js":
/*!****************************************!*\
  !*** ./node_modules/pem-jwk/factor.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var asn = __webpack_require__(/*! asn1.js */ "./node_modules/pem-jwk/node_modules/asn1.js/lib/asn1.js")
var crypto = __webpack_require__(/*! crypto */ "crypto")
var BN = asn.bignum

var zero = new BN(0)
var one = new BN(1)
var two = new BN(2)

function rand(low, high) {
  do {
    var b = new BN(crypto.randomBytes(high.byteLength()))
  } while(b.cmp(low) <= 0 || b.cmp(high) >= 0)
  return b
}

function odd(n) {
  if (n.cmp(zero) === 0) { return zero }
  var r = n
  while (r.isEven()) {
    r = r.div(two)
  }
  return r
}

function rootOne(x, r, n) {
  var i = x.toRed(BN.red(n)).redPow(r).fromRed()
  var o = zero
  while (i.cmp(one) !== 0) {
    o = i
    i = i.mul(i).mod(n)
  }
  if (o.cmp(n.sub(one)) === 0) {
    return zero
  }
  return o
}

function factor(e, d, n) {
  var k = e.mul(d).sub(one)
  var r = odd(k)
  do {
    var y = rootOne(rand(two, n), r, n)
  } while (y.cmp(zero) === 0)

  var p = y.sub(one).gcd(n)
  return {
    p: p,
    q: n.div(p)
  }
}

module.exports = factor


/***/ }),

/***/ "./node_modules/pem-jwk/index.js":
/*!***************************************!*\
  !*** ./node_modules/pem-jwk/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var asn = __webpack_require__(/*! asn1.js */ "./node_modules/pem-jwk/node_modules/asn1.js/lib/asn1.js")
var factor = __webpack_require__(/*! ./factor */ "./node_modules/pem-jwk/factor.js")
var one = new asn.bignum(1)

function urlize(base64) {
  return base64.replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

function hex2b64url(str) {
  return urlize(Buffer(str, 'hex').toString('base64'))
}

function fromPEM(data) {
  var text = data.toString().split(/(\r\n|\r|\n)+/g);
  text = text.filter(function(line) {
    return line.trim().length !== 0;
  });
  text = text.slice(1, -1).join('');
  return new Buffer(text.replace(/[^\w\d\+\/=]+/g, ''), 'base64');
}

var RSAPublicKey = asn.define('RSAPublicKey', function () {
  this.seq().obj(
    this.key('n').int(),
    this.key('e').int()
  )
})

var AlgorithmIdentifier = asn.define('AlgorithmIdentifier', function () {
  this.seq().obj(
    this.key('algorithm').objid(),
    this.key('parameters').optional().any()
  )
})

var PublicKeyInfo = asn.define('PublicKeyInfo', function () {
  this.seq().obj(
    this.key('algorithm').use(AlgorithmIdentifier),
    this.key('publicKey').bitstr()
  )
})

var Version = asn.define('Version', function () {
  this.int({
    0: 'two-prime',
    1: 'multi'
  })
})

var OtherPrimeInfos = asn.define('OtherPrimeInfos', function () {
  this.seq().obj(
    this.key('ri').int(),
    this.key('di').int(),
    this.key('ti').int()
  )
})

var RSAPrivateKey = asn.define('RSAPrivateKey', function () {
  this.seq().obj(
    this.key('version').use(Version),
    this.key('n').int(),
    this.key('e').int(),
    this.key('d').int(),
    this.key('p').int(),
    this.key('q').int(),
    this.key('dp').int(),
    this.key('dq').int(),
    this.key('qi').int(),
    this.key('other').optional().use(OtherPrimeInfos)
  )
})

var PrivateKeyInfo = asn.define('PrivateKeyInfo', function () {
  this.seq().obj(
    this.key('version').use(Version),
    this.key('algorithm').use(AlgorithmIdentifier),
    this.key('privateKey').bitstr()
  )
})

const RSA_OID = '1.2.840.113549.1.1.1'

function addExtras(obj, extras) {
  extras = extras || {}
  Object.keys(extras).forEach(
    function (key) {
      obj[key] = extras[key]
    }
  )
  return obj
}

function pad(hex) {
  return (hex.length % 2 === 1) ? '0' + hex : hex
}

function decodeRsaPublic(buffer, extras) {
  var key = RSAPublicKey.decode(buffer, 'der')
  var e = pad(key.e.toString(16))
  var jwk = {
    kty: 'RSA',
    n: bn2base64url(key.n),
    e: hex2b64url(e)
  }
  return addExtras(jwk, extras)
}

function decodeRsaPrivate(buffer, extras) {
  var key = RSAPrivateKey.decode(buffer, 'der')
  var e = pad(key.e.toString(16))
  var jwk = {
    kty: 'RSA',
    n: bn2base64url(key.n),
    e: hex2b64url(e),
    d: bn2base64url(key.d),
    p: bn2base64url(key.p),
    q: bn2base64url(key.q),
    dp: bn2base64url(key.dp),
    dq: bn2base64url(key.dq),
    qi: bn2base64url(key.qi)
  }
  return addExtras(jwk, extras)
}

function decodePublic(buffer, extras) {
  var info = PublicKeyInfo.decode(buffer, 'der')
  return decodeRsaPublic(info.publicKey.data, extras)
}

function decodePrivate(buffer, extras) {
  var info = PrivateKeyInfo.decode(buffer, 'der')
  return decodeRsaPrivate(info.privateKey.data, extras)
}

function getDecoder(header) {
  var match = /^-----BEGIN (RSA )?(PUBLIC|PRIVATE) KEY-----$/.exec(header)
  if (!match) { return null }
  var isRSA = !!(match[1])
  var isPrivate = (match[2] === 'PRIVATE')
  if (isPrivate) {
    return isRSA ? decodeRsaPrivate : decodePrivate
  }
  else {
    return isRSA ? decodeRsaPublic : decodePublic
  }
}

function pem2jwk(pem, extras) {
  var text = pem.toString().split(/(\r\n|\r|\n)+/g)
  text = text.filter(function(line) {
    return line.trim().length !== 0
  });
  var decoder = getDecoder(text[0])

  text = text.slice(1, -1).join('')
  return decoder(new Buffer(text.replace(/[^\w\d\+\/=]+/g, ''), 'base64'), extras)
}

function recomputePrimes(jwk) {
  var pq = factor(jwk.e, jwk.d, jwk.n)
  var p = pq.p
  var q = pq.q
  var dp = jwk.d.mod(p.sub(one))
  var dq = jwk.d.mod(q.sub(one))
  var qi = q.invm(p)
  return {
    n: jwk.n,
    e: jwk.e,
    d: jwk.d,
    p: p,
    q: q,
    dp: dp,
    dq: dq,
    qi: qi
  }
}

function parse(jwk) {
  return {
    n: string2bn(jwk.n),
    e: string2bn(jwk.e),
    d: jwk.d && string2bn(jwk.d),
    p: jwk.p && string2bn(jwk.p),
    q: jwk.q && string2bn(jwk.q),
    dp: jwk.dp && string2bn(jwk.dp),
    dq: jwk.dq && string2bn(jwk.dq),
    qi: jwk.qi && string2bn(jwk.qi)
  }
}

function jwk2pem(json) {
  var jwk = parse(json)
  var isPrivate = !!(jwk.d)
  var t = isPrivate ? 'PRIVATE' : 'PUBLIC'
  var header = '-----BEGIN RSA ' + t + ' KEY-----\n'
  var footer = '\n-----END RSA ' + t + ' KEY-----\n'
  var data = Buffer(0)
  if (isPrivate) {
    if (!jwk.p) {
      jwk = recomputePrimes(jwk)
    }
    jwk.version = 'two-prime'
    data = RSAPrivateKey.encode(jwk, 'der')
  }
  else {
    data = RSAPublicKey.encode(jwk, 'der')
  }
  var body = data.toString('base64').match(/.{1,64}/g).join('\n')
  return header + body + footer
}

function bn2base64url(bn) {
  return hex2b64url(pad(bn.toString(16)))
}

function base64url2bn(str) {
  return new asn.bignum(Buffer(str, 'base64'))
}

function string2bn(str) {
  if (/^[0-9]+$/.test(str)) {
    return new asn.bignum(str, 10)
  }
  return base64url2bn(str)
}

module.exports = {
  pem2jwk: pem2jwk,
  jwk2pem: jwk2pem,
  BN: asn.bignum
}


/***/ }),

/***/ "./node_modules/pem-jwk/node_modules/asn1.js/lib/asn1.js":
/*!***************************************************************!*\
  !*** ./node_modules/pem-jwk/node_modules/asn1.js/lib/asn1.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var asn1 = exports;

asn1.bignum = __webpack_require__(/*! bn.js */ "./node_modules/pem-jwk/node_modules/bn.js/lib/bn.js");

asn1.define = __webpack_require__(/*! ./asn1/api */ "./node_modules/pem-jwk/node_modules/asn1.js/lib/asn1/api.js").define;
asn1.base = __webpack_require__(/*! ./asn1/base */ "./node_modules/pem-jwk/node_modules/asn1.js/lib/asn1/base/index.js");
asn1.constants = __webpack_require__(/*! ./asn1/constants */ "./node_modules/pem-jwk/node_modules/asn1.js/lib/asn1/constants/index.js");
asn1.decoders = __webpack_require__(/*! ./asn1/decoders */ "./node_modules/pem-jwk/node_modules/asn1.js/lib/asn1/decoders/index.js");
asn1.encoders = __webpack_require__(/*! ./asn1/encoders */ "./node_modules/pem-jwk/node_modules/asn1.js/lib/asn1/encoders/index.js");


/***/ }),

/***/ "./node_modules/pem-jwk/node_modules/asn1.js/lib/asn1/api.js":
/*!*******************************************************************!*\
  !*** ./node_modules/pem-jwk/node_modules/asn1.js/lib/asn1/api.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var asn1 = __webpack_require__(/*! ../asn1 */ "./node_modules/pem-jwk/node_modules/asn1.js/lib/asn1.js");
var inherits = __webpack_require__(/*! inherits */ "./node_modules/inherits/inherits.js");
var vm = __webpack_require__(/*! vm */ "vm");

var api = exports;

api.define = function define(name, body) {
  return new Entity(name, body);
};

function Entity(name, body) {
  this.name = name;
  this.body = body;

  this.decoders = {};
  this.encoders = {};
};

Entity.prototype._createNamed = function createNamed(base) {
  var named = vm.runInThisContext('(function ' + this.name + '(entity) {\n' +
    '  this._initNamed(entity);\n' +
    '})');
  inherits(named, base);
  named.prototype._initNamed = function initnamed(entity) {
    base.call(this, entity);
  };

  return new named(this);
};

Entity.prototype._getDecoder = function _getDecoder(enc) {
  // Lazily create decoder
  if (!this.decoders.hasOwnProperty(enc))
    this.decoders[enc] = this._createNamed(asn1.decoders[enc]);
  return this.decoders[enc];
};

Entity.prototype.decode = function decode(data, enc, options) {
  return this._getDecoder(enc).decode(data, options);
};

Entity.prototype._getEncoder = function _getEncoder(enc) {
  // Lazily create encoder
  if (!this.encoders.hasOwnProperty(enc))
    this.encoders[enc] = this._createNamed(asn1.encoders[enc]);
  return this.encoders[enc];
};

Entity.prototype.encode = function encode(data, enc, /* internal */ reporter) {
  return this._getEncoder(enc).encode(data, reporter);
};


/***/ }),

/***/ "./node_modules/pem-jwk/node_modules/asn1.js/lib/asn1/base/buffer.js":
/*!***************************************************************************!*\
  !*** ./node_modules/pem-jwk/node_modules/asn1.js/lib/asn1/base/buffer.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var inherits = __webpack_require__(/*! inherits */ "./node_modules/inherits/inherits.js");
var Reporter = __webpack_require__(/*! ../base */ "./node_modules/pem-jwk/node_modules/asn1.js/lib/asn1/base/index.js").Reporter;
var Buffer = __webpack_require__(/*! buffer */ "buffer").Buffer;

function DecoderBuffer(base, options) {
  Reporter.call(this, options);
  if (!Buffer.isBuffer(base)) {
    this.error('Input not Buffer');
    return;
  }

  this.base = base;
  this.offset = 0;
  this.length = base.length;
}
inherits(DecoderBuffer, Reporter);
exports.DecoderBuffer = DecoderBuffer;

DecoderBuffer.prototype.save = function save() {
  return { offset: this.offset };
};

DecoderBuffer.prototype.restore = function restore(save) {
  // Return skipped data
  var res = new DecoderBuffer(this.base);
  res.offset = save.offset;
  res.length = this.offset;

  this.offset = save.offset;

  return res;
};

DecoderBuffer.prototype.isEmpty = function isEmpty() {
  return this.offset === this.length;
};

DecoderBuffer.prototype.readUInt8 = function readUInt8(fail) {
  if (this.offset + 1 <= this.length)
    return this.base.readUInt8(this.offset++, true);
  else
    return this.error(fail || 'DecoderBuffer overrun');
}

DecoderBuffer.prototype.skip = function skip(bytes, fail) {
  if (!(this.offset + bytes <= this.length))
    return this.error(fail || 'DecoderBuffer overrun');

  var res = new DecoderBuffer(this.base);

  // Share reporter state
  res._reporterState = this._reporterState;

  res.offset = this.offset;
  res.length = this.offset + bytes;
  this.offset += bytes;
  return res;
}

DecoderBuffer.prototype.raw = function raw(save) {
  return this.base.slice(save ? save.offset : this.offset, this.length);
}

function EncoderBuffer(value, reporter) {
  if (Array.isArray(value)) {
    this.length = 0;
    this.value = value.map(function(item) {
      if (!(item instanceof EncoderBuffer))
        item = new EncoderBuffer(item, reporter);
      this.length += item.length;
      return item;
    }, this);
  } else if (typeof value === 'number') {
    if (!(0 <= value && value <= 0xff))
      return reporter.error('non-byte EncoderBuffer value');
    this.value = value;
    this.length = 1;
  } else if (typeof value === 'string') {
    this.value = value;
    this.length = Buffer.byteLength(value);
  } else if (Buffer.isBuffer(value)) {
    this.value = value;
    this.length = value.length;
  } else {
    return reporter.error('Unsupported type: ' + typeof value);
  }
}
exports.EncoderBuffer = EncoderBuffer;

EncoderBuffer.prototype.join = function join(out, offset) {
  if (!out)
    out = new Buffer(this.length);
  if (!offset)
    offset = 0;

  if (this.length === 0)
    return out;

  if (Array.isArray(this.value)) {
    this.value.forEach(function(item) {
      item.join(out, offset);
      offset += item.length;
    });
  } else {
    if (typeof this.value === 'number')
      out[offset] = this.value;
    else if (typeof this.value === 'string')
      out.write(this.value, offset);
    else if (Buffer.isBuffer(this.value))
      this.value.copy(out, offset);
    offset += this.length;
  }

  return out;
};


/***/ }),

/***/ "./node_modules/pem-jwk/node_modules/asn1.js/lib/asn1/base/index.js":
/*!**************************************************************************!*\
  !*** ./node_modules/pem-jwk/node_modules/asn1.js/lib/asn1/base/index.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var base = exports;

base.Reporter = __webpack_require__(/*! ./reporter */ "./node_modules/pem-jwk/node_modules/asn1.js/lib/asn1/base/reporter.js").Reporter;
base.DecoderBuffer = __webpack_require__(/*! ./buffer */ "./node_modules/pem-jwk/node_modules/asn1.js/lib/asn1/base/buffer.js").DecoderBuffer;
base.EncoderBuffer = __webpack_require__(/*! ./buffer */ "./node_modules/pem-jwk/node_modules/asn1.js/lib/asn1/base/buffer.js").EncoderBuffer;
base.Node = __webpack_require__(/*! ./node */ "./node_modules/pem-jwk/node_modules/asn1.js/lib/asn1/base/node.js");


/***/ }),

/***/ "./node_modules/pem-jwk/node_modules/asn1.js/lib/asn1/base/node.js":
/*!*************************************************************************!*\
  !*** ./node_modules/pem-jwk/node_modules/asn1.js/lib/asn1/base/node.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Reporter = __webpack_require__(/*! ../base */ "./node_modules/pem-jwk/node_modules/asn1.js/lib/asn1/base/index.js").Reporter;
var EncoderBuffer = __webpack_require__(/*! ../base */ "./node_modules/pem-jwk/node_modules/asn1.js/lib/asn1/base/index.js").EncoderBuffer;
var assert = __webpack_require__(/*! minimalistic-assert */ "./node_modules/minimalistic-assert/index.js");

// Supported tags
var tags = [
  'seq', 'seqof', 'set', 'setof', 'octstr', 'bitstr', 'objid', 'bool',
  'gentime', 'utctime', 'null_', 'enum', 'int', 'ia5str'
];

// Public methods list
var methods = [
  'key', 'obj', 'use', 'optional', 'explicit', 'implicit', 'def', 'choice',
  'any'
].concat(tags);

// Overrided methods list
var overrided = [
  '_peekTag', '_decodeTag', '_use',
  '_decodeStr', '_decodeObjid', '_decodeTime',
  '_decodeNull', '_decodeInt', '_decodeBool', '_decodeList',

  '_encodeComposite', '_encodeStr', '_encodeObjid', '_encodeTime',
  '_encodeNull', '_encodeInt', '_encodeBool'
];

function Node(enc, parent) {
  var state = {};
  this._baseState = state;

  state.enc = enc;

  state.parent = parent || null;
  state.children = null;

  // State
  state.tag = null;
  state.args = null;
  state.reverseArgs = null;
  state.choice = null;
  state.optional = false;
  state.any = false;
  state.obj = false;
  state.use = null;
  state.useDecoder = null;
  state.key = null;
  state['default'] = null;
  state.explicit = null;
  state.implicit = null;

  // Should create new instance on each method
  if (!state.parent) {
    state.children = [];
    this._wrap();
  }
}
module.exports = Node;

var stateProps = [
  'enc', 'parent', 'children', 'tag', 'args', 'reverseArgs', 'choice',
  'optional', 'any', 'obj', 'use', 'alteredUse', 'key', 'default', 'explicit',
  'implicit'
];

Node.prototype.clone = function clone() {
  var state = this._baseState;
  var cstate = {};
  stateProps.forEach(function(prop) {
    cstate[prop] = state[prop];
  });
  var res = new this.constructor(cstate.parent);
  res._baseState = cstate;
  return res;
};

Node.prototype._wrap = function wrap() {
  var state = this._baseState;
  methods.forEach(function(method) {
    this[method] = function _wrappedMethod() {
      var clone = new this.constructor(this);
      state.children.push(clone);
      return clone[method].apply(clone, arguments);
    };
  }, this);
};

Node.prototype._init = function init(body) {
  var state = this._baseState;

  assert(state.parent === null);
  body.call(this);

  // Filter children
  state.children = state.children.filter(function(child) {
    return child._baseState.parent === this;
  }, this);
  assert.equal(state.children.length, 1, 'Root node can have only one child');
};

Node.prototype._useArgs = function useArgs(args) {
  var state = this._baseState;

  // Filter children and args
  var children = args.filter(function(arg) {
    return arg instanceof this.constructor;
  }, this);
  args = args.filter(function(arg) {
    return !(arg instanceof this.constructor);
  }, this);

  if (children.length !== 0) {
    assert(state.children === null);
    state.children = children;

    // Replace parent to maintain backward link
    children.forEach(function(child) {
      child._baseState.parent = this;
    }, this);
  }
  if (args.length !== 0) {
    assert(state.args === null);
    state.args = args;
    state.reverseArgs = args.map(function(arg) {
      if (typeof arg !== 'object' || arg.constructor !== Object)
        return arg;

      var res = {};
      Object.keys(arg).forEach(function(key) {
        if (key == (key | 0))
          key |= 0;
        var value = arg[key];
        res[value] = key;
      });
      return res;
    });
  }
};

//
// Overrided methods
//

overrided.forEach(function(method) {
  Node.prototype[method] = function _overrided() {
    var state = this._baseState;
    throw new Error(method + ' not implemented for encoding: ' + state.enc);
  };
});

//
// Public methods
//

tags.forEach(function(tag) {
  Node.prototype[tag] = function _tagMethod() {
    var state = this._baseState;
    var args = Array.prototype.slice.call(arguments);

    assert(state.tag === null);
    state.tag = tag;

    this._useArgs(args);

    return this;
  };
});

Node.prototype.use = function use(item) {
  var state = this._baseState;

  assert(state.use === null);
  state.use = item;

  return this;
};

Node.prototype.optional = function optional() {
  var state = this._baseState;

  state.optional = true;

  return this;
};

Node.prototype.def = function def(val) {
  var state = this._baseState;

  assert(state['default'] === null);
  state['default'] = val;
  state.optional = true;

  return this;
};

Node.prototype.explicit = function explicit(num) {
  var state = this._baseState;

  assert(state.explicit === null && state.implicit === null);
  state.explicit = num;

  return this;
};

Node.prototype.implicit = function implicit(num) {
  var state = this._baseState;

  assert(state.explicit === null && state.implicit === null);
  state.implicit = num;

  return this;
};

Node.prototype.obj = function obj() {
  var state = this._baseState;
  var args = Array.prototype.slice.call(arguments);

  state.obj = true;

  if (args.length !== 0)
    this._useArgs(args);

  return this;
};

Node.prototype.key = function key(newKey) {
  var state = this._baseState;

  assert(state.key === null);
  state.key = newKey;

  return this;
};

Node.prototype.any = function any() {
  var state = this._baseState;

  state.any = true;

  return this;
};

Node.prototype.choice = function choice(obj) {
  var state = this._baseState;

  assert(state.choice === null);
  state.choice = obj;
  this._useArgs(Object.keys(obj).map(function(key) {
    return obj[key];
  }));

  return this;
};

//
// Decoding
//

Node.prototype._decode = function decode(input) {
  var state = this._baseState;

  // Decode root node
  if (state.parent === null)
    return input.wrapResult(state.children[0]._decode(input));

  var result = state['default'];
  var present = true;

  var prevKey;
  if (state.key !== null)
    prevKey = input.enterKey(state.key);

  // Check if tag is there
  if (state.optional) {
    present = this._peekTag(
      input,
      state.explicit !== null ? state.explicit :
          state.implicit !== null ? state.implicit :
              state.tag || 0
    );
    if (input.isError(present))
      return present;
  }

  // Push object on stack
  var prevObj;
  if (state.obj && present)
    prevObj = input.enterObject();

  if (present) {
    // Unwrap explicit values
    if (state.explicit !== null) {
      var explicit = this._decodeTag(input, state.explicit);
      if (input.isError(explicit))
        return explicit;
      input = explicit;
    }

    // Unwrap implicit and normal values
    if (state.use === null && state.choice === null) {
      if (state.any)
        var save = input.save();
      var body = this._decodeTag(
        input,
        state.implicit !== null ? state.implicit : state.tag,
        state.any
      );
      if (input.isError(body))
        return body;

      if (state.any)
        result = input.raw(save);
      else
        input = body;
    }

    // Select proper method for tag
    if (state.any)
      result = result;
    else if (state.choice === null)
      result = this._decodeGeneric(state.tag, input);
    else
      result = this._decodeChoice(input);

    if (input.isError(result))
      return result;

    // Decode children
    if (!state.any && state.choice === null && state.children !== null) {
      var fail = state.children.some(function decodeChildren(child) {
        // NOTE: We are ignoring errors here, to let parser continue with other
        // parts of encoded data
        child._decode(input);
      });
      if (fail)
        return err;
    }
  }

  // Pop object
  if (state.obj && present)
    result = input.leaveObject(prevObj);

  // Set key
  if (state.key !== null && (result !== null || present === true))
    input.leaveKey(prevKey, state.key, result);

  return result;
};

Node.prototype._decodeGeneric = function decodeGeneric(tag, input) {
  var state = this._baseState;

  if (tag === 'seq' || tag === 'set')
    return null;
  if (tag === 'seqof' || tag === 'setof')
    return this._decodeList(input, tag, state.args[0]);
  else if (tag === 'octstr' || tag === 'bitstr' || tag === 'ia5str')
    return this._decodeStr(input, tag);
  else if (tag === 'objid' && state.args)
    return this._decodeObjid(input, state.args[0], state.args[1]);
  else if (tag === 'objid')
    return this._decodeObjid(input, null, null);
  else if (tag === 'gentime' || tag === 'utctime')
    return this._decodeTime(input, tag);
  else if (tag === 'null_')
    return this._decodeNull(input);
  else if (tag === 'bool')
    return this._decodeBool(input);
  else if (tag === 'int' || tag === 'enum')
    return this._decodeInt(input, state.args && state.args[0]);
  else if (state.use !== null)
    return this._getUse(state.use, input._reporterState.obj)._decode(input);
  else
    return input.error('unknown tag: ' + tag);

  return null;
};

Node.prototype._getUse = function _getUse(entity, obj) {

  var state = this._baseState;
  // Create altered use decoder if implicit is set
  state.useDecoder = this._use(entity, obj);
  assert(state.useDecoder._baseState.parent === null);
  state.useDecoder = state.useDecoder._baseState.children[0];
  if (state.implicit !== state.useDecoder._baseState.implicit) {
    state.useDecoder = state.useDecoder.clone();
    state.useDecoder._baseState.implicit = state.implicit;
  }
  return state.useDecoder;
};

Node.prototype._decodeChoice = function decodeChoice(input) {
  var state = this._baseState;
  var result = null;
  var match = false;

  Object.keys(state.choice).some(function(key) {
    var save = input.save();
    var node = state.choice[key];
    try {
      var value = node._decode(input);
      if (input.isError(value))
        return false;

      result = { type: key, value: value };
      match = true;
    } catch (e) {
      input.restore(save);
      return false;
    }
    return true;
  }, this);

  if (!match)
    return input.error('Choice not matched');

  return result;
};

//
// Encoding
//

Node.prototype._createEncoderBuffer = function createEncoderBuffer(data) {
  return new EncoderBuffer(data, this.reporter);
};

Node.prototype._encode = function encode(data, reporter, parent) {
  var state = this._baseState;
  if (state['default'] !== null && state['default'] === data)
    return;

  var result = this._encodeValue(data, reporter, parent);
  if (result === undefined)
    return;

  if (this._skipDefault(result, reporter, parent))
    return;

  return result;
};

Node.prototype._encodeValue = function encode(data, reporter, parent) {
  var state = this._baseState;

  // Decode root node
  if (state.parent === null)
    return state.children[0]._encode(data, reporter || new Reporter());

  var result = null;
  var present = true;

  // Set reporter to share it with a child class
  this.reporter = reporter;

  // Check if data is there
  if (state.optional && data === undefined) {
    if (state['default'] !== null)
      data = state['default']
    else
      return;
  }

  // For error reporting
  var prevKey;

  // Encode children first
  var content = null;
  var primitive = false;
  if (state.any) {
    // Anything that was given is translated to buffer
    result = this._createEncoderBuffer(data);
  } else if (state.choice) {
    result = this._encodeChoice(data, reporter);
  } else if (state.children) {
    content = state.children.map(function(child) {
      if (child._baseState.tag === 'null_')
        return child._encode(null, reporter, data);

      if (child._baseState.key === null)
        return reporter.error('Child should have a key');
      var prevKey = reporter.enterKey(child._baseState.key);

      if (typeof data !== 'object')
        return reporter.error('Child expected, but input is not object');

      var res = child._encode(data[child._baseState.key], reporter, data);
      reporter.leaveKey(prevKey);

      return res;
    }, this).filter(function(child) {
      return child;
    });

    content = this._createEncoderBuffer(content);
  } else {
    if (state.tag === 'seqof' || state.tag === 'setof') {
      // TODO(indutny): this should be thrown on DSL level
      if (!(state.args && state.args.length === 1))
        return reporter.error('Too many args for : ' + state.tag);

      if (!Array.isArray(data))
        return reporter.error('seqof/setof, but data is not Array');

      var child = this.clone();
      child._baseState.implicit = null;
      content = this._createEncoderBuffer(data.map(function(item) {
        var state = this._baseState;

        return this._getUse(state.args[0], data)._encode(item, reporter);
      }, child));
    } else if (state.use !== null) {
      result = this._getUse(state.use, parent)._encode(data, reporter);
    } else {
      content = this._encodePrimitive(state.tag, data);
      primitive = true;
    }
  }

  // Encode data itself
  var result;
  if (!state.any && state.choice === null) {
    var tag = state.implicit !== null ? state.implicit : state.tag;
    var cls = state.implicit === null ? 'universal' : 'context';

    if (tag === null) {
      if (state.use === null)
        reporter.error('Tag could be ommited only for .use()');
    } else {
      if (state.use === null)
        result = this._encodeComposite(tag, primitive, cls, content);
    }
  }

  // Wrap in explicit
  if (state.explicit !== null)
    result = this._encodeComposite(state.explicit, false, 'context', result);

  return result;
};

Node.prototype._encodeChoice = function encodeChoice(data, reporter) {
  var state = this._baseState;

  var node = state.choice[data.type];
  if (!node) {
    assert(
        false,
        data.type + ' not found in ' +
            JSON.stringify(Object.keys(state.choice)));
  }
  return node._encode(data.value, reporter);
};

Node.prototype._encodePrimitive = function encodePrimitive(tag, data) {
  var state = this._baseState;

  if (tag === 'octstr' || tag === 'bitstr' || tag === 'ia5str')
    return this._encodeStr(data, tag);
  else if (tag === 'objid' && state.args)
    return this._encodeObjid(data, state.reverseArgs[0], state.args[1]);
  else if (tag === 'objid')
    return this._encodeObjid(data, null, null);
  else if (tag === 'gentime' || tag === 'utctime')
    return this._encodeTime(data, tag);
  else if (tag === 'null_')
    return this._encodeNull();
  else if (tag === 'int' || tag === 'enum')
    return this._encodeInt(data, state.args && state.reverseArgs[0]);
  else if (tag === 'bool')
    return this._encodeBool(data);
  else
    throw new Error('Unsupported tag: ' + tag);
};


/***/ }),

/***/ "./node_modules/pem-jwk/node_modules/asn1.js/lib/asn1/base/reporter.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/pem-jwk/node_modules/asn1.js/lib/asn1/base/reporter.js ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var inherits = __webpack_require__(/*! inherits */ "./node_modules/inherits/inherits.js");

function Reporter(options) {
  this._reporterState = {
    obj: null,
    path: [],
    options: options || {},
    errors: []
  };
}
exports.Reporter = Reporter;

Reporter.prototype.isError = function isError(obj) {
  return obj instanceof ReporterError;
};

Reporter.prototype.enterKey = function enterKey(key) {
  return this._reporterState.path.push(key);
};

Reporter.prototype.leaveKey = function leaveKey(index, key, value) {
  var state = this._reporterState;

  state.path = state.path.slice(0, index - 1);
  if (state.obj !== null)
    state.obj[key] = value;
};

Reporter.prototype.enterObject = function enterObject() {
  var state = this._reporterState;

  var prev = state.obj;
  state.obj = {};
  return prev;
};

Reporter.prototype.leaveObject = function leaveObject(prev) {
  var state = this._reporterState;

  var now = state.obj;
  state.obj = prev;
  return now;
};

Reporter.prototype.error = function error(msg) {
  var err;
  var state = this._reporterState;

  var inherited = msg instanceof ReporterError;
  if (inherited) {
    err = msg;
  } else {
    err = new ReporterError(state.path.map(function(elem) {
      return '[' + JSON.stringify(elem) + ']';
    }).join(''), msg.message || msg, msg.stack);
  }

  if (!state.options.partial)
    throw err;

  if (!inherited)
    state.errors.push(err);

  return err;
};

Reporter.prototype.wrapResult = function wrapResult(result) {
  var state = this._reporterState;
  if (!state.options.partial)
    return result;

  return {
    result: this.isError(result) ? null : result,
    errors: state.errors
  };
};

function ReporterError(path, msg) {
  this.path = path;
  this.rethrow(msg);
};
inherits(ReporterError, Error);

ReporterError.prototype.rethrow = function rethrow(msg) {
  this.message = msg + ' at: ' + (this.path || '(shallow)');
  Error.captureStackTrace(this, ReporterError);

  return this;
};


/***/ }),

/***/ "./node_modules/pem-jwk/node_modules/asn1.js/lib/asn1/constants/der.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/pem-jwk/node_modules/asn1.js/lib/asn1/constants/der.js ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var constants = __webpack_require__(/*! ../constants */ "./node_modules/pem-jwk/node_modules/asn1.js/lib/asn1/constants/index.js");

exports.tagClass = {
  0: 'universal',
  1: 'application',
  2: 'context',
  3: 'private'
};
exports.tagClassByName = constants._reverse(exports.tagClass);

exports.tag = {
  0x00: 'end',
  0x01: 'bool',
  0x02: 'int',
  0x03: 'bitstr',
  0x04: 'octstr',
  0x05: 'null_',
  0x06: 'objid',
  0x07: 'objDesc',
  0x08: 'external',
  0x09: 'real',
  0x0a: 'enum',
  0x0b: 'embed',
  0x0c: 'utf8str',
  0x0d: 'relativeOid',
  0x10: 'seq',
  0x11: 'set',
  0x12: 'numstr',
  0x13: 'printstr',
  0x14: 't61str',
  0x15: 'videostr',
  0x16: 'ia5str',
  0x17: 'utctime',
  0x18: 'gentime',
  0x19: 'graphstr',
  0x1a: 'iso646str',
  0x1b: 'genstr',
  0x1c: 'unistr',
  0x1d: 'charstr',
  0x1e: 'bmpstr'
};
exports.tagByName = constants._reverse(exports.tag);


/***/ }),

/***/ "./node_modules/pem-jwk/node_modules/asn1.js/lib/asn1/constants/index.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/pem-jwk/node_modules/asn1.js/lib/asn1/constants/index.js ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var constants = exports;

// Helper
constants._reverse = function reverse(map) {
  var res = {};

  Object.keys(map).forEach(function(key) {
    // Convert key to integer if it is stringified
    if ((key | 0) == key)
      key = key | 0;

    var value = map[key];
    res[value] = key;
  });

  return res;
};

constants.der = __webpack_require__(/*! ./der */ "./node_modules/pem-jwk/node_modules/asn1.js/lib/asn1/constants/der.js");


/***/ }),

/***/ "./node_modules/pem-jwk/node_modules/asn1.js/lib/asn1/decoders/der.js":
/*!****************************************************************************!*\
  !*** ./node_modules/pem-jwk/node_modules/asn1.js/lib/asn1/decoders/der.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var inherits = __webpack_require__(/*! inherits */ "./node_modules/inherits/inherits.js");

var asn1 = __webpack_require__(/*! ../../asn1 */ "./node_modules/pem-jwk/node_modules/asn1.js/lib/asn1.js");
var base = asn1.base;
var bignum = asn1.bignum;

// Import DER constants
var der = asn1.constants.der;

function DERDecoder(entity) {
  this.enc = 'der';
  this.name = entity.name;
  this.entity = entity;

  // Construct base tree
  this.tree = new DERNode();
  this.tree._init(entity.body);
};
module.exports = DERDecoder;

DERDecoder.prototype.decode = function decode(data, options) {
  if (!(data instanceof base.DecoderBuffer))
    data = new base.DecoderBuffer(data, options);

  return this.tree._decode(data, options);
};

// Tree methods

function DERNode(parent) {
  base.Node.call(this, 'der', parent);
}
inherits(DERNode, base.Node);

DERNode.prototype._peekTag = function peekTag(buffer, tag) {
  if (buffer.isEmpty())
    return false;

  var state = buffer.save();
  var decodedTag = derDecodeTag(buffer, 'Failed to peek tag: "' + tag + '"');
  if (buffer.isError(decodedTag))
    return decodedTag;

  buffer.restore(state);

  return decodedTag.tag === tag || decodedTag.tagStr === tag;
};

DERNode.prototype._decodeTag = function decodeTag(buffer, tag, any) {
  var decodedTag = derDecodeTag(buffer,
                                'Failed to decode tag of "' + tag + '"');
  if (buffer.isError(decodedTag))
    return decodedTag;

  var len = derDecodeLen(buffer,
                         decodedTag.primitive,
                         'Failed to get length of "' + tag + '"');

  // Failure
  if (buffer.isError(len))
    return len;

  if (!any &&
      decodedTag.tag !== tag &&
      decodedTag.tagStr !== tag &&
      decodedTag.tagStr + 'of' !== tag) {
    return buffer.error('Failed to match tag: "' + tag + '"');
  }

  if (decodedTag.primitive || len !== null)
    return buffer.skip(len, 'Failed to match body of: "' + tag + '"');

  // Indefinite length... find END tag
  var state = buffer.start();
  var res = this._skipUntilEnd(
      buffer,
      'Failed to skip indefinite length body: "' + this.tag + '"');
  if (buffer.isError(res))
    return res;

  return buffer.cut(state);
};

DERNode.prototype._skipUntilEnd = function skipUntilEnd(buffer, fail) {
  while (true) {
    var tag = derDecodeTag(buffer, fail);
    if (buffer.isError(tag))
      return tag;
    var len = derDecodeLen(buffer, tag.primitive, fail);
    if (buffer.isError(len))
      return len;

    var res;
    if (tag.primitive || len !== null)
      res = buffer.skip(len)
    else
      res = this._skipUntilEnd(buffer, fail);

    // Failure
    if (buffer.isError(res))
      return res;

    if (tag.tagStr === 'end')
      break;
  }
};

DERNode.prototype._decodeList = function decodeList(buffer, tag, decoder) {
  var result = [];
  while (!buffer.isEmpty()) {
    var possibleEnd = this._peekTag(buffer, 'end');
    if (buffer.isError(possibleEnd))
      return possibleEnd;

    var res = decoder.decode(buffer, 'der');
    if (buffer.isError(res) && possibleEnd)
      break;
    result.push(res);
  }
  return result;
};

DERNode.prototype._decodeStr = function decodeStr(buffer, tag) {
  if (tag === 'octstr') {
    return buffer.raw();
  } else if (tag === 'bitstr') {
    var unused = buffer.readUInt8();
    if (buffer.isError(unused))
      return unused;

    return { unused: unused, data: buffer.raw() };
  } else if (tag === 'ia5str') {
    return buffer.raw().toString();
  } else {
    return this.error('Decoding of string type: ' + tag + ' unsupported');
  }
};

DERNode.prototype._decodeObjid = function decodeObjid(buffer, values, relative) {
  var identifiers = [];
  var ident = 0;
  while (!buffer.isEmpty()) {
    var subident = buffer.readUInt8();
    ident <<= 7;
    ident |= subident & 0x7f;
    if ((subident & 0x80) === 0) {
      identifiers.push(ident);
      ident = 0;
    }
  }
  if (subident & 0x80)
    identifiers.push(ident);

  var first = (identifiers[0] / 40) | 0;
  var second = identifiers[0] % 40;

  if (relative)
    result = identifiers;
  else
    result = [first, second].concat(identifiers.slice(1));

  if (values)
    result = values[result.join(' ')];

  return result;
};

DERNode.prototype._decodeTime = function decodeTime(buffer, tag) {
  var str = buffer.raw().toString();
  if (tag === 'gentime') {
    var year = str.slice(0, 4) | 0;
    var mon = str.slice(4, 6) | 0;
    var day = str.slice(6, 8) | 0;
    var hour = str.slice(8, 10) | 0;
    var min = str.slice(10, 12) | 0;
    var sec = str.slice(12, 14) | 0;
  } else if (tag === 'utctime') {
    var year = str.slice(0, 2) | 0;
    var mon = str.slice(2, 4) | 0;
    var day = str.slice(4, 6) | 0;
    var hour = str.slice(6, 8) | 0;
    var min = str.slice(8, 10) | 0;
    var sec = str.slice(10, 12) | 0;
    if (year < 70)
      year = 2000 + year;
    else
      year = 1900 + year;
  } else {
    return this.error('Decoding ' + tag + ' time is not supported yet');
  }

  return Date.UTC(year, mon - 1, day, hour, min, sec, 0);
};

DERNode.prototype._decodeNull = function decodeNull(buffer) {
  return null;
};

DERNode.prototype._decodeBool = function decodeBool(buffer) {
  var res = buffer.readUInt8();
  if (buffer.isError(res))
    return res;
  else
    return res !== 0;
};

DERNode.prototype._decodeInt = function decodeInt(buffer, values) {
  var res = 0;

  // Bigint, return as it is (assume big endian)
  var raw = buffer.raw();
  if (raw.length > 3)
    return new bignum(raw);

  while (!buffer.isEmpty()) {
    res <<= 8;
    var i = buffer.readUInt8();
    if (buffer.isError(i))
      return i;
    res |= i;
  }

  if (values)
    res = values[res] || res;

  return res;
};

DERNode.prototype._use = function use(entity, obj) {
  if (typeof entity === 'function')
    entity = entity(obj);
  return entity._getDecoder('der').tree;
};

// Utility methods

function derDecodeTag(buf, fail) {
  var tag = buf.readUInt8(fail);
  if (buf.isError(tag))
    return tag;

  var cls = der.tagClass[tag >> 6];
  var primitive = (tag & 0x20) === 0;

  // Multi-octet tag - load
  if ((tag & 0x1f) === 0x1f) {
    var oct = tag;
    tag = 0;
    while ((oct & 0x80) === 0x80) {
      oct = buf.readUInt8(fail);
      if (buf.isError(oct))
        return oct;

      tag <<= 7;
      tag |= oct & 0x7f;
    }
  } else {
    tag &= 0x1f;
  }
  var tagStr = der.tag[tag];

  return {
    cls: cls,
    primitive: primitive,
    tag: tag,
    tagStr: tagStr
  };
}

function derDecodeLen(buf, primitive, fail) {
  var len = buf.readUInt8(fail);
  if (buf.isError(len))
    return len;

  // Indefinite form
  if (!primitive && len === 0x80)
    return null;

  // Definite form
  if ((len & 0x80) === 0) {
    // Short form
    return len;
  }

  // Long form
  var num = len & 0x7f;
  if (num >= 4)
    return buf.error('length octect is too long');

  len = 0;
  for (var i = 0; i < num; i++) {
    len <<= 8;
    var j = buf.readUInt8(fail);
    if (buf.isError(j))
      return j;
    len |= j;
  }

  return len;
}


/***/ }),

/***/ "./node_modules/pem-jwk/node_modules/asn1.js/lib/asn1/decoders/index.js":
/*!******************************************************************************!*\
  !*** ./node_modules/pem-jwk/node_modules/asn1.js/lib/asn1/decoders/index.js ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var decoders = exports;

decoders.der = __webpack_require__(/*! ./der */ "./node_modules/pem-jwk/node_modules/asn1.js/lib/asn1/decoders/der.js");


/***/ }),

/***/ "./node_modules/pem-jwk/node_modules/asn1.js/lib/asn1/encoders/der.js":
/*!****************************************************************************!*\
  !*** ./node_modules/pem-jwk/node_modules/asn1.js/lib/asn1/encoders/der.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var inherits = __webpack_require__(/*! inherits */ "./node_modules/inherits/inherits.js");
var Buffer = __webpack_require__(/*! buffer */ "buffer").Buffer;

var asn1 = __webpack_require__(/*! ../../asn1 */ "./node_modules/pem-jwk/node_modules/asn1.js/lib/asn1.js");
var base = asn1.base;
var bignum = asn1.bignum;

// Import DER constants
var der = asn1.constants.der;

function DEREncoder(entity) {
  this.enc = 'der';
  this.name = entity.name;
  this.entity = entity;

  // Construct base tree
  this.tree = new DERNode();
  this.tree._init(entity.body);
};
module.exports = DEREncoder;

DEREncoder.prototype.encode = function encode(data, reporter) {
  return this.tree._encode(data, reporter).join();
};

// Tree methods

function DERNode(parent) {
  base.Node.call(this, 'der', parent);
}
inherits(DERNode, base.Node);

DERNode.prototype._encodeComposite = function encodeComposite(tag,
                                                              primitive,
                                                              cls,
                                                              content) {
  var encodedTag = encodeTag(tag, primitive, cls, this.reporter);

  // Short form
  if (content.length < 0x80) {
    var header = new Buffer(2);
    header[0] = encodedTag;
    header[1] = content.length;
    return this._createEncoderBuffer([ header, content ]);
  }

  // Long form
  // Count octets required to store length
  var lenOctets = 1;
  for (var i = content.length; i >= 0x100; i >>= 8)
    lenOctets++;

  var header = new Buffer(1 + 1 + lenOctets);
  header[0] = encodedTag;
  header[1] = 0x80 | lenOctets;

  for (var i = 1 + lenOctets, j = content.length; j > 0; i--, j >>= 8)
    header[i] = j & 0xff;

  return this._createEncoderBuffer([ header, content ]);
};

DERNode.prototype._encodeStr = function encodeStr(str, tag) {
  if (tag === 'octstr')
    return this._createEncoderBuffer(str);
  else if (tag === 'bitstr')
    return this._createEncoderBuffer([ str.unused | 0, str.data ]);
  else if (tag === 'ia5str')
    return this._createEncoderBuffer(str);
  return this.reporter.error('Encoding of string type: ' + tag +
                             ' unsupported');
};

DERNode.prototype._encodeObjid = function encodeObjid(id, values, relative) {
  if (typeof id === 'string') {
    if (!values)
      return this.reporter.error('string objid given, but no values map found');
    if (!values.hasOwnProperty(id))
      return this.reporter.error('objid not found in values map');
    id = values[id].split(/\s+/g);
    for (var i = 0; i < id.length; i++)
      id[i] |= 0;
  } else if (Array.isArray(id)) {
    id = id.slice();
  }

  if (!Array.isArray(id)) {
    return this.reporter.error('objid() should be either array or string, ' +
                               'got: ' + JSON.stringify(id));
  }

  if (!relative) {
    if (id[1] >= 40)
      return this.reporter.error('Second objid identifier OOB');
    id.splice(0, 2, id[0] * 40 + id[1]);
  }

  // Count number of octets
  var size = 0;
  for (var i = 0; i < id.length; i++) {
    var ident = id[i];
    for (size++; ident >= 0x80; ident >>= 7)
      size++;
  }

  var objid = new Buffer(size);
  var offset = objid.length - 1;
  for (var i = id.length - 1; i >= 0; i--) {
    var ident = id[i];
    objid[offset--] = ident & 0x7f;
    while ((ident >>= 7) > 0)
      objid[offset--] = 0x80 | (ident & 0x7f);
  }

  return this._createEncoderBuffer(objid);
};

function two(num) {
  if (num <= 10)
    return '0' + num;
  else
    return num;
}

DERNode.prototype._encodeTime = function encodeTime(time, tag) {
  var str;
  var date = new Date(time);

  if (tag === 'gentime') {
    str = [
      date.getFullYear(),
      two(date.getUTCMonth() + 1),
      two(date.getUTCDate()),
      two(date.getUTCHours()),
      two(date.getUTCMinutes()),
      two(date.getUTCSeconds()),
      'Z'
    ].join('');
  } else if (tag === 'utctime') {
    str = [
      date.getFullYear() % 100,
      two(date.getUTCMonth() + 1),
      two(date.getUTCDate()),
      two(date.getUTCHours()),
      two(date.getUTCMinutes()),
      two(date.getUTCSeconds()),
      'Z'
    ].join('');
  } else {
    this.reporter.error('Encoding ' + tag + ' time is not supported yet');
  }

  return this._encodeStr(str, 'octstr');
};

DERNode.prototype._encodeNull = function encodeNull() {
  return this._createEncoderBuffer('');
};

DERNode.prototype._encodeInt = function encodeInt(num, values) {
  if (typeof num === 'string') {
    if (!values)
      return this.reporter.error('String int or enum given, but no values map');
    if (!values.hasOwnProperty(num)) {
      return this.reporter.error('Values map doesn\'t contain: ' +
                                 JSON.stringify(num));
    }
    num = values[num];
  }

  // Bignum, assume big endian
  if (bignum !== null && num instanceof bignum) {
    var numArray = num.toArray();
    if(num.sign === false && numArray[0] & 0x80) {
      numArray.unshift(0);
    }
    num = new Buffer(numArray);
  }

  if (Buffer.isBuffer(num)) {
    var size = num.length;
    if (num.length === 0)
      size++;

    var out = new Buffer(size);
    num.copy(out);
    if (num.length === 0)
      out[0] = 0
    return this._createEncoderBuffer(out);
  }

  if (num < 0x80)
    return this._createEncoderBuffer(num);

  if (num < 0x100)
    return this._createEncoderBuffer([0, num]);

  var size = 1;
  for (var i = num; i >= 0x100; i >>= 8)
    size++;

  var out = new Array(size);
  for (var i = out.length - 1; i >= 0; i--) {
    out[i] = num & 0xff;
    num >>= 8;
  }
  if(out[0] & 0x80) {
    out.unshift(0);
  }

  return this._createEncoderBuffer(new Buffer(out));
};

DERNode.prototype._encodeBool = function encodeBool(value) {
  return this._createEncoderBuffer(value ? 0xff : 0);
};

DERNode.prototype._use = function use(entity, obj) {
  if (typeof entity === 'function')
    entity = entity(obj);
  return entity._getEncoder('der').tree;
};

DERNode.prototype._skipDefault = function skipDefault(dataBuffer, reporter, parent) {
  var state = this._baseState;
  var i;
  if (state['default'] === null)
    return false;

  var data = dataBuffer.join();
  if (state.defaultBuffer === undefined)
    state.defaultBuffer = this._encodeValue(state['default'], reporter, parent).join();

  if (data.length !== state.defaultBuffer.length)
    return false;

  for (i=0; i < data.length; i++)
    if (data[i] !== state.defaultBuffer[i])
      return false;

  return true;
};

// Utility methods

function encodeTag(tag, primitive, cls, reporter) {
  var res;

  if (tag === 'seqof')
    tag = 'seq';
  else if (tag === 'setof')
    tag = 'set';

  if (der.tagByName.hasOwnProperty(tag))
    res = der.tagByName[tag];
  else if (typeof tag === 'number' && (tag | 0) === tag)
    res = tag;
  else
    return reporter.error('Unknown tag: ' + tag);

  if (res >= 0x1f)
    return reporter.error('Multi-octet tag encoding unsupported');

  if (!primitive)
    res |= 0x20;

  res |= (der.tagClassByName[cls || 'universal'] << 6);

  return res;
}


/***/ }),

/***/ "./node_modules/pem-jwk/node_modules/asn1.js/lib/asn1/encoders/index.js":
/*!******************************************************************************!*\
  !*** ./node_modules/pem-jwk/node_modules/asn1.js/lib/asn1/encoders/index.js ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var encoders = exports;

encoders.der = __webpack_require__(/*! ./der */ "./node_modules/pem-jwk/node_modules/asn1.js/lib/asn1/encoders/der.js");


/***/ }),

/***/ "./node_modules/pem-jwk/node_modules/bn.js/lib/bn.js":
/*!***********************************************************!*\
  !*** ./node_modules/pem-jwk/node_modules/bn.js/lib/bn.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {(function(module, exports) {

'use strict';

// Utils

function assert(val, msg) {
  if (!val)
    throw new Error(msg || 'Assertion failed');
}

// Could use `inherits` module, but don't want to move from single file
// architecture yet.
function inherits(ctor, superCtor) {
  ctor.super_ = superCtor;
  var TempCtor = function () {};
  TempCtor.prototype = superCtor.prototype;
  ctor.prototype = new TempCtor();
  ctor.prototype.constructor = ctor;
}

// BN

function BN(number, base, endian) {
  // May be `new BN(bn)` ?
  if (number !== null &&
      typeof number === 'object' &&
      Array.isArray(number.words)) {
    return number;
  }

  this.sign = false;
  this.words = null;
  this.length = 0;

  // Reduction context
  this.red = null;

  if (base === 'le' || base === 'be') {
    endian = base;
    base = 10;
  }

  if (number !== null)
    this._init(number || 0, base || 10, endian || 'be');
}
if (typeof module === 'object')
  module.exports = BN;
else
  exports.BN = BN;

BN.BN = BN;
BN.wordSize = 26;

BN.prototype._init = function init(number, base, endian) {
  if (typeof number === 'number') {
    if (number < 0) {
      this.sign = true;
      number = -number;
    }
    if (number < 0x4000000) {
      this.words = [ number & 0x3ffffff ];
      this.length = 1;
    } else {
      this.words = [
        number & 0x3ffffff,
        (number / 0x4000000) & 0x3ffffff
      ];
      this.length = 2;
    }
    return;
  } else if (typeof number === 'object') {
    return this._initArray(number, base, endian);
  }
  if (base === 'hex')
    base = 16;
  assert(base === (base | 0) && base >= 2 && base <= 36);

  number = number.toString().replace(/\s+/g, '');
  var start = 0;
  if (number[0] === '-')
    start++;

  if (base === 16)
    this._parseHex(number, start);
  else
    this._parseBase(number, base, start);

  if (number[0] === '-')
    this.sign = true;

  this.strip();
};

BN.prototype._initArray = function _initArray(number, base, endian) {
  // Perhaps a Uint8Array
  assert(typeof number.length === 'number');
  this.length = Math.ceil(number.length / 3);
  this.words = new Array(this.length);
  for (var i = 0; i < this.length; i++)
    this.words[i] = 0;

  var off = 0;
  if (endian === 'be') {
    for (var i = number.length - 1, j = 0; i >= 0; i -= 3) {
      var w = number[i] | (number[i - 1] << 8) | (number[i - 2] << 16);
      this.words[j] |= (w << off) & 0x3ffffff;
      this.words[j + 1] = (w >>> (26 - off)) & 0x3ffffff;
      off += 24;
      if (off >= 26) {
        off -= 26;
        j++;
      }
    }
  } else if (endian === 'le') {
    for (var i = 0, j = 0; i < number.length; i += 3) {
      var w = number[i] | (number[i + 1] << 8) | (number[i + 2] << 16);
      this.words[j] |= (w << off) & 0x3ffffff;
      this.words[j + 1] = (w >>> (26 - off)) & 0x3ffffff;
      off += 24;
      if (off >= 26) {
        off -= 26;
        j++;
      }
    }
  }
  return this.strip();
};

function parseHex(str, start, end) {
  var r = 0;
  var len = Math.min(str.length, end);
  for (var i = start; i < len; i++) {
    var c = str.charCodeAt(i) - 48;

    r <<= 4;

    // 'a' - 'f'
    if (c >= 49 && c <= 54)
      r |= c - 49 + 0xa;

    // 'A' - 'F'
    else if (c >= 17 && c <= 22)
      r |= c - 17 + 0xa;

    // '0' - '9'
    else
      r |= c & 0xf;
  }
  return r;
}

BN.prototype._parseHex = function _parseHex(number, start) {
  // Create possibly bigger array to ensure that it fits the number
  this.length = Math.ceil((number.length - start) / 6);
  this.words = new Array(this.length);
  for (var i = 0; i < this.length; i++)
    this.words[i] = 0;

  // Scan 24-bit chunks and add them to the number
  var off = 0;
  for (var i = number.length - 6, j = 0; i >= start; i -= 6) {
    var w = parseHex(number, i, i + 6);
    this.words[j] |= (w << off) & 0x3ffffff;
    this.words[j + 1] |= w >>> (26 - off) & 0x3fffff;
    off += 24;
    if (off >= 26) {
      off -= 26;
      j++;
    }
  }
  if (i + 6 !== start) {
    var w = parseHex(number, start, i + 6);
    this.words[j] |= (w << off) & 0x3ffffff;
    this.words[j + 1] |= w >>> (26 - off) & 0x3fffff;
  }
  this.strip();
};

function parseBase(str, start, end, mul) {
  var r = 0;
  var len = Math.min(str.length, end);
  for (var i = start; i < len; i++) {
    var c = str.charCodeAt(i) - 48;

    r *= mul;

    // 'a'
    if (c >= 49)
      r += c - 49 + 0xa;

    // 'A'
    else if (c >= 17)
      r += c - 17 + 0xa;

    // '0' - '9'
    else
      r += c;
  }
  return r;
}

BN.prototype._parseBase = function _parseBase(number, base, start) {
  // Initialize as zero
  this.words = [ 0 ];
  this.length = 1;

  // Find length of limb in base
  for (var limbLen = 0, limbPow = 1; limbPow <= 0x3ffffff; limbPow *= base)
    limbLen++;
  limbLen--;
  limbPow = (limbPow / base) | 0;

  var total = number.length - start;
  var mod = total % limbLen;
  var end = Math.min(total, total - mod) + start;

  var word = 0;
  for (var i = start; i < end; i += limbLen) {
    word = parseBase(number, i, i + limbLen, base);

    this.imuln(limbPow);
    if (this.words[0] + word < 0x4000000)
      this.words[0] += word;
    else
      this._iaddn(word);
  }

  if (mod !== 0) {
    var pow = 1;
    var word = parseBase(number, i, number.length, base);

    for (var i = 0; i < mod; i++)
      pow *= base;
    this.imuln(pow);
    if (this.words[0] + word < 0x4000000)
      this.words[0] += word;
    else
      this._iaddn(word);
  }
};

BN.prototype.copy = function copy(dest) {
  dest.words = new Array(this.length);
  for (var i = 0; i < this.length; i++)
    dest.words[i] = this.words[i];
  dest.length = this.length;
  dest.sign = this.sign;
  dest.red = this.red;
};

BN.prototype.clone = function clone() {
  var r = new BN(null);
  this.copy(r);
  return r;
};

// Remove leading `0` from `this`
BN.prototype.strip = function strip() {
  while (this.length > 1 && this.words[this.length - 1] === 0)
    this.length--;
  return this._normSign();
};

BN.prototype._normSign = function _normSign() {
  // -0 = 0
  if (this.length === 1 && this.words[0] === 0)
    this.sign = false;
  return this;
};

BN.prototype.inspect = function inspect() {
  return (this.red ? '<BN-R: ' : '<BN: ') + this.toString(16) + '>';
};

/*

var zeros = [];
var groupSizes = [];
var groupBases = [];

var s = '';
var i = -1;
while (++i < BN.wordSize) {
  zeros[i] = s;
  s += '0';
}
groupSizes[0] = 0;
groupSizes[1] = 0;
groupBases[0] = 0;
groupBases[1] = 0;
var base = 2 - 1;
while (++base < 36 + 1) {
  var groupSize = 0;
  var groupBase = 1;
  while (groupBase < (1 << BN.wordSize) / base) {
    groupBase *= base;
    groupSize += 1;
  }
  groupSizes[base] = groupSize;
  groupBases[base] = groupBase;
}

*/

var zeros = [
  '',
  '0',
  '00',
  '000',
  '0000',
  '00000',
  '000000',
  '0000000',
  '00000000',
  '000000000',
  '0000000000',
  '00000000000',
  '000000000000',
  '0000000000000',
  '00000000000000',
  '000000000000000',
  '0000000000000000',
  '00000000000000000',
  '000000000000000000',
  '0000000000000000000',
  '00000000000000000000',
  '000000000000000000000',
  '0000000000000000000000',
  '00000000000000000000000',
  '000000000000000000000000',
  '0000000000000000000000000'
];

var groupSizes = [
  0, 0,
  25, 16, 12, 11, 10, 9, 8,
  8, 7, 7, 7, 7, 6, 6,
  6, 6, 6, 6, 6, 5, 5,
  5, 5, 5, 5, 5, 5, 5,
  5, 5, 5, 5, 5, 5, 5
];

var groupBases = [
  0, 0,
  33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216,
  43046721, 10000000, 19487171, 35831808, 62748517, 7529536, 11390625,
  16777216, 24137569, 34012224, 47045881, 64000000, 4084101, 5153632,
  6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149,
  24300000, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176
];

BN.prototype.toString = function toString(base, padding) {
  base = base || 10;
  if (base === 16 || base === 'hex') {
    var out = '';
    var off = 0;
    var padding = padding | 0 || 1;
    var carry = 0;
    for (var i = 0; i < this.length; i++) {
      var w = this.words[i];
      var word = (((w << off) | carry) & 0xffffff).toString(16);
      carry = (w >>> (24 - off)) & 0xffffff;
      if (carry !== 0 || i !== this.length - 1)
        out = zeros[6 - word.length] + word + out;
      else
        out = word + out;
      off += 2;
      if (off >= 26) {
        off -= 26;
        i--;
      }
    }
    if (carry !== 0)
      out = carry.toString(16) + out;
    while (out.length % padding !== 0)
      out = '0' + out;
    if (this.sign)
      out = '-' + out;
    return out;
  } else if (base === (base | 0) && base >= 2 && base <= 36) {
    // var groupSize = Math.floor(BN.wordSize * Math.LN2 / Math.log(base));
    var groupSize = groupSizes[base];
    // var groupBase = Math.pow(base, groupSize);
    var groupBase = groupBases[base];
    var out = '';
    var c = this.clone();
    c.sign = false;
    while (c.cmpn(0) !== 0) {
      var r = c.modn(groupBase).toString(base);
      c = c.idivn(groupBase);

      if (c.cmpn(0) !== 0)
        out = zeros[groupSize - r.length] + r + out;
      else
        out = r + out;
    }
    if (this.cmpn(0) === 0)
      out = '0' + out;
    if (this.sign)
      out = '-' + out;
    return out;
  } else {
    assert(false, 'Base should be between 2 and 36');
  }
};

BN.prototype.toJSON = function toJSON() {
  return this.toString(16);
};

BN.prototype.toArray = function toArray() {
  this.strip();
  var res = new Array(this.byteLength());
  res[0] = 0;

  var q = this.clone();
  for (var i = 0; q.cmpn(0) !== 0; i++) {
    var b = q.andln(0xff);
    q.ishrn(8);

    // Assume big-endian
    res[res.length - i - 1] = b;
  }

  return res;
};

/*
function genCountBits(bits) {
  var arr = [];

  for (var i = bits - 1; i >= 0; i--) {
    var bit = '0x' + (1 << i).toString(16);
    arr.push('w >= ' + bit + ' ? ' + (i + 1));
  }

  return new Function('w', 'return ' + arr.join(' :\n') + ' :\n0;');
};

BN.prototype._countBits = genCountBits(26);
*/

// Sadly chrome apps could not contain `new Function()` calls
BN.prototype._countBits = function _countBits(w) {
  return w >= 0x2000000 ? 26 :
         w >= 0x1000000 ? 25 :
         w >= 0x800000 ? 24 :
         w >= 0x400000 ? 23 :
         w >= 0x200000 ? 22 :
         w >= 0x100000 ? 21 :
         w >= 0x80000 ? 20 :
         w >= 0x40000 ? 19 :
         w >= 0x20000 ? 18 :
         w >= 0x10000 ? 17 :
         w >= 0x8000 ? 16 :
         w >= 0x4000 ? 15 :
         w >= 0x2000 ? 14 :
         w >= 0x1000 ? 13 :
         w >= 0x800 ? 12 :
         w >= 0x400 ? 11 :
         w >= 0x200 ? 10 :
         w >= 0x100 ? 9 :
         w >= 0x80 ? 8 :
         w >= 0x40 ? 7 :
         w >= 0x20 ? 6 :
         w >= 0x10 ? 5 :
         w >= 0x8 ? 4 :
         w >= 0x4 ? 3 :
         w >= 0x2 ? 2 :
         w >= 0x1 ? 1 :
         0;
};

// Return number of used bits in a BN
BN.prototype.bitLength = function bitLength() {
  var hi = 0;
  var w = this.words[this.length - 1];
  var hi = this._countBits(w);
  return (this.length - 1) * 26 + hi;
};

BN.prototype.byteLength = function byteLength() {
  return Math.ceil(this.bitLength() / 8);
};

// Return negative clone of `this`
BN.prototype.neg = function neg() {
  if (this.cmpn(0) === 0)
    return this.clone();

  var r = this.clone();
  r.sign = !this.sign;
  return r;
};


// Or `num` with `this` in-place
BN.prototype.ior = function ior(num) {
  this.sign = this.sign || num.sign;

  while (this.length < num.length)
    this.words[this.length++] = 0;

  for (var i = 0; i < num.length; i++)
    this.words[i] = this.words[i] | num.words[i];

  return this.strip();
};


// Or `num` with `this`
BN.prototype.or = function or(num) {
  if (this.length > num.length)
    return this.clone().ior(num);
  else
    return num.clone().ior(this);
};


// And `num` with `this` in-place
BN.prototype.iand = function iand(num) {
  this.sign = this.sign && num.sign;

  // b = min-length(num, this)
  var b;
  if (this.length > num.length)
    b = num;
  else
    b = this;

  for (var i = 0; i < b.length; i++)
    this.words[i] = this.words[i] & num.words[i];

  this.length = b.length;

  return this.strip();
};


// And `num` with `this`
BN.prototype.and = function and(num) {
  if (this.length > num.length)
    return this.clone().iand(num);
  else
    return num.clone().iand(this);
};


// Xor `num` with `this` in-place
BN.prototype.ixor = function ixor(num) {
  this.sign = this.sign || num.sign;

  // a.length > b.length
  var a;
  var b;
  if (this.length > num.length) {
    a = this;
    b = num;
  } else {
    a = num;
    b = this;
  }

  for (var i = 0; i < b.length; i++)
    this.words[i] = a.words[i] ^ b.words[i];

  if (this !== a)
    for (; i < a.length; i++)
      this.words[i] = a.words[i];

  this.length = a.length;

  return this.strip();
};


// Xor `num` with `this`
BN.prototype.xor = function xor(num) {
  if (this.length > num.length)
    return this.clone().ixor(num);
  else
    return num.clone().ixor(this);
};


// Set `bit` of `this`
BN.prototype.setn = function setn(bit, val) {
  assert(typeof bit === 'number' && bit >= 0);

  var off = (bit / 26) | 0;
  var wbit = bit % 26;

  while (this.length <= off)
    this.words[this.length++] = 0;

  if (val)
    this.words[off] = this.words[off] | (1 << wbit);
  else
    this.words[off] = this.words[off] & ~(1 << wbit);

  return this.strip();
};


// Add `num` to `this` in-place
BN.prototype.iadd = function iadd(num) {
  // negative + positive
  if (this.sign && !num.sign) {
    this.sign = false;
    var r = this.isub(num);
    this.sign = !this.sign;
    return this._normSign();

  // positive + negative
  } else if (!this.sign && num.sign) {
    num.sign = false;
    var r = this.isub(num);
    num.sign = true;
    return r._normSign();
  }

  // a.length > b.length
  var a;
  var b;
  if (this.length > num.length) {
    a = this;
    b = num;
  } else {
    a = num;
    b = this;
  }

  var carry = 0;
  for (var i = 0; i < b.length; i++) {
    var r = a.words[i] + b.words[i] + carry;
    this.words[i] = r & 0x3ffffff;
    carry = r >>> 26;
  }
  for (; carry !== 0 && i < a.length; i++) {
    var r = a.words[i] + carry;
    this.words[i] = r & 0x3ffffff;
    carry = r >>> 26;
  }

  this.length = a.length;
  if (carry !== 0) {
    this.words[this.length] = carry;
    this.length++;
  // Copy the rest of the words
  } else if (a !== this) {
    for (; i < a.length; i++)
      this.words[i] = a.words[i];
  }

  return this;
};

// Add `num` to `this`
BN.prototype.add = function add(num) {
  if (num.sign && !this.sign) {
    num.sign = false;
    var res = this.sub(num);
    num.sign = true;
    return res;
  } else if (!num.sign && this.sign) {
    this.sign = false;
    var res = num.sub(this);
    this.sign = true;
    return res;
  }

  if (this.length > num.length)
    return this.clone().iadd(num);
  else
    return num.clone().iadd(this);
};

// Subtract `num` from `this` in-place
BN.prototype.isub = function isub(num) {
  // this - (-num) = this + num
  if (num.sign) {
    num.sign = false;
    var r = this.iadd(num);
    num.sign = true;
    return r._normSign();

  // -this - num = -(this + num)
  } else if (this.sign) {
    this.sign = false;
    this.iadd(num);
    this.sign = true;
    return this._normSign();
  }

  // At this point both numbers are positive
  var cmp = this.cmp(num);

  // Optimization - zeroify
  if (cmp === 0) {
    this.sign = false;
    this.length = 1;
    this.words[0] = 0;
    return this;
  }

  // a > b
  var a;
  var b;
  if (cmp > 0) {
    a = this;
    b = num;
  } else {
    a = num;
    b = this;
  }

  var carry = 0;
  for (var i = 0; i < b.length; i++) {
    var r = a.words[i] - b.words[i] + carry;
    carry = r >> 26;
    this.words[i] = r & 0x3ffffff;
  }
  for (; carry !== 0 && i < a.length; i++) {
    var r = a.words[i] + carry;
    carry = r >> 26;
    this.words[i] = r & 0x3ffffff;
  }

  // Copy rest of the words
  if (carry === 0 && i < a.length && a !== this)
    for (; i < a.length; i++)
      this.words[i] = a.words[i];
  this.length = Math.max(this.length, i);

  if (a !== this)
    this.sign = true;

  return this.strip();
};

// Subtract `num` from `this`
BN.prototype.sub = function sub(num) {
  return this.clone().isub(num);
};

/*
// NOTE: This could be potentionally used to generate loop-less multiplications
function _genCombMulTo(alen, blen) {
  var len = alen + blen - 1;
  var src = [
    'var a = this.words, b = num.words, o = out.words, c = 0, w, ' +
        'mask = 0x3ffffff, shift = 0x4000000;',
    'out.length = ' + len + ';'
  ];
  for (var k = 0; k < len; k++) {
    var minJ = Math.max(0, k - alen + 1);
    var maxJ = Math.min(k, blen - 1);

    for (var j = minJ; j <= maxJ; j++) {
      var i = k - j;
      var mul = 'a[' + i + '] * b[' + j + ']';

      if (j === minJ) {
        src.push('w = ' + mul + ' + c;');
        src.push('c = (w / shift) | 0;');
      } else {
        src.push('w += ' + mul + ';');
        src.push('c += (w / shift) | 0;');
      }
      src.push('w &= mask;');
    }
    src.push('o[' + k + '] = w;');
  }
  src.push('if (c !== 0) {',
           '  o[' + k + '] = c;',
           '  out.length++;',
           '}',
           'return out;');

  return src.join('\n');
}
*/

BN.prototype._smallMulTo = function _smallMulTo(num, out) {
  out.sign = num.sign !== this.sign;
  out.length = this.length + num.length;

  var carry = 0;
  for (var k = 0; k < out.length - 1; k++) {
    // Sum all words with the same `i + j = k` and accumulate `ncarry`,
    // note that ncarry could be >= 0x3ffffff
    var ncarry = carry >>> 26;
    var rword = carry & 0x3ffffff;
    var maxJ = Math.min(k, num.length - 1);
    for (var j = Math.max(0, k - this.length + 1); j <= maxJ; j++) {
      var i = k - j;
      var a = this.words[i] | 0;
      var b = num.words[j] | 0;
      var r = a * b;

      var lo = r & 0x3ffffff;
      ncarry = (ncarry + ((r / 0x4000000) | 0)) | 0;
      lo = (lo + rword) | 0;
      rword = lo & 0x3ffffff;
      ncarry = (ncarry + (lo >>> 26)) | 0;
    }
    out.words[k] = rword;
    carry = ncarry;
  }
  if (carry !== 0) {
    out.words[k] = carry;
  } else {
    out.length--;
  }

  return out.strip();
};

BN.prototype._bigMulTo = function _bigMulTo(num, out) {
  out.sign = num.sign !== this.sign;
  out.length = this.length + num.length;

  var carry = 0;
  var hncarry = 0;
  for (var k = 0; k < out.length - 1; k++) {
    // Sum all words with the same `i + j = k` and accumulate `ncarry`,
    // note that ncarry could be >= 0x3ffffff
    var ncarry = hncarry;
    hncarry = 0;
    var rword = carry & 0x3ffffff;
    var maxJ = Math.min(k, num.length - 1);
    for (var j = Math.max(0, k - this.length + 1); j <= maxJ; j++) {
      var i = k - j;
      var a = this.words[i] | 0;
      var b = num.words[j] | 0;
      var r = a * b;

      var lo = r & 0x3ffffff;
      ncarry = (ncarry + ((r / 0x4000000) | 0)) | 0;
      lo = (lo + rword) | 0;
      rword = lo & 0x3ffffff;
      ncarry = (ncarry + (lo >>> 26)) | 0;

      hncarry += ncarry >>> 26;
      ncarry &= 0x3ffffff;
    }
    out.words[k] = rword;
    carry = ncarry;
    ncarry = hncarry;
  }
  if (carry !== 0) {
    out.words[k] = carry;
  } else {
    out.length--;
  }

  return out.strip();
};

BN.prototype.mulTo = function mulTo(num, out) {
  var res;
  if (this.length + num.length < 63)
    res = this._smallMulTo(num, out);
  else
    res = this._bigMulTo(num, out);
  return res;
};

// Multiply `this` by `num`
BN.prototype.mul = function mul(num) {
  var out = new BN(null);
  out.words = new Array(this.length + num.length);
  return this.mulTo(num, out);
};

// In-place Multiplication
BN.prototype.imul = function imul(num) {
  if (this.cmpn(0) === 0 || num.cmpn(0) === 0) {
    this.words[0] = 0;
    this.length = 1;
    return this;
  }

  var tlen = this.length;
  var nlen = num.length;

  this.sign = num.sign !== this.sign;
  this.length = this.length + num.length;
  this.words[this.length - 1] = 0;

  for (var k = this.length - 2; k >= 0; k--) {
    // Sum all words with the same `i + j = k` and accumulate `carry`,
    // note that carry could be >= 0x3ffffff
    var carry = 0;
    var rword = 0;
    var maxJ = Math.min(k, nlen - 1);
    for (var j = Math.max(0, k - tlen + 1); j <= maxJ; j++) {
      var i = k - j;
      var a = this.words[i];
      var b = num.words[j];
      var r = a * b;

      var lo = r & 0x3ffffff;
      carry += (r / 0x4000000) | 0;
      lo += rword;
      rword = lo & 0x3ffffff;
      carry += lo >>> 26;
    }
    this.words[k] = rword;
    this.words[k + 1] += carry;
    carry = 0;
  }

  // Propagate overflows
  var carry = 0;
  for (var i = 1; i < this.length; i++) {
    var w = this.words[i] + carry;
    this.words[i] = w & 0x3ffffff;
    carry = w >>> 26;
  }

  return this.strip();
};

BN.prototype.imuln = function imuln(num) {
  assert(typeof num === 'number');

  // Carry
  var carry = 0;
  for (var i = 0; i < this.length; i++) {
    var w = this.words[i] * num;
    var lo = (w & 0x3ffffff) + (carry & 0x3ffffff);
    carry >>= 26;
    carry += (w / 0x4000000) | 0;
    // NOTE: lo is 27bit maximum
    carry += lo >>> 26;
    this.words[i] = lo & 0x3ffffff;
  }

  if (carry !== 0) {
    this.words[i] = carry;
    this.length++;
  }

  return this;
};

// `this` * `this`
BN.prototype.sqr = function sqr() {
  return this.mul(this);
};

// `this` * `this` in-place
BN.prototype.isqr = function isqr() {
  return this.mul(this);
};

// Shift-left in-place
BN.prototype.ishln = function ishln(bits) {
  assert(typeof bits === 'number' && bits >= 0);
  var r = bits % 26;
  var s = (bits - r) / 26;
  var carryMask = (0x3ffffff >>> (26 - r)) << (26 - r);

  if (r !== 0) {
    var carry = 0;
    for (var i = 0; i < this.length; i++) {
      var newCarry = this.words[i] & carryMask;
      var c = (this.words[i] - newCarry) << r;
      this.words[i] = c | carry;
      carry = newCarry >>> (26 - r);
    }
    if (carry) {
      this.words[i] = carry;
      this.length++;
    }
  }

  if (s !== 0) {
    for (var i = this.length - 1; i >= 0; i--)
      this.words[i + s] = this.words[i];
    for (var i = 0; i < s; i++)
      this.words[i] = 0;
    this.length += s;
  }

  return this.strip();
};

// Shift-right in-place
// NOTE: `hint` is a lowest bit before trailing zeroes
// NOTE: if `extended` is true - { lo: ..., hi: } object will be returned
BN.prototype.ishrn = function ishrn(bits, hint, extended) {
  assert(typeof bits === 'number' && bits >= 0);
  if (hint)
    hint = (hint - (hint % 26)) / 26;
  else
    hint = 0;

  var r = bits % 26;
  var s = Math.min((bits - r) / 26, this.length);
  var mask = 0x3ffffff ^ ((0x3ffffff >>> r) << r);
  var maskedWords = extended;

  hint -= s;
  hint = Math.max(0, hint);

  // Extended mode, copy masked part
  if (maskedWords) {
    for (var i = 0; i < s; i++)
      maskedWords.words[i] = this.words[i];
    maskedWords.length = s;
  }

  if (s === 0) {
    // No-op, we should not move anything at all
  } else if (this.length > s) {
    this.length -= s;
    for (var i = 0; i < this.length; i++)
      this.words[i] = this.words[i + s];
  } else {
    this.words[0] = 0;
    this.length = 1;
  }

  var carry = 0;
  for (var i = this.length - 1; i >= 0 && (carry !== 0 || i >= hint); i--) {
    var word = this.words[i];
    this.words[i] = (carry << (26 - r)) | (word >>> r);
    carry = word & mask;
  }

  // Push carried bits as a mask
  if (maskedWords && carry !== 0)
    maskedWords.words[maskedWords.length++] = carry;

  if (this.length === 0) {
    this.words[0] = 0;
    this.length = 1;
  }

  this.strip();
  if (extended)
    return { hi: this, lo: maskedWords };

  return this;
};

// Shift-left
BN.prototype.shln = function shln(bits) {
  return this.clone().ishln(bits);
};

// Shift-right
BN.prototype.shrn = function shrn(bits) {
  return this.clone().ishrn(bits);
};

// Test if n bit is set
BN.prototype.testn = function testn(bit) {
  assert(typeof bit === 'number' && bit >= 0);
  var r = bit % 26;
  var s = (bit - r) / 26;
  var q = 1 << r;

  // Fast case: bit is much higher than all existing words
  if (this.length <= s) {
    return false;
  }

  // Check bit and return
  var w = this.words[s];

  return !!(w & q);
};

// Return only lowers bits of number (in-place)
BN.prototype.imaskn = function imaskn(bits) {
  assert(typeof bits === 'number' && bits >= 0);
  var r = bits % 26;
  var s = (bits - r) / 26;

  assert(!this.sign, 'imaskn works only with positive numbers');

  if (r !== 0)
    s++;
  this.length = Math.min(s, this.length);

  if (r !== 0) {
    var mask = 0x3ffffff ^ ((0x3ffffff >>> r) << r);
    this.words[this.length - 1] &= mask;
  }

  return this.strip();
};

// Return only lowers bits of number
BN.prototype.maskn = function maskn(bits) {
  return this.clone().imaskn(bits);
};

// Add plain number `num` to `this`
BN.prototype.iaddn = function iaddn(num) {
  assert(typeof num === 'number');
  if (num < 0)
    return this.isubn(-num);

  // Possible sign change
  if (this.sign) {
    if (this.length === 1 && this.words[0] < num) {
      this.words[0] = num - this.words[0];
      this.sign = false;
      return this;
    }

    this.sign = false;
    this.isubn(num);
    this.sign = true;
    return this;
  }

  // Add without checks
  return this._iaddn(num);
};

BN.prototype._iaddn = function _iaddn(num) {
  this.words[0] += num;

  // Carry
  for (var i = 0; i < this.length && this.words[i] >= 0x4000000; i++) {
    this.words[i] -= 0x4000000;
    if (i === this.length - 1)
      this.words[i + 1] = 1;
    else
      this.words[i + 1]++;
  }
  this.length = Math.max(this.length, i + 1);

  return this;
};

// Subtract plain number `num` from `this`
BN.prototype.isubn = function isubn(num) {
  assert(typeof num === 'number');
  if (num < 0)
    return this.iaddn(-num);

  if (this.sign) {
    this.sign = false;
    this.iaddn(num);
    this.sign = true;
    return this;
  }

  this.words[0] -= num;

  // Carry
  for (var i = 0; i < this.length && this.words[i] < 0; i++) {
    this.words[i] += 0x4000000;
    this.words[i + 1] -= 1;
  }

  return this.strip();
};

BN.prototype.addn = function addn(num) {
  return this.clone().iaddn(num);
};

BN.prototype.subn = function subn(num) {
  return this.clone().isubn(num);
};

BN.prototype.iabs = function iabs() {
  this.sign = false;

  return this;
};

BN.prototype.abs = function abs() {
  return this.clone().iabs();
};

BN.prototype._ishlnsubmul = function _ishlnsubmul(num, mul, shift) {
  // Bigger storage is needed
  var len = num.length + shift;
  var i;
  if (this.words.length < len) {
    var t = new Array(len);
    for (var i = 0; i < this.length; i++)
      t[i] = this.words[i];
    this.words = t;
  } else {
    i = this.length;
  }

  // Zeroify rest
  this.length = Math.max(this.length, len);
  for (; i < this.length; i++)
    this.words[i] = 0;

  var carry = 0;
  for (var i = 0; i < num.length; i++) {
    var w = this.words[i + shift] + carry;
    var right = num.words[i] * mul;
    w -= right & 0x3ffffff;
    carry = (w >> 26) - ((right / 0x4000000) | 0);
    this.words[i + shift] = w & 0x3ffffff;
  }
  for (; i < this.length - shift; i++) {
    var w = this.words[i + shift] + carry;
    carry = w >> 26;
    this.words[i + shift] = w & 0x3ffffff;
  }

  if (carry === 0)
    return this.strip();

  // Subtraction overflow
  assert(carry === -1);
  carry = 0;
  for (var i = 0; i < this.length; i++) {
    var w = -this.words[i] + carry;
    carry = w >> 26;
    this.words[i] = w & 0x3ffffff;
  }
  this.sign = true;

  return this.strip();
};

BN.prototype._wordDiv = function _wordDiv(num, mode) {
  var shift = this.length - num.length;

  var a = this.clone();
  var b = num;

  // Normalize
  var bhi = b.words[b.length - 1];
  for (var shift = 0; bhi < 0x2000000; shift++)
    bhi <<= 1;
  if (shift !== 0) {
    b = b.shln(shift);
    a.ishln(shift);
    bhi = b.words[b.length - 1];
  }

  // Initialize quotient
  var m = a.length - b.length;
  var q;

  if (mode !== 'mod') {
    q = new BN(null);
    q.length = m + 1;
    q.words = new Array(q.length);
    for (var i = 0; i < q.length; i++)
      q.words[i] = 0;
  }

  var diff = a.clone()._ishlnsubmul(b, 1, m);
  if (!diff.sign) {
    a = diff;
    if (q)
      q.words[m] = 1;
  }

  for (var j = m - 1; j >= 0; j--) {
    var qj = a.words[b.length + j] * 0x4000000 + a.words[b.length + j - 1];

    // NOTE: (qj / bhi) is (0x3ffffff * 0x4000000 + 0x3ffffff) / 0x2000000 max
    // (0x7ffffff)
    qj = Math.min((qj / bhi) | 0, 0x3ffffff);

    a._ishlnsubmul(b, qj, j);
    while (a.sign) {
      qj--;
      a.sign = false;
      a._ishlnsubmul(b, 1, j);
      a.sign = !a.sign;
    }
    if (q)
      q.words[j] = qj;
  }
  if (q)
    q.strip();
  a.strip();

  // Denormalize
  if (mode !== 'div' && shift !== 0)
    a.ishrn(shift);
  return { div: q ? q : null, mod: a };
};

BN.prototype.divmod = function divmod(num, mode) {
  assert(num.cmpn(0) !== 0);

  if (this.sign && !num.sign) {
    var res = this.neg().divmod(num, mode);
    var div;
    var mod;
    if (mode !== 'mod')
      div = res.div.neg();
    if (mode !== 'div')
      mod = res.mod.cmpn(0) === 0 ? res.mod : num.sub(res.mod);
    return {
      div: div,
      mod: mod
    };
  } else if (!this.sign && num.sign) {
    var res = this.divmod(num.neg(), mode);
    var div;
    if (mode !== 'mod')
      div = res.div.neg();
    return { div: div, mod: res.mod };
  } else if (this.sign && num.sign) {
    return this.neg().divmod(num.neg(), mode);
  }

  // Both numbers are positive at this point

  // Strip both numbers to approximate shift value
  if (num.length > this.length || this.cmp(num) < 0)
    return { div: new BN(0), mod: this };

  // Very short reduction
  if (num.length === 1) {
    if (mode === 'div')
      return { div: this.divn(num.words[0]), mod: null };
    else if (mode === 'mod')
      return { div: null, mod: new BN(this.modn(num.words[0])) };
    return {
      div: this.divn(num.words[0]),
      mod: new BN(this.modn(num.words[0]))
    };
  }

  return this._wordDiv(num, mode);
};

// Find `this` / `num`
BN.prototype.div = function div(num) {
  return this.divmod(num, 'div').div;
};

// Find `this` % `num`
BN.prototype.mod = function mod(num) {
  return this.divmod(num, 'mod').mod;
};

// Find Round(`this` / `num`)
BN.prototype.divRound = function divRound(num) {
  var dm = this.divmod(num);

  // Fast case - exact division
  if (dm.mod.cmpn(0) === 0)
    return dm.div;

  var mod = dm.div.sign ? dm.mod.isub(num) : dm.mod;

  var half = num.shrn(1);
  var r2 = num.andln(1);
  var cmp = mod.cmp(half);

  // Round down
  if (cmp < 0 || r2 === 1 && cmp === 0)
    return dm.div;

  // Round up
  return dm.div.sign ? dm.div.isubn(1) : dm.div.iaddn(1);
};

BN.prototype.modn = function modn(num) {
  assert(num <= 0x3ffffff);
  var p = (1 << 26) % num;

  var acc = 0;
  for (var i = this.length - 1; i >= 0; i--)
    acc = (p * acc + this.words[i]) % num;

  return acc;
};

// In-place division by number
BN.prototype.idivn = function idivn(num) {
  assert(num <= 0x3ffffff);

  var carry = 0;
  for (var i = this.length - 1; i >= 0; i--) {
    var w = this.words[i] + carry * 0x4000000;
    this.words[i] = (w / num) | 0;
    carry = w % num;
  }

  return this.strip();
};

BN.prototype.divn = function divn(num) {
  return this.clone().idivn(num);
};

BN.prototype._egcd = function _egcd(x1, p) {
  assert(!p.sign);
  assert(p.cmpn(0) !== 0);

  var a = this;
  var b = p.clone();

  if (a.sign)
    a = a.mod(p);
  else
    a = a.clone();

  var x2 = new BN(0);
  while (b.isEven())
    b.ishrn(1);
  var delta = b.clone();
  while (a.cmpn(1) > 0 && b.cmpn(1) > 0) {
    while (a.isEven()) {
      a.ishrn(1);
      if (x1.isEven())
        x1.ishrn(1);
      else
        x1.iadd(delta).ishrn(1);
    }
    while (b.isEven()) {
      b.ishrn(1);
      if (x2.isEven())
        x2.ishrn(1);
      else
        x2.iadd(delta).ishrn(1);
    }
    if (a.cmp(b) >= 0) {
      a.isub(b);
      x1.isub(x2);
    } else {
      b.isub(a);
      x2.isub(x1);
    }
  }
  if (a.cmpn(1) === 0)
    return x1;
  else
    return x2;
};

BN.prototype.gcd = function gcd(num) {
  if (this.cmpn(0) === 0)
    return num.clone();
  if (num.cmpn(0) === 0)
    return this.clone();

  var a = this.clone();
  var b = num.clone();
  a.sign = false;
  b.sign = false;

  // Remove common factor of two
  for (var shift = 0; a.isEven() && b.isEven(); shift++) {
    a.ishrn(1);
    b.ishrn(1);
  }

  while (a.isEven())
    a.ishrn(1);

  do {
    while (b.isEven())
      b.ishrn(1);

    // Swap `a` and `b` to make `a` always bigger than `b`
    if (a.cmp(b) < 0) {
      var t = a;
      a = b;
      b = t;
    }
    a.isub(a.div(b).mul(b));
  } while (a.cmpn(0) !== 0 && b.cmpn(0) !== 0);
  if (a.cmpn(0) === 0)
    return b.ishln(shift);
  else
    return a.ishln(shift);
};

// Invert number in the field F(num)
BN.prototype.invm = function invm(num) {
  return this._egcd(new BN(1), num).mod(num);
};

BN.prototype.isEven = function isEven() {
  return (this.words[0] & 1) === 0;
};

BN.prototype.isOdd = function isOdd() {
  return (this.words[0] & 1) === 1;
};

// And first word and num
BN.prototype.andln = function andln(num) {
  return this.words[0] & num;
};

// Increment at the bit position in-line
BN.prototype.bincn = function bincn(bit) {
  assert(typeof bit === 'number');
  var r = bit % 26;
  var s = (bit - r) / 26;
  var q = 1 << r;

  // Fast case: bit is much higher than all existing words
  if (this.length <= s) {
    for (var i = this.length; i < s + 1; i++)
      this.words[i] = 0;
    this.words[s] |= q;
    this.length = s + 1;
    return this;
  }

  // Add bit and propagate, if needed
  var carry = q;
  for (var i = s; carry !== 0 && i < this.length; i++) {
    var w = this.words[i];
    w += carry;
    carry = w >>> 26;
    w &= 0x3ffffff;
    this.words[i] = w;
  }
  if (carry !== 0) {
    this.words[i] = carry;
    this.length++;
  }
  return this;
};

BN.prototype.cmpn = function cmpn(num) {
  var sign = num < 0;
  if (sign)
    num = -num;

  if (this.sign && !sign)
    return -1;
  else if (!this.sign && sign)
    return 1;

  num &= 0x3ffffff;
  this.strip();

  var res;
  if (this.length > 1) {
    res = 1;
  } else {
    var w = this.words[0];
    res = w === num ? 0 : w < num ? -1 : 1;
  }
  if (this.sign)
    res = -res;
  return res;
};

// Compare two numbers and return:
// 1 - if `this` > `num`
// 0 - if `this` == `num`
// -1 - if `this` < `num`
BN.prototype.cmp = function cmp(num) {
  if (this.sign && !num.sign)
    return -1;
  else if (!this.sign && num.sign)
    return 1;

  var res = this.ucmp(num);
  if (this.sign)
    return -res;
  else
    return res;
};

// Unsigned comparison
BN.prototype.ucmp = function ucmp(num) {
  // At this point both numbers have the same sign
  if (this.length > num.length)
    return 1;
  else if (this.length < num.length)
    return -1;

  var res = 0;
  for (var i = this.length - 1; i >= 0; i--) {
    var a = this.words[i];
    var b = num.words[i];

    if (a === b)
      continue;
    if (a < b)
      res = -1;
    else if (a > b)
      res = 1;
    break;
  }
  return res;
};

//
// A reduce context, could be using montgomery or something better, depending
// on the `m` itself.
//
BN.red = function red(num) {
  return new Red(num);
};

BN.prototype.toRed = function toRed(ctx) {
  assert(!this.red, 'Already a number in reduction context');
  assert(!this.sign, 'red works only with positives');
  return ctx.convertTo(this)._forceRed(ctx);
};

BN.prototype.fromRed = function fromRed() {
  assert(this.red, 'fromRed works only with numbers in reduction context');
  return this.red.convertFrom(this);
};

BN.prototype._forceRed = function _forceRed(ctx) {
  this.red = ctx;
  return this;
};

BN.prototype.forceRed = function forceRed(ctx) {
  assert(!this.red, 'Already a number in reduction context');
  return this._forceRed(ctx);
};

BN.prototype.redAdd = function redAdd(num) {
  assert(this.red, 'redAdd works only with red numbers');
  return this.red.add(this, num);
};

BN.prototype.redIAdd = function redIAdd(num) {
  assert(this.red, 'redIAdd works only with red numbers');
  return this.red.iadd(this, num);
};

BN.prototype.redSub = function redSub(num) {
  assert(this.red, 'redSub works only with red numbers');
  return this.red.sub(this, num);
};

BN.prototype.redISub = function redISub(num) {
  assert(this.red, 'redISub works only with red numbers');
  return this.red.isub(this, num);
};

BN.prototype.redShl = function redShl(num) {
  assert(this.red, 'redShl works only with red numbers');
  return this.red.shl(this, num);
};

BN.prototype.redMul = function redMul(num) {
  assert(this.red, 'redMul works only with red numbers');
  this.red._verify2(this, num);
  return this.red.mul(this, num);
};

BN.prototype.redIMul = function redIMul(num) {
  assert(this.red, 'redMul works only with red numbers');
  this.red._verify2(this, num);
  return this.red.imul(this, num);
};

BN.prototype.redSqr = function redSqr() {
  assert(this.red, 'redSqr works only with red numbers');
  this.red._verify1(this);
  return this.red.sqr(this);
};

BN.prototype.redISqr = function redISqr() {
  assert(this.red, 'redISqr works only with red numbers');
  this.red._verify1(this);
  return this.red.isqr(this);
};

// Square root over p
BN.prototype.redSqrt = function redSqrt() {
  assert(this.red, 'redSqrt works only with red numbers');
  this.red._verify1(this);
  return this.red.sqrt(this);
};

BN.prototype.redInvm = function redInvm() {
  assert(this.red, 'redInvm works only with red numbers');
  this.red._verify1(this);
  return this.red.invm(this);
};

// Return negative clone of `this` % `red modulo`
BN.prototype.redNeg = function redNeg() {
  assert(this.red, 'redNeg works only with red numbers');
  this.red._verify1(this);
  return this.red.neg(this);
};

BN.prototype.redPow = function redPow(num) {
  assert(this.red && !num.red, 'redPow(normalNum)');
  this.red._verify1(this);
  return this.red.pow(this, num);
};

// Prime numbers with efficient reduction
var primes = {
  k256: null,
  p224: null,
  p192: null,
  p25519: null
};

// Pseudo-Mersenne prime
function MPrime(name, p) {
  // P = 2 ^ N - K
  this.name = name;
  this.p = new BN(p, 16);
  this.n = this.p.bitLength();
  this.k = new BN(1).ishln(this.n).isub(this.p);

  this.tmp = this._tmp();
}

MPrime.prototype._tmp = function _tmp() {
  var tmp = new BN(null);
  tmp.words = new Array(Math.ceil(this.n / 13));
  return tmp;
};

MPrime.prototype.ireduce = function ireduce(num) {
  // Assumes that `num` is less than `P^2`
  // num = HI * (2 ^ N - K) + HI * K + LO = HI * K + LO (mod P)
  var r = num;
  var rlen;

  do {
    var pair = r.ishrn(this.n, 0, this.tmp);
    r = this.imulK(pair.hi);
    r = r.iadd(pair.lo);
    rlen = r.bitLength();
  } while (rlen > this.n);

  var cmp = rlen < this.n ? -1 : r.cmp(this.p);
  if (cmp === 0) {
    r.words[0] = 0;
    r.length = 1;
  } else if (cmp > 0) {
    r.isub(this.p);
  } else {
    r.strip();
  }

  return r;
};

MPrime.prototype.imulK = function imulK(num) {
  return num.imul(this.k);
};

function K256() {
  MPrime.call(
    this,
    'k256',
    'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f');
}
inherits(K256, MPrime);

K256.prototype.imulK = function imulK(num) {
  // K = 0x1000003d1 = [ 0x40, 0x3d1 ]
  num.words[num.length] = 0;
  num.words[num.length + 1] = 0;
  num.length += 2;

  // bounded at: 0x40 * 0x3ffffff + 0x3d0 = 0x100000390
  var hi;
  var lo = 0;
  for (var i = 0; i < num.length; i++) {
    var w = num.words[i];
    hi = w * 0x40;
    lo += w * 0x3d1;
    hi += (lo / 0x4000000) | 0;
    lo &= 0x3ffffff;

    num.words[i] = lo;

    lo = hi;
  }

  // Fast length reduction
  if (num.words[num.length - 1] === 0) {
    num.length--;
    if (num.words[num.length - 1] === 0)
      num.length--;
  }
  return num;
};

function P224() {
  MPrime.call(
    this,
    'p224',
    'ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001');
}
inherits(P224, MPrime);

function P192() {
  MPrime.call(
    this,
    'p192',
    'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff');
}
inherits(P192, MPrime);

function P25519() {
  // 2 ^ 255 - 19
  MPrime.call(
    this,
    '25519',
    '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed');
}
inherits(P25519, MPrime);

P25519.prototype.imulK = function imulK(num) {
  // K = 0x13
  var carry = 0;
  for (var i = 0; i < num.length; i++) {
    var hi = num.words[i] * 0x13 + carry;
    var lo = hi & 0x3ffffff;
    hi >>>= 26;

    num.words[i] = lo;
    carry = hi;
  }
  if (carry !== 0)
    num.words[num.length++] = carry;
  return num;
};

// Exported mostly for testing purposes, use plain name instead
BN._prime = function prime(name) {
  // Cached version of prime
  if (primes[name])
    return primes[name];

  var prime;
  if (name === 'k256')
    prime = new K256();
  else if (name === 'p224')
    prime = new P224();
  else if (name === 'p192')
    prime = new P192();
  else if (name === 'p25519')
    prime = new P25519();
  else
    throw new Error('Unknown prime ' + name);
  primes[name] = prime;

  return prime;
};

//
// Base reduction engine
//
function Red(m) {
  if (typeof m === 'string') {
    var prime = BN._prime(m);
    this.m = prime.p;
    this.prime = prime;
  } else {
    this.m = m;
    this.prime = null;
  }
}

Red.prototype._verify1 = function _verify1(a) {
  assert(!a.sign, 'red works only with positives');
  assert(a.red, 'red works only with red numbers');
};

Red.prototype._verify2 = function _verify2(a, b) {
  assert(!a.sign && !b.sign, 'red works only with positives');
  assert(a.red && a.red === b.red,
         'red works only with red numbers');
};

Red.prototype.imod = function imod(a) {
  if (this.prime)
    return this.prime.ireduce(a)._forceRed(this);
  return a.mod(this.m)._forceRed(this);
};

Red.prototype.neg = function neg(a) {
  var r = a.clone();
  r.sign = !r.sign;
  return r.iadd(this.m)._forceRed(this);
};

Red.prototype.add = function add(a, b) {
  this._verify2(a, b);

  var res = a.add(b);
  if (res.cmp(this.m) >= 0)
    res.isub(this.m);
  return res._forceRed(this);
};

Red.prototype.iadd = function iadd(a, b) {
  this._verify2(a, b);

  var res = a.iadd(b);
  if (res.cmp(this.m) >= 0)
    res.isub(this.m);
  return res;
};

Red.prototype.sub = function sub(a, b) {
  this._verify2(a, b);

  var res = a.sub(b);
  if (res.cmpn(0) < 0)
    res.iadd(this.m);
  return res._forceRed(this);
};

Red.prototype.isub = function isub(a, b) {
  this._verify2(a, b);

  var res = a.isub(b);
  if (res.cmpn(0) < 0)
    res.iadd(this.m);
  return res;
};

Red.prototype.shl = function shl(a, num) {
  this._verify1(a);
  return this.imod(a.shln(num));
};

Red.prototype.imul = function imul(a, b) {
  this._verify2(a, b);
  return this.imod(a.imul(b));
};

Red.prototype.mul = function mul(a, b) {
  this._verify2(a, b);
  return this.imod(a.mul(b));
};

Red.prototype.isqr = function isqr(a) {
  return this.imul(a, a);
};

Red.prototype.sqr = function sqr(a) {
  return this.mul(a, a);
};

Red.prototype.sqrt = function sqrt(a) {
  if (a.cmpn(0) === 0)
    return a.clone();

  var mod3 = this.m.andln(3);
  assert(mod3 % 2 === 1);

  // Fast case
  if (mod3 === 3) {
    var pow = this.m.add(new BN(1)).ishrn(2);
    var r = this.pow(a, pow);
    return r;
  }

  // Tonelli-Shanks algorithm (Totally unoptimized and slow)
  //
  // Find Q and S, that Q * 2 ^ S = (P - 1)
  var q = this.m.subn(1);
  var s = 0;
  while (q.cmpn(0) !== 0 && q.andln(1) === 0) {
    s++;
    q.ishrn(1);
  }
  assert(q.cmpn(0) !== 0);

  var one = new BN(1).toRed(this);
  var nOne = one.redNeg();

  // Find quadratic non-residue
  // NOTE: Max is such because of generalized Riemann hypothesis.
  var lpow = this.m.subn(1).ishrn(1);
  var z = this.m.bitLength();
  z = new BN(2 * z * z).toRed(this);
  while (this.pow(z, lpow).cmp(nOne) !== 0)
    z.redIAdd(nOne);

  var c = this.pow(z, q);
  var r = this.pow(a, q.addn(1).ishrn(1));
  var t = this.pow(a, q);
  var m = s;
  while (t.cmp(one) !== 0) {
    var tmp = t;
    for (var i = 0; tmp.cmp(one) !== 0; i++)
      tmp = tmp.redSqr();
    assert(i < m);
    var b = this.pow(c, new BN(1).ishln(m - i - 1));

    r = r.redMul(b);
    c = b.redSqr();
    t = t.redMul(c);
    m = i;
  }

  return r;
};

Red.prototype.invm = function invm(a) {
  var inv = a._egcd(new BN(1), this.m);
  if (inv.sign) {
    inv.sign = false;
    return this.imod(inv).redNeg();
  } else {
    return this.imod(inv);
  }
};

Red.prototype.pow = function pow(a, num) {
  var w = [];
  var q = num.clone();
  while (q.cmpn(0) !== 0) {
    w.push(q.andln(1));
    q.ishrn(1);
  }

  // Skip leading zeroes
  var res = a;
  for (var i = 0; i < w.length; i++, res = this.sqr(res))
    if (w[i] !== 0)
      break;

  if (++i < w.length) {
    for (var q = this.sqr(res); i < w.length; i++, q = this.sqr(q)) {
      if (w[i] === 0)
        continue;
      res = this.mul(res, q);
    }
  }

  return res;
};

Red.prototype.convertTo = function convertTo(num) {
  return num.clone();
};

Red.prototype.convertFrom = function convertFrom(num) {
  var res = num.clone();
  res.red = null;
  return res;
};

//
// Montgomery method engine
//

BN.mont = function mont(num) {
  return new Mont(num);
};

function Mont(m) {
  Red.call(this, m);

  this.shift = this.m.bitLength();
  if (this.shift % 26 !== 0)
    this.shift += 26 - (this.shift % 26);
  this.r = new BN(1).ishln(this.shift);
  this.r2 = this.imod(this.r.sqr());
  this.rinv = this.r.invm(this.m);

  this.minv = this.rinv.mul(this.r).isubn(1).div(this.m);
  this.minv.sign = true;
  this.minv = this.minv.mod(this.r);
}
inherits(Mont, Red);

Mont.prototype.convertTo = function convertTo(num) {
  return this.imod(num.shln(this.shift));
};

Mont.prototype.convertFrom = function convertFrom(num) {
  var r = this.imod(num.mul(this.rinv));
  r.red = null;
  return r;
};

Mont.prototype.imul = function imul(a, b) {
  if (a.cmpn(0) === 0 || b.cmpn(0) === 0) {
    a.words[0] = 0;
    a.length = 1;
    return a;
  }

  var t = a.imul(b);
  var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
  var u = t.isub(c).ishrn(this.shift);
  var res = u;
  if (u.cmp(this.m) >= 0)
    res = u.isub(this.m);
  else if (u.cmpn(0) < 0)
    res = u.iadd(this.m);

  return res._forceRed(this);
};

Mont.prototype.mul = function mul(a, b) {
  if (a.cmpn(0) === 0 || b.cmpn(0) === 0)
    return new BN(0)._forceRed(this);

  var t = a.mul(b);
  var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
  var u = t.isub(c).ishrn(this.shift);
  var res = u;
  if (u.cmp(this.m) >= 0)
    res = u.isub(this.m);
  else if (u.cmpn(0) < 0)
    res = u.iadd(this.m);

  return res._forceRed(this);
};

Mont.prototype.invm = function invm(a) {
  // (AR)^-1 * R^2 = (A^-1 * R^-1) * R^2 = A^-1 * R
  var res = this.imod(a.invm(this.m).mul(this.r2));
  return res._forceRed(this);
};

})( false || module, this);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./node_modules/supports-color/index.js":
/*!**********************************************!*\
  !*** ./node_modules/supports-color/index.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const os = __webpack_require__(/*! os */ "os");
const hasFlag = __webpack_require__(/*! has-flag */ "./node_modules/has-flag/index.js");

const env = process.env;

let forceColor;
if (hasFlag('no-color') ||
	hasFlag('no-colors') ||
	hasFlag('color=false')) {
	forceColor = false;
} else if (hasFlag('color') ||
	hasFlag('colors') ||
	hasFlag('color=true') ||
	hasFlag('color=always')) {
	forceColor = true;
}
if ('FORCE_COLOR' in env) {
	forceColor = env.FORCE_COLOR.length === 0 || parseInt(env.FORCE_COLOR, 10) !== 0;
}

function translateLevel(level) {
	if (level === 0) {
		return false;
	}

	return {
		level,
		hasBasic: true,
		has256: level >= 2,
		has16m: level >= 3
	};
}

function supportsColor(stream) {
	if (forceColor === false) {
		return 0;
	}

	if (hasFlag('color=16m') ||
		hasFlag('color=full') ||
		hasFlag('color=truecolor')) {
		return 3;
	}

	if (hasFlag('color=256')) {
		return 2;
	}

	if (stream && !stream.isTTY && forceColor !== true) {
		return 0;
	}

	const min = forceColor ? 1 : 0;

	if (process.platform === 'win32') {
		// Node.js 7.5.0 is the first version of Node.js to include a patch to
		// libuv that enables 256 color output on Windows. Anything earlier and it
		// won't work. However, here we target Node.js 8 at minimum as it is an LTS
		// release, and Node.js 7 is not. Windows 10 build 10586 is the first Windows
		// release that supports 256 colors. Windows 10 build 14931 is the first release
		// that supports 16m/TrueColor.
		const osRelease = os.release().split('.');
		if (
			Number(process.versions.node.split('.')[0]) >= 8 &&
			Number(osRelease[0]) >= 10 &&
			Number(osRelease[2]) >= 10586
		) {
			return Number(osRelease[2]) >= 14931 ? 3 : 2;
		}

		return 1;
	}

	if ('CI' in env) {
		if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
			return 1;
		}

		return min;
	}

	if ('TEAMCITY_VERSION' in env) {
		return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
	}

	if (env.COLORTERM === 'truecolor') {
		return 3;
	}

	if ('TERM_PROGRAM' in env) {
		const version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

		switch (env.TERM_PROGRAM) {
			case 'iTerm.app':
				return version >= 3 ? 3 : 2;
			case 'Apple_Terminal':
				return 2;
			// No default
		}
	}

	if (/-256(color)?$/i.test(env.TERM)) {
		return 2;
	}

	if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
		return 1;
	}

	if ('COLORTERM' in env) {
		return 1;
	}

	if (env.TERM === 'dumb') {
		return min;
	}

	return min;
}

function getSupportLevel(stream) {
	const level = supportsColor(stream);
	return translateLevel(level);
}

module.exports = {
	supportsColor: getSupportLevel,
	stdout: getSupportLevel(process.stdout),
	stderr: getSupportLevel(process.stderr)
};


/***/ }),

/***/ "./node_modules/webpack/buildin/module.js":
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ "./src/arweave/ar.ts":
/*!***************************!*\
  !*** ./src/arweave/ar.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = __webpack_require__(/*! bignumber.js */ "./node_modules/bignumber.js/bignumber.mjs");
class Ar {
    constructor() {
        // Configure and assign the constructor function for the bignumber library.
        this.BigNum = (value, decimals) => {
            let instance = bignumber_js_1.BigNumber.clone({ DECIMAL_PLACES: decimals });
            return new instance(value);
        };
    }
    winstonToAr(winstonString, { formatted = false, decimals = 12, trim = true } = {}) {
        let number = this.stringToBigNum(winstonString, decimals).shiftedBy(-12);
        return formatted ? number.toFormat(decimals) : number.toFixed(decimals);
    }
    arToWinston(arString, { formatted = false } = {}) {
        let number = this.stringToBigNum(arString).shiftedBy(12);
        return formatted ? number.toFormat() : number.toFixed(0);
    }
    stringToBigNum(stringValue, decimalPlaces = 12) {
        return this.BigNum(stringValue, decimalPlaces);
    }
}
exports.Ar = Ar;


/***/ }),

/***/ "./src/arweave/arweave.ts":
/*!********************************!*\
  !*** ./src/arweave/arweave.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const ar_1 = __webpack_require__(/*! ./ar */ "./src/arweave/ar.ts");
const api_1 = __webpack_require__(/*! ./lib/api */ "./src/arweave/lib/api.ts");
const network_1 = __webpack_require__(/*! ./network */ "./src/arweave/network.ts");
const transactions_1 = __webpack_require__(/*! ./transactions */ "./src/arweave/transactions.ts");
const wallets_1 = __webpack_require__(/*! ./wallets */ "./src/arweave/wallets.ts");
const Transaction_1 = __webpack_require__(/*! ./lib/Transaction */ "./src/arweave/lib/Transaction.ts");
const utils_1 = __webpack_require__(/*! ./lib/utils */ "./src/arweave/lib/utils.ts");
class Arweave {
    constructor(config) {
        this.crypto = config.crypto;
        this.api = new api_1.Api(config.api);
        this.wallets = new wallets_1.Wallets(this.api, config.crypto);
        this.transactions = new transactions_1.Transactions(this.api, config.crypto);
        this.network = new network_1.Network(this.api);
        this.ar = new ar_1.Ar;
        this.utils = utils_1.ArweaveUtils;
    }
    async createTransaction(attributes, jwk) {
        if (!attributes.data && !(attributes.target && attributes.quantity)) {
            throw new Error(`A new Arweave transaction must have a 'data' value, or 'target' and 'quantity' values.`);
        }
        let from = await this.wallets.jwkToAddress(jwk);
        if (attributes.owner == undefined) {
            attributes.owner = jwk.n;
        }
        if (attributes.last_tx == undefined) {
            attributes.last_tx = await this.wallets.getLastTransactionID(from);
        }
        if (attributes.reward == undefined) {
            let length = (typeof attributes.data == 'string' && attributes.data.length > 0) ? attributes.data.length : 0;
            let target = (typeof attributes.target == 'string' && attributes.target.length > 0) ? attributes.target : null;
            attributes.reward = await this.transactions.getPrice(length, target);
        }
        if (attributes.data) {
            attributes.data = utils_1.ArweaveUtils.stringToB64Url(attributes.data);
        }
        return new Transaction_1.Transaction(attributes);
    }
}
exports.Arweave = Arweave;


/***/ }),

/***/ "./src/arweave/lib/Transaction.ts":
/*!****************************************!*\
  !*** ./src/arweave/lib/Transaction.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = __webpack_require__(/*! ./utils */ "./src/arweave/lib/utils.ts");
class BaseObject {
    get(field, options) {
        if (!Object.getOwnPropertyNames(this).includes(field)) {
            throw new Error(`Field "${field}" is not a property of the Arweave Transaction class.`);
        }
        if (options && options.decode == true) {
            if (options && options.string) {
                return utils_1.ArweaveUtils.b64UrlToString(this[field]);
            }
            return utils_1.ArweaveUtils.b64UrlToBuffer(this[field]);
        }
        return this[field];
    }
}
class Tag extends BaseObject {
    constructor(name, value, decode = false) {
        super();
        this.name = name;
        this.value = value;
    }
}
exports.Tag = Tag;
class Transaction extends BaseObject {
    constructor(attributes) {
        super();
        this.last_tx = '';
        this.owner = '';
        this.tags = [];
        this.target = '';
        this.quantity = '0';
        this.data = '';
        this.reward = '0';
        this.signature = '';
        Object.assign(this, attributes);
    }
    addTag(name, value) {
        this.tags.push(new Tag(utils_1.ArweaveUtils.stringToB64Url(name), utils_1.ArweaveUtils.stringToB64Url(value)));
    }
    toJSON() {
        return {
            id: this.id,
            last_tx: this.last_tx,
            owner: this.owner,
            tags: this.tags,
            target: this.target,
            quantity: this.quantity,
            data: this.data,
            reward: this.reward,
            signature: this.signature
        };
    }
    setSignature({ signature, id }) {
        this.signature = signature;
        this.id = id;
    }
    getSignatureData() {
        let tagString = this.tags.reduce((accumulator, tag) => {
            return accumulator + '' + tag.get('name', { decode: true, string: true }) + '' + tag.get('value', { decode: true, string: true });
        }, '');
        return utils_1.ArweaveUtils.concatBuffers([
            this.get('owner', { decode: true, string: false }),
            this.get('target', { decode: true, string: false }),
            this.get('data', { decode: true, string: false }),
            utils_1.ArweaveUtils.stringToBuffer(this.quantity),
            utils_1.ArweaveUtils.stringToBuffer(this.reward),
            this.get('last_tx', { decode: true, string: false }),
            utils_1.ArweaveUtils.stringToBuffer(tagString)
        ]);
    }
}
exports.Transaction = Transaction;


/***/ }),

/***/ "./src/arweave/lib/api.ts":
/*!********************************!*\
  !*** ./src/arweave/lib/api.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
class Api {
    constructor(config) {
        this.METHOD_GET = 'GET';
        this.METHOD_POST = 'POST';
        this.config = this.mergeDefaults(config);
    }
    mergeDefaults(config) {
        return {
            host: config.host,
            protocol: config.protocol || 'http',
            port: config.port || 1984,
            timeout: config.timeout || 20000,
            logging: false,
        };
    }
    async get(endpoint, config) {
        try {
            return await this.request().get(endpoint, config);
        }
        catch (error) {
            if (error.response && error.response.status) {
                return error.response;
            }
            throw error;
        }
    }
    async post() {
    }
    /**
     * Get an AxiosInstance with the base configuration setup to fire off
     * a request to the network.
     */
    request() {
        let instance = axios_1.default.create({
            baseURL: `${this.config.protocol}://${this.config.host}:${this.config.port}`,
            timeout: 1000,
        });
        if (this.config.logging) {
            instance.interceptors.request.use(request => {
                console.log(`Requesting: ${request.baseURL}/${request.url}`);
                return request;
            });
            instance.interceptors.response.use(response => {
                console.log(`Response:   ${response.config.url} - ${response.status}`);
                return response;
            });
        }
        return instance;
    }
}
exports.Api = Api;


/***/ }),

/***/ "./src/arweave/lib/crypto/node-driver.ts":
/*!***********************************************!*\
  !*** ./src/arweave/lib/crypto/node-driver.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const pemToJWK = __webpack_require__(/*! pem-jwk */ "./node_modules/pem-jwk/index.js").pem2jwk;
const JWKTopem = __webpack_require__(/*! pem-jwk */ "./node_modules/pem-jwk/index.js").jwk2pem;
const crypto = __webpack_require__(/*! crypto */ "crypto");
class NodeCryptoDriver {
    constructor() {
        this.keyLength = 4096;
        this.publicExponent = 0x10001;
        this.hashAlgorithm = 'sha256';
    }
    generateJWK() {
        return new Promise((resolve, reject) => {
            crypto
                .generateKeyPair('rsa', {
                modulusLength: this.keyLength,
                publicExponent: this.publicExponent,
                privateKeyEncoding: {
                    type: 'pkcs1',
                    format: 'pem'
                },
                publicKeyEncoding: {
                    type: 'pkcs1',
                    format: 'pem'
                }
            }, (err, publicKey, privateKey) => {
                if (err) {
                    reject(err);
                }
                resolve(this.pemToJWK(privateKey));
            });
        });
    }
    /**
     *
     * @param jwk
     * @param data
     */
    sign(jwk, data) {
        return new Promise((resolve, reject) => {
            resolve(crypto
                .createSign(this.hashAlgorithm)
                .update(data)
                .sign({
                key: this.jwkToPem(jwk),
                padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
                saltLength: 0
            }));
        });
    }
    hash(data) {
        return new Promise((resolve, reject) => {
            resolve(crypto
                .createHash(this.hashAlgorithm)
                .update(data)
                .digest());
        });
    }
    jwkToPem(jwk) {
        return JWKTopem(jwk);
    }
    pemToJWK(pem) {
        return pemToJWK(pem);
    }
}
exports.NodeCryptoDriver = NodeCryptoDriver;


/***/ }),

/***/ "./src/arweave/lib/error.ts":
/*!**********************************!*\
  !*** ./src/arweave/lib/error.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
;
class ArweaveError extends Error {
    constructor(type, optional) {
        if (optional.message) {
            super(optional.message);
        }
        else {
            super();
        }
        this.type = type;
        this.response = optional.response;
    }
    getType() {
        return this.type;
    }
}
exports.ArweaveError = ArweaveError;


/***/ }),

/***/ "./src/arweave/lib/transaction.ts":
/*!****************************************!*\
  !*** ./src/arweave/lib/transaction.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = __webpack_require__(/*! ./utils */ "./src/arweave/lib/utils.ts");
class BaseObject {
    get(field, options) {
        if (!Object.getOwnPropertyNames(this).includes(field)) {
            throw new Error(`Field "${field}" is not a property of the Arweave Transaction class.`);
        }
        if (options && options.decode == true) {
            if (options && options.string) {
                return utils_1.ArweaveUtils.b64UrlToString(this[field]);
            }
            return utils_1.ArweaveUtils.b64UrlToBuffer(this[field]);
        }
        return this[field];
    }
}
class Tag extends BaseObject {
    constructor(name, value, decode = false) {
        super();
        this.name = name;
        this.value = value;
    }
}
exports.Tag = Tag;
class Transaction extends BaseObject {
    constructor(attributes) {
        super();
        this.last_tx = '';
        this.owner = '';
        this.tags = [];
        this.target = '';
        this.quantity = '0';
        this.data = '';
        this.reward = '0';
        this.signature = '';
        Object.assign(this, attributes);
    }
    addTag(name, value) {
        this.tags.push(new Tag(utils_1.ArweaveUtils.stringToB64Url(name), utils_1.ArweaveUtils.stringToB64Url(value)));
    }
    toJSON() {
        return {
            id: this.id,
            last_tx: this.last_tx,
            owner: this.owner,
            tags: this.tags,
            target: this.target,
            quantity: this.quantity,
            data: this.data,
            reward: this.reward,
            signature: this.signature
        };
    }
    setSignature({ signature, id }) {
        this.signature = signature;
        this.id = id;
    }
    getSignatureData() {
        let tagString = this.tags.reduce((accumulator, tag) => {
            return accumulator + '' + tag.get('name', { decode: true, string: true }) + '' + tag.get('value', { decode: true, string: true });
        }, '');
        return utils_1.ArweaveUtils.concatBuffers([
            this.get('owner', { decode: true, string: false }),
            this.get('target', { decode: true, string: false }),
            this.get('data', { decode: true, string: false }),
            utils_1.ArweaveUtils.stringToBuffer(this.quantity),
            utils_1.ArweaveUtils.stringToBuffer(this.reward),
            this.get('last_tx', { decode: true, string: false }),
            utils_1.ArweaveUtils.stringToBuffer(tagString)
        ]);
    }
}
exports.Transaction = Transaction;


/***/ }),

/***/ "./src/arweave/lib/utils.ts":
/*!**********************************!*\
  !*** ./src/arweave/lib/utils.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const B64js = __webpack_require__(/*! base64-js */ "./node_modules/base64-js/index.js");
class ArweaveUtils {
    static concatBuffers(buffers) {
        let total_length = 0;
        for (let i = 0; i < buffers.length; i++) {
            total_length += buffers[i].byteLength;
        }
        let temp = new Uint8Array(total_length);
        let offset = 0;
        temp.set(new Uint8Array(buffers[0]), offset);
        offset += buffers[0].byteLength;
        for (let i = 1; i < buffers.length; i++) {
            temp.set(new Uint8Array(buffers[i]), offset);
            offset += buffers[i].byteLength;
        }
        return temp;
    }
    static b64UrlToString(b64UrlString) {
        let buffer = ArweaveUtils.b64UrlToBuffer(b64UrlString);
        // TextEncoder will be available in browsers, but not in node
        if (typeof TextDecoder == 'undefined') {
            const TextDecoder = __webpack_require__(/*! util */ "util").TextDecoder;
            return new TextDecoder('utf-8', { fatal: true }).decode(buffer);
        }
        return new TextDecoder('utf-8', { fatal: true }).decode(buffer);
    }
    static stringToBuffer(string) {
        // TextEncoder will be available in browsers, but not in node
        if (typeof TextEncoder == 'undefined') {
            const TextEncoder = __webpack_require__(/*! util */ "util").TextEncoder;
            return new TextEncoder().encode(string);
        }
        return new TextEncoder().encode(string);
    }
    static stringToB64Url(string) {
        return ArweaveUtils.bufferTob64Url(ArweaveUtils.stringToBuffer(string));
    }
    static b64UrlToBuffer(b64UrlString) {
        return new Uint8Array(B64js.toByteArray(ArweaveUtils.b64UrlDecode(b64UrlString)));
    }
    static bufferTob64(buffer) {
        return B64js.fromByteArray(new Uint8Array(buffer));
    }
    static bufferTob64Url(buffer) {
        return ArweaveUtils.b64UrlEncode(ArweaveUtils.bufferTob64(buffer));
    }
    static b64UrlEncode(b64UrlString) {
        return b64UrlString.replace(/\+/g, "-").replace(/\//g, "_").replace(/\=/g, "");
    }
    static b64UrlDecode(b64UrlString) {
        b64UrlString = b64UrlString.replace(/\-/g, "+").replace(/\_/g, "/");
        let padding;
        b64UrlString.length % 4 == 0 ? padding = 0 : padding = 4 - (b64UrlString.length % 4);
        return b64UrlString.concat("=".repeat(padding));
    }
}
exports.ArweaveUtils = ArweaveUtils;


/***/ }),

/***/ "./src/arweave/network.ts":
/*!********************************!*\
  !*** ./src/arweave/network.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Network {
    constructor(api) {
        this.api = api;
    }
    info() {
        return this.api.get(`info`).then(response => {
            return response.data;
        });
    }
    peers() {
        return this.api.get(`peers`).then(response => {
            return response.data;
        });
    }
}
exports.Network = Network;


/***/ }),

/***/ "./src/arweave/transactions.ts":
/*!*************************************!*\
  !*** ./src/arweave/transactions.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = __webpack_require__(/*! ./lib/error */ "./src/arweave/lib/error.ts");
const transaction_1 = __webpack_require__(/*! ./lib/transaction */ "./src/arweave/lib/transaction.ts");
const utils_1 = __webpack_require__(/*! ./lib/utils */ "./src/arweave/lib/utils.ts");
class Transactions {
    constructor(api, crypto) {
        this.api = api;
        this.crypto = crypto;
    }
    getPrice(byteSize, targetAddress) {
        let endpoint = targetAddress ? `price/${byteSize}/${targetAddress}` : `price/${byteSize}`;
        return this.api.get(endpoint, {
            transformResponse: [
                /**
                 * We need to specify a response transformer to override
                 * the default JSON.parse behaviour, as this causes
                 * winston to be converted to a number and we want to
                 * return it as a winston string.
                 * @param data
                 */
                function (data) {
                    return data;
                }
            ]
        }).then(response => {
            return response.data;
        });
    }
    get(id) {
        return this.api.get(`tx/${id}`).then(response => {
            if (response.status == 200) {
                return new transaction_1.Transaction(response.data);
            }
            if (response.status == 202) {
                new error_1.ArweaveError("TX_PENDING" /* TX_PENDING */);
            }
            if (response.status == 404) {
                new error_1.ArweaveError("TX_NOT_FOUND" /* TX_NOT_FOUND */);
            }
            if (response.status == 410) {
                new error_1.ArweaveError("TX_FAILED" /* TX_FAILED */);
            }
        });
    }
    getStatus(id) {
        return this.api.get(`tx/${id}/id`).then(response => {
            return response.status;
        });
    }
    async sign(transaction, jwk) {
        let dataToSign = transaction.getSignatureData();
        let rawSignature = await this.crypto.sign(jwk, dataToSign);
        let id = await this.crypto.hash(rawSignature);
        transaction.setSignature({
            signature: utils_1.ArweaveUtils.bufferTob64Url(rawSignature),
            id: utils_1.ArweaveUtils.bufferTob64Url(id)
        });
        return transaction;
    }
}
exports.Transactions = Transactions;


/***/ }),

/***/ "./src/arweave/wallets.ts":
/*!********************************!*\
  !*** ./src/arweave/wallets.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = __webpack_require__(/*! ./lib/utils */ "./src/arweave/lib/utils.ts");
class Wallets {
    constructor(api, crypto) {
        this.api = api;
        this.crypto = crypto;
    }
    /**
     * Get the wallet balance for the given address.
     *
     * @param {string} address - The arweave address to get the balance for.
     *
     * @returns {Promise<string>} - Promise which resolves with a winston string balance.
     */
    getBalance(address) {
        return this.api.get(`wallet/${address}/balance`, {
            transformResponse: [
                /**
                 * We need to specify a response transformer to override
                 * the default JSON.parse behaviour, as this causes
                 * balances to be converted to a number and we want to
                 * return it as a winston string.
                 * @param data
                 */
                function (data) {
                    return data;
                }
            ]
        }).then(response => {
            return response.data;
        });
    }
    /**
     * Get the last transaction ID for the given wallet address.
     *
     * @param {string} address - The arweave address to get the balance for.
     *
     * @returns {Promise<string>} - Promise which resolves with a winston string balance.
     */
    getLastTransactionID(address) {
        return this.api.get(`wallet/${address}/last_tx`).then(response => {
            return response.data;
        });
    }
    generate() {
        return this.crypto.generateJWK();
    }
    async jwkToAddress(jwk) {
        return utils_1.ArweaveUtils.bufferTob64Url(await this.crypto.hash(utils_1.ArweaveUtils.b64UrlToBuffer(jwk.n)));
    }
}
exports.Wallets = Wallets;


/***/ }),

/***/ "./src/node.ts":
/*!*********************!*\
  !*** ./src/node.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const arweave_1 = __webpack_require__(/*! ./arweave/arweave */ "./src/arweave/arweave.ts");
const node_driver_1 = __webpack_require__(/*! ./arweave/lib/crypto/node-driver */ "./src/arweave/lib/crypto/node-driver.ts");
function init(apiConfig) {
    return new arweave_1.Arweave({
        api: apiConfig,
        crypto: new node_driver_1.NodeCryptoDriver
    });
}
exports.init = init;


/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("https");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("stream");

/***/ }),

/***/ "tty":
/*!**********************!*\
  !*** external "tty" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("tty");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),

/***/ "vm":
/*!*********************!*\
  !*** external "vm" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("vm");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("zlib");

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvYWRhcHRlcnMvaHR0cC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2FkYXB0ZXJzL3hoci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2F4aW9zLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY2FuY2VsL0NhbmNlbC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NhbmNlbC9DYW5jZWxUb2tlbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NhbmNlbC9pc0NhbmNlbC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvQXhpb3MuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL0ludGVyY2VwdG9yTWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvY3JlYXRlRXJyb3IuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2Rpc3BhdGNoUmVxdWVzdC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvZW5oYW5jZUVycm9yLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9zZXR0bGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL3RyYW5zZm9ybURhdGEuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9kZWZhdWx0cy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvYmluZC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvYnRvYS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvYnVpbGRVUkwuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2NvbWJpbmVVUkxzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9jb29raWVzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9pc0Fic29sdXRlVVJMLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9pc1VSTFNhbWVPcmlnaW4uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL25vcm1hbGl6ZUhlYWRlck5hbWUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL3BhcnNlSGVhZGVycy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvc3ByZWFkLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Jhc2U2NC1qcy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYmlnbnVtYmVyLmpzL2JpZ251bWJlci5tanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2ZvbGxvdy1yZWRpcmVjdHMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2ZvbGxvdy1yZWRpcmVjdHMvbm9kZV9tb2R1bGVzL2RlYnVnL3NyYy9icm93c2VyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9mb2xsb3ctcmVkaXJlY3RzL25vZGVfbW9kdWxlcy9kZWJ1Zy9zcmMvZGVidWcuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2ZvbGxvdy1yZWRpcmVjdHMvbm9kZV9tb2R1bGVzL2RlYnVnL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZm9sbG93LXJlZGlyZWN0cy9ub2RlX21vZHVsZXMvZGVidWcvc3JjL25vZGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2hhcy1mbGFnL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9pbmhlcml0cy9pbmhlcml0cy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvaXMtYnVmZmVyL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9taW5pbWFsaXN0aWMtYXNzZXJ0L2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9tcy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcGVtLWp3ay9mYWN0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3BlbS1qd2svaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3BlbS1qd2svbm9kZV9tb2R1bGVzL2FzbjEuanMvbGliL2FzbjEuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3BlbS1qd2svbm9kZV9tb2R1bGVzL2FzbjEuanMvbGliL2FzbjEvYXBpLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wZW0tandrL25vZGVfbW9kdWxlcy9hc24xLmpzL2xpYi9hc24xL2Jhc2UvYnVmZmVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wZW0tandrL25vZGVfbW9kdWxlcy9hc24xLmpzL2xpYi9hc24xL2Jhc2UvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3BlbS1qd2svbm9kZV9tb2R1bGVzL2FzbjEuanMvbGliL2FzbjEvYmFzZS9ub2RlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wZW0tandrL25vZGVfbW9kdWxlcy9hc24xLmpzL2xpYi9hc24xL2Jhc2UvcmVwb3J0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3BlbS1qd2svbm9kZV9tb2R1bGVzL2FzbjEuanMvbGliL2FzbjEvY29uc3RhbnRzL2Rlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcGVtLWp3ay9ub2RlX21vZHVsZXMvYXNuMS5qcy9saWIvYXNuMS9jb25zdGFudHMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3BlbS1qd2svbm9kZV9tb2R1bGVzL2FzbjEuanMvbGliL2FzbjEvZGVjb2RlcnMvZGVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wZW0tandrL25vZGVfbW9kdWxlcy9hc24xLmpzL2xpYi9hc24xL2RlY29kZXJzL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wZW0tandrL25vZGVfbW9kdWxlcy9hc24xLmpzL2xpYi9hc24xL2VuY29kZXJzL2Rlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcGVtLWp3ay9ub2RlX21vZHVsZXMvYXNuMS5qcy9saWIvYXNuMS9lbmNvZGVycy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcGVtLWp3ay9ub2RlX21vZHVsZXMvYm4uanMvbGliL2JuLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zdXBwb3J0cy1jb2xvci9pbmRleC5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2J1aWxkaW4vbW9kdWxlLmpzIiwid2VicGFjazovLy8uL3NyYy9hcndlYXZlL2FyLnRzIiwid2VicGFjazovLy8uL3NyYy9hcndlYXZlL2Fyd2VhdmUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Fyd2VhdmUvbGliL1RyYW5zYWN0aW9uLnRzIiwid2VicGFjazovLy8uL3NyYy9hcndlYXZlL2xpYi9hcGkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Fyd2VhdmUvbGliL2NyeXB0by9ub2RlLWRyaXZlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYXJ3ZWF2ZS9saWIvZXJyb3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Fyd2VhdmUvbGliL3RyYW5zYWN0aW9uLnRzIiwid2VicGFjazovLy8uL3NyYy9hcndlYXZlL2xpYi91dGlscy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYXJ3ZWF2ZS9uZXR3b3JrLnRzIiwid2VicGFjazovLy8uL3NyYy9hcndlYXZlL3RyYW5zYWN0aW9ucy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYXJ3ZWF2ZS93YWxsZXRzLnRzIiwid2VicGFjazovLy8uL3NyYy9ub2RlLnRzIiwid2VicGFjazovLy9leHRlcm5hbCBcImFzc2VydFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImJ1ZmZlclwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImNyeXB0b1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImh0dHBcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJodHRwc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcIm9zXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwic3RyZWFtXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwidHR5XCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwidXJsXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwidXRpbFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInZtXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiemxpYlwiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2xGQSxpQkFBaUIsbUJBQU8sQ0FBQyxzREFBYSxFOzs7Ozs7Ozs7Ozs7QUNBekI7O0FBRWIsWUFBWSxtQkFBTyxDQUFDLHFEQUFZO0FBQ2hDLGFBQWEsbUJBQU8sQ0FBQyxpRUFBa0I7QUFDdkMsZUFBZSxtQkFBTyxDQUFDLDJFQUF1QjtBQUM5QyxXQUFXLG1CQUFPLENBQUMsa0JBQU07QUFDekIsWUFBWSxtQkFBTyxDQUFDLG9CQUFPO0FBQzNCLGlCQUFpQixtQkFBTyxDQUFDLGtFQUFrQjtBQUMzQyxrQkFBa0IsbUJBQU8sQ0FBQyxrRUFBa0I7QUFDNUMsVUFBVSxtQkFBTyxDQUFDLGdCQUFLO0FBQ3ZCLFdBQVcsbUJBQU8sQ0FBQyxrQkFBTTtBQUN6QixVQUFVLG1CQUFPLENBQUMsK0RBQXNCO0FBQ3hDLGtCQUFrQixtQkFBTyxDQUFDLHlFQUFxQjtBQUMvQyxtQkFBbUIsbUJBQU8sQ0FBQywyRUFBc0I7O0FBRWpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsT0FBTztBQUNQO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBO0FB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QUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpQkFBaUIsU0FBUztBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLFNBQVM7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwwQ0FBMEMsVUFBVTtBQUNwRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7OztBQ3RKQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLGdDQUFnQyxLQUFLOztBQUVyQztBQUNBOztBQUVBLGlCQUFpQixVQUFVO0FBQzNCO0FBQ0E7QUFDQTs7QUFFQSw4QkFBOEIsT0FBTztBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFlBQVksS0FBSztBQUNqQjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLGVBQWUsR0FBRztBQUNsQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsZUFBZTtBQUN4QjtBQUNBLFdBQVcsT0FBTztBQUNsQjtBQUNBLGtDQUFrQyxtREFBbUQsR0FBRyxNQUFNO0FBQzlGO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsWUFBWSxhQUFhOztBQUV6QjtBQUNBLG9CQUFvQixTQUFTO0FBQzdCOztBQUVBOztBQUVBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSxPQUFPO0FBQ2Y7QUFDQSxrQ0FBa0MsbURBQW1ELEdBQUcsRUFBRTtBQUMxRjtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFlBQVksRUFBRTtBQUNkO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7O0FBRVgsOENBQThDLElBQUksT0FBTyxJQUFJO0FBQzdEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixXQUFXLE9BQU87QUFDbEI7QUFDQSxrQ0FBa0MsbURBQW1ELEdBQUcsTUFBTTtBQUM5RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixXQUFXLE9BQU87QUFDbEI7QUFDQSxrQ0FBa0MsbURBQW1ELEdBQUcsTUFBTTtBQUM5RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsV0FBVyxPQUFPO0FBQ2xCLGVBQWUsT0FBTztBQUN0QjtBQUNBLGtDQUFrQyxtREFBbUQsR0FBRyxNQUFNO0FBQzlGLGlEQUFpRCxPQUFPO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLFNBQVM7QUFDdkI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwrQ0FBK0MsV0FBVztBQUMxRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsd0JBQXdCO0FBQ25DO0FBQ0Esa0NBQWtDLDRCQUE0QixJQUFJLEdBQUc7QUFDckU7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsVUFBVSxFQUFFO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsV0FBVyxPQUFPO0FBQ2xCO0FBQ0Esa0NBQWtDLG1EQUFtRCxHQUFHLE1BQU07QUFDOUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVLE9BQU87QUFDakI7QUFDQSw4QkFBOEIsbURBQW1ELEdBQUcsRUFBRTtBQUN0RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7OztBQUdBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFFBQVEsT0FBTztBQUNmO0FBQ0E7QUFDQSxVQUFVLEtBQUs7QUFDZjtBQUNBOztBQUVBO0FBQ0Esb0JBQW9CLDBCQUEwQjs7QUFFOUM7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxhQUFhLE9BQU87O0FBRXBCO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHNCQUFzQixLQUFLO0FBQzNCOztBQUVBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQSw0QkFBNEIsS0FBSztBQUNqQztBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0E7OztBQUdPOztBQUVRLHdFQUFTLEVBQUM7Ozs7Ozs7Ozs7OztBQzl3RnpCLFVBQVUsbUJBQU8sQ0FBQyxnQkFBSztBQUN2QixXQUFXLG1CQUFPLENBQUMsa0JBQU07QUFDekIsWUFBWSxtQkFBTyxDQUFDLG9CQUFPO0FBQzNCLGFBQWEsbUJBQU8sQ0FBQyxzQkFBUTtBQUM3QixlQUFlLG1CQUFPLENBQUMsc0JBQVE7QUFDL0IsWUFBWSxtQkFBTyxDQUFDLDhFQUFPOztBQUUzQjtBQUNBO0FBQ0Esb0JBQW9COztBQUVwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLGlDQUFpQztBQUNwRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQix1Q0FBdUMsRUFBRTtBQUMvRCxHQUFHO0FBQ0gsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQSx1QkFBdUIsMkJBQTJCO0FBQ2xEOzs7Ozs7Ozs7Ozs7QUN0VEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSwyQkFBMkIsbUJBQU8sQ0FBQyxnRkFBUztBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNB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QUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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O0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGdCQUFnQjtBQUNoQjtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLO0FBQ0w7QUFDQSxLQUFLOztBQUVMO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDOWpCQSxlQUFlLG1CQUFPLENBQUMscURBQVU7O0FBRWpDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7O0FDeEZBLGdCQUFnQixtQkFBTyxDQUFDLDZGQUFjOztBQUV0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUN6Q0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUEsZ0JBQWdCLG1CQUFPLENBQUMsb0ZBQU87Ozs7Ozs7Ozs7OztBQ2xCL0IsZUFBZSxtQkFBTyxDQUFDLHFEQUFVOztBQUVqQyxXQUFXLG1CQUFPLENBQUMsMkVBQVk7QUFDL0I7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQSxZQUFZO0FBQ1osR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIsU0FBUztBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7O0FDM1NBOztBQUVBLGVBQWUsbUJBQU8sQ0FBQyxtRkFBTzs7Ozs7Ozs7Ozs7O0FDRjlCLGVBQWUsbUJBQU8sQ0FBQyxxREFBVTtBQUNqQyxhQUFhLG1CQUFPLENBQUMsc0JBQVE7O0FBRTdCLFdBQVcsbUJBQU8sQ0FBQywyRUFBWTtBQUMvQjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsWUFBWTtBQUMxQzs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsaURBQWlELE9BQU87QUFDeEQ7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixlQUFlO0FBQ2xDO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCLGVBQWU7QUFDaEM7QUFDQSxnQkFBZ0IsZUFBZTtBQUMvQjtBQUNBOztBQUVBO0FBQ0E7QUFDQSw2QkFBNkIsUUFBUTtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtQkFBbUIsWUFBWTtBQUMvQjs7QUFFQTtBQUNBLDhCQUE4QixRQUFRO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsV0FBVyxpQkFBaUI7QUFDNUI7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7QUM3UUE7O0FBRUEsZUFBZSxtQkFBTyxDQUFDLG1GQUFPOzs7Ozs7Ozs7Ozs7QUNGOUI7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsaUJBQWlCO0FBQ2xDOztBQUVBO0FBQ0E7QUFDQSwwQ0FBMEMsUUFBUTtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsMEJBQTBCLG1CQUFtQjtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLFNBQVM7QUFDOUI7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsaUJBQWlCO0FBQ2xDOztBQUVBO0FBQ0E7QUFDQSx3Q0FBd0MsWUFBWTtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsU0FBUztBQUM5Qjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9DQUFvQyxzQkFBc0I7QUFDMUQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHFCQUFxQixTQUFTO0FBQzlCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsbUJBQW1CLFNBQVM7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCLGlCQUFpQjtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsaUJBQWlCO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQixpQkFBaUI7QUFDbEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsd0JBQXdC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Q0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw2QkFBNkIsV0FBVztBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUIsZ0NBQWdDO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsK0JBQStCLFFBQVE7QUFDdkM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixnQkFBZ0I7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsZ0JBQWdCO0FBQ2pDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLG9CQUFvQjtBQUN2QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUIsY0FBYztBQUMvQjtBQUNBOztBQUVBO0FBQ0EsK0JBQStCLGNBQWM7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtB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QUM7SUFDckMsQ0FBQztJQUVNLEtBQUssQ0FBQyxZQUFZLENBQUMsR0FBaUI7UUFDdkMsT0FBTyxvQkFBWSxDQUFDLGNBQWMsQ0FBQyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLG9CQUFZLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkcsQ0FBQztDQUVKO0FBMURELDBCQTBEQzs7Ozs7Ozs7Ozs7Ozs7O0FDL0RELDJGQUE0QztBQUM1Qyw2SEFBb0U7QUFHcEUsU0FBZ0IsSUFBSSxDQUFDLFNBQWlCO0lBQ2xDLE9BQU8sSUFBSSxpQkFBTyxDQUFDO1FBQ2YsR0FBRyxFQUFFLFNBQVM7UUFDZCxNQUFNLEVBQUUsSUFBSSw4QkFBZ0I7S0FDL0IsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQUxELG9CQUtDOzs7Ozs7Ozs7Ozs7QUNURCxtQzs7Ozs7Ozs7Ozs7QUNBQSxtQzs7Ozs7Ozs7Ozs7QUNBQSxtQzs7Ozs7Ozs7Ozs7QUNBQSxpQzs7Ozs7Ozs7Ozs7QUNBQSxrQzs7Ozs7Ozs7Ozs7QUNBQSwrQjs7Ozs7Ozs7Ozs7QUNBQSxtQzs7Ozs7Ozs7Ozs7QUNBQSxnQzs7Ozs7Ozs7Ozs7QUNBQSxnQzs7Ozs7Ozs7Ozs7QUNBQSxpQzs7Ozs7Ozs7Ozs7QUNBQSwrQjs7Ozs7Ozs7Ozs7QUNBQSxpQyIsImZpbGUiOiJub2RlLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL25vZGUudHNcIik7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vbGliL2F4aW9zJyk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG52YXIgc2V0dGxlID0gcmVxdWlyZSgnLi8uLi9jb3JlL3NldHRsZScpO1xudmFyIGJ1aWxkVVJMID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2J1aWxkVVJMJyk7XG52YXIgaHR0cCA9IHJlcXVpcmUoJ2h0dHAnKTtcbnZhciBodHRwcyA9IHJlcXVpcmUoJ2h0dHBzJyk7XG52YXIgaHR0cEZvbGxvdyA9IHJlcXVpcmUoJ2ZvbGxvdy1yZWRpcmVjdHMnKS5odHRwO1xudmFyIGh0dHBzRm9sbG93ID0gcmVxdWlyZSgnZm9sbG93LXJlZGlyZWN0cycpLmh0dHBzO1xudmFyIHVybCA9IHJlcXVpcmUoJ3VybCcpO1xudmFyIHpsaWIgPSByZXF1aXJlKCd6bGliJyk7XG52YXIgcGtnID0gcmVxdWlyZSgnLi8uLi8uLi9wYWNrYWdlLmpzb24nKTtcbnZhciBjcmVhdGVFcnJvciA9IHJlcXVpcmUoJy4uL2NvcmUvY3JlYXRlRXJyb3InKTtcbnZhciBlbmhhbmNlRXJyb3IgPSByZXF1aXJlKCcuLi9jb3JlL2VuaGFuY2VFcnJvcicpO1xuXG4vKmVzbGludCBjb25zaXN0ZW50LXJldHVybjowKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaHR0cEFkYXB0ZXIoY29uZmlnKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiBkaXNwYXRjaEh0dHBSZXF1ZXN0KHJlc29sdmUsIHJlamVjdCkge1xuICAgIHZhciBkYXRhID0gY29uZmlnLmRhdGE7XG4gICAgdmFyIGhlYWRlcnMgPSBjb25maWcuaGVhZGVycztcbiAgICB2YXIgdGltZXI7XG5cbiAgICAvLyBTZXQgVXNlci1BZ2VudCAocmVxdWlyZWQgYnkgc29tZSBzZXJ2ZXJzKVxuICAgIC8vIE9ubHkgc2V0IGhlYWRlciBpZiBpdCBoYXNuJ3QgYmVlbiBzZXQgaW4gY29uZmlnXG4gICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9heGlvcy9heGlvcy9pc3N1ZXMvNjlcbiAgICBpZiAoIWhlYWRlcnNbJ1VzZXItQWdlbnQnXSAmJiAhaGVhZGVyc1sndXNlci1hZ2VudCddKSB7XG4gICAgICBoZWFkZXJzWydVc2VyLUFnZW50J10gPSAnYXhpb3MvJyArIHBrZy52ZXJzaW9uO1xuICAgIH1cblxuICAgIGlmIChkYXRhICYmICF1dGlscy5pc1N0cmVhbShkYXRhKSkge1xuICAgICAgaWYgKEJ1ZmZlci5pc0J1ZmZlcihkYXRhKSkge1xuICAgICAgICAvLyBOb3RoaW5nIHRvIGRvLi4uXG4gICAgICB9IGVsc2UgaWYgKHV0aWxzLmlzQXJyYXlCdWZmZXIoZGF0YSkpIHtcbiAgICAgICAgZGF0YSA9IG5ldyBCdWZmZXIobmV3IFVpbnQ4QXJyYXkoZGF0YSkpO1xuICAgICAgfSBlbHNlIGlmICh1dGlscy5pc1N0cmluZyhkYXRhKSkge1xuICAgICAgICBkYXRhID0gbmV3IEJ1ZmZlcihkYXRhLCAndXRmLTgnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiByZWplY3QoY3JlYXRlRXJyb3IoXG4gICAgICAgICAgJ0RhdGEgYWZ0ZXIgdHJhbnNmb3JtYXRpb24gbXVzdCBiZSBhIHN0cmluZywgYW4gQXJyYXlCdWZmZXIsIGEgQnVmZmVyLCBvciBhIFN0cmVhbScsXG4gICAgICAgICAgY29uZmlnXG4gICAgICAgICkpO1xuICAgICAgfVxuXG4gICAgICAvLyBBZGQgQ29udGVudC1MZW5ndGggaGVhZGVyIGlmIGRhdGEgZXhpc3RzXG4gICAgICBoZWFkZXJzWydDb250ZW50LUxlbmd0aCddID0gZGF0YS5sZW5ndGg7XG4gICAgfVxuXG4gICAgLy8gSFRUUCBiYXNpYyBhdXRoZW50aWNhdGlvblxuICAgIHZhciBhdXRoID0gdW5kZWZpbmVkO1xuICAgIGlmIChjb25maWcuYXV0aCkge1xuICAgICAgdmFyIHVzZXJuYW1lID0gY29uZmlnLmF1dGgudXNlcm5hbWUgfHwgJyc7XG4gICAgICB2YXIgcGFzc3dvcmQgPSBjb25maWcuYXV0aC5wYXNzd29yZCB8fCAnJztcbiAgICAgIGF1dGggPSB1c2VybmFtZSArICc6JyArIHBhc3N3b3JkO1xuICAgIH1cblxuICAgIC8vIFBhcnNlIHVybFxuICAgIHZhciBwYXJzZWQgPSB1cmwucGFyc2UoY29uZmlnLnVybCk7XG4gICAgdmFyIHByb3RvY29sID0gcGFyc2VkLnByb3RvY29sIHx8ICdodHRwOic7XG5cbiAgICBpZiAoIWF1dGggJiYgcGFyc2VkLmF1dGgpIHtcbiAgICAgIHZhciB1cmxBdXRoID0gcGFyc2VkLmF1dGguc3BsaXQoJzonKTtcbiAgICAgIHZhciB1cmxVc2VybmFtZSA9IHVybEF1dGhbMF0gfHwgJyc7XG4gICAgICB2YXIgdXJsUGFzc3dvcmQgPSB1cmxBdXRoWzFdIHx8ICcnO1xuICAgICAgYXV0aCA9IHVybFVzZXJuYW1lICsgJzonICsgdXJsUGFzc3dvcmQ7XG4gICAgfVxuXG4gICAgaWYgKGF1dGgpIHtcbiAgICAgIGRlbGV0ZSBoZWFkZXJzLkF1dGhvcml6YXRpb247XG4gICAgfVxuXG4gICAgdmFyIGlzSHR0cHMgPSBwcm90b2NvbCA9PT0gJ2h0dHBzOic7XG4gICAgdmFyIGFnZW50ID0gaXNIdHRwcyA/IGNvbmZpZy5odHRwc0FnZW50IDogY29uZmlnLmh0dHBBZ2VudDtcblxuICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgcGF0aDogYnVpbGRVUkwocGFyc2VkLnBhdGgsIGNvbmZpZy5wYXJhbXMsIGNvbmZpZy5wYXJhbXNTZXJpYWxpemVyKS5yZXBsYWNlKC9eXFw/LywgJycpLFxuICAgICAgbWV0aG9kOiBjb25maWcubWV0aG9kLFxuICAgICAgaGVhZGVyczogaGVhZGVycyxcbiAgICAgIGFnZW50OiBhZ2VudCxcbiAgICAgIGF1dGg6IGF1dGhcbiAgICB9O1xuXG4gICAgaWYgKGNvbmZpZy5zb2NrZXRQYXRoKSB7XG4gICAgICBvcHRpb25zLnNvY2tldFBhdGggPSBjb25maWcuc29ja2V0UGF0aDtcbiAgICB9IGVsc2Uge1xuICAgICAgb3B0aW9ucy5ob3N0bmFtZSA9IHBhcnNlZC5ob3N0bmFtZTtcbiAgICAgIG9wdGlvbnMucG9ydCA9IHBhcnNlZC5wb3J0O1xuICAgIH1cblxuICAgIHZhciBwcm94eSA9IGNvbmZpZy5wcm94eTtcbiAgICBpZiAoIXByb3h5ICYmIHByb3h5ICE9PSBmYWxzZSkge1xuICAgICAgdmFyIHByb3h5RW52ID0gcHJvdG9jb2wuc2xpY2UoMCwgLTEpICsgJ19wcm94eSc7XG4gICAgICB2YXIgcHJveHlVcmwgPSBwcm9jZXNzLmVudltwcm94eUVudl0gfHwgcHJvY2Vzcy5lbnZbcHJveHlFbnYudG9VcHBlckNhc2UoKV07XG4gICAgICBpZiAocHJveHlVcmwpIHtcbiAgICAgICAgdmFyIHBhcnNlZFByb3h5VXJsID0gdXJsLnBhcnNlKHByb3h5VXJsKTtcbiAgICAgICAgcHJveHkgPSB7XG4gICAgICAgICAgaG9zdDogcGFyc2VkUHJveHlVcmwuaG9zdG5hbWUsXG4gICAgICAgICAgcG9ydDogcGFyc2VkUHJveHlVcmwucG9ydFxuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChwYXJzZWRQcm94eVVybC5hdXRoKSB7XG4gICAgICAgICAgdmFyIHByb3h5VXJsQXV0aCA9IHBhcnNlZFByb3h5VXJsLmF1dGguc3BsaXQoJzonKTtcbiAgICAgICAgICBwcm94eS5hdXRoID0ge1xuICAgICAgICAgICAgdXNlcm5hbWU6IHByb3h5VXJsQXV0aFswXSxcbiAgICAgICAgICAgIHBhc3N3b3JkOiBwcm94eVVybEF1dGhbMV1cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHByb3h5KSB7XG4gICAgICBvcHRpb25zLmhvc3RuYW1lID0gcHJveHkuaG9zdDtcbiAgICAgIG9wdGlvbnMuaG9zdCA9IHByb3h5Lmhvc3Q7XG4gICAgICBvcHRpb25zLmhlYWRlcnMuaG9zdCA9IHBhcnNlZC5ob3N0bmFtZSArIChwYXJzZWQucG9ydCA/ICc6JyArIHBhcnNlZC5wb3J0IDogJycpO1xuICAgICAgb3B0aW9ucy5wb3J0ID0gcHJveHkucG9ydDtcbiAgICAgIG9wdGlvbnMucGF0aCA9IHByb3RvY29sICsgJy8vJyArIHBhcnNlZC5ob3N0bmFtZSArIChwYXJzZWQucG9ydCA/ICc6JyArIHBhcnNlZC5wb3J0IDogJycpICsgb3B0aW9ucy5wYXRoO1xuXG4gICAgICAvLyBCYXNpYyBwcm94eSBhdXRob3JpemF0aW9uXG4gICAgICBpZiAocHJveHkuYXV0aCkge1xuICAgICAgICB2YXIgYmFzZTY0ID0gbmV3IEJ1ZmZlcihwcm94eS5hdXRoLnVzZXJuYW1lICsgJzonICsgcHJveHkuYXV0aC5wYXNzd29yZCwgJ3V0ZjgnKS50b1N0cmluZygnYmFzZTY0Jyk7XG4gICAgICAgIG9wdGlvbnMuaGVhZGVyc1snUHJveHktQXV0aG9yaXphdGlvbiddID0gJ0Jhc2ljICcgKyBiYXNlNjQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHRyYW5zcG9ydDtcbiAgICBpZiAoY29uZmlnLnRyYW5zcG9ydCkge1xuICAgICAgdHJhbnNwb3J0ID0gY29uZmlnLnRyYW5zcG9ydDtcbiAgICB9IGVsc2UgaWYgKGNvbmZpZy5tYXhSZWRpcmVjdHMgPT09IDApIHtcbiAgICAgIHRyYW5zcG9ydCA9IGlzSHR0cHMgPyBodHRwcyA6IGh0dHA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChjb25maWcubWF4UmVkaXJlY3RzKSB7XG4gICAgICAgIG9wdGlvbnMubWF4UmVkaXJlY3RzID0gY29uZmlnLm1heFJlZGlyZWN0cztcbiAgICAgIH1cbiAgICAgIHRyYW5zcG9ydCA9IGlzSHR0cHMgPyBodHRwc0ZvbGxvdyA6IGh0dHBGb2xsb3c7XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy5tYXhDb250ZW50TGVuZ3RoICYmIGNvbmZpZy5tYXhDb250ZW50TGVuZ3RoID4gLTEpIHtcbiAgICAgIG9wdGlvbnMubWF4Qm9keUxlbmd0aCA9IGNvbmZpZy5tYXhDb250ZW50TGVuZ3RoO1xuICAgIH1cblxuICAgIC8vIENyZWF0ZSB0aGUgcmVxdWVzdFxuICAgIHZhciByZXEgPSB0cmFuc3BvcnQucmVxdWVzdChvcHRpb25zLCBmdW5jdGlvbiBoYW5kbGVSZXNwb25zZShyZXMpIHtcbiAgICAgIGlmIChyZXEuYWJvcnRlZCkgcmV0dXJuO1xuXG4gICAgICAvLyBSZXNwb25zZSBoYXMgYmVlbiByZWNlaXZlZCBzbyBraWxsIHRpbWVyIHRoYXQgaGFuZGxlcyByZXF1ZXN0IHRpbWVvdXRcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICB0aW1lciA9IG51bGw7XG5cbiAgICAgIC8vIHVuY29tcHJlc3MgdGhlIHJlc3BvbnNlIGJvZHkgdHJhbnNwYXJlbnRseSBpZiByZXF1aXJlZFxuICAgICAgdmFyIHN0cmVhbSA9IHJlcztcbiAgICAgIHN3aXRjaCAocmVzLmhlYWRlcnNbJ2NvbnRlbnQtZW5jb2RpbmcnXSkge1xuICAgICAgLyplc2xpbnQgZGVmYXVsdC1jYXNlOjAqL1xuICAgICAgY2FzZSAnZ3ppcCc6XG4gICAgICBjYXNlICdjb21wcmVzcyc6XG4gICAgICBjYXNlICdkZWZsYXRlJzpcbiAgICAgICAgLy8gYWRkIHRoZSB1bnppcHBlciB0byB0aGUgYm9keSBzdHJlYW0gcHJvY2Vzc2luZyBwaXBlbGluZVxuICAgICAgICBzdHJlYW0gPSBzdHJlYW0ucGlwZSh6bGliLmNyZWF0ZVVuemlwKCkpO1xuXG4gICAgICAgIC8vIHJlbW92ZSB0aGUgY29udGVudC1lbmNvZGluZyBpbiBvcmRlciB0byBub3QgY29uZnVzZSBkb3duc3RyZWFtIG9wZXJhdGlvbnNcbiAgICAgICAgZGVsZXRlIHJlcy5oZWFkZXJzWydjb250ZW50LWVuY29kaW5nJ107XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICAvLyByZXR1cm4gdGhlIGxhc3QgcmVxdWVzdCBpbiBjYXNlIG9mIHJlZGlyZWN0c1xuICAgICAgdmFyIGxhc3RSZXF1ZXN0ID0gcmVzLnJlcSB8fCByZXE7XG5cbiAgICAgIHZhciByZXNwb25zZSA9IHtcbiAgICAgICAgc3RhdHVzOiByZXMuc3RhdHVzQ29kZSxcbiAgICAgICAgc3RhdHVzVGV4dDogcmVzLnN0YXR1c01lc3NhZ2UsXG4gICAgICAgIGhlYWRlcnM6IHJlcy5oZWFkZXJzLFxuICAgICAgICBjb25maWc6IGNvbmZpZyxcbiAgICAgICAgcmVxdWVzdDogbGFzdFJlcXVlc3RcbiAgICAgIH07XG5cbiAgICAgIGlmIChjb25maWcucmVzcG9uc2VUeXBlID09PSAnc3RyZWFtJykge1xuICAgICAgICByZXNwb25zZS5kYXRhID0gc3RyZWFtO1xuICAgICAgICBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCByZXNwb25zZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgcmVzcG9uc2VCdWZmZXIgPSBbXTtcbiAgICAgICAgc3RyZWFtLm9uKCdkYXRhJywgZnVuY3Rpb24gaGFuZGxlU3RyZWFtRGF0YShjaHVuaykge1xuICAgICAgICAgIHJlc3BvbnNlQnVmZmVyLnB1c2goY2h1bmspO1xuXG4gICAgICAgICAgLy8gbWFrZSBzdXJlIHRoZSBjb250ZW50IGxlbmd0aCBpcyBub3Qgb3ZlciB0aGUgbWF4Q29udGVudExlbmd0aCBpZiBzcGVjaWZpZWRcbiAgICAgICAgICBpZiAoY29uZmlnLm1heENvbnRlbnRMZW5ndGggPiAtMSAmJiBCdWZmZXIuY29uY2F0KHJlc3BvbnNlQnVmZmVyKS5sZW5ndGggPiBjb25maWcubWF4Q29udGVudExlbmd0aCkge1xuICAgICAgICAgICAgcmVqZWN0KGNyZWF0ZUVycm9yKCdtYXhDb250ZW50TGVuZ3RoIHNpemUgb2YgJyArIGNvbmZpZy5tYXhDb250ZW50TGVuZ3RoICsgJyBleGNlZWRlZCcsXG4gICAgICAgICAgICAgIGNvbmZpZywgbnVsbCwgbGFzdFJlcXVlc3QpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHN0cmVhbS5vbignZXJyb3InLCBmdW5jdGlvbiBoYW5kbGVTdHJlYW1FcnJvcihlcnIpIHtcbiAgICAgICAgICBpZiAocmVxLmFib3J0ZWQpIHJldHVybjtcbiAgICAgICAgICByZWplY3QoZW5oYW5jZUVycm9yKGVyciwgY29uZmlnLCBudWxsLCBsYXN0UmVxdWVzdCkpO1xuICAgICAgICB9KTtcblxuICAgICAgICBzdHJlYW0ub24oJ2VuZCcsIGZ1bmN0aW9uIGhhbmRsZVN0cmVhbUVuZCgpIHtcbiAgICAgICAgICB2YXIgcmVzcG9uc2VEYXRhID0gQnVmZmVyLmNvbmNhdChyZXNwb25zZUJ1ZmZlcik7XG4gICAgICAgICAgaWYgKGNvbmZpZy5yZXNwb25zZVR5cGUgIT09ICdhcnJheWJ1ZmZlcicpIHtcbiAgICAgICAgICAgIHJlc3BvbnNlRGF0YSA9IHJlc3BvbnNlRGF0YS50b1N0cmluZygndXRmOCcpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlc3BvbnNlLmRhdGEgPSByZXNwb25zZURhdGE7XG4gICAgICAgICAgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgcmVzcG9uc2UpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIEhhbmRsZSBlcnJvcnNcbiAgICByZXEub24oJ2Vycm9yJywgZnVuY3Rpb24gaGFuZGxlUmVxdWVzdEVycm9yKGVycikge1xuICAgICAgaWYgKHJlcS5hYm9ydGVkKSByZXR1cm47XG4gICAgICByZWplY3QoZW5oYW5jZUVycm9yKGVyciwgY29uZmlnLCBudWxsLCByZXEpKTtcbiAgICB9KTtcblxuICAgIC8vIEhhbmRsZSByZXF1ZXN0IHRpbWVvdXRcbiAgICBpZiAoY29uZmlnLnRpbWVvdXQgJiYgIXRpbWVyKSB7XG4gICAgICB0aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gaGFuZGxlUmVxdWVzdFRpbWVvdXQoKSB7XG4gICAgICAgIHJlcS5hYm9ydCgpO1xuICAgICAgICByZWplY3QoY3JlYXRlRXJyb3IoJ3RpbWVvdXQgb2YgJyArIGNvbmZpZy50aW1lb3V0ICsgJ21zIGV4Y2VlZGVkJywgY29uZmlnLCAnRUNPTk5BQk9SVEVEJywgcmVxKSk7XG4gICAgICB9LCBjb25maWcudGltZW91dCk7XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy5jYW5jZWxUb2tlbikge1xuICAgICAgLy8gSGFuZGxlIGNhbmNlbGxhdGlvblxuICAgICAgY29uZmlnLmNhbmNlbFRva2VuLnByb21pc2UudGhlbihmdW5jdGlvbiBvbkNhbmNlbGVkKGNhbmNlbCkge1xuICAgICAgICBpZiAocmVxLmFib3J0ZWQpIHJldHVybjtcblxuICAgICAgICByZXEuYWJvcnQoKTtcbiAgICAgICAgcmVqZWN0KGNhbmNlbCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBTZW5kIHRoZSByZXF1ZXN0XG4gICAgaWYgKHV0aWxzLmlzU3RyZWFtKGRhdGEpKSB7XG4gICAgICBkYXRhLnBpcGUocmVxKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVxLmVuZChkYXRhKTtcbiAgICB9XG4gIH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xudmFyIHNldHRsZSA9IHJlcXVpcmUoJy4vLi4vY29yZS9zZXR0bGUnKTtcbnZhciBidWlsZFVSTCA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9idWlsZFVSTCcpO1xudmFyIHBhcnNlSGVhZGVycyA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9wYXJzZUhlYWRlcnMnKTtcbnZhciBpc1VSTFNhbWVPcmlnaW4gPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvaXNVUkxTYW1lT3JpZ2luJyk7XG52YXIgY3JlYXRlRXJyb3IgPSByZXF1aXJlKCcuLi9jb3JlL2NyZWF0ZUVycm9yJyk7XG52YXIgYnRvYSA9ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuYnRvYSAmJiB3aW5kb3cuYnRvYS5iaW5kKHdpbmRvdykpIHx8IHJlcXVpcmUoJy4vLi4vaGVscGVycy9idG9hJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24geGhyQWRhcHRlcihjb25maWcpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIGRpc3BhdGNoWGhyUmVxdWVzdChyZXNvbHZlLCByZWplY3QpIHtcbiAgICB2YXIgcmVxdWVzdERhdGEgPSBjb25maWcuZGF0YTtcbiAgICB2YXIgcmVxdWVzdEhlYWRlcnMgPSBjb25maWcuaGVhZGVycztcblxuICAgIGlmICh1dGlscy5pc0Zvcm1EYXRhKHJlcXVlc3REYXRhKSkge1xuICAgICAgZGVsZXRlIHJlcXVlc3RIZWFkZXJzWydDb250ZW50LVR5cGUnXTsgLy8gTGV0IHRoZSBicm93c2VyIHNldCBpdFxuICAgIH1cblxuICAgIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgdmFyIGxvYWRFdmVudCA9ICdvbnJlYWR5c3RhdGVjaGFuZ2UnO1xuICAgIHZhciB4RG9tYWluID0gZmFsc2U7XG5cbiAgICAvLyBGb3IgSUUgOC85IENPUlMgc3VwcG9ydFxuICAgIC8vIE9ubHkgc3VwcG9ydHMgUE9TVCBhbmQgR0VUIGNhbGxzIGFuZCBkb2Vzbid0IHJldHVybnMgdGhlIHJlc3BvbnNlIGhlYWRlcnMuXG4gICAgLy8gRE9OJ1QgZG8gdGhpcyBmb3IgdGVzdGluZyBiL2MgWE1MSHR0cFJlcXVlc3QgaXMgbW9ja2VkLCBub3QgWERvbWFpblJlcXVlc3QuXG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAndGVzdCcgJiZcbiAgICAgICAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgd2luZG93LlhEb21haW5SZXF1ZXN0ICYmICEoJ3dpdGhDcmVkZW50aWFscycgaW4gcmVxdWVzdCkgJiZcbiAgICAgICAgIWlzVVJMU2FtZU9yaWdpbihjb25maWcudXJsKSkge1xuICAgICAgcmVxdWVzdCA9IG5ldyB3aW5kb3cuWERvbWFpblJlcXVlc3QoKTtcbiAgICAgIGxvYWRFdmVudCA9ICdvbmxvYWQnO1xuICAgICAgeERvbWFpbiA9IHRydWU7XG4gICAgICByZXF1ZXN0Lm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbiBoYW5kbGVQcm9ncmVzcygpIHt9O1xuICAgICAgcmVxdWVzdC5vbnRpbWVvdXQgPSBmdW5jdGlvbiBoYW5kbGVUaW1lb3V0KCkge307XG4gICAgfVxuXG4gICAgLy8gSFRUUCBiYXNpYyBhdXRoZW50aWNhdGlvblxuICAgIGlmIChjb25maWcuYXV0aCkge1xuICAgICAgdmFyIHVzZXJuYW1lID0gY29uZmlnLmF1dGgudXNlcm5hbWUgfHwgJyc7XG4gICAgICB2YXIgcGFzc3dvcmQgPSBjb25maWcuYXV0aC5wYXNzd29yZCB8fCAnJztcbiAgICAgIHJlcXVlc3RIZWFkZXJzLkF1dGhvcml6YXRpb24gPSAnQmFzaWMgJyArIGJ0b2EodXNlcm5hbWUgKyAnOicgKyBwYXNzd29yZCk7XG4gICAgfVxuXG4gICAgcmVxdWVzdC5vcGVuKGNvbmZpZy5tZXRob2QudG9VcHBlckNhc2UoKSwgYnVpbGRVUkwoY29uZmlnLnVybCwgY29uZmlnLnBhcmFtcywgY29uZmlnLnBhcmFtc1NlcmlhbGl6ZXIpLCB0cnVlKTtcblxuICAgIC8vIFNldCB0aGUgcmVxdWVzdCB0aW1lb3V0IGluIE1TXG4gICAgcmVxdWVzdC50aW1lb3V0ID0gY29uZmlnLnRpbWVvdXQ7XG5cbiAgICAvLyBMaXN0ZW4gZm9yIHJlYWR5IHN0YXRlXG4gICAgcmVxdWVzdFtsb2FkRXZlbnRdID0gZnVuY3Rpb24gaGFuZGxlTG9hZCgpIHtcbiAgICAgIGlmICghcmVxdWVzdCB8fCAocmVxdWVzdC5yZWFkeVN0YXRlICE9PSA0ICYmICF4RG9tYWluKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSByZXF1ZXN0IGVycm9yZWQgb3V0IGFuZCB3ZSBkaWRuJ3QgZ2V0IGEgcmVzcG9uc2UsIHRoaXMgd2lsbCBiZVxuICAgICAgLy8gaGFuZGxlZCBieSBvbmVycm9yIGluc3RlYWRcbiAgICAgIC8vIFdpdGggb25lIGV4Y2VwdGlvbjogcmVxdWVzdCB0aGF0IHVzaW5nIGZpbGU6IHByb3RvY29sLCBtb3N0IGJyb3dzZXJzXG4gICAgICAvLyB3aWxsIHJldHVybiBzdGF0dXMgYXMgMCBldmVuIHRob3VnaCBpdCdzIGEgc3VjY2Vzc2Z1bCByZXF1ZXN0XG4gICAgICBpZiAocmVxdWVzdC5zdGF0dXMgPT09IDAgJiYgIShyZXF1ZXN0LnJlc3BvbnNlVVJMICYmIHJlcXVlc3QucmVzcG9uc2VVUkwuaW5kZXhPZignZmlsZTonKSA9PT0gMCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBQcmVwYXJlIHRoZSByZXNwb25zZVxuICAgICAgdmFyIHJlc3BvbnNlSGVhZGVycyA9ICdnZXRBbGxSZXNwb25zZUhlYWRlcnMnIGluIHJlcXVlc3QgPyBwYXJzZUhlYWRlcnMocmVxdWVzdC5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSkgOiBudWxsO1xuICAgICAgdmFyIHJlc3BvbnNlRGF0YSA9ICFjb25maWcucmVzcG9uc2VUeXBlIHx8IGNvbmZpZy5yZXNwb25zZVR5cGUgPT09ICd0ZXh0JyA/IHJlcXVlc3QucmVzcG9uc2VUZXh0IDogcmVxdWVzdC5yZXNwb25zZTtcbiAgICAgIHZhciByZXNwb25zZSA9IHtcbiAgICAgICAgZGF0YTogcmVzcG9uc2VEYXRhLFxuICAgICAgICAvLyBJRSBzZW5kcyAxMjIzIGluc3RlYWQgb2YgMjA0IChodHRwczovL2dpdGh1Yi5jb20vYXhpb3MvYXhpb3MvaXNzdWVzLzIwMSlcbiAgICAgICAgc3RhdHVzOiByZXF1ZXN0LnN0YXR1cyA9PT0gMTIyMyA/IDIwNCA6IHJlcXVlc3Quc3RhdHVzLFxuICAgICAgICBzdGF0dXNUZXh0OiByZXF1ZXN0LnN0YXR1cyA9PT0gMTIyMyA/ICdObyBDb250ZW50JyA6IHJlcXVlc3Quc3RhdHVzVGV4dCxcbiAgICAgICAgaGVhZGVyczogcmVzcG9uc2VIZWFkZXJzLFxuICAgICAgICBjb25maWc6IGNvbmZpZyxcbiAgICAgICAgcmVxdWVzdDogcmVxdWVzdFxuICAgICAgfTtcblxuICAgICAgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgcmVzcG9uc2UpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlIGxvdyBsZXZlbCBuZXR3b3JrIGVycm9yc1xuICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uIGhhbmRsZUVycm9yKCkge1xuICAgICAgLy8gUmVhbCBlcnJvcnMgYXJlIGhpZGRlbiBmcm9tIHVzIGJ5IHRoZSBicm93c2VyXG4gICAgICAvLyBvbmVycm9yIHNob3VsZCBvbmx5IGZpcmUgaWYgaXQncyBhIG5ldHdvcmsgZXJyb3JcbiAgICAgIHJlamVjdChjcmVhdGVFcnJvcignTmV0d29yayBFcnJvcicsIGNvbmZpZywgbnVsbCwgcmVxdWVzdCkpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlIHRpbWVvdXRcbiAgICByZXF1ZXN0Lm9udGltZW91dCA9IGZ1bmN0aW9uIGhhbmRsZVRpbWVvdXQoKSB7XG4gICAgICByZWplY3QoY3JlYXRlRXJyb3IoJ3RpbWVvdXQgb2YgJyArIGNvbmZpZy50aW1lb3V0ICsgJ21zIGV4Y2VlZGVkJywgY29uZmlnLCAnRUNPTk5BQk9SVEVEJyxcbiAgICAgICAgcmVxdWVzdCkpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gQWRkIHhzcmYgaGVhZGVyXG4gICAgLy8gVGhpcyBpcyBvbmx5IGRvbmUgaWYgcnVubmluZyBpbiBhIHN0YW5kYXJkIGJyb3dzZXIgZW52aXJvbm1lbnQuXG4gICAgLy8gU3BlY2lmaWNhbGx5IG5vdCBpZiB3ZSdyZSBpbiBhIHdlYiB3b3JrZXIsIG9yIHJlYWN0LW5hdGl2ZS5cbiAgICBpZiAodXRpbHMuaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSkge1xuICAgICAgdmFyIGNvb2tpZXMgPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvY29va2llcycpO1xuXG4gICAgICAvLyBBZGQgeHNyZiBoZWFkZXJcbiAgICAgIHZhciB4c3JmVmFsdWUgPSAoY29uZmlnLndpdGhDcmVkZW50aWFscyB8fCBpc1VSTFNhbWVPcmlnaW4oY29uZmlnLnVybCkpICYmIGNvbmZpZy54c3JmQ29va2llTmFtZSA/XG4gICAgICAgICAgY29va2llcy5yZWFkKGNvbmZpZy54c3JmQ29va2llTmFtZSkgOlxuICAgICAgICAgIHVuZGVmaW5lZDtcblxuICAgICAgaWYgKHhzcmZWYWx1ZSkge1xuICAgICAgICByZXF1ZXN0SGVhZGVyc1tjb25maWcueHNyZkhlYWRlck5hbWVdID0geHNyZlZhbHVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEFkZCBoZWFkZXJzIHRvIHRoZSByZXF1ZXN0XG4gICAgaWYgKCdzZXRSZXF1ZXN0SGVhZGVyJyBpbiByZXF1ZXN0KSB7XG4gICAgICB1dGlscy5mb3JFYWNoKHJlcXVlc3RIZWFkZXJzLCBmdW5jdGlvbiBzZXRSZXF1ZXN0SGVhZGVyKHZhbCwga2V5KSB7XG4gICAgICAgIGlmICh0eXBlb2YgcmVxdWVzdERhdGEgPT09ICd1bmRlZmluZWQnICYmIGtleS50b0xvd2VyQ2FzZSgpID09PSAnY29udGVudC10eXBlJykge1xuICAgICAgICAgIC8vIFJlbW92ZSBDb250ZW50LVR5cGUgaWYgZGF0YSBpcyB1bmRlZmluZWRcbiAgICAgICAgICBkZWxldGUgcmVxdWVzdEhlYWRlcnNba2V5XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBPdGhlcndpc2UgYWRkIGhlYWRlciB0byB0aGUgcmVxdWVzdFxuICAgICAgICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcihrZXksIHZhbCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEFkZCB3aXRoQ3JlZGVudGlhbHMgdG8gcmVxdWVzdCBpZiBuZWVkZWRcbiAgICBpZiAoY29uZmlnLndpdGhDcmVkZW50aWFscykge1xuICAgICAgcmVxdWVzdC53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuICAgIH1cblxuICAgIC8vIEFkZCByZXNwb25zZVR5cGUgdG8gcmVxdWVzdCBpZiBuZWVkZWRcbiAgICBpZiAoY29uZmlnLnJlc3BvbnNlVHlwZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVxdWVzdC5yZXNwb25zZVR5cGUgPSBjb25maWcucmVzcG9uc2VUeXBlO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBFeHBlY3RlZCBET01FeGNlcHRpb24gdGhyb3duIGJ5IGJyb3dzZXJzIG5vdCBjb21wYXRpYmxlIFhNTEh0dHBSZXF1ZXN0IExldmVsIDIuXG4gICAgICAgIC8vIEJ1dCwgdGhpcyBjYW4gYmUgc3VwcHJlc3NlZCBmb3IgJ2pzb24nIHR5cGUgYXMgaXQgY2FuIGJlIHBhcnNlZCBieSBkZWZhdWx0ICd0cmFuc2Zvcm1SZXNwb25zZScgZnVuY3Rpb24uXG4gICAgICAgIGlmIChjb25maWcucmVzcG9uc2VUeXBlICE9PSAnanNvbicpIHtcbiAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIHByb2dyZXNzIGlmIG5lZWRlZFxuICAgIGlmICh0eXBlb2YgY29uZmlnLm9uRG93bmxvYWRQcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGNvbmZpZy5vbkRvd25sb2FkUHJvZ3Jlc3MpO1xuICAgIH1cblxuICAgIC8vIE5vdCBhbGwgYnJvd3NlcnMgc3VwcG9ydCB1cGxvYWQgZXZlbnRzXG4gICAgaWYgKHR5cGVvZiBjb25maWcub25VcGxvYWRQcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJyAmJiByZXF1ZXN0LnVwbG9hZCkge1xuICAgICAgcmVxdWVzdC51cGxvYWQuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBjb25maWcub25VcGxvYWRQcm9ncmVzcyk7XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy5jYW5jZWxUb2tlbikge1xuICAgICAgLy8gSGFuZGxlIGNhbmNlbGxhdGlvblxuICAgICAgY29uZmlnLmNhbmNlbFRva2VuLnByb21pc2UudGhlbihmdW5jdGlvbiBvbkNhbmNlbGVkKGNhbmNlbCkge1xuICAgICAgICBpZiAoIXJlcXVlc3QpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICByZXF1ZXN0LmFib3J0KCk7XG4gICAgICAgIHJlamVjdChjYW5jZWwpO1xuICAgICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHJlcXVlc3REYXRhID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJlcXVlc3REYXRhID0gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBTZW5kIHRoZSByZXF1ZXN0XG4gICAgcmVxdWVzdC5zZW5kKHJlcXVlc3REYXRhKTtcbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG52YXIgYmluZCA9IHJlcXVpcmUoJy4vaGVscGVycy9iaW5kJyk7XG52YXIgQXhpb3MgPSByZXF1aXJlKCcuL2NvcmUvQXhpb3MnKTtcbnZhciBkZWZhdWx0cyA9IHJlcXVpcmUoJy4vZGVmYXVsdHMnKTtcblxuLyoqXG4gKiBDcmVhdGUgYW4gaW5zdGFuY2Ugb2YgQXhpb3NcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZGVmYXVsdENvbmZpZyBUaGUgZGVmYXVsdCBjb25maWcgZm9yIHRoZSBpbnN0YW5jZVxuICogQHJldHVybiB7QXhpb3N9IEEgbmV3IGluc3RhbmNlIG9mIEF4aW9zXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUluc3RhbmNlKGRlZmF1bHRDb25maWcpIHtcbiAgdmFyIGNvbnRleHQgPSBuZXcgQXhpb3MoZGVmYXVsdENvbmZpZyk7XG4gIHZhciBpbnN0YW5jZSA9IGJpbmQoQXhpb3MucHJvdG90eXBlLnJlcXVlc3QsIGNvbnRleHQpO1xuXG4gIC8vIENvcHkgYXhpb3MucHJvdG90eXBlIHRvIGluc3RhbmNlXG4gIHV0aWxzLmV4dGVuZChpbnN0YW5jZSwgQXhpb3MucHJvdG90eXBlLCBjb250ZXh0KTtcblxuICAvLyBDb3B5IGNvbnRleHQgdG8gaW5zdGFuY2VcbiAgdXRpbHMuZXh0ZW5kKGluc3RhbmNlLCBjb250ZXh0KTtcblxuICByZXR1cm4gaW5zdGFuY2U7XG59XG5cbi8vIENyZWF0ZSB0aGUgZGVmYXVsdCBpbnN0YW5jZSB0byBiZSBleHBvcnRlZFxudmFyIGF4aW9zID0gY3JlYXRlSW5zdGFuY2UoZGVmYXVsdHMpO1xuXG4vLyBFeHBvc2UgQXhpb3MgY2xhc3MgdG8gYWxsb3cgY2xhc3MgaW5oZXJpdGFuY2VcbmF4aW9zLkF4aW9zID0gQXhpb3M7XG5cbi8vIEZhY3RvcnkgZm9yIGNyZWF0aW5nIG5ldyBpbnN0YW5jZXNcbmF4aW9zLmNyZWF0ZSA9IGZ1bmN0aW9uIGNyZWF0ZShpbnN0YW5jZUNvbmZpZykge1xuICByZXR1cm4gY3JlYXRlSW5zdGFuY2UodXRpbHMubWVyZ2UoZGVmYXVsdHMsIGluc3RhbmNlQ29uZmlnKSk7XG59O1xuXG4vLyBFeHBvc2UgQ2FuY2VsICYgQ2FuY2VsVG9rZW5cbmF4aW9zLkNhbmNlbCA9IHJlcXVpcmUoJy4vY2FuY2VsL0NhbmNlbCcpO1xuYXhpb3MuQ2FuY2VsVG9rZW4gPSByZXF1aXJlKCcuL2NhbmNlbC9DYW5jZWxUb2tlbicpO1xuYXhpb3MuaXNDYW5jZWwgPSByZXF1aXJlKCcuL2NhbmNlbC9pc0NhbmNlbCcpO1xuXG4vLyBFeHBvc2UgYWxsL3NwcmVhZFxuYXhpb3MuYWxsID0gZnVuY3Rpb24gYWxsKHByb21pc2VzKSB7XG4gIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG59O1xuYXhpb3Muc3ByZWFkID0gcmVxdWlyZSgnLi9oZWxwZXJzL3NwcmVhZCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGF4aW9zO1xuXG4vLyBBbGxvdyB1c2Ugb2YgZGVmYXVsdCBpbXBvcnQgc3ludGF4IGluIFR5cGVTY3JpcHRcbm1vZHVsZS5leHBvcnRzLmRlZmF1bHQgPSBheGlvcztcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBBIGBDYW5jZWxgIGlzIGFuIG9iamVjdCB0aGF0IGlzIHRocm93biB3aGVuIGFuIG9wZXJhdGlvbiBpcyBjYW5jZWxlZC5cbiAqXG4gKiBAY2xhc3NcbiAqIEBwYXJhbSB7c3RyaW5nPX0gbWVzc2FnZSBUaGUgbWVzc2FnZS5cbiAqL1xuZnVuY3Rpb24gQ2FuY2VsKG1lc3NhZ2UpIHtcbiAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbn1cblxuQ2FuY2VsLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICByZXR1cm4gJ0NhbmNlbCcgKyAodGhpcy5tZXNzYWdlID8gJzogJyArIHRoaXMubWVzc2FnZSA6ICcnKTtcbn07XG5cbkNhbmNlbC5wcm90b3R5cGUuX19DQU5DRUxfXyA9IHRydWU7XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FuY2VsO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQ2FuY2VsID0gcmVxdWlyZSgnLi9DYW5jZWwnKTtcblxuLyoqXG4gKiBBIGBDYW5jZWxUb2tlbmAgaXMgYW4gb2JqZWN0IHRoYXQgY2FuIGJlIHVzZWQgdG8gcmVxdWVzdCBjYW5jZWxsYXRpb24gb2YgYW4gb3BlcmF0aW9uLlxuICpcbiAqIEBjbGFzc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gZXhlY3V0b3IgVGhlIGV4ZWN1dG9yIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBDYW5jZWxUb2tlbihleGVjdXRvcikge1xuICBpZiAodHlwZW9mIGV4ZWN1dG9yICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZXhlY3V0b3IgbXVzdCBiZSBhIGZ1bmN0aW9uLicpO1xuICB9XG5cbiAgdmFyIHJlc29sdmVQcm9taXNlO1xuICB0aGlzLnByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiBwcm9taXNlRXhlY3V0b3IocmVzb2x2ZSkge1xuICAgIHJlc29sdmVQcm9taXNlID0gcmVzb2x2ZTtcbiAgfSk7XG5cbiAgdmFyIHRva2VuID0gdGhpcztcbiAgZXhlY3V0b3IoZnVuY3Rpb24gY2FuY2VsKG1lc3NhZ2UpIHtcbiAgICBpZiAodG9rZW4ucmVhc29uKSB7XG4gICAgICAvLyBDYW5jZWxsYXRpb24gaGFzIGFscmVhZHkgYmVlbiByZXF1ZXN0ZWRcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0b2tlbi5yZWFzb24gPSBuZXcgQ2FuY2VsKG1lc3NhZ2UpO1xuICAgIHJlc29sdmVQcm9taXNlKHRva2VuLnJlYXNvbik7XG4gIH0pO1xufVxuXG4vKipcbiAqIFRocm93cyBhIGBDYW5jZWxgIGlmIGNhbmNlbGxhdGlvbiBoYXMgYmVlbiByZXF1ZXN0ZWQuXG4gKi9cbkNhbmNlbFRva2VuLnByb3RvdHlwZS50aHJvd0lmUmVxdWVzdGVkID0gZnVuY3Rpb24gdGhyb3dJZlJlcXVlc3RlZCgpIHtcbiAgaWYgKHRoaXMucmVhc29uKSB7XG4gICAgdGhyb3cgdGhpcy5yZWFzb247XG4gIH1cbn07XG5cbi8qKlxuICogUmV0dXJucyBhbiBvYmplY3QgdGhhdCBjb250YWlucyBhIG5ldyBgQ2FuY2VsVG9rZW5gIGFuZCBhIGZ1bmN0aW9uIHRoYXQsIHdoZW4gY2FsbGVkLFxuICogY2FuY2VscyB0aGUgYENhbmNlbFRva2VuYC5cbiAqL1xuQ2FuY2VsVG9rZW4uc291cmNlID0gZnVuY3Rpb24gc291cmNlKCkge1xuICB2YXIgY2FuY2VsO1xuICB2YXIgdG9rZW4gPSBuZXcgQ2FuY2VsVG9rZW4oZnVuY3Rpb24gZXhlY3V0b3IoYykge1xuICAgIGNhbmNlbCA9IGM7XG4gIH0pO1xuICByZXR1cm4ge1xuICAgIHRva2VuOiB0b2tlbixcbiAgICBjYW5jZWw6IGNhbmNlbFxuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDYW5jZWxUb2tlbjtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0NhbmNlbCh2YWx1ZSkge1xuICByZXR1cm4gISEodmFsdWUgJiYgdmFsdWUuX19DQU5DRUxfXyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCcuLy4uL2RlZmF1bHRzJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG52YXIgSW50ZXJjZXB0b3JNYW5hZ2VyID0gcmVxdWlyZSgnLi9JbnRlcmNlcHRvck1hbmFnZXInKTtcbnZhciBkaXNwYXRjaFJlcXVlc3QgPSByZXF1aXJlKCcuL2Rpc3BhdGNoUmVxdWVzdCcpO1xuXG4vKipcbiAqIENyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBBeGlvc1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBpbnN0YW5jZUNvbmZpZyBUaGUgZGVmYXVsdCBjb25maWcgZm9yIHRoZSBpbnN0YW5jZVxuICovXG5mdW5jdGlvbiBBeGlvcyhpbnN0YW5jZUNvbmZpZykge1xuICB0aGlzLmRlZmF1bHRzID0gaW5zdGFuY2VDb25maWc7XG4gIHRoaXMuaW50ZXJjZXB0b3JzID0ge1xuICAgIHJlcXVlc3Q6IG5ldyBJbnRlcmNlcHRvck1hbmFnZXIoKSxcbiAgICByZXNwb25zZTogbmV3IEludGVyY2VwdG9yTWFuYWdlcigpXG4gIH07XG59XG5cbi8qKlxuICogRGlzcGF0Y2ggYSByZXF1ZXN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnIHNwZWNpZmljIGZvciB0aGlzIHJlcXVlc3QgKG1lcmdlZCB3aXRoIHRoaXMuZGVmYXVsdHMpXG4gKi9cbkF4aW9zLnByb3RvdHlwZS5yZXF1ZXN0ID0gZnVuY3Rpb24gcmVxdWVzdChjb25maWcpIHtcbiAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gIC8vIEFsbG93IGZvciBheGlvcygnZXhhbXBsZS91cmwnWywgY29uZmlnXSkgYSBsYSBmZXRjaCBBUElcbiAgaWYgKHR5cGVvZiBjb25maWcgPT09ICdzdHJpbmcnKSB7XG4gICAgY29uZmlnID0gdXRpbHMubWVyZ2Uoe1xuICAgICAgdXJsOiBhcmd1bWVudHNbMF1cbiAgICB9LCBhcmd1bWVudHNbMV0pO1xuICB9XG5cbiAgY29uZmlnID0gdXRpbHMubWVyZ2UoZGVmYXVsdHMsIHttZXRob2Q6ICdnZXQnfSwgdGhpcy5kZWZhdWx0cywgY29uZmlnKTtcbiAgY29uZmlnLm1ldGhvZCA9IGNvbmZpZy5tZXRob2QudG9Mb3dlckNhc2UoKTtcblxuICAvLyBIb29rIHVwIGludGVyY2VwdG9ycyBtaWRkbGV3YXJlXG4gIHZhciBjaGFpbiA9IFtkaXNwYXRjaFJlcXVlc3QsIHVuZGVmaW5lZF07XG4gIHZhciBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKGNvbmZpZyk7XG5cbiAgdGhpcy5pbnRlcmNlcHRvcnMucmVxdWVzdC5mb3JFYWNoKGZ1bmN0aW9uIHVuc2hpZnRSZXF1ZXN0SW50ZXJjZXB0b3JzKGludGVyY2VwdG9yKSB7XG4gICAgY2hhaW4udW5zaGlmdChpbnRlcmNlcHRvci5mdWxmaWxsZWQsIGludGVyY2VwdG9yLnJlamVjdGVkKTtcbiAgfSk7XG5cbiAgdGhpcy5pbnRlcmNlcHRvcnMucmVzcG9uc2UuZm9yRWFjaChmdW5jdGlvbiBwdXNoUmVzcG9uc2VJbnRlcmNlcHRvcnMoaW50ZXJjZXB0b3IpIHtcbiAgICBjaGFpbi5wdXNoKGludGVyY2VwdG9yLmZ1bGZpbGxlZCwgaW50ZXJjZXB0b3IucmVqZWN0ZWQpO1xuICB9KTtcblxuICB3aGlsZSAoY2hhaW4ubGVuZ3RoKSB7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbihjaGFpbi5zaGlmdCgpLCBjaGFpbi5zaGlmdCgpKTtcbiAgfVxuXG4gIHJldHVybiBwcm9taXNlO1xufTtcblxuLy8gUHJvdmlkZSBhbGlhc2VzIGZvciBzdXBwb3J0ZWQgcmVxdWVzdCBtZXRob2RzXG51dGlscy5mb3JFYWNoKFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJywgJ29wdGlvbnMnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZE5vRGF0YShtZXRob2QpIHtcbiAgLyplc2xpbnQgZnVuYy1uYW1lczowKi9cbiAgQXhpb3MucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbih1cmwsIGNvbmZpZykge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QodXRpbHMubWVyZ2UoY29uZmlnIHx8IHt9LCB7XG4gICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgIHVybDogdXJsXG4gICAgfSkpO1xuICB9O1xufSk7XG5cbnV0aWxzLmZvckVhY2goWydwb3N0JywgJ3B1dCcsICdwYXRjaCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kV2l0aERhdGEobWV0aG9kKSB7XG4gIC8qZXNsaW50IGZ1bmMtbmFtZXM6MCovXG4gIEF4aW9zLnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24odXJsLCBkYXRhLCBjb25maWcpIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KHV0aWxzLm1lcmdlKGNvbmZpZyB8fCB7fSwge1xuICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICB1cmw6IHVybCxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9KSk7XG4gIH07XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBBeGlvcztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG5mdW5jdGlvbiBJbnRlcmNlcHRvck1hbmFnZXIoKSB7XG4gIHRoaXMuaGFuZGxlcnMgPSBbXTtcbn1cblxuLyoqXG4gKiBBZGQgYSBuZXcgaW50ZXJjZXB0b3IgdG8gdGhlIHN0YWNrXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVsZmlsbGVkIFRoZSBmdW5jdGlvbiB0byBoYW5kbGUgYHRoZW5gIGZvciBhIGBQcm9taXNlYFxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVqZWN0ZWQgVGhlIGZ1bmN0aW9uIHRvIGhhbmRsZSBgcmVqZWN0YCBmb3IgYSBgUHJvbWlzZWBcbiAqXG4gKiBAcmV0dXJuIHtOdW1iZXJ9IEFuIElEIHVzZWQgdG8gcmVtb3ZlIGludGVyY2VwdG9yIGxhdGVyXG4gKi9cbkludGVyY2VwdG9yTWFuYWdlci5wcm90b3R5cGUudXNlID0gZnVuY3Rpb24gdXNlKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpIHtcbiAgdGhpcy5oYW5kbGVycy5wdXNoKHtcbiAgICBmdWxmaWxsZWQ6IGZ1bGZpbGxlZCxcbiAgICByZWplY3RlZDogcmVqZWN0ZWRcbiAgfSk7XG4gIHJldHVybiB0aGlzLmhhbmRsZXJzLmxlbmd0aCAtIDE7XG59O1xuXG4vKipcbiAqIFJlbW92ZSBhbiBpbnRlcmNlcHRvciBmcm9tIHRoZSBzdGFja1xuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBpZCBUaGUgSUQgdGhhdCB3YXMgcmV0dXJuZWQgYnkgYHVzZWBcbiAqL1xuSW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS5lamVjdCA9IGZ1bmN0aW9uIGVqZWN0KGlkKSB7XG4gIGlmICh0aGlzLmhhbmRsZXJzW2lkXSkge1xuICAgIHRoaXMuaGFuZGxlcnNbaWRdID0gbnVsbDtcbiAgfVxufTtcblxuLyoqXG4gKiBJdGVyYXRlIG92ZXIgYWxsIHRoZSByZWdpc3RlcmVkIGludGVyY2VwdG9yc1xuICpcbiAqIFRoaXMgbWV0aG9kIGlzIHBhcnRpY3VsYXJseSB1c2VmdWwgZm9yIHNraXBwaW5nIG92ZXIgYW55XG4gKiBpbnRlcmNlcHRvcnMgdGhhdCBtYXkgaGF2ZSBiZWNvbWUgYG51bGxgIGNhbGxpbmcgYGVqZWN0YC5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gY2FsbCBmb3IgZWFjaCBpbnRlcmNlcHRvclxuICovXG5JbnRlcmNlcHRvck1hbmFnZXIucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiBmb3JFYWNoKGZuKSB7XG4gIHV0aWxzLmZvckVhY2godGhpcy5oYW5kbGVycywgZnVuY3Rpb24gZm9yRWFjaEhhbmRsZXIoaCkge1xuICAgIGlmIChoICE9PSBudWxsKSB7XG4gICAgICBmbihoKTtcbiAgICB9XG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBJbnRlcmNlcHRvck1hbmFnZXI7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBlbmhhbmNlRXJyb3IgPSByZXF1aXJlKCcuL2VuaGFuY2VFcnJvcicpO1xuXG4vKipcbiAqIENyZWF0ZSBhbiBFcnJvciB3aXRoIHRoZSBzcGVjaWZpZWQgbWVzc2FnZSwgY29uZmlnLCBlcnJvciBjb2RlLCByZXF1ZXN0IGFuZCByZXNwb25zZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSBUaGUgZXJyb3IgbWVzc2FnZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbY29kZV0gVGhlIGVycm9yIGNvZGUgKGZvciBleGFtcGxlLCAnRUNPTk5BQk9SVEVEJykuXG4gKiBAcGFyYW0ge09iamVjdH0gW3JlcXVlc3RdIFRoZSByZXF1ZXN0LlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXNwb25zZV0gVGhlIHJlc3BvbnNlLlxuICogQHJldHVybnMge0Vycm9yfSBUaGUgY3JlYXRlZCBlcnJvci5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVFcnJvcihtZXNzYWdlLCBjb25maWcsIGNvZGUsIHJlcXVlc3QsIHJlc3BvbnNlKSB7XG4gIHZhciBlcnJvciA9IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgcmV0dXJuIGVuaGFuY2VFcnJvcihlcnJvciwgY29uZmlnLCBjb2RlLCByZXF1ZXN0LCByZXNwb25zZSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG52YXIgdHJhbnNmb3JtRGF0YSA9IHJlcXVpcmUoJy4vdHJhbnNmb3JtRGF0YScpO1xudmFyIGlzQ2FuY2VsID0gcmVxdWlyZSgnLi4vY2FuY2VsL2lzQ2FuY2VsJyk7XG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCcuLi9kZWZhdWx0cycpO1xudmFyIGlzQWJzb2x1dGVVUkwgPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvaXNBYnNvbHV0ZVVSTCcpO1xudmFyIGNvbWJpbmVVUkxzID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2NvbWJpbmVVUkxzJyk7XG5cbi8qKlxuICogVGhyb3dzIGEgYENhbmNlbGAgaWYgY2FuY2VsbGF0aW9uIGhhcyBiZWVuIHJlcXVlc3RlZC5cbiAqL1xuZnVuY3Rpb24gdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpIHtcbiAgaWYgKGNvbmZpZy5jYW5jZWxUb2tlbikge1xuICAgIGNvbmZpZy5jYW5jZWxUb2tlbi50aHJvd0lmUmVxdWVzdGVkKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBEaXNwYXRjaCBhIHJlcXVlc3QgdG8gdGhlIHNlcnZlciB1c2luZyB0aGUgY29uZmlndXJlZCBhZGFwdGVyLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZyB0aGF0IGlzIHRvIGJlIHVzZWQgZm9yIHRoZSByZXF1ZXN0XG4gKiBAcmV0dXJucyB7UHJvbWlzZX0gVGhlIFByb21pc2UgdG8gYmUgZnVsZmlsbGVkXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGlzcGF0Y2hSZXF1ZXN0KGNvbmZpZykge1xuICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG5cbiAgLy8gU3VwcG9ydCBiYXNlVVJMIGNvbmZpZ1xuICBpZiAoY29uZmlnLmJhc2VVUkwgJiYgIWlzQWJzb2x1dGVVUkwoY29uZmlnLnVybCkpIHtcbiAgICBjb25maWcudXJsID0gY29tYmluZVVSTHMoY29uZmlnLmJhc2VVUkwsIGNvbmZpZy51cmwpO1xuICB9XG5cbiAgLy8gRW5zdXJlIGhlYWRlcnMgZXhpc3RcbiAgY29uZmlnLmhlYWRlcnMgPSBjb25maWcuaGVhZGVycyB8fCB7fTtcblxuICAvLyBUcmFuc2Zvcm0gcmVxdWVzdCBkYXRhXG4gIGNvbmZpZy5kYXRhID0gdHJhbnNmb3JtRGF0YShcbiAgICBjb25maWcuZGF0YSxcbiAgICBjb25maWcuaGVhZGVycyxcbiAgICBjb25maWcudHJhbnNmb3JtUmVxdWVzdFxuICApO1xuXG4gIC8vIEZsYXR0ZW4gaGVhZGVyc1xuICBjb25maWcuaGVhZGVycyA9IHV0aWxzLm1lcmdlKFxuICAgIGNvbmZpZy5oZWFkZXJzLmNvbW1vbiB8fCB7fSxcbiAgICBjb25maWcuaGVhZGVyc1tjb25maWcubWV0aG9kXSB8fCB7fSxcbiAgICBjb25maWcuaGVhZGVycyB8fCB7fVxuICApO1xuXG4gIHV0aWxzLmZvckVhY2goXG4gICAgWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnLCAncG9zdCcsICdwdXQnLCAncGF0Y2gnLCAnY29tbW9uJ10sXG4gICAgZnVuY3Rpb24gY2xlYW5IZWFkZXJDb25maWcobWV0aG9kKSB7XG4gICAgICBkZWxldGUgY29uZmlnLmhlYWRlcnNbbWV0aG9kXTtcbiAgICB9XG4gICk7XG5cbiAgdmFyIGFkYXB0ZXIgPSBjb25maWcuYWRhcHRlciB8fCBkZWZhdWx0cy5hZGFwdGVyO1xuXG4gIHJldHVybiBhZGFwdGVyKGNvbmZpZykudGhlbihmdW5jdGlvbiBvbkFkYXB0ZXJSZXNvbHV0aW9uKHJlc3BvbnNlKSB7XG4gICAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXG4gICAgLy8gVHJhbnNmb3JtIHJlc3BvbnNlIGRhdGFcbiAgICByZXNwb25zZS5kYXRhID0gdHJhbnNmb3JtRGF0YShcbiAgICAgIHJlc3BvbnNlLmRhdGEsXG4gICAgICByZXNwb25zZS5oZWFkZXJzLFxuICAgICAgY29uZmlnLnRyYW5zZm9ybVJlc3BvbnNlXG4gICAgKTtcblxuICAgIHJldHVybiByZXNwb25zZTtcbiAgfSwgZnVuY3Rpb24gb25BZGFwdGVyUmVqZWN0aW9uKHJlYXNvbikge1xuICAgIGlmICghaXNDYW5jZWwocmVhc29uKSkge1xuICAgICAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXG4gICAgICAvLyBUcmFuc2Zvcm0gcmVzcG9uc2UgZGF0YVxuICAgICAgaWYgKHJlYXNvbiAmJiByZWFzb24ucmVzcG9uc2UpIHtcbiAgICAgICAgcmVhc29uLnJlc3BvbnNlLmRhdGEgPSB0cmFuc2Zvcm1EYXRhKFxuICAgICAgICAgIHJlYXNvbi5yZXNwb25zZS5kYXRhLFxuICAgICAgICAgIHJlYXNvbi5yZXNwb25zZS5oZWFkZXJzLFxuICAgICAgICAgIGNvbmZpZy50cmFuc2Zvcm1SZXNwb25zZVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZWFzb24pO1xuICB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogVXBkYXRlIGFuIEVycm9yIHdpdGggdGhlIHNwZWNpZmllZCBjb25maWcsIGVycm9yIGNvZGUsIGFuZCByZXNwb25zZS5cbiAqXG4gKiBAcGFyYW0ge0Vycm9yfSBlcnJvciBUaGUgZXJyb3IgdG8gdXBkYXRlLlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnLlxuICogQHBhcmFtIHtzdHJpbmd9IFtjb2RlXSBUaGUgZXJyb3IgY29kZSAoZm9yIGV4YW1wbGUsICdFQ09OTkFCT1JURUQnKS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbcmVxdWVzdF0gVGhlIHJlcXVlc3QuXG4gKiBAcGFyYW0ge09iamVjdH0gW3Jlc3BvbnNlXSBUaGUgcmVzcG9uc2UuXG4gKiBAcmV0dXJucyB7RXJyb3J9IFRoZSBlcnJvci5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBlbmhhbmNlRXJyb3IoZXJyb3IsIGNvbmZpZywgY29kZSwgcmVxdWVzdCwgcmVzcG9uc2UpIHtcbiAgZXJyb3IuY29uZmlnID0gY29uZmlnO1xuICBpZiAoY29kZSkge1xuICAgIGVycm9yLmNvZGUgPSBjb2RlO1xuICB9XG4gIGVycm9yLnJlcXVlc3QgPSByZXF1ZXN0O1xuICBlcnJvci5yZXNwb25zZSA9IHJlc3BvbnNlO1xuICByZXR1cm4gZXJyb3I7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY3JlYXRlRXJyb3IgPSByZXF1aXJlKCcuL2NyZWF0ZUVycm9yJyk7XG5cbi8qKlxuICogUmVzb2x2ZSBvciByZWplY3QgYSBQcm9taXNlIGJhc2VkIG9uIHJlc3BvbnNlIHN0YXR1cy5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZXNvbHZlIEEgZnVuY3Rpb24gdGhhdCByZXNvbHZlcyB0aGUgcHJvbWlzZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlamVjdCBBIGZ1bmN0aW9uIHRoYXQgcmVqZWN0cyB0aGUgcHJvbWlzZS5cbiAqIEBwYXJhbSB7b2JqZWN0fSByZXNwb25zZSBUaGUgcmVzcG9uc2UuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgcmVzcG9uc2UpIHtcbiAgdmFyIHZhbGlkYXRlU3RhdHVzID0gcmVzcG9uc2UuY29uZmlnLnZhbGlkYXRlU3RhdHVzO1xuICAvLyBOb3RlOiBzdGF0dXMgaXMgbm90IGV4cG9zZWQgYnkgWERvbWFpblJlcXVlc3RcbiAgaWYgKCFyZXNwb25zZS5zdGF0dXMgfHwgIXZhbGlkYXRlU3RhdHVzIHx8IHZhbGlkYXRlU3RhdHVzKHJlc3BvbnNlLnN0YXR1cykpIHtcbiAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgfSBlbHNlIHtcbiAgICByZWplY3QoY3JlYXRlRXJyb3IoXG4gICAgICAnUmVxdWVzdCBmYWlsZWQgd2l0aCBzdGF0dXMgY29kZSAnICsgcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgcmVzcG9uc2UuY29uZmlnLFxuICAgICAgbnVsbCxcbiAgICAgIHJlc3BvbnNlLnJlcXVlc3QsXG4gICAgICByZXNwb25zZVxuICAgICkpO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbi8qKlxuICogVHJhbnNmb3JtIHRoZSBkYXRhIGZvciBhIHJlcXVlc3Qgb3IgYSByZXNwb25zZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fFN0cmluZ30gZGF0YSBUaGUgZGF0YSB0byBiZSB0cmFuc2Zvcm1lZFxuICogQHBhcmFtIHtBcnJheX0gaGVhZGVycyBUaGUgaGVhZGVycyBmb3IgdGhlIHJlcXVlc3Qgb3IgcmVzcG9uc2VcbiAqIEBwYXJhbSB7QXJyYXl8RnVuY3Rpb259IGZucyBBIHNpbmdsZSBmdW5jdGlvbiBvciBBcnJheSBvZiBmdW5jdGlvbnNcbiAqIEByZXR1cm5zIHsqfSBUaGUgcmVzdWx0aW5nIHRyYW5zZm9ybWVkIGRhdGFcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0cmFuc2Zvcm1EYXRhKGRhdGEsIGhlYWRlcnMsIGZucykge1xuICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgdXRpbHMuZm9yRWFjaChmbnMsIGZ1bmN0aW9uIHRyYW5zZm9ybShmbikge1xuICAgIGRhdGEgPSBmbihkYXRhLCBoZWFkZXJzKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGRhdGE7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG52YXIgbm9ybWFsaXplSGVhZGVyTmFtZSA9IHJlcXVpcmUoJy4vaGVscGVycy9ub3JtYWxpemVIZWFkZXJOYW1lJyk7XG5cbnZhciBERUZBVUxUX0NPTlRFTlRfVFlQRSA9IHtcbiAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG59O1xuXG5mdW5jdGlvbiBzZXRDb250ZW50VHlwZUlmVW5zZXQoaGVhZGVycywgdmFsdWUpIHtcbiAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChoZWFkZXJzKSAmJiB1dGlscy5pc1VuZGVmaW5lZChoZWFkZXJzWydDb250ZW50LVR5cGUnXSkpIHtcbiAgICBoZWFkZXJzWydDb250ZW50LVR5cGUnXSA9IHZhbHVlO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldERlZmF1bHRBZGFwdGVyKCkge1xuICB2YXIgYWRhcHRlcjtcbiAgaWYgKHR5cGVvZiBYTUxIdHRwUmVxdWVzdCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAvLyBGb3IgYnJvd3NlcnMgdXNlIFhIUiBhZGFwdGVyXG4gICAgYWRhcHRlciA9IHJlcXVpcmUoJy4vYWRhcHRlcnMveGhyJyk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgLy8gRm9yIG5vZGUgdXNlIEhUVFAgYWRhcHRlclxuICAgIGFkYXB0ZXIgPSByZXF1aXJlKCcuL2FkYXB0ZXJzL2h0dHAnKTtcbiAgfVxuICByZXR1cm4gYWRhcHRlcjtcbn1cblxudmFyIGRlZmF1bHRzID0ge1xuICBhZGFwdGVyOiBnZXREZWZhdWx0QWRhcHRlcigpLFxuXG4gIHRyYW5zZm9ybVJlcXVlc3Q6IFtmdW5jdGlvbiB0cmFuc2Zvcm1SZXF1ZXN0KGRhdGEsIGhlYWRlcnMpIHtcbiAgICBub3JtYWxpemVIZWFkZXJOYW1lKGhlYWRlcnMsICdDb250ZW50LVR5cGUnKTtcbiAgICBpZiAodXRpbHMuaXNGb3JtRGF0YShkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNBcnJheUJ1ZmZlcihkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNCdWZmZXIoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzU3RyZWFtKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0ZpbGUoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzQmxvYihkYXRhKVxuICAgICkge1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuICAgIGlmICh1dGlscy5pc0FycmF5QnVmZmVyVmlldyhkYXRhKSkge1xuICAgICAgcmV0dXJuIGRhdGEuYnVmZmVyO1xuICAgIH1cbiAgICBpZiAodXRpbHMuaXNVUkxTZWFyY2hQYXJhbXMoZGF0YSkpIHtcbiAgICAgIHNldENvbnRlbnRUeXBlSWZVbnNldChoZWFkZXJzLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkO2NoYXJzZXQ9dXRmLTgnKTtcbiAgICAgIHJldHVybiBkYXRhLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIGlmICh1dGlscy5pc09iamVjdChkYXRhKSkge1xuICAgICAgc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsICdhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTgnKTtcbiAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShkYXRhKTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1dLFxuXG4gIHRyYW5zZm9ybVJlc3BvbnNlOiBbZnVuY3Rpb24gdHJhbnNmb3JtUmVzcG9uc2UoZGF0YSkge1xuICAgIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgfSBjYXRjaCAoZSkgeyAvKiBJZ25vcmUgKi8gfVxuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbiAgfV0sXG5cbiAgLyoqXG4gICAqIEEgdGltZW91dCBpbiBtaWxsaXNlY29uZHMgdG8gYWJvcnQgYSByZXF1ZXN0LiBJZiBzZXQgdG8gMCAoZGVmYXVsdCkgYVxuICAgKiB0aW1lb3V0IGlzIG5vdCBjcmVhdGVkLlxuICAgKi9cbiAgdGltZW91dDogMCxcblxuICB4c3JmQ29va2llTmFtZTogJ1hTUkYtVE9LRU4nLFxuICB4c3JmSGVhZGVyTmFtZTogJ1gtWFNSRi1UT0tFTicsXG5cbiAgbWF4Q29udGVudExlbmd0aDogLTEsXG5cbiAgdmFsaWRhdGVTdGF0dXM6IGZ1bmN0aW9uIHZhbGlkYXRlU3RhdHVzKHN0YXR1cykge1xuICAgIHJldHVybiBzdGF0dXMgPj0gMjAwICYmIHN0YXR1cyA8IDMwMDtcbiAgfVxufTtcblxuZGVmYXVsdHMuaGVhZGVycyA9IHtcbiAgY29tbW9uOiB7XG4gICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uLCB0ZXh0L3BsYWluLCAqLyonXG4gIH1cbn07XG5cbnV0aWxzLmZvckVhY2goWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZE5vRGF0YShtZXRob2QpIHtcbiAgZGVmYXVsdHMuaGVhZGVyc1ttZXRob2RdID0ge307XG59KTtcblxudXRpbHMuZm9yRWFjaChbJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2RXaXRoRGF0YShtZXRob2QpIHtcbiAgZGVmYXVsdHMuaGVhZGVyc1ttZXRob2RdID0gdXRpbHMubWVyZ2UoREVGQVVMVF9DT05URU5UX1RZUEUpO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZGVmYXVsdHM7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmluZChmbiwgdGhpc0FyZykge1xuICByZXR1cm4gZnVuY3Rpb24gd3JhcCgpIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaV07XG4gICAgfVxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIGJ0b2EgcG9seWZpbGwgZm9yIElFPDEwIGNvdXJ0ZXN5IGh0dHBzOi8vZ2l0aHViLmNvbS9kYXZpZGNoYW1iZXJzL0Jhc2U2NC5qc1xuXG52YXIgY2hhcnMgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLz0nO1xuXG5mdW5jdGlvbiBFKCkge1xuICB0aGlzLm1lc3NhZ2UgPSAnU3RyaW5nIGNvbnRhaW5zIGFuIGludmFsaWQgY2hhcmFjdGVyJztcbn1cbkUucHJvdG90eXBlID0gbmV3IEVycm9yO1xuRS5wcm90b3R5cGUuY29kZSA9IDU7XG5FLnByb3RvdHlwZS5uYW1lID0gJ0ludmFsaWRDaGFyYWN0ZXJFcnJvcic7XG5cbmZ1bmN0aW9uIGJ0b2EoaW5wdXQpIHtcbiAgdmFyIHN0ciA9IFN0cmluZyhpbnB1dCk7XG4gIHZhciBvdXRwdXQgPSAnJztcbiAgZm9yIChcbiAgICAvLyBpbml0aWFsaXplIHJlc3VsdCBhbmQgY291bnRlclxuICAgIHZhciBibG9jaywgY2hhckNvZGUsIGlkeCA9IDAsIG1hcCA9IGNoYXJzO1xuICAgIC8vIGlmIHRoZSBuZXh0IHN0ciBpbmRleCBkb2VzIG5vdCBleGlzdDpcbiAgICAvLyAgIGNoYW5nZSB0aGUgbWFwcGluZyB0YWJsZSB0byBcIj1cIlxuICAgIC8vICAgY2hlY2sgaWYgZCBoYXMgbm8gZnJhY3Rpb25hbCBkaWdpdHNcbiAgICBzdHIuY2hhckF0KGlkeCB8IDApIHx8IChtYXAgPSAnPScsIGlkeCAlIDEpO1xuICAgIC8vIFwiOCAtIGlkeCAlIDEgKiA4XCIgZ2VuZXJhdGVzIHRoZSBzZXF1ZW5jZSAyLCA0LCA2LCA4XG4gICAgb3V0cHV0ICs9IG1hcC5jaGFyQXQoNjMgJiBibG9jayA+PiA4IC0gaWR4ICUgMSAqIDgpXG4gICkge1xuICAgIGNoYXJDb2RlID0gc3RyLmNoYXJDb2RlQXQoaWR4ICs9IDMgLyA0KTtcbiAgICBpZiAoY2hhckNvZGUgPiAweEZGKSB7XG4gICAgICB0aHJvdyBuZXcgRSgpO1xuICAgIH1cbiAgICBibG9jayA9IGJsb2NrIDw8IDggfCBjaGFyQ29kZTtcbiAgfVxuICByZXR1cm4gb3V0cHV0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJ0b2E7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxuZnVuY3Rpb24gZW5jb2RlKHZhbCkge1xuICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHZhbCkuXG4gICAgcmVwbGFjZSgvJTQwL2dpLCAnQCcpLlxuICAgIHJlcGxhY2UoLyUzQS9naSwgJzonKS5cbiAgICByZXBsYWNlKC8lMjQvZywgJyQnKS5cbiAgICByZXBsYWNlKC8lMkMvZ2ksICcsJykuXG4gICAgcmVwbGFjZSgvJTIwL2csICcrJykuXG4gICAgcmVwbGFjZSgvJTVCL2dpLCAnWycpLlxuICAgIHJlcGxhY2UoLyU1RC9naSwgJ10nKTtcbn1cblxuLyoqXG4gKiBCdWlsZCBhIFVSTCBieSBhcHBlbmRpbmcgcGFyYW1zIHRvIHRoZSBlbmRcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIFRoZSBiYXNlIG9mIHRoZSB1cmwgKGUuZy4sIGh0dHA6Ly93d3cuZ29vZ2xlLmNvbSlcbiAqIEBwYXJhbSB7b2JqZWN0fSBbcGFyYW1zXSBUaGUgcGFyYW1zIHRvIGJlIGFwcGVuZGVkXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgZm9ybWF0dGVkIHVybFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJ1aWxkVVJMKHVybCwgcGFyYW1zLCBwYXJhbXNTZXJpYWxpemVyKSB7XG4gIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICBpZiAoIXBhcmFtcykge1xuICAgIHJldHVybiB1cmw7XG4gIH1cblxuICB2YXIgc2VyaWFsaXplZFBhcmFtcztcbiAgaWYgKHBhcmFtc1NlcmlhbGl6ZXIpIHtcbiAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFyYW1zU2VyaWFsaXplcihwYXJhbXMpO1xuICB9IGVsc2UgaWYgKHV0aWxzLmlzVVJMU2VhcmNoUGFyYW1zKHBhcmFtcykpIHtcbiAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFyYW1zLnRvU3RyaW5nKCk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIHBhcnRzID0gW107XG5cbiAgICB1dGlscy5mb3JFYWNoKHBhcmFtcywgZnVuY3Rpb24gc2VyaWFsaXplKHZhbCwga2V5KSB7XG4gICAgICBpZiAodmFsID09PSBudWxsIHx8IHR5cGVvZiB2YWwgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHV0aWxzLmlzQXJyYXkodmFsKSkge1xuICAgICAgICBrZXkgPSBrZXkgKyAnW10nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsID0gW3ZhbF07XG4gICAgICB9XG5cbiAgICAgIHV0aWxzLmZvckVhY2godmFsLCBmdW5jdGlvbiBwYXJzZVZhbHVlKHYpIHtcbiAgICAgICAgaWYgKHV0aWxzLmlzRGF0ZSh2KSkge1xuICAgICAgICAgIHYgPSB2LnRvSVNPU3RyaW5nKCk7XG4gICAgICAgIH0gZWxzZSBpZiAodXRpbHMuaXNPYmplY3QodikpIHtcbiAgICAgICAgICB2ID0gSlNPTi5zdHJpbmdpZnkodik7XG4gICAgICAgIH1cbiAgICAgICAgcGFydHMucHVzaChlbmNvZGUoa2V5KSArICc9JyArIGVuY29kZSh2KSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSBwYXJ0cy5qb2luKCcmJyk7XG4gIH1cblxuICBpZiAoc2VyaWFsaXplZFBhcmFtcykge1xuICAgIHVybCArPSAodXJsLmluZGV4T2YoJz8nKSA9PT0gLTEgPyAnPycgOiAnJicpICsgc2VyaWFsaXplZFBhcmFtcztcbiAgfVxuXG4gIHJldHVybiB1cmw7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgVVJMIGJ5IGNvbWJpbmluZyB0aGUgc3BlY2lmaWVkIFVSTHNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gYmFzZVVSTCBUaGUgYmFzZSBVUkxcbiAqIEBwYXJhbSB7c3RyaW5nfSByZWxhdGl2ZVVSTCBUaGUgcmVsYXRpdmUgVVJMXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgY29tYmluZWQgVVJMXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY29tYmluZVVSTHMoYmFzZVVSTCwgcmVsYXRpdmVVUkwpIHtcbiAgcmV0dXJuIHJlbGF0aXZlVVJMXG4gICAgPyBiYXNlVVJMLnJlcGxhY2UoL1xcLyskLywgJycpICsgJy8nICsgcmVsYXRpdmVVUkwucmVwbGFjZSgvXlxcLysvLCAnJylcbiAgICA6IGJhc2VVUkw7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKFxuICB1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpID9cblxuICAvLyBTdGFuZGFyZCBicm93c2VyIGVudnMgc3VwcG9ydCBkb2N1bWVudC5jb29raWVcbiAgKGZ1bmN0aW9uIHN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgd3JpdGU6IGZ1bmN0aW9uIHdyaXRlKG5hbWUsIHZhbHVlLCBleHBpcmVzLCBwYXRoLCBkb21haW4sIHNlY3VyZSkge1xuICAgICAgICB2YXIgY29va2llID0gW107XG4gICAgICAgIGNvb2tpZS5wdXNoKG5hbWUgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpKTtcblxuICAgICAgICBpZiAodXRpbHMuaXNOdW1iZXIoZXhwaXJlcykpIHtcbiAgICAgICAgICBjb29raWUucHVzaCgnZXhwaXJlcz0nICsgbmV3IERhdGUoZXhwaXJlcykudG9HTVRTdHJpbmcoKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodXRpbHMuaXNTdHJpbmcocGF0aCkpIHtcbiAgICAgICAgICBjb29raWUucHVzaCgncGF0aD0nICsgcGF0aCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodXRpbHMuaXNTdHJpbmcoZG9tYWluKSkge1xuICAgICAgICAgIGNvb2tpZS5wdXNoKCdkb21haW49JyArIGRvbWFpbik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2VjdXJlID09PSB0cnVlKSB7XG4gICAgICAgICAgY29va2llLnB1c2goJ3NlY3VyZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgZG9jdW1lbnQuY29va2llID0gY29va2llLmpvaW4oJzsgJyk7XG4gICAgICB9LFxuXG4gICAgICByZWFkOiBmdW5jdGlvbiByZWFkKG5hbWUpIHtcbiAgICAgICAgdmFyIG1hdGNoID0gZG9jdW1lbnQuY29va2llLm1hdGNoKG5ldyBSZWdFeHAoJyhefDtcXFxccyopKCcgKyBuYW1lICsgJyk9KFteO10qKScpKTtcbiAgICAgICAgcmV0dXJuIChtYXRjaCA/IGRlY29kZVVSSUNvbXBvbmVudChtYXRjaFszXSkgOiBudWxsKTtcbiAgICAgIH0sXG5cbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKG5hbWUpIHtcbiAgICAgICAgdGhpcy53cml0ZShuYW1lLCAnJywgRGF0ZS5ub3coKSAtIDg2NDAwMDAwKTtcbiAgICAgIH1cbiAgICB9O1xuICB9KSgpIDpcblxuICAvLyBOb24gc3RhbmRhcmQgYnJvd3NlciBlbnYgKHdlYiB3b3JrZXJzLCByZWFjdC1uYXRpdmUpIGxhY2sgbmVlZGVkIHN1cHBvcnQuXG4gIChmdW5jdGlvbiBub25TdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHdyaXRlOiBmdW5jdGlvbiB3cml0ZSgpIHt9LFxuICAgICAgcmVhZDogZnVuY3Rpb24gcmVhZCgpIHsgcmV0dXJuIG51bGw7IH0sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfSkoKVxuKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHNwZWNpZmllZCBVUkwgaXMgYWJzb2x1dGVcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIFRoZSBVUkwgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHNwZWNpZmllZCBVUkwgaXMgYWJzb2x1dGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQWJzb2x1dGVVUkwodXJsKSB7XG4gIC8vIEEgVVJMIGlzIGNvbnNpZGVyZWQgYWJzb2x1dGUgaWYgaXQgYmVnaW5zIHdpdGggXCI8c2NoZW1lPjovL1wiIG9yIFwiLy9cIiAocHJvdG9jb2wtcmVsYXRpdmUgVVJMKS5cbiAgLy8gUkZDIDM5ODYgZGVmaW5lcyBzY2hlbWUgbmFtZSBhcyBhIHNlcXVlbmNlIG9mIGNoYXJhY3RlcnMgYmVnaW5uaW5nIHdpdGggYSBsZXR0ZXIgYW5kIGZvbGxvd2VkXG4gIC8vIGJ5IGFueSBjb21iaW5hdGlvbiBvZiBsZXR0ZXJzLCBkaWdpdHMsIHBsdXMsIHBlcmlvZCwgb3IgaHlwaGVuLlxuICByZXR1cm4gL14oW2Etel1bYS16XFxkXFwrXFwtXFwuXSo6KT9cXC9cXC8vaS50ZXN0KHVybCk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKFxuICB1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpID9cblxuICAvLyBTdGFuZGFyZCBicm93c2VyIGVudnMgaGF2ZSBmdWxsIHN1cHBvcnQgb2YgdGhlIEFQSXMgbmVlZGVkIHRvIHRlc3RcbiAgLy8gd2hldGhlciB0aGUgcmVxdWVzdCBVUkwgaXMgb2YgdGhlIHNhbWUgb3JpZ2luIGFzIGN1cnJlbnQgbG9jYXRpb24uXG4gIChmdW5jdGlvbiBzdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgdmFyIG1zaWUgPSAvKG1zaWV8dHJpZGVudCkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuICAgIHZhciB1cmxQYXJzaW5nTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICB2YXIgb3JpZ2luVVJMO1xuXG4gICAgLyoqXG4gICAgKiBQYXJzZSBhIFVSTCB0byBkaXNjb3ZlciBpdCdzIGNvbXBvbmVudHNcbiAgICAqXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsIFRoZSBVUkwgdG8gYmUgcGFyc2VkXG4gICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuICAgICovXG4gICAgZnVuY3Rpb24gcmVzb2x2ZVVSTCh1cmwpIHtcbiAgICAgIHZhciBocmVmID0gdXJsO1xuXG4gICAgICBpZiAobXNpZSkge1xuICAgICAgICAvLyBJRSBuZWVkcyBhdHRyaWJ1dGUgc2V0IHR3aWNlIHRvIG5vcm1hbGl6ZSBwcm9wZXJ0aWVzXG4gICAgICAgIHVybFBhcnNpbmdOb2RlLnNldEF0dHJpYnV0ZSgnaHJlZicsIGhyZWYpO1xuICAgICAgICBocmVmID0gdXJsUGFyc2luZ05vZGUuaHJlZjtcbiAgICAgIH1cblxuICAgICAgdXJsUGFyc2luZ05vZGUuc2V0QXR0cmlidXRlKCdocmVmJywgaHJlZik7XG5cbiAgICAgIC8vIHVybFBhcnNpbmdOb2RlIHByb3ZpZGVzIHRoZSBVcmxVdGlscyBpbnRlcmZhY2UgLSBodHRwOi8vdXJsLnNwZWMud2hhdHdnLm9yZy8jdXJsdXRpbHNcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGhyZWY6IHVybFBhcnNpbmdOb2RlLmhyZWYsXG4gICAgICAgIHByb3RvY29sOiB1cmxQYXJzaW5nTm9kZS5wcm90b2NvbCA/IHVybFBhcnNpbmdOb2RlLnByb3RvY29sLnJlcGxhY2UoLzokLywgJycpIDogJycsXG4gICAgICAgIGhvc3Q6IHVybFBhcnNpbmdOb2RlLmhvc3QsXG4gICAgICAgIHNlYXJjaDogdXJsUGFyc2luZ05vZGUuc2VhcmNoID8gdXJsUGFyc2luZ05vZGUuc2VhcmNoLnJlcGxhY2UoL15cXD8vLCAnJykgOiAnJyxcbiAgICAgICAgaGFzaDogdXJsUGFyc2luZ05vZGUuaGFzaCA/IHVybFBhcnNpbmdOb2RlLmhhc2gucmVwbGFjZSgvXiMvLCAnJykgOiAnJyxcbiAgICAgICAgaG9zdG5hbWU6IHVybFBhcnNpbmdOb2RlLmhvc3RuYW1lLFxuICAgICAgICBwb3J0OiB1cmxQYXJzaW5nTm9kZS5wb3J0LFxuICAgICAgICBwYXRobmFtZTogKHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lLmNoYXJBdCgwKSA9PT0gJy8nKSA/XG4gICAgICAgICAgICAgICAgICB1cmxQYXJzaW5nTm9kZS5wYXRobmFtZSA6XG4gICAgICAgICAgICAgICAgICAnLycgKyB1cmxQYXJzaW5nTm9kZS5wYXRobmFtZVxuICAgICAgfTtcbiAgICB9XG5cbiAgICBvcmlnaW5VUkwgPSByZXNvbHZlVVJMKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcblxuICAgIC8qKlxuICAgICogRGV0ZXJtaW5lIGlmIGEgVVJMIHNoYXJlcyB0aGUgc2FtZSBvcmlnaW4gYXMgdGhlIGN1cnJlbnQgbG9jYXRpb25cbiAgICAqXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gcmVxdWVzdFVSTCBUaGUgVVJMIHRvIHRlc3RcbiAgICAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIFVSTCBzaGFyZXMgdGhlIHNhbWUgb3JpZ2luLCBvdGhlcndpc2UgZmFsc2VcbiAgICAqL1xuICAgIHJldHVybiBmdW5jdGlvbiBpc1VSTFNhbWVPcmlnaW4ocmVxdWVzdFVSTCkge1xuICAgICAgdmFyIHBhcnNlZCA9ICh1dGlscy5pc1N0cmluZyhyZXF1ZXN0VVJMKSkgPyByZXNvbHZlVVJMKHJlcXVlc3RVUkwpIDogcmVxdWVzdFVSTDtcbiAgICAgIHJldHVybiAocGFyc2VkLnByb3RvY29sID09PSBvcmlnaW5VUkwucHJvdG9jb2wgJiZcbiAgICAgICAgICAgIHBhcnNlZC5ob3N0ID09PSBvcmlnaW5VUkwuaG9zdCk7XG4gICAgfTtcbiAgfSkoKSA6XG5cbiAgLy8gTm9uIHN0YW5kYXJkIGJyb3dzZXIgZW52cyAod2ViIHdvcmtlcnMsIHJlYWN0LW5hdGl2ZSkgbGFjayBuZWVkZWQgc3VwcG9ydC5cbiAgKGZ1bmN0aW9uIG5vblN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gaXNVUkxTYW1lT3JpZ2luKCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcbiAgfSkoKVxuKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBub3JtYWxpemVIZWFkZXJOYW1lKGhlYWRlcnMsIG5vcm1hbGl6ZWROYW1lKSB7XG4gIHV0aWxzLmZvckVhY2goaGVhZGVycywgZnVuY3Rpb24gcHJvY2Vzc0hlYWRlcih2YWx1ZSwgbmFtZSkge1xuICAgIGlmIChuYW1lICE9PSBub3JtYWxpemVkTmFtZSAmJiBuYW1lLnRvVXBwZXJDYXNlKCkgPT09IG5vcm1hbGl6ZWROYW1lLnRvVXBwZXJDYXNlKCkpIHtcbiAgICAgIGhlYWRlcnNbbm9ybWFsaXplZE5hbWVdID0gdmFsdWU7XG4gICAgICBkZWxldGUgaGVhZGVyc1tuYW1lXTtcbiAgICB9XG4gIH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG4vLyBIZWFkZXJzIHdob3NlIGR1cGxpY2F0ZXMgYXJlIGlnbm9yZWQgYnkgbm9kZVxuLy8gYy5mLiBodHRwczovL25vZGVqcy5vcmcvYXBpL2h0dHAuaHRtbCNodHRwX21lc3NhZ2VfaGVhZGVyc1xudmFyIGlnbm9yZUR1cGxpY2F0ZU9mID0gW1xuICAnYWdlJywgJ2F1dGhvcml6YXRpb24nLCAnY29udGVudC1sZW5ndGgnLCAnY29udGVudC10eXBlJywgJ2V0YWcnLFxuICAnZXhwaXJlcycsICdmcm9tJywgJ2hvc3QnLCAnaWYtbW9kaWZpZWQtc2luY2UnLCAnaWYtdW5tb2RpZmllZC1zaW5jZScsXG4gICdsYXN0LW1vZGlmaWVkJywgJ2xvY2F0aW9uJywgJ21heC1mb3J3YXJkcycsICdwcm94eS1hdXRob3JpemF0aW9uJyxcbiAgJ3JlZmVyZXInLCAncmV0cnktYWZ0ZXInLCAndXNlci1hZ2VudCdcbl07XG5cbi8qKlxuICogUGFyc2UgaGVhZGVycyBpbnRvIGFuIG9iamVjdFxuICpcbiAqIGBgYFxuICogRGF0ZTogV2VkLCAyNyBBdWcgMjAxNCAwODo1ODo0OSBHTVRcbiAqIENvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvblxuICogQ29ubmVjdGlvbjoga2VlcC1hbGl2ZVxuICogVHJhbnNmZXItRW5jb2Rpbmc6IGNodW5rZWRcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBoZWFkZXJzIEhlYWRlcnMgbmVlZGluZyB0byBiZSBwYXJzZWRcbiAqIEByZXR1cm5zIHtPYmplY3R9IEhlYWRlcnMgcGFyc2VkIGludG8gYW4gb2JqZWN0XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcGFyc2VIZWFkZXJzKGhlYWRlcnMpIHtcbiAgdmFyIHBhcnNlZCA9IHt9O1xuICB2YXIga2V5O1xuICB2YXIgdmFsO1xuICB2YXIgaTtcblxuICBpZiAoIWhlYWRlcnMpIHsgcmV0dXJuIHBhcnNlZDsgfVxuXG4gIHV0aWxzLmZvckVhY2goaGVhZGVycy5zcGxpdCgnXFxuJyksIGZ1bmN0aW9uIHBhcnNlcihsaW5lKSB7XG4gICAgaSA9IGxpbmUuaW5kZXhPZignOicpO1xuICAgIGtleSA9IHV0aWxzLnRyaW0obGluZS5zdWJzdHIoMCwgaSkpLnRvTG93ZXJDYXNlKCk7XG4gICAgdmFsID0gdXRpbHMudHJpbShsaW5lLnN1YnN0cihpICsgMSkpO1xuXG4gICAgaWYgKGtleSkge1xuICAgICAgaWYgKHBhcnNlZFtrZXldICYmIGlnbm9yZUR1cGxpY2F0ZU9mLmluZGV4T2Yoa2V5KSA+PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChrZXkgPT09ICdzZXQtY29va2llJykge1xuICAgICAgICBwYXJzZWRba2V5XSA9IChwYXJzZWRba2V5XSA/IHBhcnNlZFtrZXldIDogW10pLmNvbmNhdChbdmFsXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJzZWRba2V5XSA9IHBhcnNlZFtrZXldID8gcGFyc2VkW2tleV0gKyAnLCAnICsgdmFsIDogdmFsO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHBhcnNlZDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogU3ludGFjdGljIHN1Z2FyIGZvciBpbnZva2luZyBhIGZ1bmN0aW9uIGFuZCBleHBhbmRpbmcgYW4gYXJyYXkgZm9yIGFyZ3VtZW50cy5cbiAqXG4gKiBDb21tb24gdXNlIGNhc2Ugd291bGQgYmUgdG8gdXNlIGBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHlgLlxuICpcbiAqICBgYGBqc1xuICogIGZ1bmN0aW9uIGYoeCwgeSwgeikge31cbiAqICB2YXIgYXJncyA9IFsxLCAyLCAzXTtcbiAqICBmLmFwcGx5KG51bGwsIGFyZ3MpO1xuICogIGBgYFxuICpcbiAqIFdpdGggYHNwcmVhZGAgdGhpcyBleGFtcGxlIGNhbiBiZSByZS13cml0dGVuLlxuICpcbiAqICBgYGBqc1xuICogIHNwcmVhZChmdW5jdGlvbih4LCB5LCB6KSB7fSkoWzEsIDIsIDNdKTtcbiAqICBgYGBcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHJldHVybnMge0Z1bmN0aW9ufVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNwcmVhZChjYWxsYmFjaykge1xuICByZXR1cm4gZnVuY3Rpb24gd3JhcChhcnIpIHtcbiAgICByZXR1cm4gY2FsbGJhY2suYXBwbHkobnVsbCwgYXJyKTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBiaW5kID0gcmVxdWlyZSgnLi9oZWxwZXJzL2JpbmQnKTtcbnZhciBpc0J1ZmZlciA9IHJlcXVpcmUoJ2lzLWJ1ZmZlcicpO1xuXG4vKmdsb2JhbCB0b1N0cmluZzp0cnVlKi9cblxuLy8gdXRpbHMgaXMgYSBsaWJyYXJ5IG9mIGdlbmVyaWMgaGVscGVyIGZ1bmN0aW9ucyBub24tc3BlY2lmaWMgdG8gYXhpb3NcblxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBBcnJheVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEFycmF5LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheSh2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBBcnJheUJ1ZmZlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEFycmF5QnVmZmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUJ1ZmZlcih2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZvcm1EYXRhXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gRm9ybURhdGEsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Zvcm1EYXRhKHZhbCkge1xuICByZXR1cm4gKHR5cGVvZiBGb3JtRGF0YSAhPT0gJ3VuZGVmaW5lZCcpICYmICh2YWwgaW5zdGFuY2VvZiBGb3JtRGF0YSk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSB2aWV3IG9uIGFuIEFycmF5QnVmZmVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSB2aWV3IG9uIGFuIEFycmF5QnVmZmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUJ1ZmZlclZpZXcodmFsKSB7XG4gIHZhciByZXN1bHQ7XG4gIGlmICgodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJykgJiYgKEFycmF5QnVmZmVyLmlzVmlldykpIHtcbiAgICByZXN1bHQgPSBBcnJheUJ1ZmZlci5pc1ZpZXcodmFsKTtcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQgPSAodmFsKSAmJiAodmFsLmJ1ZmZlcikgJiYgKHZhbC5idWZmZXIgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcik7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFN0cmluZ1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgU3RyaW5nLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTdHJpbmcodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAnc3RyaW5nJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIE51bWJlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgTnVtYmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNOdW1iZXIodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAnbnVtYmVyJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyB1bmRlZmluZWRcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgdmFsdWUgaXMgdW5kZWZpbmVkLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNVbmRlZmluZWQodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAndW5kZWZpbmVkJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBPYmplY3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBPYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWwpIHtcbiAgcmV0dXJuIHZhbCAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0Jztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIERhdGVcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIERhdGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0RhdGUodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IERhdGVdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZpbGVcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEZpbGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0ZpbGUodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEZpbGVdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEJsb2JcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEJsb2IsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Jsb2IodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEJsb2JdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZ1bmN0aW9uXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBGdW5jdGlvbiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBTdHJlYW1cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFN0cmVhbSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3RyZWFtKHZhbCkge1xuICByZXR1cm4gaXNPYmplY3QodmFsKSAmJiBpc0Z1bmN0aW9uKHZhbC5waXBlKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFVSTFNlYXJjaFBhcmFtcyBvYmplY3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFVSTFNlYXJjaFBhcmFtcyBvYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1VSTFNlYXJjaFBhcmFtcyh2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiBVUkxTZWFyY2hQYXJhbXMgIT09ICd1bmRlZmluZWQnICYmIHZhbCBpbnN0YW5jZW9mIFVSTFNlYXJjaFBhcmFtcztcbn1cblxuLyoqXG4gKiBUcmltIGV4Y2VzcyB3aGl0ZXNwYWNlIG9mZiB0aGUgYmVnaW5uaW5nIGFuZCBlbmQgb2YgYSBzdHJpbmdcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBTdHJpbmcgdG8gdHJpbVxuICogQHJldHVybnMge1N0cmluZ30gVGhlIFN0cmluZyBmcmVlZCBvZiBleGNlc3Mgd2hpdGVzcGFjZVxuICovXG5mdW5jdGlvbiB0cmltKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMqLywgJycpLnJlcGxhY2UoL1xccyokLywgJycpO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiB3ZSdyZSBydW5uaW5nIGluIGEgc3RhbmRhcmQgYnJvd3NlciBlbnZpcm9ubWVudFxuICpcbiAqIFRoaXMgYWxsb3dzIGF4aW9zIHRvIHJ1biBpbiBhIHdlYiB3b3JrZXIsIGFuZCByZWFjdC1uYXRpdmUuXG4gKiBCb3RoIGVudmlyb25tZW50cyBzdXBwb3J0IFhNTEh0dHBSZXF1ZXN0LCBidXQgbm90IGZ1bGx5IHN0YW5kYXJkIGdsb2JhbHMuXG4gKlxuICogd2ViIHdvcmtlcnM6XG4gKiAgdHlwZW9mIHdpbmRvdyAtPiB1bmRlZmluZWRcbiAqICB0eXBlb2YgZG9jdW1lbnQgLT4gdW5kZWZpbmVkXG4gKlxuICogcmVhY3QtbmF0aXZlOlxuICogIG5hdmlnYXRvci5wcm9kdWN0IC0+ICdSZWFjdE5hdGl2ZSdcbiAqL1xuZnVuY3Rpb24gaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gIGlmICh0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyAmJiBuYXZpZ2F0b3IucHJvZHVjdCA9PT0gJ1JlYWN0TmF0aXZlJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gKFxuICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXG4gICAgdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJ1xuICApO1xufVxuXG4vKipcbiAqIEl0ZXJhdGUgb3ZlciBhbiBBcnJheSBvciBhbiBPYmplY3QgaW52b2tpbmcgYSBmdW5jdGlvbiBmb3IgZWFjaCBpdGVtLlxuICpcbiAqIElmIGBvYmpgIGlzIGFuIEFycmF5IGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIHBhc3NpbmdcbiAqIHRoZSB2YWx1ZSwgaW5kZXgsIGFuZCBjb21wbGV0ZSBhcnJheSBmb3IgZWFjaCBpdGVtLlxuICpcbiAqIElmICdvYmonIGlzIGFuIE9iamVjdCBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZCBwYXNzaW5nXG4gKiB0aGUgdmFsdWUsIGtleSwgYW5kIGNvbXBsZXRlIG9iamVjdCBmb3IgZWFjaCBwcm9wZXJ0eS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdHxBcnJheX0gb2JqIFRoZSBvYmplY3QgdG8gaXRlcmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGNhbGxiYWNrIHRvIGludm9rZSBmb3IgZWFjaCBpdGVtXG4gKi9cbmZ1bmN0aW9uIGZvckVhY2gob2JqLCBmbikge1xuICAvLyBEb24ndCBib3RoZXIgaWYgbm8gdmFsdWUgcHJvdmlkZWRcbiAgaWYgKG9iaiA9PT0gbnVsbCB8fCB0eXBlb2Ygb2JqID09PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIEZvcmNlIGFuIGFycmF5IGlmIG5vdCBhbHJlYWR5IHNvbWV0aGluZyBpdGVyYWJsZVxuICBpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHtcbiAgICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgICBvYmogPSBbb2JqXTtcbiAgfVxuXG4gIGlmIChpc0FycmF5KG9iaikpIHtcbiAgICAvLyBJdGVyYXRlIG92ZXIgYXJyYXkgdmFsdWVzXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBvYmoubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBmbi5jYWxsKG51bGwsIG9ialtpXSwgaSwgb2JqKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gSXRlcmF0ZSBvdmVyIG9iamVjdCBrZXlzXG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcbiAgICAgICAgZm4uY2FsbChudWxsLCBvYmpba2V5XSwga2V5LCBvYmopO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEFjY2VwdHMgdmFyYXJncyBleHBlY3RpbmcgZWFjaCBhcmd1bWVudCB0byBiZSBhbiBvYmplY3QsIHRoZW5cbiAqIGltbXV0YWJseSBtZXJnZXMgdGhlIHByb3BlcnRpZXMgb2YgZWFjaCBvYmplY3QgYW5kIHJldHVybnMgcmVzdWx0LlxuICpcbiAqIFdoZW4gbXVsdGlwbGUgb2JqZWN0cyBjb250YWluIHRoZSBzYW1lIGtleSB0aGUgbGF0ZXIgb2JqZWN0IGluXG4gKiB0aGUgYXJndW1lbnRzIGxpc3Qgd2lsbCB0YWtlIHByZWNlZGVuY2UuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiBgYGBqc1xuICogdmFyIHJlc3VsdCA9IG1lcmdlKHtmb286IDEyM30sIHtmb286IDQ1Nn0pO1xuICogY29uc29sZS5sb2cocmVzdWx0LmZvbyk7IC8vIG91dHB1dHMgNDU2XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqMSBPYmplY3QgdG8gbWVyZ2VcbiAqIEByZXR1cm5zIHtPYmplY3R9IFJlc3VsdCBvZiBhbGwgbWVyZ2UgcHJvcGVydGllc1xuICovXG5mdW5jdGlvbiBtZXJnZSgvKiBvYmoxLCBvYmoyLCBvYmozLCAuLi4gKi8pIHtcbiAgdmFyIHJlc3VsdCA9IHt9O1xuICBmdW5jdGlvbiBhc3NpZ25WYWx1ZSh2YWwsIGtleSkge1xuICAgIGlmICh0eXBlb2YgcmVzdWx0W2tleV0gPT09ICdvYmplY3QnICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnKSB7XG4gICAgICByZXN1bHRba2V5XSA9IG1lcmdlKHJlc3VsdFtrZXldLCB2YWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHRba2V5XSA9IHZhbDtcbiAgICB9XG4gIH1cblxuICBmb3IgKHZhciBpID0gMCwgbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBmb3JFYWNoKGFyZ3VtZW50c1tpXSwgYXNzaWduVmFsdWUpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogRXh0ZW5kcyBvYmplY3QgYSBieSBtdXRhYmx5IGFkZGluZyB0byBpdCB0aGUgcHJvcGVydGllcyBvZiBvYmplY3QgYi5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYSBUaGUgb2JqZWN0IHRvIGJlIGV4dGVuZGVkXG4gKiBAcGFyYW0ge09iamVjdH0gYiBUaGUgb2JqZWN0IHRvIGNvcHkgcHJvcGVydGllcyBmcm9tXG4gKiBAcGFyYW0ge09iamVjdH0gdGhpc0FyZyBUaGUgb2JqZWN0IHRvIGJpbmQgZnVuY3Rpb24gdG9cbiAqIEByZXR1cm4ge09iamVjdH0gVGhlIHJlc3VsdGluZyB2YWx1ZSBvZiBvYmplY3QgYVxuICovXG5mdW5jdGlvbiBleHRlbmQoYSwgYiwgdGhpc0FyZykge1xuICBmb3JFYWNoKGIsIGZ1bmN0aW9uIGFzc2lnblZhbHVlKHZhbCwga2V5KSB7XG4gICAgaWYgKHRoaXNBcmcgJiYgdHlwZW9mIHZhbCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgYVtrZXldID0gYmluZCh2YWwsIHRoaXNBcmcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhW2tleV0gPSB2YWw7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc0FycmF5OiBpc0FycmF5LFxuICBpc0FycmF5QnVmZmVyOiBpc0FycmF5QnVmZmVyLFxuICBpc0J1ZmZlcjogaXNCdWZmZXIsXG4gIGlzRm9ybURhdGE6IGlzRm9ybURhdGEsXG4gIGlzQXJyYXlCdWZmZXJWaWV3OiBpc0FycmF5QnVmZmVyVmlldyxcbiAgaXNTdHJpbmc6IGlzU3RyaW5nLFxuICBpc051bWJlcjogaXNOdW1iZXIsXG4gIGlzT2JqZWN0OiBpc09iamVjdCxcbiAgaXNVbmRlZmluZWQ6IGlzVW5kZWZpbmVkLFxuICBpc0RhdGU6IGlzRGF0ZSxcbiAgaXNGaWxlOiBpc0ZpbGUsXG4gIGlzQmxvYjogaXNCbG9iLFxuICBpc0Z1bmN0aW9uOiBpc0Z1bmN0aW9uLFxuICBpc1N0cmVhbTogaXNTdHJlYW0sXG4gIGlzVVJMU2VhcmNoUGFyYW1zOiBpc1VSTFNlYXJjaFBhcmFtcyxcbiAgaXNTdGFuZGFyZEJyb3dzZXJFbnY6IGlzU3RhbmRhcmRCcm93c2VyRW52LFxuICBmb3JFYWNoOiBmb3JFYWNoLFxuICBtZXJnZTogbWVyZ2UsXG4gIGV4dGVuZDogZXh0ZW5kLFxuICB0cmltOiB0cmltXG59O1xuIiwiJ3VzZSBzdHJpY3QnXG5cbmV4cG9ydHMuYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGhcbmV4cG9ydHMudG9CeXRlQXJyYXkgPSB0b0J5dGVBcnJheVxuZXhwb3J0cy5mcm9tQnl0ZUFycmF5ID0gZnJvbUJ5dGVBcnJheVxuXG52YXIgbG9va3VwID0gW11cbnZhciByZXZMb29rdXAgPSBbXVxudmFyIEFyciA9IHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJyA/IFVpbnQ4QXJyYXkgOiBBcnJheVxuXG52YXIgY29kZSA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJ1xuZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNvZGUubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgbG9va3VwW2ldID0gY29kZVtpXVxuICByZXZMb29rdXBbY29kZS5jaGFyQ29kZUF0KGkpXSA9IGlcbn1cblxuLy8gU3VwcG9ydCBkZWNvZGluZyBVUkwtc2FmZSBiYXNlNjQgc3RyaW5ncywgYXMgTm9kZS5qcyBkb2VzLlxuLy8gU2VlOiBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9CYXNlNjQjVVJMX2FwcGxpY2F0aW9uc1xucmV2TG9va3VwWyctJy5jaGFyQ29kZUF0KDApXSA9IDYyXG5yZXZMb29rdXBbJ18nLmNoYXJDb2RlQXQoMCldID0gNjNcblxuZnVuY3Rpb24gZ2V0TGVucyAoYjY0KSB7XG4gIHZhciBsZW4gPSBiNjQubGVuZ3RoXG5cbiAgaWYgKGxlbiAlIDQgPiAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHN0cmluZy4gTGVuZ3RoIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA0JylcbiAgfVxuXG4gIC8vIFRyaW0gb2ZmIGV4dHJhIGJ5dGVzIGFmdGVyIHBsYWNlaG9sZGVyIGJ5dGVzIGFyZSBmb3VuZFxuICAvLyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9iZWF0Z2FtbWl0L2Jhc2U2NC1qcy9pc3N1ZXMvNDJcbiAgdmFyIHZhbGlkTGVuID0gYjY0LmluZGV4T2YoJz0nKVxuICBpZiAodmFsaWRMZW4gPT09IC0xKSB2YWxpZExlbiA9IGxlblxuXG4gIHZhciBwbGFjZUhvbGRlcnNMZW4gPSB2YWxpZExlbiA9PT0gbGVuXG4gICAgPyAwXG4gICAgOiA0IC0gKHZhbGlkTGVuICUgNClcblxuICByZXR1cm4gW3ZhbGlkTGVuLCBwbGFjZUhvbGRlcnNMZW5dXG59XG5cbi8vIGJhc2U2NCBpcyA0LzMgKyB1cCB0byB0d28gY2hhcmFjdGVycyBvZiB0aGUgb3JpZ2luYWwgZGF0YVxuZnVuY3Rpb24gYnl0ZUxlbmd0aCAoYjY0KSB7XG4gIHZhciBsZW5zID0gZ2V0TGVucyhiNjQpXG4gIHZhciB2YWxpZExlbiA9IGxlbnNbMF1cbiAgdmFyIHBsYWNlSG9sZGVyc0xlbiA9IGxlbnNbMV1cbiAgcmV0dXJuICgodmFsaWRMZW4gKyBwbGFjZUhvbGRlcnNMZW4pICogMyAvIDQpIC0gcGxhY2VIb2xkZXJzTGVuXG59XG5cbmZ1bmN0aW9uIF9ieXRlTGVuZ3RoIChiNjQsIHZhbGlkTGVuLCBwbGFjZUhvbGRlcnNMZW4pIHtcbiAgcmV0dXJuICgodmFsaWRMZW4gKyBwbGFjZUhvbGRlcnNMZW4pICogMyAvIDQpIC0gcGxhY2VIb2xkZXJzTGVuXG59XG5cbmZ1bmN0aW9uIHRvQnl0ZUFycmF5IChiNjQpIHtcbiAgdmFyIHRtcFxuICB2YXIgbGVucyA9IGdldExlbnMoYjY0KVxuICB2YXIgdmFsaWRMZW4gPSBsZW5zWzBdXG4gIHZhciBwbGFjZUhvbGRlcnNMZW4gPSBsZW5zWzFdXG5cbiAgdmFyIGFyciA9IG5ldyBBcnIoX2J5dGVMZW5ndGgoYjY0LCB2YWxpZExlbiwgcGxhY2VIb2xkZXJzTGVuKSlcblxuICB2YXIgY3VyQnl0ZSA9IDBcblxuICAvLyBpZiB0aGVyZSBhcmUgcGxhY2Vob2xkZXJzLCBvbmx5IGdldCB1cCB0byB0aGUgbGFzdCBjb21wbGV0ZSA0IGNoYXJzXG4gIHZhciBsZW4gPSBwbGFjZUhvbGRlcnNMZW4gPiAwXG4gICAgPyB2YWxpZExlbiAtIDRcbiAgICA6IHZhbGlkTGVuXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gNCkge1xuICAgIHRtcCA9XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkpXSA8PCAxOCkgfFxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldIDw8IDEyKSB8XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAyKV0gPDwgNikgfFxuICAgICAgcmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAzKV1cbiAgICBhcnJbY3VyQnl0ZSsrXSA9ICh0bXAgPj4gMTYpICYgMHhGRlxuICAgIGFycltjdXJCeXRlKytdID0gKHRtcCA+PiA4KSAmIDB4RkZcbiAgICBhcnJbY3VyQnl0ZSsrXSA9IHRtcCAmIDB4RkZcbiAgfVxuXG4gIGlmIChwbGFjZUhvbGRlcnNMZW4gPT09IDIpIHtcbiAgICB0bXAgPVxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMikgfFxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldID4+IDQpXG4gICAgYXJyW2N1ckJ5dGUrK10gPSB0bXAgJiAweEZGXG4gIH1cblxuICBpZiAocGxhY2VIb2xkZXJzTGVuID09PSAxKSB7XG4gICAgdG1wID1cbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDEwKSB8XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPDwgNCkgfFxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMildID4+IDIpXG4gICAgYXJyW2N1ckJ5dGUrK10gPSAodG1wID4+IDgpICYgMHhGRlxuICAgIGFycltjdXJCeXRlKytdID0gdG1wICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIGFyclxufVxuXG5mdW5jdGlvbiB0cmlwbGV0VG9CYXNlNjQgKG51bSkge1xuICByZXR1cm4gbG9va3VwW251bSA+PiAxOCAmIDB4M0ZdICtcbiAgICBsb29rdXBbbnVtID4+IDEyICYgMHgzRl0gK1xuICAgIGxvb2t1cFtudW0gPj4gNiAmIDB4M0ZdICtcbiAgICBsb29rdXBbbnVtICYgMHgzRl1cbn1cblxuZnVuY3Rpb24gZW5jb2RlQ2h1bmsgKHVpbnQ4LCBzdGFydCwgZW5kKSB7XG4gIHZhciB0bXBcbiAgdmFyIG91dHB1dCA9IFtdXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSArPSAzKSB7XG4gICAgdG1wID1cbiAgICAgICgodWludDhbaV0gPDwgMTYpICYgMHhGRjAwMDApICtcbiAgICAgICgodWludDhbaSArIDFdIDw8IDgpICYgMHhGRjAwKSArXG4gICAgICAodWludDhbaSArIDJdICYgMHhGRilcbiAgICBvdXRwdXQucHVzaCh0cmlwbGV0VG9CYXNlNjQodG1wKSlcbiAgfVxuICByZXR1cm4gb3V0cHV0LmpvaW4oJycpXG59XG5cbmZ1bmN0aW9uIGZyb21CeXRlQXJyYXkgKHVpbnQ4KSB7XG4gIHZhciB0bXBcbiAgdmFyIGxlbiA9IHVpbnQ4Lmxlbmd0aFxuICB2YXIgZXh0cmFCeXRlcyA9IGxlbiAlIDMgLy8gaWYgd2UgaGF2ZSAxIGJ5dGUgbGVmdCwgcGFkIDIgYnl0ZXNcbiAgdmFyIHBhcnRzID0gW11cbiAgdmFyIG1heENodW5rTGVuZ3RoID0gMTYzODMgLy8gbXVzdCBiZSBtdWx0aXBsZSBvZiAzXG5cbiAgLy8gZ28gdGhyb3VnaCB0aGUgYXJyYXkgZXZlcnkgdGhyZWUgYnl0ZXMsIHdlJ2xsIGRlYWwgd2l0aCB0cmFpbGluZyBzdHVmZiBsYXRlclxuICBmb3IgKHZhciBpID0gMCwgbGVuMiA9IGxlbiAtIGV4dHJhQnl0ZXM7IGkgPCBsZW4yOyBpICs9IG1heENodW5rTGVuZ3RoKSB7XG4gICAgcGFydHMucHVzaChlbmNvZGVDaHVuayhcbiAgICAgIHVpbnQ4LCBpLCAoaSArIG1heENodW5rTGVuZ3RoKSA+IGxlbjIgPyBsZW4yIDogKGkgKyBtYXhDaHVua0xlbmd0aClcbiAgICApKVxuICB9XG5cbiAgLy8gcGFkIHRoZSBlbmQgd2l0aCB6ZXJvcywgYnV0IG1ha2Ugc3VyZSB0byBub3QgZm9yZ2V0IHRoZSBleHRyYSBieXRlc1xuICBpZiAoZXh0cmFCeXRlcyA9PT0gMSkge1xuICAgIHRtcCA9IHVpbnQ4W2xlbiAtIDFdXG4gICAgcGFydHMucHVzaChcbiAgICAgIGxvb2t1cFt0bXAgPj4gMl0gK1xuICAgICAgbG9va3VwWyh0bXAgPDwgNCkgJiAweDNGXSArXG4gICAgICAnPT0nXG4gICAgKVxuICB9IGVsc2UgaWYgKGV4dHJhQnl0ZXMgPT09IDIpIHtcbiAgICB0bXAgPSAodWludDhbbGVuIC0gMl0gPDwgOCkgKyB1aW50OFtsZW4gLSAxXVxuICAgIHBhcnRzLnB1c2goXG4gICAgICBsb29rdXBbdG1wID4+IDEwXSArXG4gICAgICBsb29rdXBbKHRtcCA+PiA0KSAmIDB4M0ZdICtcbiAgICAgIGxvb2t1cFsodG1wIDw8IDIpICYgMHgzRl0gK1xuICAgICAgJz0nXG4gICAgKVxuICB9XG5cbiAgcmV0dXJuIHBhcnRzLmpvaW4oJycpXG59XG4iLCIvKlxyXG4gKiAgICAgIGJpZ251bWJlci5qcyB2OC4wLjFcclxuICogICAgICBBIEphdmFTY3JpcHQgbGlicmFyeSBmb3IgYXJiaXRyYXJ5LXByZWNpc2lvbiBhcml0aG1ldGljLlxyXG4gKiAgICAgIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWtlTWNsL2JpZ251bWJlci5qc1xyXG4gKiAgICAgIENvcHlyaWdodCAoYykgMjAxOCBNaWNoYWVsIE1jbGF1Z2hsaW4gPE04Y2g4OGxAZ21haWwuY29tPlxyXG4gKiAgICAgIE1JVCBMaWNlbnNlZC5cclxuICpcclxuICogICAgICBCaWdOdW1iZXIucHJvdG90eXBlIG1ldGhvZHMgICAgIHwgIEJpZ051bWJlciBtZXRob2RzXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XHJcbiAqICAgICAgYWJzb2x1dGVWYWx1ZSAgICAgICAgICAgIGFicyAgICB8ICBjbG9uZVxyXG4gKiAgICAgIGNvbXBhcmVkVG8gICAgICAgICAgICAgICAgICAgICAgfCAgY29uZmlnICAgICAgICAgICAgICAgc2V0XHJcbiAqICAgICAgZGVjaW1hbFBsYWNlcyAgICAgICAgICAgIGRwICAgICB8ICAgICAgREVDSU1BTF9QTEFDRVNcclxuICogICAgICBkaXZpZGVkQnkgICAgICAgICAgICAgICAgZGl2ICAgIHwgICAgICBST1VORElOR19NT0RFXHJcbiAqICAgICAgZGl2aWRlZFRvSW50ZWdlckJ5ICAgICAgIGlkaXYgICB8ICAgICAgRVhQT05FTlRJQUxfQVRcclxuICogICAgICBleHBvbmVudGlhdGVkQnkgICAgICAgICAgcG93ICAgIHwgICAgICBSQU5HRVxyXG4gKiAgICAgIGludGVnZXJWYWx1ZSAgICAgICAgICAgICAgICAgICAgfCAgICAgIENSWVBUT1xyXG4gKiAgICAgIGlzRXF1YWxUbyAgICAgICAgICAgICAgICBlcSAgICAgfCAgICAgIE1PRFVMT19NT0RFXHJcbiAqICAgICAgaXNGaW5pdGUgICAgICAgICAgICAgICAgICAgICAgICB8ICAgICAgUE9XX1BSRUNJU0lPTlxyXG4gKiAgICAgIGlzR3JlYXRlclRoYW4gICAgICAgICAgICBndCAgICAgfCAgICAgIEZPUk1BVFxyXG4gKiAgICAgIGlzR3JlYXRlclRoYW5PckVxdWFsVG8gICBndGUgICAgfCAgICAgIEFMUEhBQkVUXHJcbiAqICAgICAgaXNJbnRlZ2VyICAgICAgICAgICAgICAgICAgICAgICB8ICBpc0JpZ051bWJlclxyXG4gKiAgICAgIGlzTGVzc1RoYW4gICAgICAgICAgICAgICBsdCAgICAgfCAgbWF4aW11bSAgICAgICAgICAgICAgbWF4XHJcbiAqICAgICAgaXNMZXNzVGhhbk9yRXF1YWxUbyAgICAgIGx0ZSAgICB8ICBtaW5pbXVtICAgICAgICAgICAgICBtaW5cclxuICogICAgICBpc05hTiAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgIHJhbmRvbVxyXG4gKiAgICAgIGlzTmVnYXRpdmUgICAgICAgICAgICAgICAgICAgICAgfCAgc3VtXHJcbiAqICAgICAgaXNQb3NpdGl2ZSAgICAgICAgICAgICAgICAgICAgICB8XHJcbiAqICAgICAgaXNaZXJvICAgICAgICAgICAgICAgICAgICAgICAgICB8XHJcbiAqICAgICAgbWludXMgICAgICAgICAgICAgICAgICAgICAgICAgICB8XHJcbiAqICAgICAgbW9kdWxvICAgICAgICAgICAgICAgICAgIG1vZCAgICB8XHJcbiAqICAgICAgbXVsdGlwbGllZEJ5ICAgICAgICAgICAgIHRpbWVzICB8XHJcbiAqICAgICAgbmVnYXRlZCAgICAgICAgICAgICAgICAgICAgICAgICB8XHJcbiAqICAgICAgcGx1cyAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XHJcbiAqICAgICAgcHJlY2lzaW9uICAgICAgICAgICAgICAgIHNkICAgICB8XHJcbiAqICAgICAgc2hpZnRlZEJ5ICAgICAgICAgICAgICAgICAgICAgICB8XHJcbiAqICAgICAgc3F1YXJlUm9vdCAgICAgICAgICAgICAgIHNxcnQgICB8XHJcbiAqICAgICAgdG9FeHBvbmVudGlhbCAgICAgICAgICAgICAgICAgICB8XHJcbiAqICAgICAgdG9GaXhlZCAgICAgICAgICAgICAgICAgICAgICAgICB8XHJcbiAqICAgICAgdG9Gb3JtYXQgICAgICAgICAgICAgICAgICAgICAgICB8XHJcbiAqICAgICAgdG9GcmFjdGlvbiAgICAgICAgICAgICAgICAgICAgICB8XHJcbiAqICAgICAgdG9KU09OICAgICAgICAgICAgICAgICAgICAgICAgICB8XHJcbiAqICAgICAgdG9OdW1iZXIgICAgICAgICAgICAgICAgICAgICAgICB8XHJcbiAqICAgICAgdG9QcmVjaXNpb24gICAgICAgICAgICAgICAgICAgICB8XHJcbiAqICAgICAgdG9TdHJpbmcgICAgICAgICAgICAgICAgICAgICAgICB8XHJcbiAqICAgICAgdmFsdWVPZiAgICAgICAgICAgICAgICAgICAgICAgICB8XHJcbiAqXHJcbiAqL1xyXG5cclxuXHJcbnZhciBpc051bWVyaWMgPSAvXi0/KD86XFxkKyg/OlxcLlxcZCopP3xcXC5cXGQrKSg/OmVbKy1dP1xcZCspPyQvaSxcclxuXHJcbiAgbWF0aGNlaWwgPSBNYXRoLmNlaWwsXHJcbiAgbWF0aGZsb29yID0gTWF0aC5mbG9vcixcclxuXHJcbiAgYmlnbnVtYmVyRXJyb3IgPSAnW0JpZ051bWJlciBFcnJvcl0gJyxcclxuICB0b29NYW55RGlnaXRzID0gYmlnbnVtYmVyRXJyb3IgKyAnTnVtYmVyIHByaW1pdGl2ZSBoYXMgbW9yZSB0aGFuIDE1IHNpZ25pZmljYW50IGRpZ2l0czogJyxcclxuXHJcbiAgQkFTRSA9IDFlMTQsXHJcbiAgTE9HX0JBU0UgPSAxNCxcclxuICBNQVhfU0FGRV9JTlRFR0VSID0gMHgxZmZmZmZmZmZmZmZmZiwgICAgICAgICAvLyAyXjUzIC0gMVxyXG4gIC8vIE1BWF9JTlQzMiA9IDB4N2ZmZmZmZmYsICAgICAgICAgICAgICAgICAgIC8vIDJeMzEgLSAxXHJcbiAgUE9XU19URU4gPSBbMSwgMTAsIDEwMCwgMWUzLCAxZTQsIDFlNSwgMWU2LCAxZTcsIDFlOCwgMWU5LCAxZTEwLCAxZTExLCAxZTEyLCAxZTEzXSxcclxuICBTUVJUX0JBU0UgPSAxZTcsXHJcblxyXG4gIC8vIEVESVRBQkxFXHJcbiAgLy8gVGhlIGxpbWl0IG9uIHRoZSB2YWx1ZSBvZiBERUNJTUFMX1BMQUNFUywgVE9fRVhQX05FRywgVE9fRVhQX1BPUywgTUlOX0VYUCwgTUFYX0VYUCwgYW5kXHJcbiAgLy8gdGhlIGFyZ3VtZW50cyB0byB0b0V4cG9uZW50aWFsLCB0b0ZpeGVkLCB0b0Zvcm1hdCwgYW5kIHRvUHJlY2lzaW9uLlxyXG4gIE1BWCA9IDFFOTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDAgdG8gTUFYX0lOVDMyXHJcblxyXG5cclxuLypcclxuICogQ3JlYXRlIGFuZCByZXR1cm4gYSBCaWdOdW1iZXIgY29uc3RydWN0b3IuXHJcbiAqL1xyXG5mdW5jdGlvbiBjbG9uZShjb25maWdPYmplY3QpIHtcclxuICB2YXIgZGl2LCBjb252ZXJ0QmFzZSwgcGFyc2VOdW1lcmljLFxyXG4gICAgUCA9IEJpZ051bWJlci5wcm90b3R5cGUgPSB7IGNvbnN0cnVjdG9yOiBCaWdOdW1iZXIsIHRvU3RyaW5nOiBudWxsLCB2YWx1ZU9mOiBudWxsIH0sXHJcbiAgICBPTkUgPSBuZXcgQmlnTnVtYmVyKDEpLFxyXG5cclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIEVESVRBQkxFIENPTkZJRyBERUZBVUxUUyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cclxuICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlcyBiZWxvdyBtdXN0IGJlIGludGVnZXJzIHdpdGhpbiB0aGUgaW5jbHVzaXZlIHJhbmdlcyBzdGF0ZWQuXHJcbiAgICAvLyBUaGUgdmFsdWVzIGNhbiBhbHNvIGJlIGNoYW5nZWQgYXQgcnVuLXRpbWUgdXNpbmcgQmlnTnVtYmVyLnNldC5cclxuXHJcbiAgICAvLyBUaGUgbWF4aW11bSBudW1iZXIgb2YgZGVjaW1hbCBwbGFjZXMgZm9yIG9wZXJhdGlvbnMgaW52b2x2aW5nIGRpdmlzaW9uLlxyXG4gICAgREVDSU1BTF9QTEFDRVMgPSAyMCwgICAgICAgICAgICAgICAgICAgICAvLyAwIHRvIE1BWFxyXG5cclxuICAgIC8vIFRoZSByb3VuZGluZyBtb2RlIHVzZWQgd2hlbiByb3VuZGluZyB0byB0aGUgYWJvdmUgZGVjaW1hbCBwbGFjZXMsIGFuZCB3aGVuIHVzaW5nXHJcbiAgICAvLyB0b0V4cG9uZW50aWFsLCB0b0ZpeGVkLCB0b0Zvcm1hdCBhbmQgdG9QcmVjaXNpb24sIGFuZCByb3VuZCAoZGVmYXVsdCB2YWx1ZSkuXHJcbiAgICAvLyBVUCAgICAgICAgIDAgQXdheSBmcm9tIHplcm8uXHJcbiAgICAvLyBET1dOICAgICAgIDEgVG93YXJkcyB6ZXJvLlxyXG4gICAgLy8gQ0VJTCAgICAgICAyIFRvd2FyZHMgK0luZmluaXR5LlxyXG4gICAgLy8gRkxPT1IgICAgICAzIFRvd2FyZHMgLUluZmluaXR5LlxyXG4gICAgLy8gSEFMRl9VUCAgICA0IFRvd2FyZHMgbmVhcmVzdCBuZWlnaGJvdXIuIElmIGVxdWlkaXN0YW50LCB1cC5cclxuICAgIC8vIEhBTEZfRE9XTiAgNSBUb3dhcmRzIG5lYXJlc3QgbmVpZ2hib3VyLiBJZiBlcXVpZGlzdGFudCwgZG93bi5cclxuICAgIC8vIEhBTEZfRVZFTiAgNiBUb3dhcmRzIG5lYXJlc3QgbmVpZ2hib3VyLiBJZiBlcXVpZGlzdGFudCwgdG93YXJkcyBldmVuIG5laWdoYm91ci5cclxuICAgIC8vIEhBTEZfQ0VJTCAgNyBUb3dhcmRzIG5lYXJlc3QgbmVpZ2hib3VyLiBJZiBlcXVpZGlzdGFudCwgdG93YXJkcyArSW5maW5pdHkuXHJcbiAgICAvLyBIQUxGX0ZMT09SIDggVG93YXJkcyBuZWFyZXN0IG5laWdoYm91ci4gSWYgZXF1aWRpc3RhbnQsIHRvd2FyZHMgLUluZmluaXR5LlxyXG4gICAgUk9VTkRJTkdfTU9ERSA9IDQsICAgICAgICAgICAgICAgICAgICAgICAvLyAwIHRvIDhcclxuXHJcbiAgICAvLyBFWFBPTkVOVElBTF9BVCA6IFtUT19FWFBfTkVHICwgVE9fRVhQX1BPU11cclxuXHJcbiAgICAvLyBUaGUgZXhwb25lbnQgdmFsdWUgYXQgYW5kIGJlbmVhdGggd2hpY2ggdG9TdHJpbmcgcmV0dXJucyBleHBvbmVudGlhbCBub3RhdGlvbi5cclxuICAgIC8vIE51bWJlciB0eXBlOiAtN1xyXG4gICAgVE9fRVhQX05FRyA9IC03LCAgICAgICAgICAgICAgICAgICAgICAgICAvLyAwIHRvIC1NQVhcclxuXHJcbiAgICAvLyBUaGUgZXhwb25lbnQgdmFsdWUgYXQgYW5kIGFib3ZlIHdoaWNoIHRvU3RyaW5nIHJldHVybnMgZXhwb25lbnRpYWwgbm90YXRpb24uXHJcbiAgICAvLyBOdW1iZXIgdHlwZTogMjFcclxuICAgIFRPX0VYUF9QT1MgPSAyMSwgICAgICAgICAgICAgICAgICAgICAgICAgLy8gMCB0byBNQVhcclxuXHJcbiAgICAvLyBSQU5HRSA6IFtNSU5fRVhQLCBNQVhfRVhQXVxyXG5cclxuICAgIC8vIFRoZSBtaW5pbXVtIGV4cG9uZW50IHZhbHVlLCBiZW5lYXRoIHdoaWNoIHVuZGVyZmxvdyB0byB6ZXJvIG9jY3Vycy5cclxuICAgIC8vIE51bWJlciB0eXBlOiAtMzI0ICAoNWUtMzI0KVxyXG4gICAgTUlOX0VYUCA9IC0xZTcsICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAtMSB0byAtTUFYXHJcblxyXG4gICAgLy8gVGhlIG1heGltdW0gZXhwb25lbnQgdmFsdWUsIGFib3ZlIHdoaWNoIG92ZXJmbG93IHRvIEluZmluaXR5IG9jY3Vycy5cclxuICAgIC8vIE51bWJlciB0eXBlOiAgMzA4ICAoMS43OTc2OTMxMzQ4NjIzMTU3ZSszMDgpXHJcbiAgICAvLyBGb3IgTUFYX0VYUCA+IDFlNywgZS5nLiBuZXcgQmlnTnVtYmVyKCcxZTEwMDAwMDAwMCcpLnBsdXMoMSkgbWF5IGJlIHNsb3cuXHJcbiAgICBNQVhfRVhQID0gMWU3LCAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDEgdG8gTUFYXHJcblxyXG4gICAgLy8gV2hldGhlciB0byB1c2UgY3J5cHRvZ3JhcGhpY2FsbHktc2VjdXJlIHJhbmRvbSBudW1iZXIgZ2VuZXJhdGlvbiwgaWYgYXZhaWxhYmxlLlxyXG4gICAgQ1JZUFRPID0gZmFsc2UsICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0cnVlIG9yIGZhbHNlXHJcblxyXG4gICAgLy8gVGhlIG1vZHVsbyBtb2RlIHVzZWQgd2hlbiBjYWxjdWxhdGluZyB0aGUgbW9kdWx1czogYSBtb2Qgbi5cclxuICAgIC8vIFRoZSBxdW90aWVudCAocSA9IGEgLyBuKSBpcyBjYWxjdWxhdGVkIGFjY29yZGluZyB0byB0aGUgY29ycmVzcG9uZGluZyByb3VuZGluZyBtb2RlLlxyXG4gICAgLy8gVGhlIHJlbWFpbmRlciAocikgaXMgY2FsY3VsYXRlZCBhczogciA9IGEgLSBuICogcS5cclxuICAgIC8vXHJcbiAgICAvLyBVUCAgICAgICAgMCBUaGUgcmVtYWluZGVyIGlzIHBvc2l0aXZlIGlmIHRoZSBkaXZpZGVuZCBpcyBuZWdhdGl2ZSwgZWxzZSBpcyBuZWdhdGl2ZS5cclxuICAgIC8vIERPV04gICAgICAxIFRoZSByZW1haW5kZXIgaGFzIHRoZSBzYW1lIHNpZ24gYXMgdGhlIGRpdmlkZW5kLlxyXG4gICAgLy8gICAgICAgICAgICAgVGhpcyBtb2R1bG8gbW9kZSBpcyBjb21tb25seSBrbm93biBhcyAndHJ1bmNhdGVkIGRpdmlzaW9uJyBhbmQgaXNcclxuICAgIC8vICAgICAgICAgICAgIGVxdWl2YWxlbnQgdG8gKGEgJSBuKSBpbiBKYXZhU2NyaXB0LlxyXG4gICAgLy8gRkxPT1IgICAgIDMgVGhlIHJlbWFpbmRlciBoYXMgdGhlIHNhbWUgc2lnbiBhcyB0aGUgZGl2aXNvciAoUHl0aG9uICUpLlxyXG4gICAgLy8gSEFMRl9FVkVOIDYgVGhpcyBtb2R1bG8gbW9kZSBpbXBsZW1lbnRzIHRoZSBJRUVFIDc1NCByZW1haW5kZXIgZnVuY3Rpb24uXHJcbiAgICAvLyBFVUNMSUQgICAgOSBFdWNsaWRpYW4gZGl2aXNpb24uIHEgPSBzaWduKG4pICogZmxvb3IoYSAvIGFicyhuKSkuXHJcbiAgICAvLyAgICAgICAgICAgICBUaGUgcmVtYWluZGVyIGlzIGFsd2F5cyBwb3NpdGl2ZS5cclxuICAgIC8vXHJcbiAgICAvLyBUaGUgdHJ1bmNhdGVkIGRpdmlzaW9uLCBmbG9vcmVkIGRpdmlzaW9uLCBFdWNsaWRpYW4gZGl2aXNpb24gYW5kIElFRUUgNzU0IHJlbWFpbmRlclxyXG4gICAgLy8gbW9kZXMgYXJlIGNvbW1vbmx5IHVzZWQgZm9yIHRoZSBtb2R1bHVzIG9wZXJhdGlvbi5cclxuICAgIC8vIEFsdGhvdWdoIHRoZSBvdGhlciByb3VuZGluZyBtb2RlcyBjYW4gYWxzbyBiZSB1c2VkLCB0aGV5IG1heSBub3QgZ2l2ZSB1c2VmdWwgcmVzdWx0cy5cclxuICAgIE1PRFVMT19NT0RFID0gMSwgICAgICAgICAgICAgICAgICAgICAgICAgLy8gMCB0byA5XHJcblxyXG4gICAgLy8gVGhlIG1heGltdW0gbnVtYmVyIG9mIHNpZ25pZmljYW50IGRpZ2l0cyBvZiB0aGUgcmVzdWx0IG9mIHRoZSBleHBvbmVudGlhdGVkQnkgb3BlcmF0aW9uLlxyXG4gICAgLy8gSWYgUE9XX1BSRUNJU0lPTiBpcyAwLCB0aGVyZSB3aWxsIGJlIHVubGltaXRlZCBzaWduaWZpY2FudCBkaWdpdHMuXHJcbiAgICBQT1dfUFJFQ0lTSU9OID0gMCwgICAgICAgICAgICAgICAgICAgIC8vIDAgdG8gTUFYXHJcblxyXG4gICAgLy8gVGhlIGZvcm1hdCBzcGVjaWZpY2F0aW9uIHVzZWQgYnkgdGhlIEJpZ051bWJlci5wcm90b3R5cGUudG9Gb3JtYXQgbWV0aG9kLlxyXG4gICAgRk9STUFUID0ge1xyXG4gICAgICBwcmVmaXg6ICcnLFxyXG4gICAgICBncm91cFNpemU6IDMsXHJcbiAgICAgIHNlY29uZGFyeUdyb3VwU2l6ZTogMCxcclxuICAgICAgZ3JvdXBTZXBhcmF0b3I6ICcsJyxcclxuICAgICAgZGVjaW1hbFNlcGFyYXRvcjogJy4nLFxyXG4gICAgICBmcmFjdGlvbkdyb3VwU2l6ZTogMCxcclxuICAgICAgZnJhY3Rpb25Hcm91cFNlcGFyYXRvcjogJ1xceEEwJywgICAgICAvLyBub24tYnJlYWtpbmcgc3BhY2VcclxuICAgICAgc3VmZml4OiAnJ1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyBUaGUgYWxwaGFiZXQgdXNlZCBmb3IgYmFzZSBjb252ZXJzaW9uLiBJdCBtdXN0IGJlIGF0IGxlYXN0IDIgY2hhcmFjdGVycyBsb25nLCB3aXRoIG5vICcrJyxcclxuICAgIC8vICctJywgJy4nLCB3aGl0ZXNwYWNlLCBvciByZXBlYXRlZCBjaGFyYWN0ZXIuXHJcbiAgICAvLyAnMDEyMzQ1Njc4OWFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVokXydcclxuICAgIEFMUEhBQkVUID0gJzAxMjM0NTY3ODlhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5eic7XHJcblxyXG5cclxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHJcbiAgLy8gQ09OU1RSVUNUT1JcclxuXHJcblxyXG4gIC8qXHJcbiAgICogVGhlIEJpZ051bWJlciBjb25zdHJ1Y3RvciBhbmQgZXhwb3J0ZWQgZnVuY3Rpb24uXHJcbiAgICogQ3JlYXRlIGFuZCByZXR1cm4gYSBuZXcgaW5zdGFuY2Ugb2YgYSBCaWdOdW1iZXIgb2JqZWN0LlxyXG4gICAqXHJcbiAgICogbiB7bnVtYmVyfHN0cmluZ3xCaWdOdW1iZXJ9IEEgbnVtZXJpYyB2YWx1ZS5cclxuICAgKiBbYl0ge251bWJlcn0gVGhlIGJhc2Ugb2Ygbi4gSW50ZWdlciwgMiB0byBBTFBIQUJFVC5sZW5ndGggaW5jbHVzaXZlLlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIEJpZ051bWJlcihuLCBiKSB7XHJcbiAgICB2YXIgYWxwaGFiZXQsIGMsIGNhc2VDaGFuZ2VkLCBlLCBpLCBpc051bSwgbGVuLCBzdHIsXHJcbiAgICAgIHggPSB0aGlzO1xyXG5cclxuICAgIC8vIEVuYWJsZSBjb25zdHJ1Y3RvciB1c2FnZSB3aXRob3V0IG5ldy5cclxuICAgIGlmICghKHggaW5zdGFuY2VvZiBCaWdOdW1iZXIpKSB7XHJcblxyXG4gICAgICAvLyBEb24ndCB0aHJvdyBvbiBjb25zdHJ1Y3RvciBjYWxsIHdpdGhvdXQgbmV3ICgjODEpLlxyXG4gICAgICAvLyAnW0JpZ051bWJlciBFcnJvcl0gQ29uc3RydWN0b3IgY2FsbCB3aXRob3V0IG5ldzoge259J1xyXG4gICAgICAvL3Rocm93IEVycm9yKGJpZ251bWJlckVycm9yICsgJyBDb25zdHJ1Y3RvciBjYWxsIHdpdGhvdXQgbmV3OiAnICsgbik7XHJcbiAgICAgIHJldHVybiBuZXcgQmlnTnVtYmVyKG4sIGIpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChiID09IG51bGwpIHtcclxuXHJcbiAgICAgIC8vIER1cGxpY2F0ZS5cclxuICAgICAgaWYgKG4gaW5zdGFuY2VvZiBCaWdOdW1iZXIpIHtcclxuICAgICAgICB4LnMgPSBuLnM7XHJcbiAgICAgICAgeC5lID0gbi5lO1xyXG4gICAgICAgIHguYyA9IChuID0gbi5jKSA/IG4uc2xpY2UoKSA6IG47XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpc051bSA9IHR5cGVvZiBuID09ICdudW1iZXInO1xyXG5cclxuICAgICAgaWYgKGlzTnVtICYmIG4gKiAwID09IDApIHtcclxuXHJcbiAgICAgICAgLy8gVXNlIGAxIC8gbmAgdG8gaGFuZGxlIG1pbnVzIHplcm8gYWxzby5cclxuICAgICAgICB4LnMgPSAxIC8gbiA8IDAgPyAobiA9IC1uLCAtMSkgOiAxO1xyXG5cclxuICAgICAgICAvLyBGYXN0ZXIgcGF0aCBmb3IgaW50ZWdlcnMuXHJcbiAgICAgICAgaWYgKG4gPT09IH5+bikge1xyXG4gICAgICAgICAgZm9yIChlID0gMCwgaSA9IG47IGkgPj0gMTA7IGkgLz0gMTAsIGUrKyk7XHJcbiAgICAgICAgICB4LmUgPSBlO1xyXG4gICAgICAgICAgeC5jID0gW25dO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RyID0gU3RyaW5nKG4pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHN0ciA9IFN0cmluZyhuKTtcclxuICAgICAgICBpZiAoIWlzTnVtZXJpYy50ZXN0KHN0cikpIHJldHVybiBwYXJzZU51bWVyaWMoeCwgc3RyLCBpc051bSk7XHJcbiAgICAgICAgeC5zID0gc3RyLmNoYXJDb2RlQXQoMCkgPT0gNDUgPyAoc3RyID0gc3RyLnNsaWNlKDEpLCAtMSkgOiAxO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBEZWNpbWFsIHBvaW50P1xyXG4gICAgICAgIGlmICgoZSA9IHN0ci5pbmRleE9mKCcuJykpID4gLTEpIHN0ciA9IHN0ci5yZXBsYWNlKCcuJywgJycpO1xyXG5cclxuICAgICAgICAvLyBFeHBvbmVudGlhbCBmb3JtP1xyXG4gICAgICAgIGlmICgoaSA9IHN0ci5zZWFyY2goL2UvaSkpID4gMCkge1xyXG5cclxuICAgICAgICAgIC8vIERldGVybWluZSBleHBvbmVudC5cclxuICAgICAgICAgIGlmIChlIDwgMCkgZSA9IGk7XHJcbiAgICAgICAgICBlICs9ICtzdHIuc2xpY2UoaSArIDEpO1xyXG4gICAgICAgICAgc3RyID0gc3RyLnN1YnN0cmluZygwLCBpKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGUgPCAwKSB7XHJcblxyXG4gICAgICAgICAgLy8gSW50ZWdlci5cclxuICAgICAgICAgIGUgPSBzdHIubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgLy8gJ1tCaWdOdW1iZXIgRXJyb3JdIEJhc2Uge25vdCBhIHByaW1pdGl2ZSBudW1iZXJ8bm90IGFuIGludGVnZXJ8b3V0IG9mIHJhbmdlfToge2J9J1xyXG4gICAgICBpbnRDaGVjayhiLCAyLCBBTFBIQUJFVC5sZW5ndGgsICdCYXNlJyk7XHJcbiAgICAgIHN0ciA9IFN0cmluZyhuKTtcclxuXHJcbiAgICAgIC8vIEFsbG93IGV4cG9uZW50aWFsIG5vdGF0aW9uIHRvIGJlIHVzZWQgd2l0aCBiYXNlIDEwIGFyZ3VtZW50LCB3aGlsZVxyXG4gICAgICAvLyBhbHNvIHJvdW5kaW5nIHRvIERFQ0lNQUxfUExBQ0VTIGFzIHdpdGggb3RoZXIgYmFzZXMuXHJcbiAgICAgIGlmIChiID09IDEwKSB7XHJcbiAgICAgICAgeCA9IG5ldyBCaWdOdW1iZXIobiBpbnN0YW5jZW9mIEJpZ051bWJlciA/IG4gOiBzdHIpO1xyXG4gICAgICAgIHJldHVybiByb3VuZCh4LCBERUNJTUFMX1BMQUNFUyArIHguZSArIDEsIFJPVU5ESU5HX01PREUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpc051bSA9IHR5cGVvZiBuID09ICdudW1iZXInO1xyXG5cclxuICAgICAgaWYgKGlzTnVtKSB7XHJcblxyXG4gICAgICAgIC8vIEF2b2lkIHBvdGVudGlhbCBpbnRlcnByZXRhdGlvbiBvZiBJbmZpbml0eSBhbmQgTmFOIGFzIGJhc2UgNDQrIHZhbHVlcy5cclxuICAgICAgICBpZiAobiAqIDAgIT0gMCkgcmV0dXJuIHBhcnNlTnVtZXJpYyh4LCBzdHIsIGlzTnVtLCBiKTtcclxuXHJcbiAgICAgICAgeC5zID0gMSAvIG4gPCAwID8gKHN0ciA9IHN0ci5zbGljZSgxKSwgLTEpIDogMTtcclxuXHJcbiAgICAgICAgLy8gJ1tCaWdOdW1iZXIgRXJyb3JdIE51bWJlciBwcmltaXRpdmUgaGFzIG1vcmUgdGhhbiAxNSBzaWduaWZpY2FudCBkaWdpdHM6IHtufSdcclxuICAgICAgICBpZiAoQmlnTnVtYmVyLkRFQlVHICYmIHN0ci5yZXBsYWNlKC9eMFxcLjAqfFxcLi8sICcnKS5sZW5ndGggPiAxNSkge1xyXG4gICAgICAgICAgdGhyb3cgRXJyb3JcclxuICAgICAgICAgICAodG9vTWFueURpZ2l0cyArIG4pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gUHJldmVudCBsYXRlciBjaGVjayBmb3IgbGVuZ3RoIG9uIGNvbnZlcnRlZCBudW1iZXIuXHJcbiAgICAgICAgaXNOdW0gPSBmYWxzZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB4LnMgPSBzdHIuY2hhckNvZGVBdCgwKSA9PT0gNDUgPyAoc3RyID0gc3RyLnNsaWNlKDEpLCAtMSkgOiAxO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBhbHBoYWJldCA9IEFMUEhBQkVULnNsaWNlKDAsIGIpO1xyXG4gICAgICBlID0gaSA9IDA7XHJcblxyXG4gICAgICAvLyBDaGVjayB0aGF0IHN0ciBpcyBhIHZhbGlkIGJhc2UgYiBudW1iZXIuXHJcbiAgICAgIC8vIERvbid0IHVzZSBSZWdFeHAgc28gYWxwaGFiZXQgY2FuIGNvbnRhaW4gc3BlY2lhbCBjaGFyYWN0ZXJzLlxyXG4gICAgICBmb3IgKGxlbiA9IHN0ci5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgIGlmIChhbHBoYWJldC5pbmRleE9mKGMgPSBzdHIuY2hhckF0KGkpKSA8IDApIHtcclxuICAgICAgICAgIGlmIChjID09ICcuJykge1xyXG5cclxuICAgICAgICAgICAgLy8gSWYgJy4nIGlzIG5vdCB0aGUgZmlyc3QgY2hhcmFjdGVyIGFuZCBpdCBoYXMgbm90IGJlIGZvdW5kIGJlZm9yZS5cclxuICAgICAgICAgICAgaWYgKGkgPiBlKSB7XHJcbiAgICAgICAgICAgICAgZSA9IGxlbjtcclxuICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIGlmICghY2FzZUNoYW5nZWQpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIEFsbG93IGUuZy4gaGV4YWRlY2ltYWwgJ0ZGJyBhcyB3ZWxsIGFzICdmZicuXHJcbiAgICAgICAgICAgIGlmIChzdHIgPT0gc3RyLnRvVXBwZXJDYXNlKCkgJiYgKHN0ciA9IHN0ci50b0xvd2VyQ2FzZSgpKSB8fFxyXG4gICAgICAgICAgICAgICAgc3RyID09IHN0ci50b0xvd2VyQ2FzZSgpICYmIChzdHIgPSBzdHIudG9VcHBlckNhc2UoKSkpIHtcclxuICAgICAgICAgICAgICBjYXNlQ2hhbmdlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgaSA9IC0xO1xyXG4gICAgICAgICAgICAgIGUgPSAwO1xyXG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgcmV0dXJuIHBhcnNlTnVtZXJpYyh4LCBTdHJpbmcobiksIGlzTnVtLCBiKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHN0ciA9IGNvbnZlcnRCYXNlKHN0ciwgYiwgMTAsIHgucyk7XHJcblxyXG4gICAgICAvLyBEZWNpbWFsIHBvaW50P1xyXG4gICAgICBpZiAoKGUgPSBzdHIuaW5kZXhPZignLicpKSA+IC0xKSBzdHIgPSBzdHIucmVwbGFjZSgnLicsICcnKTtcclxuICAgICAgZWxzZSBlID0gc3RyLmxlbmd0aDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBEZXRlcm1pbmUgbGVhZGluZyB6ZXJvcy5cclxuICAgIGZvciAoaSA9IDA7IHN0ci5jaGFyQ29kZUF0KGkpID09PSA0ODsgaSsrKTtcclxuXHJcbiAgICAvLyBEZXRlcm1pbmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgICBmb3IgKGxlbiA9IHN0ci5sZW5ndGg7IHN0ci5jaGFyQ29kZUF0KC0tbGVuKSA9PT0gNDg7KTtcclxuXHJcbiAgICBzdHIgPSBzdHIuc2xpY2UoaSwgKytsZW4pO1xyXG5cclxuICAgIGlmIChzdHIpIHtcclxuICAgICAgbGVuIC09IGk7XHJcblxyXG4gICAgICAvLyAnW0JpZ051bWJlciBFcnJvcl0gTnVtYmVyIHByaW1pdGl2ZSBoYXMgbW9yZSB0aGFuIDE1IHNpZ25pZmljYW50IGRpZ2l0czoge259J1xyXG4gICAgICBpZiAoaXNOdW0gJiYgQmlnTnVtYmVyLkRFQlVHICYmXHJcbiAgICAgICAgbGVuID4gMTUgJiYgKG4gPiBNQVhfU0FGRV9JTlRFR0VSIHx8IG4gIT09IG1hdGhmbG9vcihuKSkpIHtcclxuICAgICAgICAgIHRocm93IEVycm9yXHJcbiAgICAgICAgICAgKHRvb01hbnlEaWdpdHMgKyAoeC5zICogbikpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBlID0gZSAtIGkgLSAxO1xyXG5cclxuICAgICAgIC8vIE92ZXJmbG93P1xyXG4gICAgICBpZiAoZSA+IE1BWF9FWFApIHtcclxuXHJcbiAgICAgICAgLy8gSW5maW5pdHkuXHJcbiAgICAgICAgeC5jID0geC5lID0gbnVsbDtcclxuXHJcbiAgICAgIC8vIFVuZGVyZmxvdz9cclxuICAgICAgfSBlbHNlIGlmIChlIDwgTUlOX0VYUCkge1xyXG5cclxuICAgICAgICAvLyBaZXJvLlxyXG4gICAgICAgIHguYyA9IFt4LmUgPSAwXTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB4LmUgPSBlO1xyXG4gICAgICAgIHguYyA9IFtdO1xyXG5cclxuICAgICAgICAvLyBUcmFuc2Zvcm0gYmFzZVxyXG5cclxuICAgICAgICAvLyBlIGlzIHRoZSBiYXNlIDEwIGV4cG9uZW50LlxyXG4gICAgICAgIC8vIGkgaXMgd2hlcmUgdG8gc2xpY2Ugc3RyIHRvIGdldCB0aGUgZmlyc3QgZWxlbWVudCBvZiB0aGUgY29lZmZpY2llbnQgYXJyYXkuXHJcbiAgICAgICAgaSA9IChlICsgMSkgJSBMT0dfQkFTRTtcclxuICAgICAgICBpZiAoZSA8IDApIGkgKz0gTE9HX0JBU0U7XHJcblxyXG4gICAgICAgIGlmIChpIDwgbGVuKSB7XHJcbiAgICAgICAgICBpZiAoaSkgeC5jLnB1c2goK3N0ci5zbGljZSgwLCBpKSk7XHJcblxyXG4gICAgICAgICAgZm9yIChsZW4gLT0gTE9HX0JBU0U7IGkgPCBsZW47KSB7XHJcbiAgICAgICAgICAgIHguYy5wdXNoKCtzdHIuc2xpY2UoaSwgaSArPSBMT0dfQkFTRSkpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHN0ciA9IHN0ci5zbGljZShpKTtcclxuICAgICAgICAgIGkgPSBMT0dfQkFTRSAtIHN0ci5sZW5ndGg7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGkgLT0gbGVuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yICg7IGktLTsgc3RyICs9ICcwJyk7XHJcbiAgICAgICAgeC5jLnB1c2goK3N0cik7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAvLyBaZXJvLlxyXG4gICAgICB4LmMgPSBbeC5lID0gMF07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgLy8gQ09OU1RSVUNUT1IgUFJPUEVSVElFU1xyXG5cclxuXHJcbiAgQmlnTnVtYmVyLmNsb25lID0gY2xvbmU7XHJcblxyXG4gIEJpZ051bWJlci5ST1VORF9VUCA9IDA7XHJcbiAgQmlnTnVtYmVyLlJPVU5EX0RPV04gPSAxO1xyXG4gIEJpZ051bWJlci5ST1VORF9DRUlMID0gMjtcclxuICBCaWdOdW1iZXIuUk9VTkRfRkxPT1IgPSAzO1xyXG4gIEJpZ051bWJlci5ST1VORF9IQUxGX1VQID0gNDtcclxuICBCaWdOdW1iZXIuUk9VTkRfSEFMRl9ET1dOID0gNTtcclxuICBCaWdOdW1iZXIuUk9VTkRfSEFMRl9FVkVOID0gNjtcclxuICBCaWdOdW1iZXIuUk9VTkRfSEFMRl9DRUlMID0gNztcclxuICBCaWdOdW1iZXIuUk9VTkRfSEFMRl9GTE9PUiA9IDg7XHJcbiAgQmlnTnVtYmVyLkVVQ0xJRCA9IDk7XHJcblxyXG5cclxuICAvKlxyXG4gICAqIENvbmZpZ3VyZSBpbmZyZXF1ZW50bHktY2hhbmdpbmcgbGlicmFyeS13aWRlIHNldHRpbmdzLlxyXG4gICAqXHJcbiAgICogQWNjZXB0IGFuIG9iamVjdCB3aXRoIHRoZSBmb2xsb3dpbmcgb3B0aW9uYWwgcHJvcGVydGllcyAoaWYgdGhlIHZhbHVlIG9mIGEgcHJvcGVydHkgaXNcclxuICAgKiBhIG51bWJlciwgaXQgbXVzdCBiZSBhbiBpbnRlZ2VyIHdpdGhpbiB0aGUgaW5jbHVzaXZlIHJhbmdlIHN0YXRlZCk6XHJcbiAgICpcclxuICAgKiAgIERFQ0lNQUxfUExBQ0VTICAge251bWJlcn0gICAgICAgICAgIDAgdG8gTUFYXHJcbiAgICogICBST1VORElOR19NT0RFICAgIHtudW1iZXJ9ICAgICAgICAgICAwIHRvIDhcclxuICAgKiAgIEVYUE9ORU5USUFMX0FUICAge251bWJlcnxudW1iZXJbXX0gIC1NQVggdG8gTUFYICBvciAgWy1NQVggdG8gMCwgMCB0byBNQVhdXHJcbiAgICogICBSQU5HRSAgICAgICAgICAgIHtudW1iZXJ8bnVtYmVyW119ICAtTUFYIHRvIE1BWCAobm90IHplcm8pICBvciAgWy1NQVggdG8gLTEsIDEgdG8gTUFYXVxyXG4gICAqICAgQ1JZUFRPICAgICAgICAgICB7Ym9vbGVhbn0gICAgICAgICAgdHJ1ZSBvciBmYWxzZVxyXG4gICAqICAgTU9EVUxPX01PREUgICAgICB7bnVtYmVyfSAgICAgICAgICAgMCB0byA5XHJcbiAgICogICBQT1dfUFJFQ0lTSU9OICAgICAgIHtudW1iZXJ9ICAgICAgICAgICAwIHRvIE1BWFxyXG4gICAqICAgQUxQSEFCRVQgICAgICAgICB7c3RyaW5nfSAgICAgICAgICAgQSBzdHJpbmcgb2YgdHdvIG9yIG1vcmUgdW5pcXVlIGNoYXJhY3RlcnMgd2hpY2ggZG9lc1xyXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vdCBjb250YWluICcuJy5cclxuICAgKiAgIEZPUk1BVCAgICAgICAgICAge29iamVjdH0gICAgICAgICAgIEFuIG9iamVjdCB3aXRoIHNvbWUgb2YgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxyXG4gICAqICAgICBwcmVmaXggICAgICAgICAgICAgICAgIHtzdHJpbmd9XHJcbiAgICogICAgIGdyb3VwU2l6ZSAgICAgICAgICAgICAge251bWJlcn1cclxuICAgKiAgICAgc2Vjb25kYXJ5R3JvdXBTaXplICAgICB7bnVtYmVyfVxyXG4gICAqICAgICBncm91cFNlcGFyYXRvciAgICAgICAgIHtzdHJpbmd9XHJcbiAgICogICAgIGRlY2ltYWxTZXBhcmF0b3IgICAgICAge3N0cmluZ31cclxuICAgKiAgICAgZnJhY3Rpb25Hcm91cFNpemUgICAgICB7bnVtYmVyfVxyXG4gICAqICAgICBmcmFjdGlvbkdyb3VwU2VwYXJhdG9yIHtzdHJpbmd9XHJcbiAgICogICAgIHN1ZmZpeCAgICAgICAgICAgICAgICAge3N0cmluZ31cclxuICAgKlxyXG4gICAqIChUaGUgdmFsdWVzIGFzc2lnbmVkIHRvIHRoZSBhYm92ZSBGT1JNQVQgb2JqZWN0IHByb3BlcnRpZXMgYXJlIG5vdCBjaGVja2VkIGZvciB2YWxpZGl0eS4pXHJcbiAgICpcclxuICAgKiBFLmcuXHJcbiAgICogQmlnTnVtYmVyLmNvbmZpZyh7IERFQ0lNQUxfUExBQ0VTIDogMjAsIFJPVU5ESU5HX01PREUgOiA0IH0pXHJcbiAgICpcclxuICAgKiBJZ25vcmUgcHJvcGVydGllcy9wYXJhbWV0ZXJzIHNldCB0byBudWxsIG9yIHVuZGVmaW5lZCwgZXhjZXB0IGZvciBBTFBIQUJFVC5cclxuICAgKlxyXG4gICAqIFJldHVybiBhbiBvYmplY3Qgd2l0aCB0aGUgcHJvcGVydGllcyBjdXJyZW50IHZhbHVlcy5cclxuICAgKi9cclxuICBCaWdOdW1iZXIuY29uZmlnID0gQmlnTnVtYmVyLnNldCA9IGZ1bmN0aW9uIChvYmopIHtcclxuICAgIHZhciBwLCB2O1xyXG5cclxuICAgIGlmIChvYmogIT0gbnVsbCkge1xyXG5cclxuICAgICAgaWYgKHR5cGVvZiBvYmogPT0gJ29iamVjdCcpIHtcclxuXHJcbiAgICAgICAgLy8gREVDSU1BTF9QTEFDRVMge251bWJlcn0gSW50ZWdlciwgMCB0byBNQVggaW5jbHVzaXZlLlxyXG4gICAgICAgIC8vICdbQmlnTnVtYmVyIEVycm9yXSBERUNJTUFMX1BMQUNFUyB7bm90IGEgcHJpbWl0aXZlIG51bWJlcnxub3QgYW4gaW50ZWdlcnxvdXQgb2YgcmFuZ2V9OiB7dn0nXHJcbiAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShwID0gJ0RFQ0lNQUxfUExBQ0VTJykpIHtcclxuICAgICAgICAgIHYgPSBvYmpbcF07XHJcbiAgICAgICAgICBpbnRDaGVjayh2LCAwLCBNQVgsIHApO1xyXG4gICAgICAgICAgREVDSU1BTF9QTEFDRVMgPSB2O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gUk9VTkRJTkdfTU9ERSB7bnVtYmVyfSBJbnRlZ2VyLCAwIHRvIDggaW5jbHVzaXZlLlxyXG4gICAgICAgIC8vICdbQmlnTnVtYmVyIEVycm9yXSBST1VORElOR19NT0RFIHtub3QgYSBwcmltaXRpdmUgbnVtYmVyfG5vdCBhbiBpbnRlZ2VyfG91dCBvZiByYW5nZX06IHt2fSdcclxuICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KHAgPSAnUk9VTkRJTkdfTU9ERScpKSB7XHJcbiAgICAgICAgICB2ID0gb2JqW3BdO1xyXG4gICAgICAgICAgaW50Q2hlY2sodiwgMCwgOCwgcCk7XHJcbiAgICAgICAgICBST1VORElOR19NT0RFID0gdjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEVYUE9ORU5USUFMX0FUIHtudW1iZXJ8bnVtYmVyW119XHJcbiAgICAgICAgLy8gSW50ZWdlciwgLU1BWCB0byBNQVggaW5jbHVzaXZlIG9yXHJcbiAgICAgICAgLy8gW2ludGVnZXIgLU1BWCB0byAwIGluY2x1c2l2ZSwgMCB0byBNQVggaW5jbHVzaXZlXS5cclxuICAgICAgICAvLyAnW0JpZ051bWJlciBFcnJvcl0gRVhQT05FTlRJQUxfQVQge25vdCBhIHByaW1pdGl2ZSBudW1iZXJ8bm90IGFuIGludGVnZXJ8b3V0IG9mIHJhbmdlfToge3Z9J1xyXG4gICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkocCA9ICdFWFBPTkVOVElBTF9BVCcpKSB7XHJcbiAgICAgICAgICB2ID0gb2JqW3BdO1xyXG4gICAgICAgICAgaWYgKHYgJiYgdi5wb3ApIHtcclxuICAgICAgICAgICAgaW50Q2hlY2sodlswXSwgLU1BWCwgMCwgcCk7XHJcbiAgICAgICAgICAgIGludENoZWNrKHZbMV0sIDAsIE1BWCwgcCk7XHJcbiAgICAgICAgICAgIFRPX0VYUF9ORUcgPSB2WzBdO1xyXG4gICAgICAgICAgICBUT19FWFBfUE9TID0gdlsxXTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGludENoZWNrKHYsIC1NQVgsIE1BWCwgcCk7XHJcbiAgICAgICAgICAgIFRPX0VYUF9ORUcgPSAtKFRPX0VYUF9QT1MgPSB2IDwgMCA/IC12IDogdik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBSQU5HRSB7bnVtYmVyfG51bWJlcltdfSBOb24temVybyBpbnRlZ2VyLCAtTUFYIHRvIE1BWCBpbmNsdXNpdmUgb3JcclxuICAgICAgICAvLyBbaW50ZWdlciAtTUFYIHRvIC0xIGluY2x1c2l2ZSwgaW50ZWdlciAxIHRvIE1BWCBpbmNsdXNpdmVdLlxyXG4gICAgICAgIC8vICdbQmlnTnVtYmVyIEVycm9yXSBSQU5HRSB7bm90IGEgcHJpbWl0aXZlIG51bWJlcnxub3QgYW4gaW50ZWdlcnxvdXQgb2YgcmFuZ2V8Y2Fubm90IGJlIHplcm99OiB7dn0nXHJcbiAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShwID0gJ1JBTkdFJykpIHtcclxuICAgICAgICAgIHYgPSBvYmpbcF07XHJcbiAgICAgICAgICBpZiAodiAmJiB2LnBvcCkge1xyXG4gICAgICAgICAgICBpbnRDaGVjayh2WzBdLCAtTUFYLCAtMSwgcCk7XHJcbiAgICAgICAgICAgIGludENoZWNrKHZbMV0sIDEsIE1BWCwgcCk7XHJcbiAgICAgICAgICAgIE1JTl9FWFAgPSB2WzBdO1xyXG4gICAgICAgICAgICBNQVhfRVhQID0gdlsxXTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGludENoZWNrKHYsIC1NQVgsIE1BWCwgcCk7XHJcbiAgICAgICAgICAgIGlmICh2KSB7XHJcbiAgICAgICAgICAgICAgTUlOX0VYUCA9IC0oTUFYX0VYUCA9IHYgPCAwID8gLXYgOiB2KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICB0aHJvdyBFcnJvclxyXG4gICAgICAgICAgICAgICAoYmlnbnVtYmVyRXJyb3IgKyBwICsgJyBjYW5ub3QgYmUgemVybzogJyArIHYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBDUllQVE8ge2Jvb2xlYW59IHRydWUgb3IgZmFsc2UuXHJcbiAgICAgICAgLy8gJ1tCaWdOdW1iZXIgRXJyb3JdIENSWVBUTyBub3QgdHJ1ZSBvciBmYWxzZToge3Z9J1xyXG4gICAgICAgIC8vICdbQmlnTnVtYmVyIEVycm9yXSBjcnlwdG8gdW5hdmFpbGFibGUnXHJcbiAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShwID0gJ0NSWVBUTycpKSB7XHJcbiAgICAgICAgICB2ID0gb2JqW3BdO1xyXG4gICAgICAgICAgaWYgKHYgPT09ICEhdikge1xyXG4gICAgICAgICAgICBpZiAodikge1xyXG4gICAgICAgICAgICAgIGlmICh0eXBlb2YgY3J5cHRvICE9ICd1bmRlZmluZWQnICYmIGNyeXB0byAmJlxyXG4gICAgICAgICAgICAgICAoY3J5cHRvLmdldFJhbmRvbVZhbHVlcyB8fCBjcnlwdG8ucmFuZG9tQnl0ZXMpKSB7XHJcbiAgICAgICAgICAgICAgICBDUllQVE8gPSB2O1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBDUllQVE8gPSAhdjtcclxuICAgICAgICAgICAgICAgIHRocm93IEVycm9yXHJcbiAgICAgICAgICAgICAgICAgKGJpZ251bWJlckVycm9yICsgJ2NyeXB0byB1bmF2YWlsYWJsZScpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBDUllQVE8gPSB2O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBFcnJvclxyXG4gICAgICAgICAgICAgKGJpZ251bWJlckVycm9yICsgcCArICcgbm90IHRydWUgb3IgZmFsc2U6ICcgKyB2KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIE1PRFVMT19NT0RFIHtudW1iZXJ9IEludGVnZXIsIDAgdG8gOSBpbmNsdXNpdmUuXHJcbiAgICAgICAgLy8gJ1tCaWdOdW1iZXIgRXJyb3JdIE1PRFVMT19NT0RFIHtub3QgYSBwcmltaXRpdmUgbnVtYmVyfG5vdCBhbiBpbnRlZ2VyfG91dCBvZiByYW5nZX06IHt2fSdcclxuICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KHAgPSAnTU9EVUxPX01PREUnKSkge1xyXG4gICAgICAgICAgdiA9IG9ialtwXTtcclxuICAgICAgICAgIGludENoZWNrKHYsIDAsIDksIHApO1xyXG4gICAgICAgICAgTU9EVUxPX01PREUgPSB2O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gUE9XX1BSRUNJU0lPTiB7bnVtYmVyfSBJbnRlZ2VyLCAwIHRvIE1BWCBpbmNsdXNpdmUuXHJcbiAgICAgICAgLy8gJ1tCaWdOdW1iZXIgRXJyb3JdIFBPV19QUkVDSVNJT04ge25vdCBhIHByaW1pdGl2ZSBudW1iZXJ8bm90IGFuIGludGVnZXJ8b3V0IG9mIHJhbmdlfToge3Z9J1xyXG4gICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkocCA9ICdQT1dfUFJFQ0lTSU9OJykpIHtcclxuICAgICAgICAgIHYgPSBvYmpbcF07XHJcbiAgICAgICAgICBpbnRDaGVjayh2LCAwLCBNQVgsIHApO1xyXG4gICAgICAgICAgUE9XX1BSRUNJU0lPTiA9IHY7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBGT1JNQVQge29iamVjdH1cclxuICAgICAgICAvLyAnW0JpZ051bWJlciBFcnJvcl0gRk9STUFUIG5vdCBhbiBvYmplY3Q6IHt2fSdcclxuICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KHAgPSAnRk9STUFUJykpIHtcclxuICAgICAgICAgIHYgPSBvYmpbcF07XHJcbiAgICAgICAgICBpZiAodHlwZW9mIHYgPT0gJ29iamVjdCcpIEZPUk1BVCA9IHY7XHJcbiAgICAgICAgICBlbHNlIHRocm93IEVycm9yXHJcbiAgICAgICAgICAgKGJpZ251bWJlckVycm9yICsgcCArICcgbm90IGFuIG9iamVjdDogJyArIHYpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQUxQSEFCRVQge3N0cmluZ31cclxuICAgICAgICAvLyAnW0JpZ051bWJlciBFcnJvcl0gQUxQSEFCRVQgaW52YWxpZDoge3Z9J1xyXG4gICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkocCA9ICdBTFBIQUJFVCcpKSB7XHJcbiAgICAgICAgICB2ID0gb2JqW3BdO1xyXG5cclxuICAgICAgICAgIC8vIERpc2FsbG93IGlmIG9ubHkgb25lIGNoYXJhY3RlcixcclxuICAgICAgICAgIC8vIG9yIGlmIGl0IGNvbnRhaW5zICcrJywgJy0nLCAnLicsIHdoaXRlc3BhY2UsIG9yIGEgcmVwZWF0ZWQgY2hhcmFjdGVyLlxyXG4gICAgICAgICAgaWYgKHR5cGVvZiB2ID09ICdzdHJpbmcnICYmICEvXi4kfFsrLS5cXHNdfCguKS4qXFwxLy50ZXN0KHYpKSB7XHJcbiAgICAgICAgICAgIEFMUEhBQkVUID0gdjtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IEVycm9yXHJcbiAgICAgICAgICAgICAoYmlnbnVtYmVyRXJyb3IgKyBwICsgJyBpbnZhbGlkOiAnICsgdik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgLy8gJ1tCaWdOdW1iZXIgRXJyb3JdIE9iamVjdCBleHBlY3RlZDoge3Z9J1xyXG4gICAgICAgIHRocm93IEVycm9yXHJcbiAgICAgICAgIChiaWdudW1iZXJFcnJvciArICdPYmplY3QgZXhwZWN0ZWQ6ICcgKyBvYmopO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgREVDSU1BTF9QTEFDRVM6IERFQ0lNQUxfUExBQ0VTLFxyXG4gICAgICBST1VORElOR19NT0RFOiBST1VORElOR19NT0RFLFxyXG4gICAgICBFWFBPTkVOVElBTF9BVDogW1RPX0VYUF9ORUcsIFRPX0VYUF9QT1NdLFxyXG4gICAgICBSQU5HRTogW01JTl9FWFAsIE1BWF9FWFBdLFxyXG4gICAgICBDUllQVE86IENSWVBUTyxcclxuICAgICAgTU9EVUxPX01PREU6IE1PRFVMT19NT0RFLFxyXG4gICAgICBQT1dfUFJFQ0lTSU9OOiBQT1dfUFJFQ0lTSU9OLFxyXG4gICAgICBGT1JNQVQ6IEZPUk1BVCxcclxuICAgICAgQUxQSEFCRVQ6IEFMUEhBQkVUXHJcbiAgICB9O1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiB0cnVlIGlmIHYgaXMgYSBCaWdOdW1iZXIgaW5zdGFuY2UsIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAgICpcclxuICAgKiB2IHthbnl9XHJcbiAgICovXHJcbiAgQmlnTnVtYmVyLmlzQmlnTnVtYmVyID0gZnVuY3Rpb24gKHYpIHtcclxuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodikgPT0gJ1tvYmplY3QgQmlnTnVtYmVyXSc7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IEJpZ051bWJlciB3aG9zZSB2YWx1ZSBpcyB0aGUgbWF4aW11bSBvZiB0aGUgYXJndW1lbnRzLlxyXG4gICAqXHJcbiAgICogYXJndW1lbnRzIHtudW1iZXJ8c3RyaW5nfEJpZ051bWJlcn1cclxuICAgKi9cclxuICBCaWdOdW1iZXIubWF4aW11bSA9IEJpZ051bWJlci5tYXggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gbWF4T3JNaW4oYXJndW1lbnRzLCBQLmx0KTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgQmlnTnVtYmVyIHdob3NlIHZhbHVlIGlzIHRoZSBtaW5pbXVtIG9mIHRoZSBhcmd1bWVudHMuXHJcbiAgICpcclxuICAgKiBhcmd1bWVudHMge251bWJlcnxzdHJpbmd8QmlnTnVtYmVyfVxyXG4gICAqL1xyXG4gIEJpZ051bWJlci5taW5pbXVtID0gQmlnTnVtYmVyLm1pbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiBtYXhPck1pbihhcmd1bWVudHMsIFAuZ3QpO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBCaWdOdW1iZXIgd2l0aCBhIHJhbmRvbSB2YWx1ZSBlcXVhbCB0byBvciBncmVhdGVyIHRoYW4gMCBhbmQgbGVzcyB0aGFuIDEsXHJcbiAgICogYW5kIHdpdGggZHAsIG9yIERFQ0lNQUxfUExBQ0VTIGlmIGRwIGlzIG9taXR0ZWQsIGRlY2ltYWwgcGxhY2VzIChvciBsZXNzIGlmIHRyYWlsaW5nXHJcbiAgICogemVyb3MgYXJlIHByb2R1Y2VkKS5cclxuICAgKlxyXG4gICAqIFtkcF0ge251bWJlcn0gRGVjaW1hbCBwbGFjZXMuIEludGVnZXIsIDAgdG8gTUFYIGluY2x1c2l2ZS5cclxuICAgKlxyXG4gICAqICdbQmlnTnVtYmVyIEVycm9yXSBBcmd1bWVudCB7bm90IGEgcHJpbWl0aXZlIG51bWJlcnxub3QgYW4gaW50ZWdlcnxvdXQgb2YgcmFuZ2V9OiB7ZHB9J1xyXG4gICAqICdbQmlnTnVtYmVyIEVycm9yXSBjcnlwdG8gdW5hdmFpbGFibGUnXHJcbiAgICovXHJcbiAgQmlnTnVtYmVyLnJhbmRvbSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgcG93Ml81MyA9IDB4MjAwMDAwMDAwMDAwMDA7XHJcblxyXG4gICAgLy8gUmV0dXJuIGEgNTMgYml0IGludGVnZXIgbiwgd2hlcmUgMCA8PSBuIDwgOTAwNzE5OTI1NDc0MDk5Mi5cclxuICAgIC8vIENoZWNrIGlmIE1hdGgucmFuZG9tKCkgcHJvZHVjZXMgbW9yZSB0aGFuIDMyIGJpdHMgb2YgcmFuZG9tbmVzcy5cclxuICAgIC8vIElmIGl0IGRvZXMsIGFzc3VtZSBhdCBsZWFzdCA1MyBiaXRzIGFyZSBwcm9kdWNlZCwgb3RoZXJ3aXNlIGFzc3VtZSBhdCBsZWFzdCAzMCBiaXRzLlxyXG4gICAgLy8gMHg0MDAwMDAwMCBpcyAyXjMwLCAweDgwMDAwMCBpcyAyXjIzLCAweDFmZmZmZiBpcyAyXjIxIC0gMS5cclxuICAgIHZhciByYW5kb201M2JpdEludCA9IChNYXRoLnJhbmRvbSgpICogcG93Ml81MykgJiAweDFmZmZmZlxyXG4gICAgID8gZnVuY3Rpb24gKCkgeyByZXR1cm4gbWF0aGZsb29yKE1hdGgucmFuZG9tKCkgKiBwb3cyXzUzKTsgfVxyXG4gICAgIDogZnVuY3Rpb24gKCkgeyByZXR1cm4gKChNYXRoLnJhbmRvbSgpICogMHg0MDAwMDAwMCB8IDApICogMHg4MDAwMDApICtcclxuICAgICAgIChNYXRoLnJhbmRvbSgpICogMHg4MDAwMDAgfCAwKTsgfTtcclxuXHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGRwKSB7XHJcbiAgICAgIHZhciBhLCBiLCBlLCBrLCB2LFxyXG4gICAgICAgIGkgPSAwLFxyXG4gICAgICAgIGMgPSBbXSxcclxuICAgICAgICByYW5kID0gbmV3IEJpZ051bWJlcihPTkUpO1xyXG5cclxuICAgICAgaWYgKGRwID09IG51bGwpIGRwID0gREVDSU1BTF9QTEFDRVM7XHJcbiAgICAgIGVsc2UgaW50Q2hlY2soZHAsIDAsIE1BWCk7XHJcblxyXG4gICAgICBrID0gbWF0aGNlaWwoZHAgLyBMT0dfQkFTRSk7XHJcblxyXG4gICAgICBpZiAoQ1JZUFRPKSB7XHJcblxyXG4gICAgICAgIC8vIEJyb3dzZXJzIHN1cHBvcnRpbmcgY3J5cHRvLmdldFJhbmRvbVZhbHVlcy5cclxuICAgICAgICBpZiAoY3J5cHRvLmdldFJhbmRvbVZhbHVlcykge1xyXG5cclxuICAgICAgICAgIGEgPSBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKG5ldyBVaW50MzJBcnJheShrICo9IDIpKTtcclxuXHJcbiAgICAgICAgICBmb3IgKDsgaSA8IGs7KSB7XHJcblxyXG4gICAgICAgICAgICAvLyA1MyBiaXRzOlxyXG4gICAgICAgICAgICAvLyAoKE1hdGgucG93KDIsIDMyKSAtIDEpICogTWF0aC5wb3coMiwgMjEpKS50b1N0cmluZygyKVxyXG4gICAgICAgICAgICAvLyAxMTExMSAxMTExMTExMSAxMTExMTExMSAxMTExMTExMSAxMTEwMDAwMCAwMDAwMDAwMCAwMDAwMDAwMFxyXG4gICAgICAgICAgICAvLyAoKE1hdGgucG93KDIsIDMyKSAtIDEpID4+PiAxMSkudG9TdHJpbmcoMilcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMTExMTEgMTExMTExMTEgMTExMTExMTFcclxuICAgICAgICAgICAgLy8gMHgyMDAwMCBpcyAyXjIxLlxyXG4gICAgICAgICAgICB2ID0gYVtpXSAqIDB4MjAwMDAgKyAoYVtpICsgMV0gPj4+IDExKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFJlamVjdGlvbiBzYW1wbGluZzpcclxuICAgICAgICAgICAgLy8gMCA8PSB2IDwgOTAwNzE5OTI1NDc0MDk5MlxyXG4gICAgICAgICAgICAvLyBQcm9iYWJpbGl0eSB0aGF0IHYgPj0gOWUxNSwgaXNcclxuICAgICAgICAgICAgLy8gNzE5OTI1NDc0MDk5MiAvIDkwMDcxOTkyNTQ3NDA5OTIgfj0gMC4wMDA4LCBpLmUuIDEgaW4gMTI1MVxyXG4gICAgICAgICAgICBpZiAodiA+PSA5ZTE1KSB7XHJcbiAgICAgICAgICAgICAgYiA9IGNyeXB0by5nZXRSYW5kb21WYWx1ZXMobmV3IFVpbnQzMkFycmF5KDIpKTtcclxuICAgICAgICAgICAgICBhW2ldID0gYlswXTtcclxuICAgICAgICAgICAgICBhW2kgKyAxXSA9IGJbMV07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgIC8vIDAgPD0gdiA8PSA4OTk5OTk5OTk5OTk5OTk5XHJcbiAgICAgICAgICAgICAgLy8gMCA8PSAodiAlIDFlMTQpIDw9IDk5OTk5OTk5OTk5OTk5XHJcbiAgICAgICAgICAgICAgYy5wdXNoKHYgJSAxZTE0KTtcclxuICAgICAgICAgICAgICBpICs9IDI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGkgPSBrIC8gMjtcclxuXHJcbiAgICAgICAgLy8gTm9kZS5qcyBzdXBwb3J0aW5nIGNyeXB0by5yYW5kb21CeXRlcy5cclxuICAgICAgICB9IGVsc2UgaWYgKGNyeXB0by5yYW5kb21CeXRlcykge1xyXG5cclxuICAgICAgICAgIC8vIGJ1ZmZlclxyXG4gICAgICAgICAgYSA9IGNyeXB0by5yYW5kb21CeXRlcyhrICo9IDcpO1xyXG5cclxuICAgICAgICAgIGZvciAoOyBpIDwgazspIHtcclxuXHJcbiAgICAgICAgICAgIC8vIDB4MTAwMDAwMDAwMDAwMCBpcyAyXjQ4LCAweDEwMDAwMDAwMDAwIGlzIDJeNDBcclxuICAgICAgICAgICAgLy8gMHgxMDAwMDAwMDAgaXMgMl4zMiwgMHgxMDAwMDAwIGlzIDJeMjRcclxuICAgICAgICAgICAgLy8gMTExMTEgMTExMTExMTEgMTExMTExMTEgMTExMTExMTEgMTExMTExMTEgMTExMTExMTEgMTExMTExMTFcclxuICAgICAgICAgICAgLy8gMCA8PSB2IDwgOTAwNzE5OTI1NDc0MDk5MlxyXG4gICAgICAgICAgICB2ID0gKChhW2ldICYgMzEpICogMHgxMDAwMDAwMDAwMDAwKSArIChhW2kgKyAxXSAqIDB4MTAwMDAwMDAwMDApICtcclxuICAgICAgICAgICAgICAgKGFbaSArIDJdICogMHgxMDAwMDAwMDApICsgKGFbaSArIDNdICogMHgxMDAwMDAwKSArXHJcbiAgICAgICAgICAgICAgIChhW2kgKyA0XSA8PCAxNikgKyAoYVtpICsgNV0gPDwgOCkgKyBhW2kgKyA2XTtcclxuXHJcbiAgICAgICAgICAgIGlmICh2ID49IDllMTUpIHtcclxuICAgICAgICAgICAgICBjcnlwdG8ucmFuZG9tQnl0ZXMoNykuY29weShhLCBpKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgLy8gMCA8PSAodiAlIDFlMTQpIDw9IDk5OTk5OTk5OTk5OTk5XHJcbiAgICAgICAgICAgICAgYy5wdXNoKHYgJSAxZTE0KTtcclxuICAgICAgICAgICAgICBpICs9IDc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGkgPSBrIC8gNztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgQ1JZUFRPID0gZmFsc2U7XHJcbiAgICAgICAgICB0aHJvdyBFcnJvclxyXG4gICAgICAgICAgIChiaWdudW1iZXJFcnJvciArICdjcnlwdG8gdW5hdmFpbGFibGUnKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFVzZSBNYXRoLnJhbmRvbS5cclxuICAgICAgaWYgKCFDUllQVE8pIHtcclxuXHJcbiAgICAgICAgZm9yICg7IGkgPCBrOykge1xyXG4gICAgICAgICAgdiA9IHJhbmRvbTUzYml0SW50KCk7XHJcbiAgICAgICAgICBpZiAodiA8IDllMTUpIGNbaSsrXSA9IHYgJSAxZTE0O1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgayA9IGNbLS1pXTtcclxuICAgICAgZHAgJT0gTE9HX0JBU0U7XHJcblxyXG4gICAgICAvLyBDb252ZXJ0IHRyYWlsaW5nIGRpZ2l0cyB0byB6ZXJvcyBhY2NvcmRpbmcgdG8gZHAuXHJcbiAgICAgIGlmIChrICYmIGRwKSB7XHJcbiAgICAgICAgdiA9IFBPV1NfVEVOW0xPR19CQVNFIC0gZHBdO1xyXG4gICAgICAgIGNbaV0gPSBtYXRoZmxvb3IoayAvIHYpICogdjtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gUmVtb3ZlIHRyYWlsaW5nIGVsZW1lbnRzIHdoaWNoIGFyZSB6ZXJvLlxyXG4gICAgICBmb3IgKDsgY1tpXSA9PT0gMDsgYy5wb3AoKSwgaS0tKTtcclxuXHJcbiAgICAgIC8vIFplcm8/XHJcbiAgICAgIGlmIChpIDwgMCkge1xyXG4gICAgICAgIGMgPSBbZSA9IDBdO1xyXG4gICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAvLyBSZW1vdmUgbGVhZGluZyBlbGVtZW50cyB3aGljaCBhcmUgemVybyBhbmQgYWRqdXN0IGV4cG9uZW50IGFjY29yZGluZ2x5LlxyXG4gICAgICAgIGZvciAoZSA9IC0xIDsgY1swXSA9PT0gMDsgYy5zcGxpY2UoMCwgMSksIGUgLT0gTE9HX0JBU0UpO1xyXG5cclxuICAgICAgICAvLyBDb3VudCB0aGUgZGlnaXRzIG9mIHRoZSBmaXJzdCBlbGVtZW50IG9mIGMgdG8gZGV0ZXJtaW5lIGxlYWRpbmcgemVyb3MsIGFuZC4uLlxyXG4gICAgICAgIGZvciAoaSA9IDEsIHYgPSBjWzBdOyB2ID49IDEwOyB2IC89IDEwLCBpKyspO1xyXG5cclxuICAgICAgICAvLyBhZGp1c3QgdGhlIGV4cG9uZW50IGFjY29yZGluZ2x5LlxyXG4gICAgICAgIGlmIChpIDwgTE9HX0JBU0UpIGUgLT0gTE9HX0JBU0UgLSBpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByYW5kLmUgPSBlO1xyXG4gICAgICByYW5kLmMgPSBjO1xyXG4gICAgICByZXR1cm4gcmFuZDtcclxuICAgIH07XHJcbiAgfSkoKTtcclxuXHJcblxyXG4gICAvKlxyXG4gICAqIFJldHVybiBhIEJpZ051bWJlciB3aG9zZSB2YWx1ZSBpcyB0aGUgc3VtIG9mIHRoZSBhcmd1bWVudHMuXHJcbiAgICpcclxuICAgKiBhcmd1bWVudHMge251bWJlcnxzdHJpbmd8QmlnTnVtYmVyfVxyXG4gICAqL1xyXG4gIEJpZ051bWJlci5zdW0gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgaSA9IDEsXHJcbiAgICAgIGFyZ3MgPSBhcmd1bWVudHMsXHJcbiAgICAgIHN1bSA9IG5ldyBCaWdOdW1iZXIoYXJnc1swXSk7XHJcbiAgICBmb3IgKDsgaSA8IGFyZ3MubGVuZ3RoOykgc3VtID0gc3VtLnBsdXMoYXJnc1tpKytdKTtcclxuICAgIHJldHVybiBzdW07XHJcbiAgfTsgIFxyXG5cclxuICBcclxuICAvLyBQUklWQVRFIEZVTkNUSU9OU1xyXG5cclxuXHJcbiAgLy8gQ2FsbGVkIGJ5IEJpZ051bWJlciBhbmQgQmlnTnVtYmVyLnByb3RvdHlwZS50b1N0cmluZy5cclxuICBjb252ZXJ0QmFzZSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZGVjaW1hbCA9ICcwMTIzNDU2Nzg5JztcclxuXHJcbiAgICAvKlxyXG4gICAgICogQ29udmVydCBzdHJpbmcgb2YgYmFzZUluIHRvIGFuIGFycmF5IG9mIG51bWJlcnMgb2YgYmFzZU91dC5cclxuICAgICAqIEVnLiB0b0Jhc2VPdXQoJzI1NScsIDEwLCAxNikgcmV0dXJucyBbMTUsIDE1XS5cclxuICAgICAqIEVnLiB0b0Jhc2VPdXQoJ2ZmJywgMTYsIDEwKSByZXR1cm5zIFsyLCA1LCA1XS5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gdG9CYXNlT3V0KHN0ciwgYmFzZUluLCBiYXNlT3V0LCBhbHBoYWJldCkge1xyXG4gICAgICB2YXIgaixcclxuICAgICAgICBhcnIgPSBbMF0sXHJcbiAgICAgICAgYXJyTCxcclxuICAgICAgICBpID0gMCxcclxuICAgICAgICBsZW4gPSBzdHIubGVuZ3RoO1xyXG5cclxuICAgICAgZm9yICg7IGkgPCBsZW47KSB7XHJcbiAgICAgICAgZm9yIChhcnJMID0gYXJyLmxlbmd0aDsgYXJyTC0tOyBhcnJbYXJyTF0gKj0gYmFzZUluKTtcclxuXHJcbiAgICAgICAgYXJyWzBdICs9IGFscGhhYmV0LmluZGV4T2Yoc3RyLmNoYXJBdChpKyspKTtcclxuXHJcbiAgICAgICAgZm9yIChqID0gMDsgaiA8IGFyci5sZW5ndGg7IGorKykge1xyXG5cclxuICAgICAgICAgIGlmIChhcnJbal0gPiBiYXNlT3V0IC0gMSkge1xyXG4gICAgICAgICAgICBpZiAoYXJyW2ogKyAxXSA9PSBudWxsKSBhcnJbaiArIDFdID0gMDtcclxuICAgICAgICAgICAgYXJyW2ogKyAxXSArPSBhcnJbal0gLyBiYXNlT3V0IHwgMDtcclxuICAgICAgICAgICAgYXJyW2pdICU9IGJhc2VPdXQ7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gYXJyLnJldmVyc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDb252ZXJ0IGEgbnVtZXJpYyBzdHJpbmcgb2YgYmFzZUluIHRvIGEgbnVtZXJpYyBzdHJpbmcgb2YgYmFzZU91dC5cclxuICAgIC8vIElmIHRoZSBjYWxsZXIgaXMgdG9TdHJpbmcsIHdlIGFyZSBjb252ZXJ0aW5nIGZyb20gYmFzZSAxMCB0byBiYXNlT3V0LlxyXG4gICAgLy8gSWYgdGhlIGNhbGxlciBpcyBCaWdOdW1iZXIsIHdlIGFyZSBjb252ZXJ0aW5nIGZyb20gYmFzZUluIHRvIGJhc2UgMTAuXHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHN0ciwgYmFzZUluLCBiYXNlT3V0LCBzaWduLCBjYWxsZXJJc1RvU3RyaW5nKSB7XHJcbiAgICAgIHZhciBhbHBoYWJldCwgZCwgZSwgaywgciwgeCwgeGMsIHksXHJcbiAgICAgICAgaSA9IHN0ci5pbmRleE9mKCcuJyksXHJcbiAgICAgICAgZHAgPSBERUNJTUFMX1BMQUNFUyxcclxuICAgICAgICBybSA9IFJPVU5ESU5HX01PREU7XHJcblxyXG4gICAgICAvLyBOb24taW50ZWdlci5cclxuICAgICAgaWYgKGkgPj0gMCkge1xyXG4gICAgICAgIGsgPSBQT1dfUFJFQ0lTSU9OO1xyXG5cclxuICAgICAgICAvLyBVbmxpbWl0ZWQgcHJlY2lzaW9uLlxyXG4gICAgICAgIFBPV19QUkVDSVNJT04gPSAwO1xyXG4gICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKCcuJywgJycpO1xyXG4gICAgICAgIHkgPSBuZXcgQmlnTnVtYmVyKGJhc2VJbik7XHJcbiAgICAgICAgeCA9IHkucG93KHN0ci5sZW5ndGggLSBpKTtcclxuICAgICAgICBQT1dfUFJFQ0lTSU9OID0gaztcclxuXHJcbiAgICAgICAgLy8gQ29udmVydCBzdHIgYXMgaWYgYW4gaW50ZWdlciwgdGhlbiByZXN0b3JlIHRoZSBmcmFjdGlvbiBwYXJ0IGJ5IGRpdmlkaW5nIHRoZVxyXG4gICAgICAgIC8vIHJlc3VsdCBieSBpdHMgYmFzZSByYWlzZWQgdG8gYSBwb3dlci5cclxuXHJcbiAgICAgICAgeS5jID0gdG9CYXNlT3V0KHRvRml4ZWRQb2ludChjb2VmZlRvU3RyaW5nKHguYyksIHguZSwgJzAnKSxcclxuICAgICAgICAgMTAsIGJhc2VPdXQsIGRlY2ltYWwpO1xyXG4gICAgICAgIHkuZSA9IHkuYy5sZW5ndGg7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIENvbnZlcnQgdGhlIG51bWJlciBhcyBpbnRlZ2VyLlxyXG5cclxuICAgICAgeGMgPSB0b0Jhc2VPdXQoc3RyLCBiYXNlSW4sIGJhc2VPdXQsIGNhbGxlcklzVG9TdHJpbmdcclxuICAgICAgID8gKGFscGhhYmV0ID0gQUxQSEFCRVQsIGRlY2ltYWwpXHJcbiAgICAgICA6IChhbHBoYWJldCA9IGRlY2ltYWwsIEFMUEhBQkVUKSk7XHJcblxyXG4gICAgICAvLyB4YyBub3cgcmVwcmVzZW50cyBzdHIgYXMgYW4gaW50ZWdlciBhbmQgY29udmVydGVkIHRvIGJhc2VPdXQuIGUgaXMgdGhlIGV4cG9uZW50LlxyXG4gICAgICBlID0gayA9IHhjLmxlbmd0aDtcclxuXHJcbiAgICAgIC8vIFJlbW92ZSB0cmFpbGluZyB6ZXJvcy5cclxuICAgICAgZm9yICg7IHhjWy0ta10gPT0gMDsgeGMucG9wKCkpO1xyXG5cclxuICAgICAgLy8gWmVybz9cclxuICAgICAgaWYgKCF4Y1swXSkgcmV0dXJuIGFscGhhYmV0LmNoYXJBdCgwKTtcclxuXHJcbiAgICAgIC8vIERvZXMgc3RyIHJlcHJlc2VudCBhbiBpbnRlZ2VyPyBJZiBzbywgbm8gbmVlZCBmb3IgdGhlIGRpdmlzaW9uLlxyXG4gICAgICBpZiAoaSA8IDApIHtcclxuICAgICAgICAtLWU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgeC5jID0geGM7XHJcbiAgICAgICAgeC5lID0gZTtcclxuXHJcbiAgICAgICAgLy8gVGhlIHNpZ24gaXMgbmVlZGVkIGZvciBjb3JyZWN0IHJvdW5kaW5nLlxyXG4gICAgICAgIHgucyA9IHNpZ247XHJcbiAgICAgICAgeCA9IGRpdih4LCB5LCBkcCwgcm0sIGJhc2VPdXQpO1xyXG4gICAgICAgIHhjID0geC5jO1xyXG4gICAgICAgIHIgPSB4LnI7XHJcbiAgICAgICAgZSA9IHguZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8geGMgbm93IHJlcHJlc2VudHMgc3RyIGNvbnZlcnRlZCB0byBiYXNlT3V0LlxyXG5cclxuICAgICAgLy8gVEhlIGluZGV4IG9mIHRoZSByb3VuZGluZyBkaWdpdC5cclxuICAgICAgZCA9IGUgKyBkcCArIDE7XHJcblxyXG4gICAgICAvLyBUaGUgcm91bmRpbmcgZGlnaXQ6IHRoZSBkaWdpdCB0byB0aGUgcmlnaHQgb2YgdGhlIGRpZ2l0IHRoYXQgbWF5IGJlIHJvdW5kZWQgdXAuXHJcbiAgICAgIGkgPSB4Y1tkXTtcclxuXHJcbiAgICAgIC8vIExvb2sgYXQgdGhlIHJvdW5kaW5nIGRpZ2l0cyBhbmQgbW9kZSB0byBkZXRlcm1pbmUgd2hldGhlciB0byByb3VuZCB1cC5cclxuXHJcbiAgICAgIGsgPSBiYXNlT3V0IC8gMjtcclxuICAgICAgciA9IHIgfHwgZCA8IDAgfHwgeGNbZCArIDFdICE9IG51bGw7XHJcblxyXG4gICAgICByID0gcm0gPCA0ID8gKGkgIT0gbnVsbCB8fCByKSAmJiAocm0gPT0gMCB8fCBybSA9PSAoeC5zIDwgMCA/IDMgOiAyKSlcclxuICAgICAgICAgICAgOiBpID4gayB8fCBpID09IGsgJiYocm0gPT0gNCB8fCByIHx8IHJtID09IDYgJiYgeGNbZCAtIDFdICYgMSB8fFxyXG4gICAgICAgICAgICAgcm0gPT0gKHgucyA8IDAgPyA4IDogNykpO1xyXG5cclxuICAgICAgLy8gSWYgdGhlIGluZGV4IG9mIHRoZSByb3VuZGluZyBkaWdpdCBpcyBub3QgZ3JlYXRlciB0aGFuIHplcm8sIG9yIHhjIHJlcHJlc2VudHNcclxuICAgICAgLy8gemVybywgdGhlbiB0aGUgcmVzdWx0IG9mIHRoZSBiYXNlIGNvbnZlcnNpb24gaXMgemVybyBvciwgaWYgcm91bmRpbmcgdXAsIGEgdmFsdWVcclxuICAgICAgLy8gc3VjaCBhcyAwLjAwMDAxLlxyXG4gICAgICBpZiAoZCA8IDEgfHwgIXhjWzBdKSB7XHJcblxyXG4gICAgICAgIC8vIDFeLWRwIG9yIDBcclxuICAgICAgICBzdHIgPSByID8gdG9GaXhlZFBvaW50KGFscGhhYmV0LmNoYXJBdCgxKSwgLWRwLCBhbHBoYWJldC5jaGFyQXQoMCkpIDogYWxwaGFiZXQuY2hhckF0KDApO1xyXG4gICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAvLyBUcnVuY2F0ZSB4YyB0byB0aGUgcmVxdWlyZWQgbnVtYmVyIG9mIGRlY2ltYWwgcGxhY2VzLlxyXG4gICAgICAgIHhjLmxlbmd0aCA9IGQ7XHJcblxyXG4gICAgICAgIC8vIFJvdW5kIHVwP1xyXG4gICAgICAgIGlmIChyKSB7XHJcblxyXG4gICAgICAgICAgLy8gUm91bmRpbmcgdXAgbWF5IG1lYW4gdGhlIHByZXZpb3VzIGRpZ2l0IGhhcyB0byBiZSByb3VuZGVkIHVwIGFuZCBzbyBvbi5cclxuICAgICAgICAgIGZvciAoLS1iYXNlT3V0OyArK3hjWy0tZF0gPiBiYXNlT3V0Oykge1xyXG4gICAgICAgICAgICB4Y1tkXSA9IDA7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWQpIHtcclxuICAgICAgICAgICAgICArK2U7XHJcbiAgICAgICAgICAgICAgeGMgPSBbMV0uY29uY2F0KHhjKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gRGV0ZXJtaW5lIHRyYWlsaW5nIHplcm9zLlxyXG4gICAgICAgIGZvciAoayA9IHhjLmxlbmd0aDsgIXhjWy0ta107KTtcclxuXHJcbiAgICAgICAgLy8gRS5nLiBbNCwgMTEsIDE1XSBiZWNvbWVzIDRiZi5cclxuICAgICAgICBmb3IgKGkgPSAwLCBzdHIgPSAnJzsgaSA8PSBrOyBzdHIgKz0gYWxwaGFiZXQuY2hhckF0KHhjW2krK10pKTtcclxuXHJcbiAgICAgICAgLy8gQWRkIGxlYWRpbmcgemVyb3MsIGRlY2ltYWwgcG9pbnQgYW5kIHRyYWlsaW5nIHplcm9zIGFzIHJlcXVpcmVkLlxyXG4gICAgICAgIHN0ciA9IHRvRml4ZWRQb2ludChzdHIsIGUsIGFscGhhYmV0LmNoYXJBdCgwKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFRoZSBjYWxsZXIgd2lsbCBhZGQgdGhlIHNpZ24uXHJcbiAgICAgIHJldHVybiBzdHI7XHJcbiAgICB9O1xyXG4gIH0pKCk7XHJcblxyXG5cclxuICAvLyBQZXJmb3JtIGRpdmlzaW9uIGluIHRoZSBzcGVjaWZpZWQgYmFzZS4gQ2FsbGVkIGJ5IGRpdiBhbmQgY29udmVydEJhc2UuXHJcbiAgZGl2ID0gKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAvLyBBc3N1bWUgbm9uLXplcm8geCBhbmQgay5cclxuICAgIGZ1bmN0aW9uIG11bHRpcGx5KHgsIGssIGJhc2UpIHtcclxuICAgICAgdmFyIG0sIHRlbXAsIHhsbywgeGhpLFxyXG4gICAgICAgIGNhcnJ5ID0gMCxcclxuICAgICAgICBpID0geC5sZW5ndGgsXHJcbiAgICAgICAga2xvID0gayAlIFNRUlRfQkFTRSxcclxuICAgICAgICBraGkgPSBrIC8gU1FSVF9CQVNFIHwgMDtcclxuXHJcbiAgICAgIGZvciAoeCA9IHguc2xpY2UoKTsgaS0tOykge1xyXG4gICAgICAgIHhsbyA9IHhbaV0gJSBTUVJUX0JBU0U7XHJcbiAgICAgICAgeGhpID0geFtpXSAvIFNRUlRfQkFTRSB8IDA7XHJcbiAgICAgICAgbSA9IGtoaSAqIHhsbyArIHhoaSAqIGtsbztcclxuICAgICAgICB0ZW1wID0ga2xvICogeGxvICsgKChtICUgU1FSVF9CQVNFKSAqIFNRUlRfQkFTRSkgKyBjYXJyeTtcclxuICAgICAgICBjYXJyeSA9ICh0ZW1wIC8gYmFzZSB8IDApICsgKG0gLyBTUVJUX0JBU0UgfCAwKSArIGtoaSAqIHhoaTtcclxuICAgICAgICB4W2ldID0gdGVtcCAlIGJhc2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChjYXJyeSkgeCA9IFtjYXJyeV0uY29uY2F0KHgpO1xyXG5cclxuICAgICAgcmV0dXJuIHg7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY29tcGFyZShhLCBiLCBhTCwgYkwpIHtcclxuICAgICAgdmFyIGksIGNtcDtcclxuXHJcbiAgICAgIGlmIChhTCAhPSBiTCkge1xyXG4gICAgICAgIGNtcCA9IGFMID4gYkwgPyAxIDogLTE7XHJcbiAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIGZvciAoaSA9IGNtcCA9IDA7IGkgPCBhTDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgaWYgKGFbaV0gIT0gYltpXSkge1xyXG4gICAgICAgICAgICBjbXAgPSBhW2ldID4gYltpXSA/IDEgOiAtMTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gY21wO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHN1YnRyYWN0KGEsIGIsIGFMLCBiYXNlKSB7XHJcbiAgICAgIHZhciBpID0gMDtcclxuXHJcbiAgICAgIC8vIFN1YnRyYWN0IGIgZnJvbSBhLlxyXG4gICAgICBmb3IgKDsgYUwtLTspIHtcclxuICAgICAgICBhW2FMXSAtPSBpO1xyXG4gICAgICAgIGkgPSBhW2FMXSA8IGJbYUxdID8gMSA6IDA7XHJcbiAgICAgICAgYVthTF0gPSBpICogYmFzZSArIGFbYUxdIC0gYlthTF07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFJlbW92ZSBsZWFkaW5nIHplcm9zLlxyXG4gICAgICBmb3IgKDsgIWFbMF0gJiYgYS5sZW5ndGggPiAxOyBhLnNwbGljZSgwLCAxKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8geDogZGl2aWRlbmQsIHk6IGRpdmlzb3IuXHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHgsIHksIGRwLCBybSwgYmFzZSkge1xyXG4gICAgICB2YXIgY21wLCBlLCBpLCBtb3JlLCBuLCBwcm9kLCBwcm9kTCwgcSwgcWMsIHJlbSwgcmVtTCwgcmVtMCwgeGksIHhMLCB5YzAsXHJcbiAgICAgICAgeUwsIHl6LFxyXG4gICAgICAgIHMgPSB4LnMgPT0geS5zID8gMSA6IC0xLFxyXG4gICAgICAgIHhjID0geC5jLFxyXG4gICAgICAgIHljID0geS5jO1xyXG5cclxuICAgICAgLy8gRWl0aGVyIE5hTiwgSW5maW5pdHkgb3IgMD9cclxuICAgICAgaWYgKCF4YyB8fCAheGNbMF0gfHwgIXljIHx8ICF5Y1swXSkge1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IEJpZ051bWJlcihcclxuXHJcbiAgICAgICAgIC8vIFJldHVybiBOYU4gaWYgZWl0aGVyIE5hTiwgb3IgYm90aCBJbmZpbml0eSBvciAwLlxyXG4gICAgICAgICAheC5zIHx8ICF5LnMgfHwgKHhjID8geWMgJiYgeGNbMF0gPT0geWNbMF0gOiAheWMpID8gTmFOIDpcclxuXHJcbiAgICAgICAgICAvLyBSZXR1cm4gwrEwIGlmIHggaXMgwrEwIG9yIHkgaXMgwrFJbmZpbml0eSwgb3IgcmV0dXJuIMKxSW5maW5pdHkgYXMgeSBpcyDCsTAuXHJcbiAgICAgICAgICB4YyAmJiB4Y1swXSA9PSAwIHx8ICF5YyA/IHMgKiAwIDogcyAvIDBcclxuICAgICAgICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHEgPSBuZXcgQmlnTnVtYmVyKHMpO1xyXG4gICAgICBxYyA9IHEuYyA9IFtdO1xyXG4gICAgICBlID0geC5lIC0geS5lO1xyXG4gICAgICBzID0gZHAgKyBlICsgMTtcclxuXHJcbiAgICAgIGlmICghYmFzZSkge1xyXG4gICAgICAgIGJhc2UgPSBCQVNFO1xyXG4gICAgICAgIGUgPSBiaXRGbG9vcih4LmUgLyBMT0dfQkFTRSkgLSBiaXRGbG9vcih5LmUgLyBMT0dfQkFTRSk7XHJcbiAgICAgICAgcyA9IHMgLyBMT0dfQkFTRSB8IDA7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFJlc3VsdCBleHBvbmVudCBtYXkgYmUgb25lIGxlc3MgdGhlbiB0aGUgY3VycmVudCB2YWx1ZSBvZiBlLlxyXG4gICAgICAvLyBUaGUgY29lZmZpY2llbnRzIG9mIHRoZSBCaWdOdW1iZXJzIGZyb20gY29udmVydEJhc2UgbWF5IGhhdmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgICAgIGZvciAoaSA9IDA7IHljW2ldID09ICh4Y1tpXSB8fCAwKTsgaSsrKTtcclxuXHJcbiAgICAgIGlmICh5Y1tpXSA+ICh4Y1tpXSB8fCAwKSkgZS0tO1xyXG5cclxuICAgICAgaWYgKHMgPCAwKSB7XHJcbiAgICAgICAgcWMucHVzaCgxKTtcclxuICAgICAgICBtb3JlID0gdHJ1ZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB4TCA9IHhjLmxlbmd0aDtcclxuICAgICAgICB5TCA9IHljLmxlbmd0aDtcclxuICAgICAgICBpID0gMDtcclxuICAgICAgICBzICs9IDI7XHJcblxyXG4gICAgICAgIC8vIE5vcm1hbGlzZSB4YyBhbmQgeWMgc28gaGlnaGVzdCBvcmRlciBkaWdpdCBvZiB5YyBpcyA+PSBiYXNlIC8gMi5cclxuXHJcbiAgICAgICAgbiA9IG1hdGhmbG9vcihiYXNlIC8gKHljWzBdICsgMSkpO1xyXG5cclxuICAgICAgICAvLyBOb3QgbmVjZXNzYXJ5LCBidXQgdG8gaGFuZGxlIG9kZCBiYXNlcyB3aGVyZSB5Y1swXSA9PSAoYmFzZSAvIDIpIC0gMS5cclxuICAgICAgICAvLyBpZiAobiA+IDEgfHwgbisrID09IDEgJiYgeWNbMF0gPCBiYXNlIC8gMikge1xyXG4gICAgICAgIGlmIChuID4gMSkge1xyXG4gICAgICAgICAgeWMgPSBtdWx0aXBseSh5YywgbiwgYmFzZSk7XHJcbiAgICAgICAgICB4YyA9IG11bHRpcGx5KHhjLCBuLCBiYXNlKTtcclxuICAgICAgICAgIHlMID0geWMubGVuZ3RoO1xyXG4gICAgICAgICAgeEwgPSB4Yy5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB4aSA9IHlMO1xyXG4gICAgICAgIHJlbSA9IHhjLnNsaWNlKDAsIHlMKTtcclxuICAgICAgICByZW1MID0gcmVtLmxlbmd0aDtcclxuXHJcbiAgICAgICAgLy8gQWRkIHplcm9zIHRvIG1ha2UgcmVtYWluZGVyIGFzIGxvbmcgYXMgZGl2aXNvci5cclxuICAgICAgICBmb3IgKDsgcmVtTCA8IHlMOyByZW1bcmVtTCsrXSA9IDApO1xyXG4gICAgICAgIHl6ID0geWMuc2xpY2UoKTtcclxuICAgICAgICB5eiA9IFswXS5jb25jYXQoeXopO1xyXG4gICAgICAgIHljMCA9IHljWzBdO1xyXG4gICAgICAgIGlmICh5Y1sxXSA+PSBiYXNlIC8gMikgeWMwKys7XHJcbiAgICAgICAgLy8gTm90IG5lY2Vzc2FyeSwgYnV0IHRvIHByZXZlbnQgdHJpYWwgZGlnaXQgbiA+IGJhc2UsIHdoZW4gdXNpbmcgYmFzZSAzLlxyXG4gICAgICAgIC8vIGVsc2UgaWYgKGJhc2UgPT0gMyAmJiB5YzAgPT0gMSkgeWMwID0gMSArIDFlLTE1O1xyXG5cclxuICAgICAgICBkbyB7XHJcbiAgICAgICAgICBuID0gMDtcclxuXHJcbiAgICAgICAgICAvLyBDb21wYXJlIGRpdmlzb3IgYW5kIHJlbWFpbmRlci5cclxuICAgICAgICAgIGNtcCA9IGNvbXBhcmUoeWMsIHJlbSwgeUwsIHJlbUwpO1xyXG5cclxuICAgICAgICAgIC8vIElmIGRpdmlzb3IgPCByZW1haW5kZXIuXHJcbiAgICAgICAgICBpZiAoY21wIDwgMCkge1xyXG5cclxuICAgICAgICAgICAgLy8gQ2FsY3VsYXRlIHRyaWFsIGRpZ2l0LCBuLlxyXG5cclxuICAgICAgICAgICAgcmVtMCA9IHJlbVswXTtcclxuICAgICAgICAgICAgaWYgKHlMICE9IHJlbUwpIHJlbTAgPSByZW0wICogYmFzZSArIChyZW1bMV0gfHwgMCk7XHJcblxyXG4gICAgICAgICAgICAvLyBuIGlzIGhvdyBtYW55IHRpbWVzIHRoZSBkaXZpc29yIGdvZXMgaW50byB0aGUgY3VycmVudCByZW1haW5kZXIuXHJcbiAgICAgICAgICAgIG4gPSBtYXRoZmxvb3IocmVtMCAvIHljMCk7XHJcblxyXG4gICAgICAgICAgICAvLyAgQWxnb3JpdGhtOlxyXG4gICAgICAgICAgICAvLyAgcHJvZHVjdCA9IGRpdmlzb3IgbXVsdGlwbGllZCBieSB0cmlhbCBkaWdpdCAobikuXHJcbiAgICAgICAgICAgIC8vICBDb21wYXJlIHByb2R1Y3QgYW5kIHJlbWFpbmRlci5cclxuICAgICAgICAgICAgLy8gIElmIHByb2R1Y3QgaXMgZ3JlYXRlciB0aGFuIHJlbWFpbmRlcjpcclxuICAgICAgICAgICAgLy8gICAgU3VidHJhY3QgZGl2aXNvciBmcm9tIHByb2R1Y3QsIGRlY3JlbWVudCB0cmlhbCBkaWdpdC5cclxuICAgICAgICAgICAgLy8gIFN1YnRyYWN0IHByb2R1Y3QgZnJvbSByZW1haW5kZXIuXHJcbiAgICAgICAgICAgIC8vICBJZiBwcm9kdWN0IHdhcyBsZXNzIHRoYW4gcmVtYWluZGVyIGF0IHRoZSBsYXN0IGNvbXBhcmU6XHJcbiAgICAgICAgICAgIC8vICAgIENvbXBhcmUgbmV3IHJlbWFpbmRlciBhbmQgZGl2aXNvci5cclxuICAgICAgICAgICAgLy8gICAgSWYgcmVtYWluZGVyIGlzIGdyZWF0ZXIgdGhhbiBkaXZpc29yOlxyXG4gICAgICAgICAgICAvLyAgICAgIFN1YnRyYWN0IGRpdmlzb3IgZnJvbSByZW1haW5kZXIsIGluY3JlbWVudCB0cmlhbCBkaWdpdC5cclxuXHJcbiAgICAgICAgICAgIGlmIChuID4gMSkge1xyXG5cclxuICAgICAgICAgICAgICAvLyBuIG1heSBiZSA+IGJhc2Ugb25seSB3aGVuIGJhc2UgaXMgMy5cclxuICAgICAgICAgICAgICBpZiAobiA+PSBiYXNlKSBuID0gYmFzZSAtIDE7XHJcblxyXG4gICAgICAgICAgICAgIC8vIHByb2R1Y3QgPSBkaXZpc29yICogdHJpYWwgZGlnaXQuXHJcbiAgICAgICAgICAgICAgcHJvZCA9IG11bHRpcGx5KHljLCBuLCBiYXNlKTtcclxuICAgICAgICAgICAgICBwcm9kTCA9IHByb2QubGVuZ3RoO1xyXG4gICAgICAgICAgICAgIHJlbUwgPSByZW0ubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgICAvLyBDb21wYXJlIHByb2R1Y3QgYW5kIHJlbWFpbmRlci5cclxuICAgICAgICAgICAgICAvLyBJZiBwcm9kdWN0ID4gcmVtYWluZGVyIHRoZW4gdHJpYWwgZGlnaXQgbiB0b28gaGlnaC5cclxuICAgICAgICAgICAgICAvLyBuIGlzIDEgdG9vIGhpZ2ggYWJvdXQgNSUgb2YgdGhlIHRpbWUsIGFuZCBpcyBub3Qga25vd24gdG8gaGF2ZVxyXG4gICAgICAgICAgICAgIC8vIGV2ZXIgYmVlbiBtb3JlIHRoYW4gMSB0b28gaGlnaC5cclxuICAgICAgICAgICAgICB3aGlsZSAoY29tcGFyZShwcm9kLCByZW0sIHByb2RMLCByZW1MKSA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICBuLS07XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gU3VidHJhY3QgZGl2aXNvciBmcm9tIHByb2R1Y3QuXHJcbiAgICAgICAgICAgICAgICBzdWJ0cmFjdChwcm9kLCB5TCA8IHByb2RMID8geXogOiB5YywgcHJvZEwsIGJhc2UpO1xyXG4gICAgICAgICAgICAgICAgcHJvZEwgPSBwcm9kLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIGNtcCA9IDE7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAvLyBuIGlzIDAgb3IgMSwgY21wIGlzIC0xLlxyXG4gICAgICAgICAgICAgIC8vIElmIG4gaXMgMCwgdGhlcmUgaXMgbm8gbmVlZCB0byBjb21wYXJlIHljIGFuZCByZW0gYWdhaW4gYmVsb3csXHJcbiAgICAgICAgICAgICAgLy8gc28gY2hhbmdlIGNtcCB0byAxIHRvIGF2b2lkIGl0LlxyXG4gICAgICAgICAgICAgIC8vIElmIG4gaXMgMSwgbGVhdmUgY21wIGFzIC0xLCBzbyB5YyBhbmQgcmVtIGFyZSBjb21wYXJlZCBhZ2Fpbi5cclxuICAgICAgICAgICAgICBpZiAobiA9PSAwKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gZGl2aXNvciA8IHJlbWFpbmRlciwgc28gbiBtdXN0IGJlIGF0IGxlYXN0IDEuXHJcbiAgICAgICAgICAgICAgICBjbXAgPSBuID0gMTtcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIC8vIHByb2R1Y3QgPSBkaXZpc29yXHJcbiAgICAgICAgICAgICAgcHJvZCA9IHljLnNsaWNlKCk7XHJcbiAgICAgICAgICAgICAgcHJvZEwgPSBwcm9kLmxlbmd0aDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHByb2RMIDwgcmVtTCkgcHJvZCA9IFswXS5jb25jYXQocHJvZCk7XHJcblxyXG4gICAgICAgICAgICAvLyBTdWJ0cmFjdCBwcm9kdWN0IGZyb20gcmVtYWluZGVyLlxyXG4gICAgICAgICAgICBzdWJ0cmFjdChyZW0sIHByb2QsIHJlbUwsIGJhc2UpO1xyXG4gICAgICAgICAgICByZW1MID0gcmVtLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgICAvLyBJZiBwcm9kdWN0IHdhcyA8IHJlbWFpbmRlci5cclxuICAgICAgICAgICAgaWYgKGNtcCA9PSAtMSkge1xyXG5cclxuICAgICAgICAgICAgICAvLyBDb21wYXJlIGRpdmlzb3IgYW5kIG5ldyByZW1haW5kZXIuXHJcbiAgICAgICAgICAgICAgLy8gSWYgZGl2aXNvciA8IG5ldyByZW1haW5kZXIsIHN1YnRyYWN0IGRpdmlzb3IgZnJvbSByZW1haW5kZXIuXHJcbiAgICAgICAgICAgICAgLy8gVHJpYWwgZGlnaXQgbiB0b28gbG93LlxyXG4gICAgICAgICAgICAgIC8vIG4gaXMgMSB0b28gbG93IGFib3V0IDUlIG9mIHRoZSB0aW1lLCBhbmQgdmVyeSByYXJlbHkgMiB0b28gbG93LlxyXG4gICAgICAgICAgICAgIHdoaWxlIChjb21wYXJlKHljLCByZW0sIHlMLCByZW1MKSA8IDEpIHtcclxuICAgICAgICAgICAgICAgIG4rKztcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTdWJ0cmFjdCBkaXZpc29yIGZyb20gcmVtYWluZGVyLlxyXG4gICAgICAgICAgICAgICAgc3VidHJhY3QocmVtLCB5TCA8IHJlbUwgPyB5eiA6IHljLCByZW1MLCBiYXNlKTtcclxuICAgICAgICAgICAgICAgIHJlbUwgPSByZW0ubGVuZ3RoO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIGlmIChjbXAgPT09IDApIHtcclxuICAgICAgICAgICAgbisrO1xyXG4gICAgICAgICAgICByZW0gPSBbMF07XHJcbiAgICAgICAgICB9IC8vIGVsc2UgY21wID09PSAxIGFuZCBuIHdpbGwgYmUgMFxyXG5cclxuICAgICAgICAgIC8vIEFkZCB0aGUgbmV4dCBkaWdpdCwgbiwgdG8gdGhlIHJlc3VsdCBhcnJheS5cclxuICAgICAgICAgIHFjW2krK10gPSBuO1xyXG5cclxuICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgcmVtYWluZGVyLlxyXG4gICAgICAgICAgaWYgKHJlbVswXSkge1xyXG4gICAgICAgICAgICByZW1bcmVtTCsrXSA9IHhjW3hpXSB8fCAwO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVtID0gW3hjW3hpXV07XHJcbiAgICAgICAgICAgIHJlbUwgPSAxO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gd2hpbGUgKCh4aSsrIDwgeEwgfHwgcmVtWzBdICE9IG51bGwpICYmIHMtLSk7XHJcblxyXG4gICAgICAgIG1vcmUgPSByZW1bMF0gIT0gbnVsbDtcclxuXHJcbiAgICAgICAgLy8gTGVhZGluZyB6ZXJvP1xyXG4gICAgICAgIGlmICghcWNbMF0pIHFjLnNwbGljZSgwLCAxKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGJhc2UgPT0gQkFTRSkge1xyXG5cclxuICAgICAgICAvLyBUbyBjYWxjdWxhdGUgcS5lLCBmaXJzdCBnZXQgdGhlIG51bWJlciBvZiBkaWdpdHMgb2YgcWNbMF0uXHJcbiAgICAgICAgZm9yIChpID0gMSwgcyA9IHFjWzBdOyBzID49IDEwOyBzIC89IDEwLCBpKyspO1xyXG5cclxuICAgICAgICByb3VuZChxLCBkcCArIChxLmUgPSBpICsgZSAqIExPR19CQVNFIC0gMSkgKyAxLCBybSwgbW9yZSk7XHJcblxyXG4gICAgICAvLyBDYWxsZXIgaXMgY29udmVydEJhc2UuXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcS5lID0gZTtcclxuICAgICAgICBxLnIgPSArbW9yZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHE7XHJcbiAgICB9O1xyXG4gIH0pKCk7XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHZhbHVlIG9mIEJpZ051bWJlciBuIGluIGZpeGVkLXBvaW50IG9yIGV4cG9uZW50aWFsXHJcbiAgICogbm90YXRpb24gcm91bmRlZCB0byB0aGUgc3BlY2lmaWVkIGRlY2ltYWwgcGxhY2VzIG9yIHNpZ25pZmljYW50IGRpZ2l0cy5cclxuICAgKlxyXG4gICAqIG46IGEgQmlnTnVtYmVyLlxyXG4gICAqIGk6IHRoZSBpbmRleCBvZiB0aGUgbGFzdCBkaWdpdCByZXF1aXJlZCAoaS5lLiB0aGUgZGlnaXQgdGhhdCBtYXkgYmUgcm91bmRlZCB1cCkuXHJcbiAgICogcm06IHRoZSByb3VuZGluZyBtb2RlLlxyXG4gICAqIGlkOiAxICh0b0V4cG9uZW50aWFsKSBvciAyICh0b1ByZWNpc2lvbikuXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gZm9ybWF0KG4sIGksIHJtLCBpZCkge1xyXG4gICAgdmFyIGMwLCBlLCBuZSwgbGVuLCBzdHI7XHJcblxyXG4gICAgaWYgKHJtID09IG51bGwpIHJtID0gUk9VTkRJTkdfTU9ERTtcclxuICAgIGVsc2UgaW50Q2hlY2socm0sIDAsIDgpO1xyXG5cclxuICAgIGlmICghbi5jKSByZXR1cm4gbi50b1N0cmluZygpO1xyXG5cclxuICAgIGMwID0gbi5jWzBdO1xyXG4gICAgbmUgPSBuLmU7XHJcblxyXG4gICAgaWYgKGkgPT0gbnVsbCkge1xyXG4gICAgICBzdHIgPSBjb2VmZlRvU3RyaW5nKG4uYyk7XHJcbiAgICAgIHN0ciA9IGlkID09IDEgfHwgaWQgPT0gMiAmJiBuZSA8PSBUT19FWFBfTkVHXHJcbiAgICAgICA/IHRvRXhwb25lbnRpYWwoc3RyLCBuZSlcclxuICAgICAgIDogdG9GaXhlZFBvaW50KHN0ciwgbmUsICcwJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBuID0gcm91bmQobmV3IEJpZ051bWJlcihuKSwgaSwgcm0pO1xyXG5cclxuICAgICAgLy8gbi5lIG1heSBoYXZlIGNoYW5nZWQgaWYgdGhlIHZhbHVlIHdhcyByb3VuZGVkIHVwLlxyXG4gICAgICBlID0gbi5lO1xyXG5cclxuICAgICAgc3RyID0gY29lZmZUb1N0cmluZyhuLmMpO1xyXG4gICAgICBsZW4gPSBzdHIubGVuZ3RoO1xyXG5cclxuICAgICAgLy8gdG9QcmVjaXNpb24gcmV0dXJucyBleHBvbmVudGlhbCBub3RhdGlvbiBpZiB0aGUgbnVtYmVyIG9mIHNpZ25pZmljYW50IGRpZ2l0c1xyXG4gICAgICAvLyBzcGVjaWZpZWQgaXMgbGVzcyB0aGFuIHRoZSBudW1iZXIgb2YgZGlnaXRzIG5lY2Vzc2FyeSB0byByZXByZXNlbnQgdGhlIGludGVnZXJcclxuICAgICAgLy8gcGFydCBvZiB0aGUgdmFsdWUgaW4gZml4ZWQtcG9pbnQgbm90YXRpb24uXHJcblxyXG4gICAgICAvLyBFeHBvbmVudGlhbCBub3RhdGlvbi5cclxuICAgICAgaWYgKGlkID09IDEgfHwgaWQgPT0gMiAmJiAoaSA8PSBlIHx8IGUgPD0gVE9fRVhQX05FRykpIHtcclxuXHJcbiAgICAgICAgLy8gQXBwZW5kIHplcm9zP1xyXG4gICAgICAgIGZvciAoOyBsZW4gPCBpOyBzdHIgKz0gJzAnLCBsZW4rKyk7XHJcbiAgICAgICAgc3RyID0gdG9FeHBvbmVudGlhbChzdHIsIGUpO1xyXG5cclxuICAgICAgLy8gRml4ZWQtcG9pbnQgbm90YXRpb24uXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaSAtPSBuZTtcclxuICAgICAgICBzdHIgPSB0b0ZpeGVkUG9pbnQoc3RyLCBlLCAnMCcpO1xyXG5cclxuICAgICAgICAvLyBBcHBlbmQgemVyb3M/XHJcbiAgICAgICAgaWYgKGUgKyAxID4gbGVuKSB7XHJcbiAgICAgICAgICBpZiAoLS1pID4gMCkgZm9yIChzdHIgKz0gJy4nOyBpLS07IHN0ciArPSAnMCcpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpICs9IGUgLSBsZW47XHJcbiAgICAgICAgICBpZiAoaSA+IDApIHtcclxuICAgICAgICAgICAgaWYgKGUgKyAxID09IGxlbikgc3RyICs9ICcuJztcclxuICAgICAgICAgICAgZm9yICg7IGktLTsgc3RyICs9ICcwJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG4ucyA8IDAgJiYgYzAgPyAnLScgKyBzdHIgOiBzdHI7XHJcbiAgfVxyXG5cclxuXHJcbiAgLy8gSGFuZGxlIEJpZ051bWJlci5tYXggYW5kIEJpZ051bWJlci5taW4uXHJcbiAgZnVuY3Rpb24gbWF4T3JNaW4oYXJncywgbWV0aG9kKSB7XHJcbiAgICB2YXIgbixcclxuICAgICAgaSA9IDEsXHJcbiAgICAgIG0gPSBuZXcgQmlnTnVtYmVyKGFyZ3NbMF0pO1xyXG5cclxuICAgIGZvciAoOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBuID0gbmV3IEJpZ051bWJlcihhcmdzW2ldKTtcclxuXHJcbiAgICAgIC8vIElmIGFueSBudW1iZXIgaXMgTmFOLCByZXR1cm4gTmFOLlxyXG4gICAgICBpZiAoIW4ucykge1xyXG4gICAgICAgIG0gPSBuO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9IGVsc2UgaWYgKG1ldGhvZC5jYWxsKG0sIG4pKSB7XHJcbiAgICAgICAgbSA9IG47XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFN0cmlwIHRyYWlsaW5nIHplcm9zLCBjYWxjdWxhdGUgYmFzZSAxMCBleHBvbmVudCBhbmQgY2hlY2sgYWdhaW5zdCBNSU5fRVhQIGFuZCBNQVhfRVhQLlxyXG4gICAqIENhbGxlZCBieSBtaW51cywgcGx1cyBhbmQgdGltZXMuXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gbm9ybWFsaXNlKG4sIGMsIGUpIHtcclxuICAgIHZhciBpID0gMSxcclxuICAgICAgaiA9IGMubGVuZ3RoO1xyXG5cclxuICAgICAvLyBSZW1vdmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgICBmb3IgKDsgIWNbLS1qXTsgYy5wb3AoKSk7XHJcblxyXG4gICAgLy8gQ2FsY3VsYXRlIHRoZSBiYXNlIDEwIGV4cG9uZW50LiBGaXJzdCBnZXQgdGhlIG51bWJlciBvZiBkaWdpdHMgb2YgY1swXS5cclxuICAgIGZvciAoaiA9IGNbMF07IGogPj0gMTA7IGogLz0gMTAsIGkrKyk7XHJcblxyXG4gICAgLy8gT3ZlcmZsb3c/XHJcbiAgICBpZiAoKGUgPSBpICsgZSAqIExPR19CQVNFIC0gMSkgPiBNQVhfRVhQKSB7XHJcblxyXG4gICAgICAvLyBJbmZpbml0eS5cclxuICAgICAgbi5jID0gbi5lID0gbnVsbDtcclxuXHJcbiAgICAvLyBVbmRlcmZsb3c/XHJcbiAgICB9IGVsc2UgaWYgKGUgPCBNSU5fRVhQKSB7XHJcblxyXG4gICAgICAvLyBaZXJvLlxyXG4gICAgICBuLmMgPSBbbi5lID0gMF07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBuLmUgPSBlO1xyXG4gICAgICBuLmMgPSBjO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBuO1xyXG4gIH1cclxuXHJcblxyXG4gIC8vIEhhbmRsZSB2YWx1ZXMgdGhhdCBmYWlsIHRoZSB2YWxpZGl0eSB0ZXN0IGluIEJpZ051bWJlci5cclxuICBwYXJzZU51bWVyaWMgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGJhc2VQcmVmaXggPSAvXigtPykwKFt4Ym9dKSg/PVxcd1tcXHcuXSokKS9pLFxyXG4gICAgICBkb3RBZnRlciA9IC9eKFteLl0rKVxcLiQvLFxyXG4gICAgICBkb3RCZWZvcmUgPSAvXlxcLihbXi5dKykkLyxcclxuICAgICAgaXNJbmZpbml0eU9yTmFOID0gL14tPyhJbmZpbml0eXxOYU4pJC8sXHJcbiAgICAgIHdoaXRlc3BhY2VPclBsdXMgPSAvXlxccypcXCsoPz1bXFx3Ll0pfF5cXHMrfFxccyskL2c7XHJcblxyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh4LCBzdHIsIGlzTnVtLCBiKSB7XHJcbiAgICAgIHZhciBiYXNlLFxyXG4gICAgICAgIHMgPSBpc051bSA/IHN0ciA6IHN0ci5yZXBsYWNlKHdoaXRlc3BhY2VPclBsdXMsICcnKTtcclxuXHJcbiAgICAgIC8vIE5vIGV4Y2VwdGlvbiBvbiDCsUluZmluaXR5IG9yIE5hTi5cclxuICAgICAgaWYgKGlzSW5maW5pdHlPck5hTi50ZXN0KHMpKSB7XHJcbiAgICAgICAgeC5zID0gaXNOYU4ocykgPyBudWxsIDogcyA8IDAgPyAtMSA6IDE7XHJcbiAgICAgICAgeC5jID0geC5lID0gbnVsbDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoIWlzTnVtKSB7XHJcblxyXG4gICAgICAgICAgLy8gYmFzZVByZWZpeCA9IC9eKC0/KTAoW3hib10pKD89XFx3W1xcdy5dKiQpL2lcclxuICAgICAgICAgIHMgPSBzLnJlcGxhY2UoYmFzZVByZWZpeCwgZnVuY3Rpb24gKG0sIHAxLCBwMikge1xyXG4gICAgICAgICAgICBiYXNlID0gKHAyID0gcDIudG9Mb3dlckNhc2UoKSkgPT0gJ3gnID8gMTYgOiBwMiA9PSAnYicgPyAyIDogODtcclxuICAgICAgICAgICAgcmV0dXJuICFiIHx8IGIgPT0gYmFzZSA/IHAxIDogbTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGlmIChiKSB7XHJcbiAgICAgICAgICAgIGJhc2UgPSBiO1xyXG5cclxuICAgICAgICAgICAgLy8gRS5nLiAnMS4nIHRvICcxJywgJy4xJyB0byAnMC4xJ1xyXG4gICAgICAgICAgICBzID0gcy5yZXBsYWNlKGRvdEFmdGVyLCAnJDEnKS5yZXBsYWNlKGRvdEJlZm9yZSwgJzAuJDEnKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAoc3RyICE9IHMpIHJldHVybiBuZXcgQmlnTnVtYmVyKHMsIGJhc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gJ1tCaWdOdW1iZXIgRXJyb3JdIE5vdCBhIG51bWJlcjoge259J1xyXG4gICAgICAgIC8vICdbQmlnTnVtYmVyIEVycm9yXSBOb3QgYSBiYXNlIHtifSBudW1iZXI6IHtufSdcclxuICAgICAgICBpZiAoQmlnTnVtYmVyLkRFQlVHKSB7XHJcbiAgICAgICAgICB0aHJvdyBFcnJvclxyXG4gICAgICAgICAgICAoYmlnbnVtYmVyRXJyb3IgKyAnTm90IGEnICsgKGIgPyAnIGJhc2UgJyArIGIgOiAnJykgKyAnIG51bWJlcjogJyArIHN0cik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBOYU5cclxuICAgICAgICB4LmMgPSB4LmUgPSB4LnMgPSBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSkoKTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUm91bmQgeCB0byBzZCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBybS4gQ2hlY2sgZm9yIG92ZXIvdW5kZXItZmxvdy5cclxuICAgKiBJZiByIGlzIHRydXRoeSwgaXQgaXMga25vd24gdGhhdCB0aGVyZSBhcmUgbW9yZSBkaWdpdHMgYWZ0ZXIgdGhlIHJvdW5kaW5nIGRpZ2l0LlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIHJvdW5kKHgsIHNkLCBybSwgcikge1xyXG4gICAgdmFyIGQsIGksIGosIGssIG4sIG5pLCByZCxcclxuICAgICAgeGMgPSB4LmMsXHJcbiAgICAgIHBvd3MxMCA9IFBPV1NfVEVOO1xyXG5cclxuICAgIC8vIGlmIHggaXMgbm90IEluZmluaXR5IG9yIE5hTi4uLlxyXG4gICAgaWYgKHhjKSB7XHJcblxyXG4gICAgICAvLyByZCBpcyB0aGUgcm91bmRpbmcgZGlnaXQsIGkuZS4gdGhlIGRpZ2l0IGFmdGVyIHRoZSBkaWdpdCB0aGF0IG1heSBiZSByb3VuZGVkIHVwLlxyXG4gICAgICAvLyBuIGlzIGEgYmFzZSAxZTE0IG51bWJlciwgdGhlIHZhbHVlIG9mIHRoZSBlbGVtZW50IG9mIGFycmF5IHguYyBjb250YWluaW5nIHJkLlxyXG4gICAgICAvLyBuaSBpcyB0aGUgaW5kZXggb2YgbiB3aXRoaW4geC5jLlxyXG4gICAgICAvLyBkIGlzIHRoZSBudW1iZXIgb2YgZGlnaXRzIG9mIG4uXHJcbiAgICAgIC8vIGkgaXMgdGhlIGluZGV4IG9mIHJkIHdpdGhpbiBuIGluY2x1ZGluZyBsZWFkaW5nIHplcm9zLlxyXG4gICAgICAvLyBqIGlzIHRoZSBhY3R1YWwgaW5kZXggb2YgcmQgd2l0aGluIG4gKGlmIDwgMCwgcmQgaXMgYSBsZWFkaW5nIHplcm8pLlxyXG4gICAgICBvdXQ6IHtcclxuXHJcbiAgICAgICAgLy8gR2V0IHRoZSBudW1iZXIgb2YgZGlnaXRzIG9mIHRoZSBmaXJzdCBlbGVtZW50IG9mIHhjLlxyXG4gICAgICAgIGZvciAoZCA9IDEsIGsgPSB4Y1swXTsgayA+PSAxMDsgayAvPSAxMCwgZCsrKTtcclxuICAgICAgICBpID0gc2QgLSBkO1xyXG5cclxuICAgICAgICAvLyBJZiB0aGUgcm91bmRpbmcgZGlnaXQgaXMgaW4gdGhlIGZpcnN0IGVsZW1lbnQgb2YgeGMuLi5cclxuICAgICAgICBpZiAoaSA8IDApIHtcclxuICAgICAgICAgIGkgKz0gTE9HX0JBU0U7XHJcbiAgICAgICAgICBqID0gc2Q7XHJcbiAgICAgICAgICBuID0geGNbbmkgPSAwXTtcclxuXHJcbiAgICAgICAgICAvLyBHZXQgdGhlIHJvdW5kaW5nIGRpZ2l0IGF0IGluZGV4IGogb2Ygbi5cclxuICAgICAgICAgIHJkID0gbiAvIHBvd3MxMFtkIC0gaiAtIDFdICUgMTAgfCAwO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBuaSA9IG1hdGhjZWlsKChpICsgMSkgLyBMT0dfQkFTRSk7XHJcblxyXG4gICAgICAgICAgaWYgKG5pID49IHhjLmxlbmd0aCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKHIpIHtcclxuXHJcbiAgICAgICAgICAgICAgLy8gTmVlZGVkIGJ5IHNxcnQuXHJcbiAgICAgICAgICAgICAgZm9yICg7IHhjLmxlbmd0aCA8PSBuaTsgeGMucHVzaCgwKSk7XHJcbiAgICAgICAgICAgICAgbiA9IHJkID0gMDtcclxuICAgICAgICAgICAgICBkID0gMTtcclxuICAgICAgICAgICAgICBpICU9IExPR19CQVNFO1xyXG4gICAgICAgICAgICAgIGogPSBpIC0gTE9HX0JBU0UgKyAxO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGJyZWFrIG91dDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbiA9IGsgPSB4Y1tuaV07XHJcblxyXG4gICAgICAgICAgICAvLyBHZXQgdGhlIG51bWJlciBvZiBkaWdpdHMgb2Ygbi5cclxuICAgICAgICAgICAgZm9yIChkID0gMTsgayA+PSAxMDsgayAvPSAxMCwgZCsrKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEdldCB0aGUgaW5kZXggb2YgcmQgd2l0aGluIG4uXHJcbiAgICAgICAgICAgIGkgJT0gTE9HX0JBU0U7XHJcblxyXG4gICAgICAgICAgICAvLyBHZXQgdGhlIGluZGV4IG9mIHJkIHdpdGhpbiBuLCBhZGp1c3RlZCBmb3IgbGVhZGluZyB6ZXJvcy5cclxuICAgICAgICAgICAgLy8gVGhlIG51bWJlciBvZiBsZWFkaW5nIHplcm9zIG9mIG4gaXMgZ2l2ZW4gYnkgTE9HX0JBU0UgLSBkLlxyXG4gICAgICAgICAgICBqID0gaSAtIExPR19CQVNFICsgZDtcclxuXHJcbiAgICAgICAgICAgIC8vIEdldCB0aGUgcm91bmRpbmcgZGlnaXQgYXQgaW5kZXggaiBvZiBuLlxyXG4gICAgICAgICAgICByZCA9IGogPCAwID8gMCA6IG4gLyBwb3dzMTBbZCAtIGogLSAxXSAlIDEwIHwgMDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHIgPSByIHx8IHNkIDwgMCB8fFxyXG5cclxuICAgICAgICAvLyBBcmUgdGhlcmUgYW55IG5vbi16ZXJvIGRpZ2l0cyBhZnRlciB0aGUgcm91bmRpbmcgZGlnaXQ/XHJcbiAgICAgICAgLy8gVGhlIGV4cHJlc3Npb24gIG4gJSBwb3dzMTBbZCAtIGogLSAxXSAgcmV0dXJucyBhbGwgZGlnaXRzIG9mIG4gdG8gdGhlIHJpZ2h0XHJcbiAgICAgICAgLy8gb2YgdGhlIGRpZ2l0IGF0IGosIGUuZy4gaWYgbiBpcyA5MDg3MTQgYW5kIGogaXMgMiwgdGhlIGV4cHJlc3Npb24gZ2l2ZXMgNzE0LlxyXG4gICAgICAgICB4Y1tuaSArIDFdICE9IG51bGwgfHwgKGogPCAwID8gbiA6IG4gJSBwb3dzMTBbZCAtIGogLSAxXSk7XHJcblxyXG4gICAgICAgIHIgPSBybSA8IDRcclxuICAgICAgICAgPyAocmQgfHwgcikgJiYgKHJtID09IDAgfHwgcm0gPT0gKHgucyA8IDAgPyAzIDogMikpXHJcbiAgICAgICAgIDogcmQgPiA1IHx8IHJkID09IDUgJiYgKHJtID09IDQgfHwgciB8fCBybSA9PSA2ICYmXHJcblxyXG4gICAgICAgICAgLy8gQ2hlY2sgd2hldGhlciB0aGUgZGlnaXQgdG8gdGhlIGxlZnQgb2YgdGhlIHJvdW5kaW5nIGRpZ2l0IGlzIG9kZC5cclxuICAgICAgICAgICgoaSA+IDAgPyBqID4gMCA/IG4gLyBwb3dzMTBbZCAtIGpdIDogMCA6IHhjW25pIC0gMV0pICUgMTApICYgMSB8fFxyXG4gICAgICAgICAgIHJtID09ICh4LnMgPCAwID8gOCA6IDcpKTtcclxuXHJcbiAgICAgICAgaWYgKHNkIDwgMSB8fCAheGNbMF0pIHtcclxuICAgICAgICAgIHhjLmxlbmd0aCA9IDA7XHJcblxyXG4gICAgICAgICAgaWYgKHIpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIENvbnZlcnQgc2QgdG8gZGVjaW1hbCBwbGFjZXMuXHJcbiAgICAgICAgICAgIHNkIC09IHguZSArIDE7XHJcblxyXG4gICAgICAgICAgICAvLyAxLCAwLjEsIDAuMDEsIDAuMDAxLCAwLjAwMDEgZXRjLlxyXG4gICAgICAgICAgICB4Y1swXSA9IHBvd3MxMFsoTE9HX0JBU0UgLSBzZCAlIExPR19CQVNFKSAlIExPR19CQVNFXTtcclxuICAgICAgICAgICAgeC5lID0gLXNkIHx8IDA7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgLy8gWmVyby5cclxuICAgICAgICAgICAgeGNbMF0gPSB4LmUgPSAwO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHJldHVybiB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gUmVtb3ZlIGV4Y2VzcyBkaWdpdHMuXHJcbiAgICAgICAgaWYgKGkgPT0gMCkge1xyXG4gICAgICAgICAgeGMubGVuZ3RoID0gbmk7XHJcbiAgICAgICAgICBrID0gMTtcclxuICAgICAgICAgIG5pLS07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHhjLmxlbmd0aCA9IG5pICsgMTtcclxuICAgICAgICAgIGsgPSBwb3dzMTBbTE9HX0JBU0UgLSBpXTtcclxuXHJcbiAgICAgICAgICAvLyBFLmcuIDU2NzAwIGJlY29tZXMgNTYwMDAgaWYgNyBpcyB0aGUgcm91bmRpbmcgZGlnaXQuXHJcbiAgICAgICAgICAvLyBqID4gMCBtZWFucyBpID4gbnVtYmVyIG9mIGxlYWRpbmcgemVyb3Mgb2Ygbi5cclxuICAgICAgICAgIHhjW25pXSA9IGogPiAwID8gbWF0aGZsb29yKG4gLyBwb3dzMTBbZCAtIGpdICUgcG93czEwW2pdKSAqIGsgOiAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gUm91bmQgdXA/XHJcbiAgICAgICAgaWYgKHIpIHtcclxuXHJcbiAgICAgICAgICBmb3IgKDsgOykge1xyXG5cclxuICAgICAgICAgICAgLy8gSWYgdGhlIGRpZ2l0IHRvIGJlIHJvdW5kZWQgdXAgaXMgaW4gdGhlIGZpcnN0IGVsZW1lbnQgb2YgeGMuLi5cclxuICAgICAgICAgICAgaWYgKG5pID09IDApIHtcclxuXHJcbiAgICAgICAgICAgICAgLy8gaSB3aWxsIGJlIHRoZSBsZW5ndGggb2YgeGNbMF0gYmVmb3JlIGsgaXMgYWRkZWQuXHJcbiAgICAgICAgICAgICAgZm9yIChpID0gMSwgaiA9IHhjWzBdOyBqID49IDEwOyBqIC89IDEwLCBpKyspO1xyXG4gICAgICAgICAgICAgIGogPSB4Y1swXSArPSBrO1xyXG4gICAgICAgICAgICAgIGZvciAoayA9IDE7IGogPj0gMTA7IGogLz0gMTAsIGsrKyk7XHJcblxyXG4gICAgICAgICAgICAgIC8vIGlmIGkgIT0gayB0aGUgbGVuZ3RoIGhhcyBpbmNyZWFzZWQuXHJcbiAgICAgICAgICAgICAgaWYgKGkgIT0gaykge1xyXG4gICAgICAgICAgICAgICAgeC5lKys7XHJcbiAgICAgICAgICAgICAgICBpZiAoeGNbMF0gPT0gQkFTRSkgeGNbMF0gPSAxO1xyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgeGNbbmldICs9IGs7XHJcbiAgICAgICAgICAgICAgaWYgKHhjW25pXSAhPSBCQVNFKSBicmVhaztcclxuICAgICAgICAgICAgICB4Y1tuaS0tXSA9IDA7XHJcbiAgICAgICAgICAgICAgayA9IDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFJlbW92ZSB0cmFpbGluZyB6ZXJvcy5cclxuICAgICAgICBmb3IgKGkgPSB4Yy5sZW5ndGg7IHhjWy0taV0gPT09IDA7IHhjLnBvcCgpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gT3ZlcmZsb3c/IEluZmluaXR5LlxyXG4gICAgICBpZiAoeC5lID4gTUFYX0VYUCkge1xyXG4gICAgICAgIHguYyA9IHguZSA9IG51bGw7XHJcblxyXG4gICAgICAvLyBVbmRlcmZsb3c/IFplcm8uXHJcbiAgICAgIH0gZWxzZSBpZiAoeC5lIDwgTUlOX0VYUCkge1xyXG4gICAgICAgIHguYyA9IFt4LmUgPSAwXTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB4O1xyXG4gIH1cclxuXHJcblxyXG4gIGZ1bmN0aW9uIHZhbHVlT2Yobikge1xyXG4gICAgdmFyIHN0cixcclxuICAgICAgZSA9IG4uZTtcclxuXHJcbiAgICBpZiAoZSA9PT0gbnVsbCkgcmV0dXJuIG4udG9TdHJpbmcoKTtcclxuXHJcbiAgICBzdHIgPSBjb2VmZlRvU3RyaW5nKG4uYyk7XHJcblxyXG4gICAgc3RyID0gZSA8PSBUT19FWFBfTkVHIHx8IGUgPj0gVE9fRVhQX1BPU1xyXG4gICAgICA/IHRvRXhwb25lbnRpYWwoc3RyLCBlKVxyXG4gICAgICA6IHRvRml4ZWRQb2ludChzdHIsIGUsICcwJyk7XHJcblxyXG4gICAgcmV0dXJuIG4ucyA8IDAgPyAnLScgKyBzdHIgOiBzdHI7XHJcbiAgfVxyXG5cclxuXHJcbiAgLy8gUFJPVE9UWVBFL0lOU1RBTkNFIE1FVEhPRFNcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IEJpZ051bWJlciB3aG9zZSB2YWx1ZSBpcyB0aGUgYWJzb2x1dGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIuXHJcbiAgICovXHJcbiAgUC5hYnNvbHV0ZVZhbHVlID0gUC5hYnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgeCA9IG5ldyBCaWdOdW1iZXIodGhpcyk7XHJcbiAgICBpZiAoeC5zIDwgMCkgeC5zID0gMTtcclxuICAgIHJldHVybiB4O1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVyblxyXG4gICAqICAgMSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgaXMgZ3JlYXRlciB0aGFuIHRoZSB2YWx1ZSBvZiBCaWdOdW1iZXIoeSwgYiksXHJcbiAgICogICAtMSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgaXMgbGVzcyB0aGFuIHRoZSB2YWx1ZSBvZiBCaWdOdW1iZXIoeSwgYiksXHJcbiAgICogICAwIGlmIHRoZXkgaGF2ZSB0aGUgc2FtZSB2YWx1ZSxcclxuICAgKiAgIG9yIG51bGwgaWYgdGhlIHZhbHVlIG9mIGVpdGhlciBpcyBOYU4uXHJcbiAgICovXHJcbiAgUC5jb21wYXJlZFRvID0gZnVuY3Rpb24gKHksIGIpIHtcclxuICAgIHJldHVybiBjb21wYXJlKHRoaXMsIG5ldyBCaWdOdW1iZXIoeSwgYikpO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIElmIGRwIGlzIHVuZGVmaW5lZCBvciBudWxsIG9yIHRydWUgb3IgZmFsc2UsIHJldHVybiB0aGUgbnVtYmVyIG9mIGRlY2ltYWwgcGxhY2VzIG9mIHRoZVxyXG4gICAqIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyLCBvciBudWxsIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZ051bWJlciBpcyDCsUluZmluaXR5IG9yIE5hTi5cclxuICAgKlxyXG4gICAqIE90aGVyd2lzZSwgaWYgZHAgaXMgYSBudW1iZXIsIHJldHVybiBhIG5ldyBCaWdOdW1iZXIgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXNcclxuICAgKiBCaWdOdW1iZXIgcm91bmRlZCB0byBhIG1heGltdW0gb2YgZHAgZGVjaW1hbCBwbGFjZXMgdXNpbmcgcm91bmRpbmcgbW9kZSBybSwgb3JcclxuICAgKiBST1VORElOR19NT0RFIGlmIHJtIGlzIG9taXR0ZWQuXHJcbiAgICpcclxuICAgKiBbZHBdIHtudW1iZXJ9IERlY2ltYWwgcGxhY2VzOiBpbnRlZ2VyLCAwIHRvIE1BWCBpbmNsdXNpdmUuXHJcbiAgICogW3JtXSB7bnVtYmVyfSBSb3VuZGluZyBtb2RlLiBJbnRlZ2VyLCAwIHRvIDggaW5jbHVzaXZlLlxyXG4gICAqXHJcbiAgICogJ1tCaWdOdW1iZXIgRXJyb3JdIEFyZ3VtZW50IHtub3QgYSBwcmltaXRpdmUgbnVtYmVyfG5vdCBhbiBpbnRlZ2VyfG91dCBvZiByYW5nZX06IHtkcHxybX0nXHJcbiAgICovXHJcbiAgUC5kZWNpbWFsUGxhY2VzID0gUC5kcCA9IGZ1bmN0aW9uIChkcCwgcm0pIHtcclxuICAgIHZhciBjLCBuLCB2LFxyXG4gICAgICB4ID0gdGhpcztcclxuXHJcbiAgICBpZiAoZHAgIT0gbnVsbCkge1xyXG4gICAgICBpbnRDaGVjayhkcCwgMCwgTUFYKTtcclxuICAgICAgaWYgKHJtID09IG51bGwpIHJtID0gUk9VTkRJTkdfTU9ERTtcclxuICAgICAgZWxzZSBpbnRDaGVjayhybSwgMCwgOCk7XHJcblxyXG4gICAgICByZXR1cm4gcm91bmQobmV3IEJpZ051bWJlcih4KSwgZHAgKyB4LmUgKyAxLCBybSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCEoYyA9IHguYykpIHJldHVybiBudWxsO1xyXG4gICAgbiA9ICgodiA9IGMubGVuZ3RoIC0gMSkgLSBiaXRGbG9vcih0aGlzLmUgLyBMT0dfQkFTRSkpICogTE9HX0JBU0U7XHJcblxyXG4gICAgLy8gU3VidHJhY3QgdGhlIG51bWJlciBvZiB0cmFpbGluZyB6ZXJvcyBvZiB0aGUgbGFzdCBudW1iZXIuXHJcbiAgICBpZiAodiA9IGNbdl0pIGZvciAoOyB2ICUgMTAgPT0gMDsgdiAvPSAxMCwgbi0tKTtcclxuICAgIGlmIChuIDwgMCkgbiA9IDA7XHJcblxyXG4gICAgcmV0dXJuIG47XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogIG4gLyAwID0gSVxyXG4gICAqICBuIC8gTiA9IE5cclxuICAgKiAgbiAvIEkgPSAwXHJcbiAgICogIDAgLyBuID0gMFxyXG4gICAqICAwIC8gMCA9IE5cclxuICAgKiAgMCAvIE4gPSBOXHJcbiAgICogIDAgLyBJID0gMFxyXG4gICAqICBOIC8gbiA9IE5cclxuICAgKiAgTiAvIDAgPSBOXHJcbiAgICogIE4gLyBOID0gTlxyXG4gICAqICBOIC8gSSA9IE5cclxuICAgKiAgSSAvIG4gPSBJXHJcbiAgICogIEkgLyAwID0gSVxyXG4gICAqICBJIC8gTiA9IE5cclxuICAgKiAgSSAvIEkgPSBOXHJcbiAgICpcclxuICAgKiBSZXR1cm4gYSBuZXcgQmlnTnVtYmVyIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZ051bWJlciBkaXZpZGVkIGJ5IHRoZSB2YWx1ZSBvZlxyXG4gICAqIEJpZ051bWJlcih5LCBiKSwgcm91bmRlZCBhY2NvcmRpbmcgdG8gREVDSU1BTF9QTEFDRVMgYW5kIFJPVU5ESU5HX01PREUuXHJcbiAgICovXHJcbiAgUC5kaXZpZGVkQnkgPSBQLmRpdiA9IGZ1bmN0aW9uICh5LCBiKSB7XHJcbiAgICByZXR1cm4gZGl2KHRoaXMsIG5ldyBCaWdOdW1iZXIoeSwgYiksIERFQ0lNQUxfUExBQ0VTLCBST1VORElOR19NT0RFKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgQmlnTnVtYmVyIHdob3NlIHZhbHVlIGlzIHRoZSBpbnRlZ2VyIHBhcnQgb2YgZGl2aWRpbmcgdGhlIHZhbHVlIG9mIHRoaXNcclxuICAgKiBCaWdOdW1iZXIgYnkgdGhlIHZhbHVlIG9mIEJpZ051bWJlcih5LCBiKS5cclxuICAgKi9cclxuICBQLmRpdmlkZWRUb0ludGVnZXJCeSA9IFAuaWRpdiA9IGZ1bmN0aW9uICh5LCBiKSB7XHJcbiAgICByZXR1cm4gZGl2KHRoaXMsIG5ldyBCaWdOdW1iZXIoeSwgYiksIDAsIDEpO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIEJpZ051bWJlciB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgZXhwb25lbnRpYXRlZCBieSBuLlxyXG4gICAqXHJcbiAgICogSWYgbSBpcyBwcmVzZW50LCByZXR1cm4gdGhlIHJlc3VsdCBtb2R1bG8gbS5cclxuICAgKiBJZiBuIGlzIG5lZ2F0aXZlIHJvdW5kIGFjY29yZGluZyB0byBERUNJTUFMX1BMQUNFUyBhbmQgUk9VTkRJTkdfTU9ERS5cclxuICAgKiBJZiBQT1dfUFJFQ0lTSU9OIGlzIG5vbi16ZXJvIGFuZCBtIGlzIG5vdCBwcmVzZW50LCByb3VuZCB0byBQT1dfUFJFQ0lTSU9OIHVzaW5nIFJPVU5ESU5HX01PREUuXHJcbiAgICpcclxuICAgKiBUaGUgbW9kdWxhciBwb3dlciBvcGVyYXRpb24gd29ya3MgZWZmaWNpZW50bHkgd2hlbiB4LCBuLCBhbmQgbSBhcmUgaW50ZWdlcnMsIG90aGVyd2lzZSBpdFxyXG4gICAqIGlzIGVxdWl2YWxlbnQgdG8gY2FsY3VsYXRpbmcgeC5leHBvbmVudGlhdGVkQnkobikubW9kdWxvKG0pIHdpdGggYSBQT1dfUFJFQ0lTSU9OIG9mIDAuXHJcbiAgICpcclxuICAgKiBuIHtudW1iZXJ8c3RyaW5nfEJpZ051bWJlcn0gVGhlIGV4cG9uZW50LiBBbiBpbnRlZ2VyLlxyXG4gICAqIFttXSB7bnVtYmVyfHN0cmluZ3xCaWdOdW1iZXJ9IFRoZSBtb2R1bHVzLlxyXG4gICAqXHJcbiAgICogJ1tCaWdOdW1iZXIgRXJyb3JdIEV4cG9uZW50IG5vdCBhbiBpbnRlZ2VyOiB7bn0nXHJcbiAgICovXHJcbiAgUC5leHBvbmVudGlhdGVkQnkgPSBQLnBvdyA9IGZ1bmN0aW9uIChuLCBtKSB7XHJcbiAgICB2YXIgaGFsZiwgaXNNb2RFeHAsIGksIGssIG1vcmUsIG5Jc0JpZywgbklzTmVnLCBuSXNPZGQsIHksXHJcbiAgICAgIHggPSB0aGlzO1xyXG5cclxuICAgIG4gPSBuZXcgQmlnTnVtYmVyKG4pO1xyXG5cclxuICAgIC8vIEFsbG93IE5hTiBhbmQgwrFJbmZpbml0eSwgYnV0IG5vdCBvdGhlciBub24taW50ZWdlcnMuXHJcbiAgICBpZiAobi5jICYmICFuLmlzSW50ZWdlcigpKSB7XHJcbiAgICAgIHRocm93IEVycm9yXHJcbiAgICAgICAgKGJpZ251bWJlckVycm9yICsgJ0V4cG9uZW50IG5vdCBhbiBpbnRlZ2VyOiAnICsgdmFsdWVPZihuKSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG0gIT0gbnVsbCkgbSA9IG5ldyBCaWdOdW1iZXIobSk7XHJcblxyXG4gICAgLy8gRXhwb25lbnQgb2YgTUFYX1NBRkVfSU5URUdFUiBpcyAxNS5cclxuICAgIG5Jc0JpZyA9IG4uZSA+IDE0O1xyXG5cclxuICAgIC8vIElmIHggaXMgTmFOLCDCsUluZmluaXR5LCDCsTAgb3IgwrExLCBvciBuIGlzIMKxSW5maW5pdHksIE5hTiBvciDCsTAuXHJcbiAgICBpZiAoIXguYyB8fCAheC5jWzBdIHx8IHguY1swXSA9PSAxICYmICF4LmUgJiYgeC5jLmxlbmd0aCA9PSAxIHx8ICFuLmMgfHwgIW4uY1swXSkge1xyXG5cclxuICAgICAgLy8gVGhlIHNpZ24gb2YgdGhlIHJlc3VsdCBvZiBwb3cgd2hlbiB4IGlzIG5lZ2F0aXZlIGRlcGVuZHMgb24gdGhlIGV2ZW5uZXNzIG9mIG4uXHJcbiAgICAgIC8vIElmICtuIG92ZXJmbG93cyB0byDCsUluZmluaXR5LCB0aGUgZXZlbm5lc3Mgb2YgbiB3b3VsZCBiZSBub3QgYmUga25vd24uXHJcbiAgICAgIHkgPSBuZXcgQmlnTnVtYmVyKE1hdGgucG93KCt2YWx1ZU9mKHgpLCBuSXNCaWcgPyAyIC0gaXNPZGQobikgOiArdmFsdWVPZihuKSkpO1xyXG4gICAgICByZXR1cm4gbSA/IHkubW9kKG0pIDogeTtcclxuICAgIH1cclxuXHJcbiAgICBuSXNOZWcgPSBuLnMgPCAwO1xyXG5cclxuICAgIGlmIChtKSB7XHJcblxyXG4gICAgICAvLyB4ICUgbSByZXR1cm5zIE5hTiBpZiBhYnMobSkgaXMgemVybywgb3IgbSBpcyBOYU4uXHJcbiAgICAgIGlmIChtLmMgPyAhbS5jWzBdIDogIW0ucykgcmV0dXJuIG5ldyBCaWdOdW1iZXIoTmFOKTtcclxuXHJcbiAgICAgIGlzTW9kRXhwID0gIW5Jc05lZyAmJiB4LmlzSW50ZWdlcigpICYmIG0uaXNJbnRlZ2VyKCk7XHJcblxyXG4gICAgICBpZiAoaXNNb2RFeHApIHggPSB4Lm1vZChtKTtcclxuXHJcbiAgICAvLyBPdmVyZmxvdyB0byDCsUluZmluaXR5OiA+PTIqKjFlMTAgb3IgPj0xLjAwMDAwMjQqKjFlMTUuXHJcbiAgICAvLyBVbmRlcmZsb3cgdG8gwrEwOiA8PTAuNzkqKjFlMTAgb3IgPD0wLjk5OTk5NzUqKjFlMTUuXHJcbiAgICB9IGVsc2UgaWYgKG4uZSA+IDkgJiYgKHguZSA+IDAgfHwgeC5lIDwgLTEgfHwgKHguZSA9PSAwXHJcbiAgICAgIC8vIFsxLCAyNDAwMDAwMDBdXHJcbiAgICAgID8geC5jWzBdID4gMSB8fCBuSXNCaWcgJiYgeC5jWzFdID49IDI0ZTdcclxuICAgICAgLy8gWzgwMDAwMDAwMDAwMDAwXSAgWzk5OTk5NzUwMDAwMDAwXVxyXG4gICAgICA6IHguY1swXSA8IDhlMTMgfHwgbklzQmlnICYmIHguY1swXSA8PSA5OTk5OTc1ZTcpKSkge1xyXG5cclxuICAgICAgLy8gSWYgeCBpcyBuZWdhdGl2ZSBhbmQgbiBpcyBvZGQsIGsgPSAtMCwgZWxzZSBrID0gMC5cclxuICAgICAgayA9IHgucyA8IDAgJiYgaXNPZGQobikgPyAtMCA6IDA7XHJcblxyXG4gICAgICAvLyBJZiB4ID49IDEsIGsgPSDCsUluZmluaXR5LlxyXG4gICAgICBpZiAoeC5lID4gLTEpIGsgPSAxIC8gaztcclxuXHJcbiAgICAgIC8vIElmIG4gaXMgbmVnYXRpdmUgcmV0dXJuIMKxMCwgZWxzZSByZXR1cm4gwrFJbmZpbml0eS5cclxuICAgICAgcmV0dXJuIG5ldyBCaWdOdW1iZXIobklzTmVnID8gMSAvIGsgOiBrKTtcclxuXHJcbiAgICB9IGVsc2UgaWYgKFBPV19QUkVDSVNJT04pIHtcclxuXHJcbiAgICAgIC8vIFRydW5jYXRpbmcgZWFjaCBjb2VmZmljaWVudCBhcnJheSB0byBhIGxlbmd0aCBvZiBrIGFmdGVyIGVhY2ggbXVsdGlwbGljYXRpb25cclxuICAgICAgLy8gZXF1YXRlcyB0byB0cnVuY2F0aW5nIHNpZ25pZmljYW50IGRpZ2l0cyB0byBQT1dfUFJFQ0lTSU9OICsgWzI4LCA0MV0sXHJcbiAgICAgIC8vIGkuZS4gdGhlcmUgd2lsbCBiZSBhIG1pbmltdW0gb2YgMjggZ3VhcmQgZGlnaXRzIHJldGFpbmVkLlxyXG4gICAgICBrID0gbWF0aGNlaWwoUE9XX1BSRUNJU0lPTiAvIExPR19CQVNFICsgMik7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG5Jc0JpZykge1xyXG4gICAgICBoYWxmID0gbmV3IEJpZ051bWJlcigwLjUpO1xyXG4gICAgICBpZiAobklzTmVnKSBuLnMgPSAxO1xyXG4gICAgICBuSXNPZGQgPSBpc09kZChuKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGkgPSBNYXRoLmFicygrdmFsdWVPZihuKSk7XHJcbiAgICAgIG5Jc09kZCA9IGkgJSAyO1xyXG4gICAgfVxyXG5cclxuICAgIHkgPSBuZXcgQmlnTnVtYmVyKE9ORSk7XHJcblxyXG4gICAgLy8gUGVyZm9ybXMgNTQgbG9vcCBpdGVyYXRpb25zIGZvciBuIG9mIDkwMDcxOTkyNTQ3NDA5OTEuXHJcbiAgICBmb3IgKDsgOykge1xyXG5cclxuICAgICAgaWYgKG5Jc09kZCkge1xyXG4gICAgICAgIHkgPSB5LnRpbWVzKHgpO1xyXG4gICAgICAgIGlmICgheS5jKSBicmVhaztcclxuXHJcbiAgICAgICAgaWYgKGspIHtcclxuICAgICAgICAgIGlmICh5LmMubGVuZ3RoID4gaykgeS5jLmxlbmd0aCA9IGs7XHJcbiAgICAgICAgfSBlbHNlIGlmIChpc01vZEV4cCkge1xyXG4gICAgICAgICAgeSA9IHkubW9kKG0pOyAgICAvL3kgPSB5Lm1pbnVzKGRpdih5LCBtLCAwLCBNT0RVTE9fTU9ERSkudGltZXMobSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGkpIHtcclxuICAgICAgICBpID0gbWF0aGZsb29yKGkgLyAyKTtcclxuICAgICAgICBpZiAoaSA9PT0gMCkgYnJlYWs7XHJcbiAgICAgICAgbklzT2RkID0gaSAlIDI7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbiA9IG4udGltZXMoaGFsZik7XHJcbiAgICAgICAgcm91bmQobiwgbi5lICsgMSwgMSk7XHJcblxyXG4gICAgICAgIGlmIChuLmUgPiAxNCkge1xyXG4gICAgICAgICAgbklzT2RkID0gaXNPZGQobik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGkgPSArdmFsdWVPZihuKTtcclxuICAgICAgICAgIGlmIChpID09PSAwKSBicmVhaztcclxuICAgICAgICAgIG5Jc09kZCA9IGkgJSAyO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgeCA9IHgudGltZXMoeCk7XHJcblxyXG4gICAgICBpZiAoaykge1xyXG4gICAgICAgIGlmICh4LmMgJiYgeC5jLmxlbmd0aCA+IGspIHguYy5sZW5ndGggPSBrO1xyXG4gICAgICB9IGVsc2UgaWYgKGlzTW9kRXhwKSB7XHJcbiAgICAgICAgeCA9IHgubW9kKG0pOyAgICAvL3ggPSB4Lm1pbnVzKGRpdih4LCBtLCAwLCBNT0RVTE9fTU9ERSkudGltZXMobSkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGlzTW9kRXhwKSByZXR1cm4geTtcclxuICAgIGlmIChuSXNOZWcpIHkgPSBPTkUuZGl2KHkpO1xyXG5cclxuICAgIHJldHVybiBtID8geS5tb2QobSkgOiBrID8gcm91bmQoeSwgUE9XX1BSRUNJU0lPTiwgUk9VTkRJTkdfTU9ERSwgbW9yZSkgOiB5O1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBCaWdOdW1iZXIgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIHJvdW5kZWQgdG8gYW4gaW50ZWdlclxyXG4gICAqIHVzaW5nIHJvdW5kaW5nIG1vZGUgcm0sIG9yIFJPVU5ESU5HX01PREUgaWYgcm0gaXMgb21pdHRlZC5cclxuICAgKlxyXG4gICAqIFtybV0ge251bWJlcn0gUm91bmRpbmcgbW9kZS4gSW50ZWdlciwgMCB0byA4IGluY2x1c2l2ZS5cclxuICAgKlxyXG4gICAqICdbQmlnTnVtYmVyIEVycm9yXSBBcmd1bWVudCB7bm90IGEgcHJpbWl0aXZlIG51bWJlcnxub3QgYW4gaW50ZWdlcnxvdXQgb2YgcmFuZ2V9OiB7cm19J1xyXG4gICAqL1xyXG4gIFAuaW50ZWdlclZhbHVlID0gZnVuY3Rpb24gKHJtKSB7XHJcbiAgICB2YXIgbiA9IG5ldyBCaWdOdW1iZXIodGhpcyk7XHJcbiAgICBpZiAocm0gPT0gbnVsbCkgcm0gPSBST1VORElOR19NT0RFO1xyXG4gICAgZWxzZSBpbnRDaGVjayhybSwgMCwgOCk7XHJcbiAgICByZXR1cm4gcm91bmQobiwgbi5lICsgMSwgcm0pO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZ051bWJlciBpcyBlcXVhbCB0byB0aGUgdmFsdWUgb2YgQmlnTnVtYmVyKHksIGIpLFxyXG4gICAqIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAgICovXHJcbiAgUC5pc0VxdWFsVG8gPSBQLmVxID0gZnVuY3Rpb24gKHksIGIpIHtcclxuICAgIHJldHVybiBjb21wYXJlKHRoaXMsIG5ldyBCaWdOdW1iZXIoeSwgYikpID09PSAwO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZ051bWJlciBpcyBhIGZpbml0ZSBudW1iZXIsIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAgICovXHJcbiAgUC5pc0Zpbml0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiAhIXRoaXMuYztcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgaXMgZ3JlYXRlciB0aGFuIHRoZSB2YWx1ZSBvZiBCaWdOdW1iZXIoeSwgYiksXHJcbiAgICogb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICAgKi9cclxuICBQLmlzR3JlYXRlclRoYW4gPSBQLmd0ID0gZnVuY3Rpb24gKHksIGIpIHtcclxuICAgIHJldHVybiBjb21wYXJlKHRoaXMsIG5ldyBCaWdOdW1iZXIoeSwgYikpID4gMDtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgaXMgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIHRoZSB2YWx1ZSBvZlxyXG4gICAqIEJpZ051bWJlcih5LCBiKSwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICAgKi9cclxuICBQLmlzR3JlYXRlclRoYW5PckVxdWFsVG8gPSBQLmd0ZSA9IGZ1bmN0aW9uICh5LCBiKSB7XHJcbiAgICByZXR1cm4gKGIgPSBjb21wYXJlKHRoaXMsIG5ldyBCaWdOdW1iZXIoeSwgYikpKSA9PT0gMSB8fCBiID09PSAwO1xyXG5cclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgaXMgYW4gaW50ZWdlciwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICAgKi9cclxuICBQLmlzSW50ZWdlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiAhIXRoaXMuYyAmJiBiaXRGbG9vcih0aGlzLmUgLyBMT0dfQkFTRSkgPiB0aGlzLmMubGVuZ3RoIC0gMjtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgaXMgbGVzcyB0aGFuIHRoZSB2YWx1ZSBvZiBCaWdOdW1iZXIoeSwgYiksXHJcbiAgICogb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICAgKi9cclxuICBQLmlzTGVzc1RoYW4gPSBQLmx0ID0gZnVuY3Rpb24gKHksIGIpIHtcclxuICAgIHJldHVybiBjb21wYXJlKHRoaXMsIG5ldyBCaWdOdW1iZXIoeSwgYikpIDwgMDtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgaXMgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIHRoZSB2YWx1ZSBvZlxyXG4gICAqIEJpZ051bWJlcih5LCBiKSwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICAgKi9cclxuICBQLmlzTGVzc1RoYW5PckVxdWFsVG8gPSBQLmx0ZSA9IGZ1bmN0aW9uICh5LCBiKSB7XHJcbiAgICByZXR1cm4gKGIgPSBjb21wYXJlKHRoaXMsIG5ldyBCaWdOdW1iZXIoeSwgYikpKSA9PT0gLTEgfHwgYiA9PT0gMDtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgaXMgTmFOLCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gICAqL1xyXG4gIFAuaXNOYU4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gIXRoaXMucztcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgaXMgbmVnYXRpdmUsIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAgICovXHJcbiAgUC5pc05lZ2F0aXZlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIHRoaXMucyA8IDA7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIGlzIHBvc2l0aXZlLCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gICAqL1xyXG4gIFAuaXNQb3NpdGl2ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB0aGlzLnMgPiAwO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZ051bWJlciBpcyAwIG9yIC0wLCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gICAqL1xyXG4gIFAuaXNaZXJvID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuICEhdGhpcy5jICYmIHRoaXMuY1swXSA9PSAwO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqICBuIC0gMCA9IG5cclxuICAgKiAgbiAtIE4gPSBOXHJcbiAgICogIG4gLSBJID0gLUlcclxuICAgKiAgMCAtIG4gPSAtblxyXG4gICAqICAwIC0gMCA9IDBcclxuICAgKiAgMCAtIE4gPSBOXHJcbiAgICogIDAgLSBJID0gLUlcclxuICAgKiAgTiAtIG4gPSBOXHJcbiAgICogIE4gLSAwID0gTlxyXG4gICAqICBOIC0gTiA9IE5cclxuICAgKiAgTiAtIEkgPSBOXHJcbiAgICogIEkgLSBuID0gSVxyXG4gICAqICBJIC0gMCA9IElcclxuICAgKiAgSSAtIE4gPSBOXHJcbiAgICogIEkgLSBJID0gTlxyXG4gICAqXHJcbiAgICogUmV0dXJuIGEgbmV3IEJpZ051bWJlciB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgbWludXMgdGhlIHZhbHVlIG9mXHJcbiAgICogQmlnTnVtYmVyKHksIGIpLlxyXG4gICAqL1xyXG4gIFAubWludXMgPSBmdW5jdGlvbiAoeSwgYikge1xyXG4gICAgdmFyIGksIGosIHQsIHhMVHksXHJcbiAgICAgIHggPSB0aGlzLFxyXG4gICAgICBhID0geC5zO1xyXG5cclxuICAgIHkgPSBuZXcgQmlnTnVtYmVyKHksIGIpO1xyXG4gICAgYiA9IHkucztcclxuXHJcbiAgICAvLyBFaXRoZXIgTmFOP1xyXG4gICAgaWYgKCFhIHx8ICFiKSByZXR1cm4gbmV3IEJpZ051bWJlcihOYU4pO1xyXG5cclxuICAgIC8vIFNpZ25zIGRpZmZlcj9cclxuICAgIGlmIChhICE9IGIpIHtcclxuICAgICAgeS5zID0gLWI7XHJcbiAgICAgIHJldHVybiB4LnBsdXMoeSk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHhlID0geC5lIC8gTE9HX0JBU0UsXHJcbiAgICAgIHllID0geS5lIC8gTE9HX0JBU0UsXHJcbiAgICAgIHhjID0geC5jLFxyXG4gICAgICB5YyA9IHkuYztcclxuXHJcbiAgICBpZiAoIXhlIHx8ICF5ZSkge1xyXG5cclxuICAgICAgLy8gRWl0aGVyIEluZmluaXR5P1xyXG4gICAgICBpZiAoIXhjIHx8ICF5YykgcmV0dXJuIHhjID8gKHkucyA9IC1iLCB5KSA6IG5ldyBCaWdOdW1iZXIoeWMgPyB4IDogTmFOKTtcclxuXHJcbiAgICAgIC8vIEVpdGhlciB6ZXJvP1xyXG4gICAgICBpZiAoIXhjWzBdIHx8ICF5Y1swXSkge1xyXG5cclxuICAgICAgICAvLyBSZXR1cm4geSBpZiB5IGlzIG5vbi16ZXJvLCB4IGlmIHggaXMgbm9uLXplcm8sIG9yIHplcm8gaWYgYm90aCBhcmUgemVyby5cclxuICAgICAgICByZXR1cm4geWNbMF0gPyAoeS5zID0gLWIsIHkpIDogbmV3IEJpZ051bWJlcih4Y1swXSA/IHggOlxyXG5cclxuICAgICAgICAgLy8gSUVFRSA3NTQgKDIwMDgpIDYuMzogbiAtIG4gPSAtMCB3aGVuIHJvdW5kaW5nIHRvIC1JbmZpbml0eVxyXG4gICAgICAgICBST1VORElOR19NT0RFID09IDMgPyAtMCA6IDApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgeGUgPSBiaXRGbG9vcih4ZSk7XHJcbiAgICB5ZSA9IGJpdEZsb29yKHllKTtcclxuICAgIHhjID0geGMuc2xpY2UoKTtcclxuXHJcbiAgICAvLyBEZXRlcm1pbmUgd2hpY2ggaXMgdGhlIGJpZ2dlciBudW1iZXIuXHJcbiAgICBpZiAoYSA9IHhlIC0geWUpIHtcclxuXHJcbiAgICAgIGlmICh4TFR5ID0gYSA8IDApIHtcclxuICAgICAgICBhID0gLWE7XHJcbiAgICAgICAgdCA9IHhjO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHllID0geGU7XHJcbiAgICAgICAgdCA9IHljO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0LnJldmVyc2UoKTtcclxuXHJcbiAgICAgIC8vIFByZXBlbmQgemVyb3MgdG8gZXF1YWxpc2UgZXhwb25lbnRzLlxyXG4gICAgICBmb3IgKGIgPSBhOyBiLS07IHQucHVzaCgwKSk7XHJcbiAgICAgIHQucmV2ZXJzZSgpO1xyXG4gICAgfSBlbHNlIHtcclxuXHJcbiAgICAgIC8vIEV4cG9uZW50cyBlcXVhbC4gQ2hlY2sgZGlnaXQgYnkgZGlnaXQuXHJcbiAgICAgIGogPSAoeExUeSA9IChhID0geGMubGVuZ3RoKSA8IChiID0geWMubGVuZ3RoKSkgPyBhIDogYjtcclxuXHJcbiAgICAgIGZvciAoYSA9IGIgPSAwOyBiIDwgajsgYisrKSB7XHJcblxyXG4gICAgICAgIGlmICh4Y1tiXSAhPSB5Y1tiXSkge1xyXG4gICAgICAgICAgeExUeSA9IHhjW2JdIDwgeWNbYl07XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyB4IDwgeT8gUG9pbnQgeGMgdG8gdGhlIGFycmF5IG9mIHRoZSBiaWdnZXIgbnVtYmVyLlxyXG4gICAgaWYgKHhMVHkpIHQgPSB4YywgeGMgPSB5YywgeWMgPSB0LCB5LnMgPSAteS5zO1xyXG5cclxuICAgIGIgPSAoaiA9IHljLmxlbmd0aCkgLSAoaSA9IHhjLmxlbmd0aCk7XHJcblxyXG4gICAgLy8gQXBwZW5kIHplcm9zIHRvIHhjIGlmIHNob3J0ZXIuXHJcbiAgICAvLyBObyBuZWVkIHRvIGFkZCB6ZXJvcyB0byB5YyBpZiBzaG9ydGVyIGFzIHN1YnRyYWN0IG9ubHkgbmVlZHMgdG8gc3RhcnQgYXQgeWMubGVuZ3RoLlxyXG4gICAgaWYgKGIgPiAwKSBmb3IgKDsgYi0tOyB4Y1tpKytdID0gMCk7XHJcbiAgICBiID0gQkFTRSAtIDE7XHJcblxyXG4gICAgLy8gU3VidHJhY3QgeWMgZnJvbSB4Yy5cclxuICAgIGZvciAoOyBqID4gYTspIHtcclxuXHJcbiAgICAgIGlmICh4Y1stLWpdIDwgeWNbal0pIHtcclxuICAgICAgICBmb3IgKGkgPSBqOyBpICYmICF4Y1stLWldOyB4Y1tpXSA9IGIpO1xyXG4gICAgICAgIC0teGNbaV07XHJcbiAgICAgICAgeGNbal0gKz0gQkFTRTtcclxuICAgICAgfVxyXG5cclxuICAgICAgeGNbal0gLT0geWNbal07XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmVtb3ZlIGxlYWRpbmcgemVyb3MgYW5kIGFkanVzdCBleHBvbmVudCBhY2NvcmRpbmdseS5cclxuICAgIGZvciAoOyB4Y1swXSA9PSAwOyB4Yy5zcGxpY2UoMCwgMSksIC0teWUpO1xyXG5cclxuICAgIC8vIFplcm8/XHJcbiAgICBpZiAoIXhjWzBdKSB7XHJcblxyXG4gICAgICAvLyBGb2xsb3dpbmcgSUVFRSA3NTQgKDIwMDgpIDYuMyxcclxuICAgICAgLy8gbiAtIG4gPSArMCAgYnV0ICBuIC0gbiA9IC0wICB3aGVuIHJvdW5kaW5nIHRvd2FyZHMgLUluZmluaXR5LlxyXG4gICAgICB5LnMgPSBST1VORElOR19NT0RFID09IDMgPyAtMSA6IDE7XHJcbiAgICAgIHkuYyA9IFt5LmUgPSAwXTtcclxuICAgICAgcmV0dXJuIHk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gTm8gbmVlZCB0byBjaGVjayBmb3IgSW5maW5pdHkgYXMgK3ggLSAreSAhPSBJbmZpbml0eSAmJiAteCAtIC15ICE9IEluZmluaXR5XHJcbiAgICAvLyBmb3IgZmluaXRlIHggYW5kIHkuXHJcbiAgICByZXR1cm4gbm9ybWFsaXNlKHksIHhjLCB5ZSk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogICBuICUgMCA9ICBOXHJcbiAgICogICBuICUgTiA9ICBOXHJcbiAgICogICBuICUgSSA9ICBuXHJcbiAgICogICAwICUgbiA9ICAwXHJcbiAgICogIC0wICUgbiA9IC0wXHJcbiAgICogICAwICUgMCA9ICBOXHJcbiAgICogICAwICUgTiA9ICBOXHJcbiAgICogICAwICUgSSA9ICAwXHJcbiAgICogICBOICUgbiA9ICBOXHJcbiAgICogICBOICUgMCA9ICBOXHJcbiAgICogICBOICUgTiA9ICBOXHJcbiAgICogICBOICUgSSA9ICBOXHJcbiAgICogICBJICUgbiA9ICBOXHJcbiAgICogICBJICUgMCA9ICBOXHJcbiAgICogICBJICUgTiA9ICBOXHJcbiAgICogICBJICUgSSA9ICBOXHJcbiAgICpcclxuICAgKiBSZXR1cm4gYSBuZXcgQmlnTnVtYmVyIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZ051bWJlciBtb2R1bG8gdGhlIHZhbHVlIG9mXHJcbiAgICogQmlnTnVtYmVyKHksIGIpLiBUaGUgcmVzdWx0IGRlcGVuZHMgb24gdGhlIHZhbHVlIG9mIE1PRFVMT19NT0RFLlxyXG4gICAqL1xyXG4gIFAubW9kdWxvID0gUC5tb2QgPSBmdW5jdGlvbiAoeSwgYikge1xyXG4gICAgdmFyIHEsIHMsXHJcbiAgICAgIHggPSB0aGlzO1xyXG5cclxuICAgIHkgPSBuZXcgQmlnTnVtYmVyKHksIGIpO1xyXG5cclxuICAgIC8vIFJldHVybiBOYU4gaWYgeCBpcyBJbmZpbml0eSBvciBOYU4sIG9yIHkgaXMgTmFOIG9yIHplcm8uXHJcbiAgICBpZiAoIXguYyB8fCAheS5zIHx8IHkuYyAmJiAheS5jWzBdKSB7XHJcbiAgICAgIHJldHVybiBuZXcgQmlnTnVtYmVyKE5hTik7XHJcblxyXG4gICAgLy8gUmV0dXJuIHggaWYgeSBpcyBJbmZpbml0eSBvciB4IGlzIHplcm8uXHJcbiAgICB9IGVsc2UgaWYgKCF5LmMgfHwgeC5jICYmICF4LmNbMF0pIHtcclxuICAgICAgcmV0dXJuIG5ldyBCaWdOdW1iZXIoeCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKE1PRFVMT19NT0RFID09IDkpIHtcclxuXHJcbiAgICAgIC8vIEV1Y2xpZGlhbiBkaXZpc2lvbjogcSA9IHNpZ24oeSkgKiBmbG9vcih4IC8gYWJzKHkpKVxyXG4gICAgICAvLyByID0geCAtIHF5ICAgIHdoZXJlICAwIDw9IHIgPCBhYnMoeSlcclxuICAgICAgcyA9IHkucztcclxuICAgICAgeS5zID0gMTtcclxuICAgICAgcSA9IGRpdih4LCB5LCAwLCAzKTtcclxuICAgICAgeS5zID0gcztcclxuICAgICAgcS5zICo9IHM7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBxID0gZGl2KHgsIHksIDAsIE1PRFVMT19NT0RFKTtcclxuICAgIH1cclxuXHJcbiAgICB5ID0geC5taW51cyhxLnRpbWVzKHkpKTtcclxuXHJcbiAgICAvLyBUbyBtYXRjaCBKYXZhU2NyaXB0ICUsIGVuc3VyZSBzaWduIG9mIHplcm8gaXMgc2lnbiBvZiBkaXZpZGVuZC5cclxuICAgIGlmICgheS5jWzBdICYmIE1PRFVMT19NT0RFID09IDEpIHkucyA9IHgucztcclxuXHJcbiAgICByZXR1cm4geTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiAgbiAqIDAgPSAwXHJcbiAgICogIG4gKiBOID0gTlxyXG4gICAqICBuICogSSA9IElcclxuICAgKiAgMCAqIG4gPSAwXHJcbiAgICogIDAgKiAwID0gMFxyXG4gICAqICAwICogTiA9IE5cclxuICAgKiAgMCAqIEkgPSBOXHJcbiAgICogIE4gKiBuID0gTlxyXG4gICAqICBOICogMCA9IE5cclxuICAgKiAgTiAqIE4gPSBOXHJcbiAgICogIE4gKiBJID0gTlxyXG4gICAqICBJICogbiA9IElcclxuICAgKiAgSSAqIDAgPSBOXHJcbiAgICogIEkgKiBOID0gTlxyXG4gICAqICBJICogSSA9IElcclxuICAgKlxyXG4gICAqIFJldHVybiBhIG5ldyBCaWdOdW1iZXIgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIG11bHRpcGxpZWQgYnkgdGhlIHZhbHVlXHJcbiAgICogb2YgQmlnTnVtYmVyKHksIGIpLlxyXG4gICAqL1xyXG4gIFAubXVsdGlwbGllZEJ5ID0gUC50aW1lcyA9IGZ1bmN0aW9uICh5LCBiKSB7XHJcbiAgICB2YXIgYywgZSwgaSwgaiwgaywgbSwgeGNMLCB4bG8sIHhoaSwgeWNMLCB5bG8sIHloaSwgemMsXHJcbiAgICAgIGJhc2UsIHNxcnRCYXNlLFxyXG4gICAgICB4ID0gdGhpcyxcclxuICAgICAgeGMgPSB4LmMsXHJcbiAgICAgIHljID0gKHkgPSBuZXcgQmlnTnVtYmVyKHksIGIpKS5jO1xyXG5cclxuICAgIC8vIEVpdGhlciBOYU4sIMKxSW5maW5pdHkgb3IgwrEwP1xyXG4gICAgaWYgKCF4YyB8fCAheWMgfHwgIXhjWzBdIHx8ICF5Y1swXSkge1xyXG5cclxuICAgICAgLy8gUmV0dXJuIE5hTiBpZiBlaXRoZXIgaXMgTmFOLCBvciBvbmUgaXMgMCBhbmQgdGhlIG90aGVyIGlzIEluZmluaXR5LlxyXG4gICAgICBpZiAoIXgucyB8fCAheS5zIHx8IHhjICYmICF4Y1swXSAmJiAheWMgfHwgeWMgJiYgIXljWzBdICYmICF4Yykge1xyXG4gICAgICAgIHkuYyA9IHkuZSA9IHkucyA9IG51bGw7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgeS5zICo9IHgucztcclxuXHJcbiAgICAgICAgLy8gUmV0dXJuIMKxSW5maW5pdHkgaWYgZWl0aGVyIGlzIMKxSW5maW5pdHkuXHJcbiAgICAgICAgaWYgKCF4YyB8fCAheWMpIHtcclxuICAgICAgICAgIHkuYyA9IHkuZSA9IG51bGw7XHJcblxyXG4gICAgICAgIC8vIFJldHVybiDCsTAgaWYgZWl0aGVyIGlzIMKxMC5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgeS5jID0gWzBdO1xyXG4gICAgICAgICAgeS5lID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB5O1xyXG4gICAgfVxyXG5cclxuICAgIGUgPSBiaXRGbG9vcih4LmUgLyBMT0dfQkFTRSkgKyBiaXRGbG9vcih5LmUgLyBMT0dfQkFTRSk7XHJcbiAgICB5LnMgKj0geC5zO1xyXG4gICAgeGNMID0geGMubGVuZ3RoO1xyXG4gICAgeWNMID0geWMubGVuZ3RoO1xyXG5cclxuICAgIC8vIEVuc3VyZSB4YyBwb2ludHMgdG8gbG9uZ2VyIGFycmF5IGFuZCB4Y0wgdG8gaXRzIGxlbmd0aC5cclxuICAgIGlmICh4Y0wgPCB5Y0wpIHpjID0geGMsIHhjID0geWMsIHljID0gemMsIGkgPSB4Y0wsIHhjTCA9IHljTCwgeWNMID0gaTtcclxuXHJcbiAgICAvLyBJbml0aWFsaXNlIHRoZSByZXN1bHQgYXJyYXkgd2l0aCB6ZXJvcy5cclxuICAgIGZvciAoaSA9IHhjTCArIHljTCwgemMgPSBbXTsgaS0tOyB6Yy5wdXNoKDApKTtcclxuXHJcbiAgICBiYXNlID0gQkFTRTtcclxuICAgIHNxcnRCYXNlID0gU1FSVF9CQVNFO1xyXG5cclxuICAgIGZvciAoaSA9IHljTDsgLS1pID49IDA7KSB7XHJcbiAgICAgIGMgPSAwO1xyXG4gICAgICB5bG8gPSB5Y1tpXSAlIHNxcnRCYXNlO1xyXG4gICAgICB5aGkgPSB5Y1tpXSAvIHNxcnRCYXNlIHwgMDtcclxuXHJcbiAgICAgIGZvciAoayA9IHhjTCwgaiA9IGkgKyBrOyBqID4gaTspIHtcclxuICAgICAgICB4bG8gPSB4Y1stLWtdICUgc3FydEJhc2U7XHJcbiAgICAgICAgeGhpID0geGNba10gLyBzcXJ0QmFzZSB8IDA7XHJcbiAgICAgICAgbSA9IHloaSAqIHhsbyArIHhoaSAqIHlsbztcclxuICAgICAgICB4bG8gPSB5bG8gKiB4bG8gKyAoKG0gJSBzcXJ0QmFzZSkgKiBzcXJ0QmFzZSkgKyB6Y1tqXSArIGM7XHJcbiAgICAgICAgYyA9ICh4bG8gLyBiYXNlIHwgMCkgKyAobSAvIHNxcnRCYXNlIHwgMCkgKyB5aGkgKiB4aGk7XHJcbiAgICAgICAgemNbai0tXSA9IHhsbyAlIGJhc2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHpjW2pdID0gYztcclxuICAgIH1cclxuXHJcbiAgICBpZiAoYykge1xyXG4gICAgICArK2U7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB6Yy5zcGxpY2UoMCwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG5vcm1hbGlzZSh5LCB6YywgZSk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IEJpZ051bWJlciB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgbmVnYXRlZCxcclxuICAgKiBpLmUuIG11bHRpcGxpZWQgYnkgLTEuXHJcbiAgICovXHJcbiAgUC5uZWdhdGVkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHggPSBuZXcgQmlnTnVtYmVyKHRoaXMpO1xyXG4gICAgeC5zID0gLXgucyB8fCBudWxsO1xyXG4gICAgcmV0dXJuIHg7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogIG4gKyAwID0gblxyXG4gICAqICBuICsgTiA9IE5cclxuICAgKiAgbiArIEkgPSBJXHJcbiAgICogIDAgKyBuID0gblxyXG4gICAqICAwICsgMCA9IDBcclxuICAgKiAgMCArIE4gPSBOXHJcbiAgICogIDAgKyBJID0gSVxyXG4gICAqICBOICsgbiA9IE5cclxuICAgKiAgTiArIDAgPSBOXHJcbiAgICogIE4gKyBOID0gTlxyXG4gICAqICBOICsgSSA9IE5cclxuICAgKiAgSSArIG4gPSBJXHJcbiAgICogIEkgKyAwID0gSVxyXG4gICAqICBJICsgTiA9IE5cclxuICAgKiAgSSArIEkgPSBJXHJcbiAgICpcclxuICAgKiBSZXR1cm4gYSBuZXcgQmlnTnVtYmVyIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZ051bWJlciBwbHVzIHRoZSB2YWx1ZSBvZlxyXG4gICAqIEJpZ051bWJlcih5LCBiKS5cclxuICAgKi9cclxuICBQLnBsdXMgPSBmdW5jdGlvbiAoeSwgYikge1xyXG4gICAgdmFyIHQsXHJcbiAgICAgIHggPSB0aGlzLFxyXG4gICAgICBhID0geC5zO1xyXG5cclxuICAgIHkgPSBuZXcgQmlnTnVtYmVyKHksIGIpO1xyXG4gICAgYiA9IHkucztcclxuXHJcbiAgICAvLyBFaXRoZXIgTmFOP1xyXG4gICAgaWYgKCFhIHx8ICFiKSByZXR1cm4gbmV3IEJpZ051bWJlcihOYU4pO1xyXG5cclxuICAgIC8vIFNpZ25zIGRpZmZlcj9cclxuICAgICBpZiAoYSAhPSBiKSB7XHJcbiAgICAgIHkucyA9IC1iO1xyXG4gICAgICByZXR1cm4geC5taW51cyh5KTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgeGUgPSB4LmUgLyBMT0dfQkFTRSxcclxuICAgICAgeWUgPSB5LmUgLyBMT0dfQkFTRSxcclxuICAgICAgeGMgPSB4LmMsXHJcbiAgICAgIHljID0geS5jO1xyXG5cclxuICAgIGlmICgheGUgfHwgIXllKSB7XHJcblxyXG4gICAgICAvLyBSZXR1cm4gwrFJbmZpbml0eSBpZiBlaXRoZXIgwrFJbmZpbml0eS5cclxuICAgICAgaWYgKCF4YyB8fCAheWMpIHJldHVybiBuZXcgQmlnTnVtYmVyKGEgLyAwKTtcclxuXHJcbiAgICAgIC8vIEVpdGhlciB6ZXJvP1xyXG4gICAgICAvLyBSZXR1cm4geSBpZiB5IGlzIG5vbi16ZXJvLCB4IGlmIHggaXMgbm9uLXplcm8sIG9yIHplcm8gaWYgYm90aCBhcmUgemVyby5cclxuICAgICAgaWYgKCF4Y1swXSB8fCAheWNbMF0pIHJldHVybiB5Y1swXSA/IHkgOiBuZXcgQmlnTnVtYmVyKHhjWzBdID8geCA6IGEgKiAwKTtcclxuICAgIH1cclxuXHJcbiAgICB4ZSA9IGJpdEZsb29yKHhlKTtcclxuICAgIHllID0gYml0Rmxvb3IoeWUpO1xyXG4gICAgeGMgPSB4Yy5zbGljZSgpO1xyXG5cclxuICAgIC8vIFByZXBlbmQgemVyb3MgdG8gZXF1YWxpc2UgZXhwb25lbnRzLiBGYXN0ZXIgdG8gdXNlIHJldmVyc2UgdGhlbiBkbyB1bnNoaWZ0cy5cclxuICAgIGlmIChhID0geGUgLSB5ZSkge1xyXG4gICAgICBpZiAoYSA+IDApIHtcclxuICAgICAgICB5ZSA9IHhlO1xyXG4gICAgICAgIHQgPSB5YztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBhID0gLWE7XHJcbiAgICAgICAgdCA9IHhjO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0LnJldmVyc2UoKTtcclxuICAgICAgZm9yICg7IGEtLTsgdC5wdXNoKDApKTtcclxuICAgICAgdC5yZXZlcnNlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgYSA9IHhjLmxlbmd0aDtcclxuICAgIGIgPSB5Yy5sZW5ndGg7XHJcblxyXG4gICAgLy8gUG9pbnQgeGMgdG8gdGhlIGxvbmdlciBhcnJheSwgYW5kIGIgdG8gdGhlIHNob3J0ZXIgbGVuZ3RoLlxyXG4gICAgaWYgKGEgLSBiIDwgMCkgdCA9IHljLCB5YyA9IHhjLCB4YyA9IHQsIGIgPSBhO1xyXG5cclxuICAgIC8vIE9ubHkgc3RhcnQgYWRkaW5nIGF0IHljLmxlbmd0aCAtIDEgYXMgdGhlIGZ1cnRoZXIgZGlnaXRzIG9mIHhjIGNhbiBiZSBpZ25vcmVkLlxyXG4gICAgZm9yIChhID0gMDsgYjspIHtcclxuICAgICAgYSA9ICh4Y1stLWJdID0geGNbYl0gKyB5Y1tiXSArIGEpIC8gQkFTRSB8IDA7XHJcbiAgICAgIHhjW2JdID0gQkFTRSA9PT0geGNbYl0gPyAwIDogeGNbYl0gJSBCQVNFO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChhKSB7XHJcbiAgICAgIHhjID0gW2FdLmNvbmNhdCh4Yyk7XHJcbiAgICAgICsreWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gTm8gbmVlZCB0byBjaGVjayBmb3IgemVybywgYXMgK3ggKyAreSAhPSAwICYmIC14ICsgLXkgIT0gMFxyXG4gICAgLy8geWUgPSBNQVhfRVhQICsgMSBwb3NzaWJsZVxyXG4gICAgcmV0dXJuIG5vcm1hbGlzZSh5LCB4YywgeWUpO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIElmIHNkIGlzIHVuZGVmaW5lZCBvciBudWxsIG9yIHRydWUgb3IgZmFsc2UsIHJldHVybiB0aGUgbnVtYmVyIG9mIHNpZ25pZmljYW50IGRpZ2l0cyBvZlxyXG4gICAqIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZ051bWJlciwgb3IgbnVsbCBpZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgaXMgwrFJbmZpbml0eSBvciBOYU4uXHJcbiAgICogSWYgc2QgaXMgdHJ1ZSBpbmNsdWRlIGludGVnZXItcGFydCB0cmFpbGluZyB6ZXJvcyBpbiB0aGUgY291bnQuXHJcbiAgICpcclxuICAgKiBPdGhlcndpc2UsIGlmIHNkIGlzIGEgbnVtYmVyLCByZXR1cm4gYSBuZXcgQmlnTnVtYmVyIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzXHJcbiAgICogQmlnTnVtYmVyIHJvdW5kZWQgdG8gYSBtYXhpbXVtIG9mIHNkIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIHJtLCBvclxyXG4gICAqIFJPVU5ESU5HX01PREUgaWYgcm0gaXMgb21pdHRlZC5cclxuICAgKlxyXG4gICAqIHNkIHtudW1iZXJ8Ym9vbGVhbn0gbnVtYmVyOiBzaWduaWZpY2FudCBkaWdpdHM6IGludGVnZXIsIDEgdG8gTUFYIGluY2x1c2l2ZS5cclxuICAgKiAgICAgICAgICAgICAgICAgICAgIGJvb2xlYW46IHdoZXRoZXIgdG8gY291bnQgaW50ZWdlci1wYXJ0IHRyYWlsaW5nIHplcm9zOiB0cnVlIG9yIGZhbHNlLlxyXG4gICAqIFtybV0ge251bWJlcn0gUm91bmRpbmcgbW9kZS4gSW50ZWdlciwgMCB0byA4IGluY2x1c2l2ZS5cclxuICAgKlxyXG4gICAqICdbQmlnTnVtYmVyIEVycm9yXSBBcmd1bWVudCB7bm90IGEgcHJpbWl0aXZlIG51bWJlcnxub3QgYW4gaW50ZWdlcnxvdXQgb2YgcmFuZ2V9OiB7c2R8cm19J1xyXG4gICAqL1xyXG4gIFAucHJlY2lzaW9uID0gUC5zZCA9IGZ1bmN0aW9uIChzZCwgcm0pIHtcclxuICAgIHZhciBjLCBuLCB2LFxyXG4gICAgICB4ID0gdGhpcztcclxuXHJcbiAgICBpZiAoc2QgIT0gbnVsbCAmJiBzZCAhPT0gISFzZCkge1xyXG4gICAgICBpbnRDaGVjayhzZCwgMSwgTUFYKTtcclxuICAgICAgaWYgKHJtID09IG51bGwpIHJtID0gUk9VTkRJTkdfTU9ERTtcclxuICAgICAgZWxzZSBpbnRDaGVjayhybSwgMCwgOCk7XHJcblxyXG4gICAgICByZXR1cm4gcm91bmQobmV3IEJpZ051bWJlcih4KSwgc2QsIHJtKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIShjID0geC5jKSkgcmV0dXJuIG51bGw7XHJcbiAgICB2ID0gYy5sZW5ndGggLSAxO1xyXG4gICAgbiA9IHYgKiBMT0dfQkFTRSArIDE7XHJcblxyXG4gICAgaWYgKHYgPSBjW3ZdKSB7XHJcblxyXG4gICAgICAvLyBTdWJ0cmFjdCB0aGUgbnVtYmVyIG9mIHRyYWlsaW5nIHplcm9zIG9mIHRoZSBsYXN0IGVsZW1lbnQuXHJcbiAgICAgIGZvciAoOyB2ICUgMTAgPT0gMDsgdiAvPSAxMCwgbi0tKTtcclxuXHJcbiAgICAgIC8vIEFkZCB0aGUgbnVtYmVyIG9mIGRpZ2l0cyBvZiB0aGUgZmlyc3QgZWxlbWVudC5cclxuICAgICAgZm9yICh2ID0gY1swXTsgdiA+PSAxMDsgdiAvPSAxMCwgbisrKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc2QgJiYgeC5lICsgMSA+IG4pIG4gPSB4LmUgKyAxO1xyXG5cclxuICAgIHJldHVybiBuO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBCaWdOdW1iZXIgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIHNoaWZ0ZWQgYnkgayBwbGFjZXNcclxuICAgKiAocG93ZXJzIG9mIDEwKS4gU2hpZnQgdG8gdGhlIHJpZ2h0IGlmIG4gPiAwLCBhbmQgdG8gdGhlIGxlZnQgaWYgbiA8IDAuXHJcbiAgICpcclxuICAgKiBrIHtudW1iZXJ9IEludGVnZXIsIC1NQVhfU0FGRV9JTlRFR0VSIHRvIE1BWF9TQUZFX0lOVEVHRVIgaW5jbHVzaXZlLlxyXG4gICAqXHJcbiAgICogJ1tCaWdOdW1iZXIgRXJyb3JdIEFyZ3VtZW50IHtub3QgYSBwcmltaXRpdmUgbnVtYmVyfG5vdCBhbiBpbnRlZ2VyfG91dCBvZiByYW5nZX06IHtrfSdcclxuICAgKi9cclxuICBQLnNoaWZ0ZWRCeSA9IGZ1bmN0aW9uIChrKSB7XHJcbiAgICBpbnRDaGVjayhrLCAtTUFYX1NBRkVfSU5URUdFUiwgTUFYX1NBRkVfSU5URUdFUik7XHJcbiAgICByZXR1cm4gdGhpcy50aW1lcygnMWUnICsgayk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogIHNxcnQoLW4pID0gIE5cclxuICAgKiAgc3FydChOKSA9ICBOXHJcbiAgICogIHNxcnQoLUkpID0gIE5cclxuICAgKiAgc3FydChJKSA9ICBJXHJcbiAgICogIHNxcnQoMCkgPSAgMFxyXG4gICAqICBzcXJ0KC0wKSA9IC0wXHJcbiAgICpcclxuICAgKiBSZXR1cm4gYSBuZXcgQmlnTnVtYmVyIHdob3NlIHZhbHVlIGlzIHRoZSBzcXVhcmUgcm9vdCBvZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIsXHJcbiAgICogcm91bmRlZCBhY2NvcmRpbmcgdG8gREVDSU1BTF9QTEFDRVMgYW5kIFJPVU5ESU5HX01PREUuXHJcbiAgICovXHJcbiAgUC5zcXVhcmVSb290ID0gUC5zcXJ0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIG0sIG4sIHIsIHJlcCwgdCxcclxuICAgICAgeCA9IHRoaXMsXHJcbiAgICAgIGMgPSB4LmMsXHJcbiAgICAgIHMgPSB4LnMsXHJcbiAgICAgIGUgPSB4LmUsXHJcbiAgICAgIGRwID0gREVDSU1BTF9QTEFDRVMgKyA0LFxyXG4gICAgICBoYWxmID0gbmV3IEJpZ051bWJlcignMC41Jyk7XHJcblxyXG4gICAgLy8gTmVnYXRpdmUvTmFOL0luZmluaXR5L3plcm8/XHJcbiAgICBpZiAocyAhPT0gMSB8fCAhYyB8fCAhY1swXSkge1xyXG4gICAgICByZXR1cm4gbmV3IEJpZ051bWJlcighcyB8fCBzIDwgMCAmJiAoIWMgfHwgY1swXSkgPyBOYU4gOiBjID8geCA6IDEgLyAwKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBJbml0aWFsIGVzdGltYXRlLlxyXG4gICAgcyA9IE1hdGguc3FydCgrdmFsdWVPZih4KSk7XHJcblxyXG4gICAgLy8gTWF0aC5zcXJ0IHVuZGVyZmxvdy9vdmVyZmxvdz9cclxuICAgIC8vIFBhc3MgeCB0byBNYXRoLnNxcnQgYXMgaW50ZWdlciwgdGhlbiBhZGp1c3QgdGhlIGV4cG9uZW50IG9mIHRoZSByZXN1bHQuXHJcbiAgICBpZiAocyA9PSAwIHx8IHMgPT0gMSAvIDApIHtcclxuICAgICAgbiA9IGNvZWZmVG9TdHJpbmcoYyk7XHJcbiAgICAgIGlmICgobi5sZW5ndGggKyBlKSAlIDIgPT0gMCkgbiArPSAnMCc7XHJcbiAgICAgIHMgPSBNYXRoLnNxcnQoK24pO1xyXG4gICAgICBlID0gYml0Rmxvb3IoKGUgKyAxKSAvIDIpIC0gKGUgPCAwIHx8IGUgJSAyKTtcclxuXHJcbiAgICAgIGlmIChzID09IDEgLyAwKSB7XHJcbiAgICAgICAgbiA9ICcxZScgKyBlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG4gPSBzLnRvRXhwb25lbnRpYWwoKTtcclxuICAgICAgICBuID0gbi5zbGljZSgwLCBuLmluZGV4T2YoJ2UnKSArIDEpICsgZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgciA9IG5ldyBCaWdOdW1iZXIobik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByID0gbmV3IEJpZ051bWJlcihzICsgJycpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENoZWNrIGZvciB6ZXJvLlxyXG4gICAgLy8gciBjb3VsZCBiZSB6ZXJvIGlmIE1JTl9FWFAgaXMgY2hhbmdlZCBhZnRlciB0aGUgdGhpcyB2YWx1ZSB3YXMgY3JlYXRlZC5cclxuICAgIC8vIFRoaXMgd291bGQgY2F1c2UgYSBkaXZpc2lvbiBieSB6ZXJvICh4L3QpIGFuZCBoZW5jZSBJbmZpbml0eSBiZWxvdywgd2hpY2ggd291bGQgY2F1c2VcclxuICAgIC8vIGNvZWZmVG9TdHJpbmcgdG8gdGhyb3cuXHJcbiAgICBpZiAoci5jWzBdKSB7XHJcbiAgICAgIGUgPSByLmU7XHJcbiAgICAgIHMgPSBlICsgZHA7XHJcbiAgICAgIGlmIChzIDwgMykgcyA9IDA7XHJcblxyXG4gICAgICAvLyBOZXd0b24tUmFwaHNvbiBpdGVyYXRpb24uXHJcbiAgICAgIGZvciAoOyA7KSB7XHJcbiAgICAgICAgdCA9IHI7XHJcbiAgICAgICAgciA9IGhhbGYudGltZXModC5wbHVzKGRpdih4LCB0LCBkcCwgMSkpKTtcclxuXHJcbiAgICAgICAgaWYgKGNvZWZmVG9TdHJpbmcodC5jKS5zbGljZSgwLCBzKSA9PT0gKG4gPSBjb2VmZlRvU3RyaW5nKHIuYykpLnNsaWNlKDAsIHMpKSB7XHJcblxyXG4gICAgICAgICAgLy8gVGhlIGV4cG9uZW50IG9mIHIgbWF5IGhlcmUgYmUgb25lIGxlc3MgdGhhbiB0aGUgZmluYWwgcmVzdWx0IGV4cG9uZW50LFxyXG4gICAgICAgICAgLy8gZS5nIDAuMDAwOTk5OSAoZS00KSAtLT4gMC4wMDEgKGUtMyksIHNvIGFkanVzdCBzIHNvIHRoZSByb3VuZGluZyBkaWdpdHNcclxuICAgICAgICAgIC8vIGFyZSBpbmRleGVkIGNvcnJlY3RseS5cclxuICAgICAgICAgIGlmIChyLmUgPCBlKSAtLXM7XHJcbiAgICAgICAgICBuID0gbi5zbGljZShzIC0gMywgcyArIDEpO1xyXG5cclxuICAgICAgICAgIC8vIFRoZSA0dGggcm91bmRpbmcgZGlnaXQgbWF5IGJlIGluIGVycm9yIGJ5IC0xIHNvIGlmIHRoZSA0IHJvdW5kaW5nIGRpZ2l0c1xyXG4gICAgICAgICAgLy8gYXJlIDk5OTkgb3IgNDk5OSAoaS5lLiBhcHByb2FjaGluZyBhIHJvdW5kaW5nIGJvdW5kYXJ5KSBjb250aW51ZSB0aGVcclxuICAgICAgICAgIC8vIGl0ZXJhdGlvbi5cclxuICAgICAgICAgIGlmIChuID09ICc5OTk5JyB8fCAhcmVwICYmIG4gPT0gJzQ5OTknKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBPbiB0aGUgZmlyc3QgaXRlcmF0aW9uIG9ubHksIGNoZWNrIHRvIHNlZSBpZiByb3VuZGluZyB1cCBnaXZlcyB0aGVcclxuICAgICAgICAgICAgLy8gZXhhY3QgcmVzdWx0IGFzIHRoZSBuaW5lcyBtYXkgaW5maW5pdGVseSByZXBlYXQuXHJcbiAgICAgICAgICAgIGlmICghcmVwKSB7XHJcbiAgICAgICAgICAgICAgcm91bmQodCwgdC5lICsgREVDSU1BTF9QTEFDRVMgKyAyLCAwKTtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKHQudGltZXModCkuZXEoeCkpIHtcclxuICAgICAgICAgICAgICAgIHIgPSB0O1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBkcCArPSA0O1xyXG4gICAgICAgICAgICBzICs9IDQ7XHJcbiAgICAgICAgICAgIHJlcCA9IDE7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgLy8gSWYgcm91bmRpbmcgZGlnaXRzIGFyZSBudWxsLCAwezAsNH0gb3IgNTB7MCwzfSwgY2hlY2sgZm9yIGV4YWN0XHJcbiAgICAgICAgICAgIC8vIHJlc3VsdC4gSWYgbm90LCB0aGVuIHRoZXJlIGFyZSBmdXJ0aGVyIGRpZ2l0cyBhbmQgbSB3aWxsIGJlIHRydXRoeS5cclxuICAgICAgICAgICAgaWYgKCErbiB8fCAhK24uc2xpY2UoMSkgJiYgbi5jaGFyQXQoMCkgPT0gJzUnKSB7XHJcblxyXG4gICAgICAgICAgICAgIC8vIFRydW5jYXRlIHRvIHRoZSBmaXJzdCByb3VuZGluZyBkaWdpdC5cclxuICAgICAgICAgICAgICByb3VuZChyLCByLmUgKyBERUNJTUFMX1BMQUNFUyArIDIsIDEpO1xyXG4gICAgICAgICAgICAgIG0gPSAhci50aW1lcyhyKS5lcSh4KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJvdW5kKHIsIHIuZSArIERFQ0lNQUxfUExBQ0VTICsgMSwgUk9VTkRJTkdfTU9ERSwgbSk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgaW4gZXhwb25lbnRpYWwgbm90YXRpb24gYW5kXHJcbiAgICogcm91bmRlZCB1c2luZyBST1VORElOR19NT0RFIHRvIGRwIGZpeGVkIGRlY2ltYWwgcGxhY2VzLlxyXG4gICAqXHJcbiAgICogW2RwXSB7bnVtYmVyfSBEZWNpbWFsIHBsYWNlcy4gSW50ZWdlciwgMCB0byBNQVggaW5jbHVzaXZlLlxyXG4gICAqIFtybV0ge251bWJlcn0gUm91bmRpbmcgbW9kZS4gSW50ZWdlciwgMCB0byA4IGluY2x1c2l2ZS5cclxuICAgKlxyXG4gICAqICdbQmlnTnVtYmVyIEVycm9yXSBBcmd1bWVudCB7bm90IGEgcHJpbWl0aXZlIG51bWJlcnxub3QgYW4gaW50ZWdlcnxvdXQgb2YgcmFuZ2V9OiB7ZHB8cm19J1xyXG4gICAqL1xyXG4gIFAudG9FeHBvbmVudGlhbCA9IGZ1bmN0aW9uIChkcCwgcm0pIHtcclxuICAgIGlmIChkcCAhPSBudWxsKSB7XHJcbiAgICAgIGludENoZWNrKGRwLCAwLCBNQVgpO1xyXG4gICAgICBkcCsrO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZvcm1hdCh0aGlzLCBkcCwgcm0sIDEpO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIGluIGZpeGVkLXBvaW50IG5vdGF0aW9uIHJvdW5kaW5nXHJcbiAgICogdG8gZHAgZml4ZWQgZGVjaW1hbCBwbGFjZXMgdXNpbmcgcm91bmRpbmcgbW9kZSBybSwgb3IgUk9VTkRJTkdfTU9ERSBpZiBybSBpcyBvbWl0dGVkLlxyXG4gICAqXHJcbiAgICogTm90ZTogYXMgd2l0aCBKYXZhU2NyaXB0J3MgbnVtYmVyIHR5cGUsICgtMCkudG9GaXhlZCgwKSBpcyAnMCcsXHJcbiAgICogYnV0IGUuZy4gKC0wLjAwMDAxKS50b0ZpeGVkKDApIGlzICctMCcuXHJcbiAgICpcclxuICAgKiBbZHBdIHtudW1iZXJ9IERlY2ltYWwgcGxhY2VzLiBJbnRlZ2VyLCAwIHRvIE1BWCBpbmNsdXNpdmUuXHJcbiAgICogW3JtXSB7bnVtYmVyfSBSb3VuZGluZyBtb2RlLiBJbnRlZ2VyLCAwIHRvIDggaW5jbHVzaXZlLlxyXG4gICAqXHJcbiAgICogJ1tCaWdOdW1iZXIgRXJyb3JdIEFyZ3VtZW50IHtub3QgYSBwcmltaXRpdmUgbnVtYmVyfG5vdCBhbiBpbnRlZ2VyfG91dCBvZiByYW5nZX06IHtkcHxybX0nXHJcbiAgICovXHJcbiAgUC50b0ZpeGVkID0gZnVuY3Rpb24gKGRwLCBybSkge1xyXG4gICAgaWYgKGRwICE9IG51bGwpIHtcclxuICAgICAgaW50Q2hlY2soZHAsIDAsIE1BWCk7XHJcbiAgICAgIGRwID0gZHAgKyB0aGlzLmUgKyAxO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZvcm1hdCh0aGlzLCBkcCwgcm0pO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIGluIGZpeGVkLXBvaW50IG5vdGF0aW9uIHJvdW5kZWRcclxuICAgKiB1c2luZyBybSBvciBST1VORElOR19NT0RFIHRvIGRwIGRlY2ltYWwgcGxhY2VzLCBhbmQgZm9ybWF0dGVkIGFjY29yZGluZyB0byB0aGUgcHJvcGVydGllc1xyXG4gICAqIG9mIHRoZSBmb3JtYXQgb3IgRk9STUFUIG9iamVjdCAoc2VlIEJpZ051bWJlci5zZXQpLlxyXG4gICAqXHJcbiAgICogVGhlIGZvcm1hdHRpbmcgb2JqZWN0IG1heSBjb250YWluIHNvbWUgb3IgYWxsIG9mIHRoZSBwcm9wZXJ0aWVzIHNob3duIGJlbG93LlxyXG4gICAqXHJcbiAgICogRk9STUFUID0ge1xyXG4gICAqICAgcHJlZml4OiAnJyxcclxuICAgKiAgIGdyb3VwU2l6ZTogMyxcclxuICAgKiAgIHNlY29uZGFyeUdyb3VwU2l6ZTogMCxcclxuICAgKiAgIGdyb3VwU2VwYXJhdG9yOiAnLCcsXHJcbiAgICogICBkZWNpbWFsU2VwYXJhdG9yOiAnLicsXHJcbiAgICogICBmcmFjdGlvbkdyb3VwU2l6ZTogMCxcclxuICAgKiAgIGZyYWN0aW9uR3JvdXBTZXBhcmF0b3I6ICdcXHhBMCcsICAgICAgLy8gbm9uLWJyZWFraW5nIHNwYWNlXHJcbiAgICogICBzdWZmaXg6ICcnXHJcbiAgICogfTtcclxuICAgKlxyXG4gICAqIFtkcF0ge251bWJlcn0gRGVjaW1hbCBwbGFjZXMuIEludGVnZXIsIDAgdG8gTUFYIGluY2x1c2l2ZS5cclxuICAgKiBbcm1dIHtudW1iZXJ9IFJvdW5kaW5nIG1vZGUuIEludGVnZXIsIDAgdG8gOCBpbmNsdXNpdmUuXHJcbiAgICogW2Zvcm1hdF0ge29iamVjdH0gRm9ybWF0dGluZyBvcHRpb25zLiBTZWUgRk9STUFUIHBiamVjdCBhYm92ZS5cclxuICAgKlxyXG4gICAqICdbQmlnTnVtYmVyIEVycm9yXSBBcmd1bWVudCB7bm90IGEgcHJpbWl0aXZlIG51bWJlcnxub3QgYW4gaW50ZWdlcnxvdXQgb2YgcmFuZ2V9OiB7ZHB8cm19J1xyXG4gICAqICdbQmlnTnVtYmVyIEVycm9yXSBBcmd1bWVudCBub3QgYW4gb2JqZWN0OiB7Zm9ybWF0fSdcclxuICAgKi9cclxuICBQLnRvRm9ybWF0ID0gZnVuY3Rpb24gKGRwLCBybSwgZm9ybWF0KSB7XHJcbiAgICB2YXIgc3RyLFxyXG4gICAgICB4ID0gdGhpcztcclxuXHJcbiAgICBpZiAoZm9ybWF0ID09IG51bGwpIHtcclxuICAgICAgaWYgKGRwICE9IG51bGwgJiYgcm0gJiYgdHlwZW9mIHJtID09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgZm9ybWF0ID0gcm07XHJcbiAgICAgICAgcm0gPSBudWxsO1xyXG4gICAgICB9IGVsc2UgaWYgKGRwICYmIHR5cGVvZiBkcCA9PSAnb2JqZWN0Jykge1xyXG4gICAgICAgIGZvcm1hdCA9IGRwO1xyXG4gICAgICAgIGRwID0gcm0gPSBudWxsO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGZvcm1hdCA9IEZPUk1BVDtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZm9ybWF0ICE9ICdvYmplY3QnKSB7XHJcbiAgICAgIHRocm93IEVycm9yXHJcbiAgICAgICAgKGJpZ251bWJlckVycm9yICsgJ0FyZ3VtZW50IG5vdCBhbiBvYmplY3Q6ICcgKyBmb3JtYXQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0ciA9IHgudG9GaXhlZChkcCwgcm0pO1xyXG5cclxuICAgIGlmICh4LmMpIHtcclxuICAgICAgdmFyIGksXHJcbiAgICAgICAgYXJyID0gc3RyLnNwbGl0KCcuJyksXHJcbiAgICAgICAgZzEgPSArZm9ybWF0Lmdyb3VwU2l6ZSxcclxuICAgICAgICBnMiA9ICtmb3JtYXQuc2Vjb25kYXJ5R3JvdXBTaXplLFxyXG4gICAgICAgIGdyb3VwU2VwYXJhdG9yID0gZm9ybWF0Lmdyb3VwU2VwYXJhdG9yIHx8ICcnLFxyXG4gICAgICAgIGludFBhcnQgPSBhcnJbMF0sXHJcbiAgICAgICAgZnJhY3Rpb25QYXJ0ID0gYXJyWzFdLFxyXG4gICAgICAgIGlzTmVnID0geC5zIDwgMCxcclxuICAgICAgICBpbnREaWdpdHMgPSBpc05lZyA/IGludFBhcnQuc2xpY2UoMSkgOiBpbnRQYXJ0LFxyXG4gICAgICAgIGxlbiA9IGludERpZ2l0cy5sZW5ndGg7XHJcblxyXG4gICAgICBpZiAoZzIpIGkgPSBnMSwgZzEgPSBnMiwgZzIgPSBpLCBsZW4gLT0gaTtcclxuXHJcbiAgICAgIGlmIChnMSA+IDAgJiYgbGVuID4gMCkge1xyXG4gICAgICAgIGkgPSBsZW4gJSBnMSB8fCBnMTtcclxuICAgICAgICBpbnRQYXJ0ID0gaW50RGlnaXRzLnN1YnN0cigwLCBpKTtcclxuICAgICAgICBmb3IgKDsgaSA8IGxlbjsgaSArPSBnMSkgaW50UGFydCArPSBncm91cFNlcGFyYXRvciArIGludERpZ2l0cy5zdWJzdHIoaSwgZzEpO1xyXG4gICAgICAgIGlmIChnMiA+IDApIGludFBhcnQgKz0gZ3JvdXBTZXBhcmF0b3IgKyBpbnREaWdpdHMuc2xpY2UoaSk7XHJcbiAgICAgICAgaWYgKGlzTmVnKSBpbnRQYXJ0ID0gJy0nICsgaW50UGFydDtcclxuICAgICAgfVxyXG5cclxuICAgICAgc3RyID0gZnJhY3Rpb25QYXJ0XHJcbiAgICAgICA/IGludFBhcnQgKyAoZm9ybWF0LmRlY2ltYWxTZXBhcmF0b3IgfHwgJycpICsgKChnMiA9ICtmb3JtYXQuZnJhY3Rpb25Hcm91cFNpemUpXHJcbiAgICAgICAgPyBmcmFjdGlvblBhcnQucmVwbGFjZShuZXcgUmVnRXhwKCdcXFxcZHsnICsgZzIgKyAnfVxcXFxCJywgJ2cnKSxcclxuICAgICAgICAgJyQmJyArIChmb3JtYXQuZnJhY3Rpb25Hcm91cFNlcGFyYXRvciB8fCAnJykpXHJcbiAgICAgICAgOiBmcmFjdGlvblBhcnQpXHJcbiAgICAgICA6IGludFBhcnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIChmb3JtYXQucHJlZml4IHx8ICcnKSArIHN0ciArIChmb3JtYXQuc3VmZml4IHx8ICcnKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYW4gYXJyYXkgb2YgdHdvIEJpZ051bWJlcnMgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZ051bWJlciBhcyBhIHNpbXBsZVxyXG4gICAqIGZyYWN0aW9uIHdpdGggYW4gaW50ZWdlciBudW1lcmF0b3IgYW5kIGFuIGludGVnZXIgZGVub21pbmF0b3IuXHJcbiAgICogVGhlIGRlbm9taW5hdG9yIHdpbGwgYmUgYSBwb3NpdGl2ZSBub24temVybyB2YWx1ZSBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gdGhlIHNwZWNpZmllZFxyXG4gICAqIG1heGltdW0gZGVub21pbmF0b3IuIElmIGEgbWF4aW11bSBkZW5vbWluYXRvciBpcyBub3Qgc3BlY2lmaWVkLCB0aGUgZGVub21pbmF0b3Igd2lsbCBiZVxyXG4gICAqIHRoZSBsb3dlc3QgdmFsdWUgbmVjZXNzYXJ5IHRvIHJlcHJlc2VudCB0aGUgbnVtYmVyIGV4YWN0bHkuXHJcbiAgICpcclxuICAgKiBbbWRdIHtudW1iZXJ8c3RyaW5nfEJpZ051bWJlcn0gSW50ZWdlciA+PSAxLCBvciBJbmZpbml0eS4gVGhlIG1heGltdW0gZGVub21pbmF0b3IuXHJcbiAgICpcclxuICAgKiAnW0JpZ051bWJlciBFcnJvcl0gQXJndW1lbnQge25vdCBhbiBpbnRlZ2VyfG91dCBvZiByYW5nZX0gOiB7bWR9J1xyXG4gICAqL1xyXG4gIFAudG9GcmFjdGlvbiA9IGZ1bmN0aW9uIChtZCkge1xyXG4gICAgdmFyIGQsIGQwLCBkMSwgZDIsIGUsIGV4cCwgbiwgbjAsIG4xLCBxLCByLCBzLFxyXG4gICAgICB4ID0gdGhpcyxcclxuICAgICAgeGMgPSB4LmM7XHJcblxyXG4gICAgaWYgKG1kICE9IG51bGwpIHtcclxuICAgICAgbiA9IG5ldyBCaWdOdW1iZXIobWQpO1xyXG5cclxuICAgICAgLy8gVGhyb3cgaWYgbWQgaXMgbGVzcyB0aGFuIG9uZSBvciBpcyBub3QgYW4gaW50ZWdlciwgdW5sZXNzIGl0IGlzIEluZmluaXR5LlxyXG4gICAgICBpZiAoIW4uaXNJbnRlZ2VyKCkgJiYgKG4uYyB8fCBuLnMgIT09IDEpIHx8IG4ubHQoT05FKSkge1xyXG4gICAgICAgIHRocm93IEVycm9yXHJcbiAgICAgICAgICAoYmlnbnVtYmVyRXJyb3IgKyAnQXJndW1lbnQgJyArXHJcbiAgICAgICAgICAgIChuLmlzSW50ZWdlcigpID8gJ291dCBvZiByYW5nZTogJyA6ICdub3QgYW4gaW50ZWdlcjogJykgKyB2YWx1ZU9mKG4pKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICgheGMpIHJldHVybiBuZXcgQmlnTnVtYmVyKHgpO1xyXG5cclxuICAgIGQgPSBuZXcgQmlnTnVtYmVyKE9ORSk7XHJcbiAgICBuMSA9IGQwID0gbmV3IEJpZ051bWJlcihPTkUpO1xyXG4gICAgZDEgPSBuMCA9IG5ldyBCaWdOdW1iZXIoT05FKTtcclxuICAgIHMgPSBjb2VmZlRvU3RyaW5nKHhjKTtcclxuXHJcbiAgICAvLyBEZXRlcm1pbmUgaW5pdGlhbCBkZW5vbWluYXRvci5cclxuICAgIC8vIGQgaXMgYSBwb3dlciBvZiAxMCBhbmQgdGhlIG1pbmltdW0gbWF4IGRlbm9taW5hdG9yIHRoYXQgc3BlY2lmaWVzIHRoZSB2YWx1ZSBleGFjdGx5LlxyXG4gICAgZSA9IGQuZSA9IHMubGVuZ3RoIC0geC5lIC0gMTtcclxuICAgIGQuY1swXSA9IFBPV1NfVEVOWyhleHAgPSBlICUgTE9HX0JBU0UpIDwgMCA/IExPR19CQVNFICsgZXhwIDogZXhwXTtcclxuICAgIG1kID0gIW1kIHx8IG4uY29tcGFyZWRUbyhkKSA+IDAgPyAoZSA+IDAgPyBkIDogbjEpIDogbjtcclxuXHJcbiAgICBleHAgPSBNQVhfRVhQO1xyXG4gICAgTUFYX0VYUCA9IDEgLyAwO1xyXG4gICAgbiA9IG5ldyBCaWdOdW1iZXIocyk7XHJcblxyXG4gICAgLy8gbjAgPSBkMSA9IDBcclxuICAgIG4wLmNbMF0gPSAwO1xyXG5cclxuICAgIGZvciAoOyA7KSAge1xyXG4gICAgICBxID0gZGl2KG4sIGQsIDAsIDEpO1xyXG4gICAgICBkMiA9IGQwLnBsdXMocS50aW1lcyhkMSkpO1xyXG4gICAgICBpZiAoZDIuY29tcGFyZWRUbyhtZCkgPT0gMSkgYnJlYWs7XHJcbiAgICAgIGQwID0gZDE7XHJcbiAgICAgIGQxID0gZDI7XHJcbiAgICAgIG4xID0gbjAucGx1cyhxLnRpbWVzKGQyID0gbjEpKTtcclxuICAgICAgbjAgPSBkMjtcclxuICAgICAgZCA9IG4ubWludXMocS50aW1lcyhkMiA9IGQpKTtcclxuICAgICAgbiA9IGQyO1xyXG4gICAgfVxyXG5cclxuICAgIGQyID0gZGl2KG1kLm1pbnVzKGQwKSwgZDEsIDAsIDEpO1xyXG4gICAgbjAgPSBuMC5wbHVzKGQyLnRpbWVzKG4xKSk7XHJcbiAgICBkMCA9IGQwLnBsdXMoZDIudGltZXMoZDEpKTtcclxuICAgIG4wLnMgPSBuMS5zID0geC5zO1xyXG4gICAgZSA9IGUgKiAyO1xyXG5cclxuICAgIC8vIERldGVybWluZSB3aGljaCBmcmFjdGlvbiBpcyBjbG9zZXIgdG8geCwgbjAvZDAgb3IgbjEvZDFcclxuICAgIHIgPSBkaXYobjEsIGQxLCBlLCBST1VORElOR19NT0RFKS5taW51cyh4KS5hYnMoKS5jb21wYXJlZFRvKFxyXG4gICAgICAgIGRpdihuMCwgZDAsIGUsIFJPVU5ESU5HX01PREUpLm1pbnVzKHgpLmFicygpKSA8IDEgPyBbbjEsIGQxXSA6IFtuMCwgZDBdO1xyXG5cclxuICAgIE1BWF9FWFAgPSBleHA7XHJcblxyXG4gICAgcmV0dXJuIHI7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZ051bWJlciBjb252ZXJ0ZWQgdG8gYSBudW1iZXIgcHJpbWl0aXZlLlxyXG4gICAqL1xyXG4gIFAudG9OdW1iZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gK3ZhbHVlT2YodGhpcyk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgcm91bmRlZCB0byBzZCBzaWduaWZpY2FudCBkaWdpdHNcclxuICAgKiB1c2luZyByb3VuZGluZyBtb2RlIHJtIG9yIFJPVU5ESU5HX01PREUuIElmIHNkIGlzIGxlc3MgdGhhbiB0aGUgbnVtYmVyIG9mIGRpZ2l0c1xyXG4gICAqIG5lY2Vzc2FyeSB0byByZXByZXNlbnQgdGhlIGludGVnZXIgcGFydCBvZiB0aGUgdmFsdWUgaW4gZml4ZWQtcG9pbnQgbm90YXRpb24sIHRoZW4gdXNlXHJcbiAgICogZXhwb25lbnRpYWwgbm90YXRpb24uXHJcbiAgICpcclxuICAgKiBbc2RdIHtudW1iZXJ9IFNpZ25pZmljYW50IGRpZ2l0cy4gSW50ZWdlciwgMSB0byBNQVggaW5jbHVzaXZlLlxyXG4gICAqIFtybV0ge251bWJlcn0gUm91bmRpbmcgbW9kZS4gSW50ZWdlciwgMCB0byA4IGluY2x1c2l2ZS5cclxuICAgKlxyXG4gICAqICdbQmlnTnVtYmVyIEVycm9yXSBBcmd1bWVudCB7bm90IGEgcHJpbWl0aXZlIG51bWJlcnxub3QgYW4gaW50ZWdlcnxvdXQgb2YgcmFuZ2V9OiB7c2R8cm19J1xyXG4gICAqL1xyXG4gIFAudG9QcmVjaXNpb24gPSBmdW5jdGlvbiAoc2QsIHJtKSB7XHJcbiAgICBpZiAoc2QgIT0gbnVsbCkgaW50Q2hlY2soc2QsIDEsIE1BWCk7XHJcbiAgICByZXR1cm4gZm9ybWF0KHRoaXMsIHNkLCBybSwgMik7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgaW4gYmFzZSBiLCBvciBiYXNlIDEwIGlmIGIgaXNcclxuICAgKiBvbWl0dGVkLiBJZiBhIGJhc2UgaXMgc3BlY2lmaWVkLCBpbmNsdWRpbmcgYmFzZSAxMCwgcm91bmQgYWNjb3JkaW5nIHRvIERFQ0lNQUxfUExBQ0VTIGFuZFxyXG4gICAqIFJPVU5ESU5HX01PREUuIElmIGEgYmFzZSBpcyBub3Qgc3BlY2lmaWVkLCBhbmQgdGhpcyBCaWdOdW1iZXIgaGFzIGEgcG9zaXRpdmUgZXhwb25lbnRcclxuICAgKiB0aGF0IGlzIGVxdWFsIHRvIG9yIGdyZWF0ZXIgdGhhbiBUT19FWFBfUE9TLCBvciBhIG5lZ2F0aXZlIGV4cG9uZW50IGVxdWFsIHRvIG9yIGxlc3MgdGhhblxyXG4gICAqIFRPX0VYUF9ORUcsIHJldHVybiBleHBvbmVudGlhbCBub3RhdGlvbi5cclxuICAgKlxyXG4gICAqIFtiXSB7bnVtYmVyfSBJbnRlZ2VyLCAyIHRvIEFMUEhBQkVULmxlbmd0aCBpbmNsdXNpdmUuXHJcbiAgICpcclxuICAgKiAnW0JpZ051bWJlciBFcnJvcl0gQmFzZSB7bm90IGEgcHJpbWl0aXZlIG51bWJlcnxub3QgYW4gaW50ZWdlcnxvdXQgb2YgcmFuZ2V9OiB7Yn0nXHJcbiAgICovXHJcbiAgUC50b1N0cmluZyA9IGZ1bmN0aW9uIChiKSB7XHJcbiAgICB2YXIgc3RyLFxyXG4gICAgICBuID0gdGhpcyxcclxuICAgICAgcyA9IG4ucyxcclxuICAgICAgZSA9IG4uZTtcclxuXHJcbiAgICAvLyBJbmZpbml0eSBvciBOYU4/XHJcbiAgICBpZiAoZSA9PT0gbnVsbCkge1xyXG4gICAgICBpZiAocykge1xyXG4gICAgICAgIHN0ciA9ICdJbmZpbml0eSc7XHJcbiAgICAgICAgaWYgKHMgPCAwKSBzdHIgPSAnLScgKyBzdHI7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc3RyID0gJ05hTic7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHN0ciA9IGNvZWZmVG9TdHJpbmcobi5jKTtcclxuXHJcbiAgICAgIGlmIChiID09IG51bGwpIHtcclxuICAgICAgICBzdHIgPSBlIDw9IFRPX0VYUF9ORUcgfHwgZSA+PSBUT19FWFBfUE9TXHJcbiAgICAgICAgID8gdG9FeHBvbmVudGlhbChzdHIsIGUpXHJcbiAgICAgICAgIDogdG9GaXhlZFBvaW50KHN0ciwgZSwgJzAnKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpbnRDaGVjayhiLCAyLCBBTFBIQUJFVC5sZW5ndGgsICdCYXNlJyk7XHJcbiAgICAgICAgc3RyID0gY29udmVydEJhc2UodG9GaXhlZFBvaW50KHN0ciwgZSwgJzAnKSwgMTAsIGIsIHMsIHRydWUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocyA8IDAgJiYgbi5jWzBdKSBzdHIgPSAnLScgKyBzdHI7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHN0cjtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYXMgdG9TdHJpbmcsIGJ1dCBkbyBub3QgYWNjZXB0IGEgYmFzZSBhcmd1bWVudCwgYW5kIGluY2x1ZGUgdGhlIG1pbnVzIHNpZ24gZm9yXHJcbiAgICogbmVnYXRpdmUgemVyby5cclxuICAgKi9cclxuICBQLnZhbHVlT2YgPSBQLnRvSlNPTiA9IFBbU3ltYm9sLmZvcignbm9kZWpzLnV0aWwuaW5zcGVjdC5jdXN0b20nKV0gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gdmFsdWVPZih0aGlzKTtcclxuICB9O1xyXG5cclxuICBQW1N5bWJvbC50b1N0cmluZ1RhZ10gPSAnQmlnTnVtYmVyJztcclxuXHJcbiAgaWYgKGNvbmZpZ09iamVjdCAhPSBudWxsKSBCaWdOdW1iZXIuc2V0KGNvbmZpZ09iamVjdCk7XHJcblxyXG4gIHJldHVybiBCaWdOdW1iZXI7XHJcbn1cclxuXHJcblxyXG4vLyBQUklWQVRFIEhFTFBFUiBGVU5DVElPTlNcclxuXHJcblxyXG5mdW5jdGlvbiBiaXRGbG9vcihuKSB7XHJcbiAgdmFyIGkgPSBuIHwgMDtcclxuICByZXR1cm4gbiA+IDAgfHwgbiA9PT0gaSA/IGkgOiBpIC0gMTtcclxufVxyXG5cclxuXHJcbi8vIFJldHVybiBhIGNvZWZmaWNpZW50IGFycmF5IGFzIGEgc3RyaW5nIG9mIGJhc2UgMTAgZGlnaXRzLlxyXG5mdW5jdGlvbiBjb2VmZlRvU3RyaW5nKGEpIHtcclxuICB2YXIgcywgeixcclxuICAgIGkgPSAxLFxyXG4gICAgaiA9IGEubGVuZ3RoLFxyXG4gICAgciA9IGFbMF0gKyAnJztcclxuXHJcbiAgZm9yICg7IGkgPCBqOykge1xyXG4gICAgcyA9IGFbaSsrXSArICcnO1xyXG4gICAgeiA9IExPR19CQVNFIC0gcy5sZW5ndGg7XHJcbiAgICBmb3IgKDsgei0tOyBzID0gJzAnICsgcyk7XHJcbiAgICByICs9IHM7XHJcbiAgfVxyXG5cclxuICAvLyBEZXRlcm1pbmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgZm9yIChqID0gci5sZW5ndGg7IHIuY2hhckNvZGVBdCgtLWopID09PSA0ODspO1xyXG5cclxuICByZXR1cm4gci5zbGljZSgwLCBqICsgMSB8fCAxKTtcclxufVxyXG5cclxuXHJcbi8vIENvbXBhcmUgdGhlIHZhbHVlIG9mIEJpZ051bWJlcnMgeCBhbmQgeS5cclxuZnVuY3Rpb24gY29tcGFyZSh4LCB5KSB7XHJcbiAgdmFyIGEsIGIsXHJcbiAgICB4YyA9IHguYyxcclxuICAgIHljID0geS5jLFxyXG4gICAgaSA9IHgucyxcclxuICAgIGogPSB5LnMsXHJcbiAgICBrID0geC5lLFxyXG4gICAgbCA9IHkuZTtcclxuXHJcbiAgLy8gRWl0aGVyIE5hTj9cclxuICBpZiAoIWkgfHwgIWopIHJldHVybiBudWxsO1xyXG5cclxuICBhID0geGMgJiYgIXhjWzBdO1xyXG4gIGIgPSB5YyAmJiAheWNbMF07XHJcblxyXG4gIC8vIEVpdGhlciB6ZXJvP1xyXG4gIGlmIChhIHx8IGIpIHJldHVybiBhID8gYiA/IDAgOiAtaiA6IGk7XHJcblxyXG4gIC8vIFNpZ25zIGRpZmZlcj9cclxuICBpZiAoaSAhPSBqKSByZXR1cm4gaTtcclxuXHJcbiAgYSA9IGkgPCAwO1xyXG4gIGIgPSBrID09IGw7XHJcblxyXG4gIC8vIEVpdGhlciBJbmZpbml0eT9cclxuICBpZiAoIXhjIHx8ICF5YykgcmV0dXJuIGIgPyAwIDogIXhjIF4gYSA/IDEgOiAtMTtcclxuXHJcbiAgLy8gQ29tcGFyZSBleHBvbmVudHMuXHJcbiAgaWYgKCFiKSByZXR1cm4gayA+IGwgXiBhID8gMSA6IC0xO1xyXG5cclxuICBqID0gKGsgPSB4Yy5sZW5ndGgpIDwgKGwgPSB5Yy5sZW5ndGgpID8gayA6IGw7XHJcblxyXG4gIC8vIENvbXBhcmUgZGlnaXQgYnkgZGlnaXQuXHJcbiAgZm9yIChpID0gMDsgaSA8IGo7IGkrKykgaWYgKHhjW2ldICE9IHljW2ldKSByZXR1cm4geGNbaV0gPiB5Y1tpXSBeIGEgPyAxIDogLTE7XHJcblxyXG4gIC8vIENvbXBhcmUgbGVuZ3Rocy5cclxuICByZXR1cm4gayA9PSBsID8gMCA6IGsgPiBsIF4gYSA/IDEgOiAtMTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIENoZWNrIHRoYXQgbiBpcyBhIHByaW1pdGl2ZSBudW1iZXIsIGFuIGludGVnZXIsIGFuZCBpbiByYW5nZSwgb3RoZXJ3aXNlIHRocm93LlxyXG4gKi9cclxuZnVuY3Rpb24gaW50Q2hlY2sobiwgbWluLCBtYXgsIG5hbWUpIHtcclxuICBpZiAobiA8IG1pbiB8fCBuID4gbWF4IHx8IG4gIT09IChuIDwgMCA/IG1hdGhjZWlsKG4pIDogbWF0aGZsb29yKG4pKSkge1xyXG4gICAgdGhyb3cgRXJyb3JcclxuICAgICAoYmlnbnVtYmVyRXJyb3IgKyAobmFtZSB8fCAnQXJndW1lbnQnKSArICh0eXBlb2YgbiA9PSAnbnVtYmVyJ1xyXG4gICAgICAgPyBuIDwgbWluIHx8IG4gPiBtYXggPyAnIG91dCBvZiByYW5nZTogJyA6ICcgbm90IGFuIGludGVnZXI6ICdcclxuICAgICAgIDogJyBub3QgYSBwcmltaXRpdmUgbnVtYmVyOiAnKSArIFN0cmluZyhuKSk7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuLy8gQXNzdW1lcyBmaW5pdGUgbi5cclxuZnVuY3Rpb24gaXNPZGQobikge1xyXG4gIHZhciBrID0gbi5jLmxlbmd0aCAtIDE7XHJcbiAgcmV0dXJuIGJpdEZsb29yKG4uZSAvIExPR19CQVNFKSA9PSBrICYmIG4uY1trXSAlIDIgIT0gMDtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIHRvRXhwb25lbnRpYWwoc3RyLCBlKSB7XHJcbiAgcmV0dXJuIChzdHIubGVuZ3RoID4gMSA/IHN0ci5jaGFyQXQoMCkgKyAnLicgKyBzdHIuc2xpY2UoMSkgOiBzdHIpICtcclxuICAgKGUgPCAwID8gJ2UnIDogJ2UrJykgKyBlO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gdG9GaXhlZFBvaW50KHN0ciwgZSwgeikge1xyXG4gIHZhciBsZW4sIHpzO1xyXG5cclxuICAvLyBOZWdhdGl2ZSBleHBvbmVudD9cclxuICBpZiAoZSA8IDApIHtcclxuXHJcbiAgICAvLyBQcmVwZW5kIHplcm9zLlxyXG4gICAgZm9yICh6cyA9IHogKyAnLic7ICsrZTsgenMgKz0geik7XHJcbiAgICBzdHIgPSB6cyArIHN0cjtcclxuXHJcbiAgLy8gUG9zaXRpdmUgZXhwb25lbnRcclxuICB9IGVsc2Uge1xyXG4gICAgbGVuID0gc3RyLmxlbmd0aDtcclxuXHJcbiAgICAvLyBBcHBlbmQgemVyb3MuXHJcbiAgICBpZiAoKytlID4gbGVuKSB7XHJcbiAgICAgIGZvciAoenMgPSB6LCBlIC09IGxlbjsgLS1lOyB6cyArPSB6KTtcclxuICAgICAgc3RyICs9IHpzO1xyXG4gICAgfSBlbHNlIGlmIChlIDwgbGVuKSB7XHJcbiAgICAgIHN0ciA9IHN0ci5zbGljZSgwLCBlKSArICcuJyArIHN0ci5zbGljZShlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBzdHI7XHJcbn1cclxuXHJcblxyXG4vLyBFWFBPUlRcclxuXHJcblxyXG5leHBvcnQgdmFyIEJpZ051bWJlciA9IGNsb25lKCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBCaWdOdW1iZXI7XHJcbiIsInZhciB1cmwgPSByZXF1aXJlKFwidXJsXCIpO1xudmFyIGh0dHAgPSByZXF1aXJlKFwiaHR0cFwiKTtcbnZhciBodHRwcyA9IHJlcXVpcmUoXCJodHRwc1wiKTtcbnZhciBhc3NlcnQgPSByZXF1aXJlKFwiYXNzZXJ0XCIpO1xudmFyIFdyaXRhYmxlID0gcmVxdWlyZShcInN0cmVhbVwiKS5Xcml0YWJsZTtcbnZhciBkZWJ1ZyA9IHJlcXVpcmUoXCJkZWJ1Z1wiKShcImZvbGxvdy1yZWRpcmVjdHNcIik7XG5cbi8vIFJGQzcyMzHCpzQuMi4xOiBPZiB0aGUgcmVxdWVzdCBtZXRob2RzIGRlZmluZWQgYnkgdGhpcyBzcGVjaWZpY2F0aW9uLFxuLy8gdGhlIEdFVCwgSEVBRCwgT1BUSU9OUywgYW5kIFRSQUNFIG1ldGhvZHMgYXJlIGRlZmluZWQgdG8gYmUgc2FmZS5cbnZhciBTQUZFX01FVEhPRFMgPSB7IEdFVDogdHJ1ZSwgSEVBRDogdHJ1ZSwgT1BUSU9OUzogdHJ1ZSwgVFJBQ0U6IHRydWUgfTtcblxuLy8gQ3JlYXRlIGhhbmRsZXJzIHRoYXQgcGFzcyBldmVudHMgZnJvbSBuYXRpdmUgcmVxdWVzdHNcbnZhciBldmVudEhhbmRsZXJzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbltcImFib3J0XCIsIFwiYWJvcnRlZFwiLCBcImVycm9yXCIsIFwic29ja2V0XCIsIFwidGltZW91dFwiXS5mb3JFYWNoKGZ1bmN0aW9uIChldmVudCkge1xuICBldmVudEhhbmRsZXJzW2V2ZW50XSA9IGZ1bmN0aW9uIChhcmcpIHtcbiAgICB0aGlzLl9yZWRpcmVjdGFibGUuZW1pdChldmVudCwgYXJnKTtcbiAgfTtcbn0pO1xuXG4vLyBBbiBIVFRQKFMpIHJlcXVlc3QgdGhhdCBjYW4gYmUgcmVkaXJlY3RlZFxuZnVuY3Rpb24gUmVkaXJlY3RhYmxlUmVxdWVzdChvcHRpb25zLCByZXNwb25zZUNhbGxiYWNrKSB7XG4gIC8vIEluaXRpYWxpemUgdGhlIHJlcXVlc3RcbiAgV3JpdGFibGUuY2FsbCh0aGlzKTtcbiAgb3B0aW9ucy5oZWFkZXJzID0gb3B0aW9ucy5oZWFkZXJzIHx8IHt9O1xuICB0aGlzLl9vcHRpb25zID0gb3B0aW9ucztcbiAgdGhpcy5fcmVkaXJlY3RDb3VudCA9IDA7XG4gIHRoaXMuX3JlZGlyZWN0cyA9IFtdO1xuICB0aGlzLl9yZXF1ZXN0Qm9keUxlbmd0aCA9IDA7XG4gIHRoaXMuX3JlcXVlc3RCb2R5QnVmZmVycyA9IFtdO1xuXG4gIC8vIEF0dGFjaCBhIGNhbGxiYWNrIGlmIHBhc3NlZFxuICBpZiAocmVzcG9uc2VDYWxsYmFjaykge1xuICAgIHRoaXMub24oXCJyZXNwb25zZVwiLCByZXNwb25zZUNhbGxiYWNrKTtcbiAgfVxuXG4gIC8vIFJlYWN0IHRvIHJlc3BvbnNlcyBvZiBuYXRpdmUgcmVxdWVzdHNcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB0aGlzLl9vbk5hdGl2ZVJlc3BvbnNlID0gZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgc2VsZi5fcHJvY2Vzc1Jlc3BvbnNlKHJlc3BvbnNlKTtcbiAgfTtcblxuICAvLyBDb21wbGV0ZSB0aGUgVVJMIG9iamVjdCB3aGVuIG5lY2Vzc2FyeVxuICBpZiAoIW9wdGlvbnMucGF0aG5hbWUgJiYgb3B0aW9ucy5wYXRoKSB7XG4gICAgdmFyIHNlYXJjaFBvcyA9IG9wdGlvbnMucGF0aC5pbmRleE9mKFwiP1wiKTtcbiAgICBpZiAoc2VhcmNoUG9zIDwgMCkge1xuICAgICAgb3B0aW9ucy5wYXRobmFtZSA9IG9wdGlvbnMucGF0aDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBvcHRpb25zLnBhdGhuYW1lID0gb3B0aW9ucy5wYXRoLnN1YnN0cmluZygwLCBzZWFyY2hQb3MpO1xuICAgICAgb3B0aW9ucy5zZWFyY2ggPSBvcHRpb25zLnBhdGguc3Vic3RyaW5nKHNlYXJjaFBvcyk7XG4gICAgfVxuICB9XG5cbiAgLy8gUGVyZm9ybSB0aGUgZmlyc3QgcmVxdWVzdFxuICB0aGlzLl9wZXJmb3JtUmVxdWVzdCgpO1xufVxuUmVkaXJlY3RhYmxlUmVxdWVzdC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFdyaXRhYmxlLnByb3RvdHlwZSk7XG5cbi8vIFdyaXRlcyBidWZmZXJlZCBkYXRhIHRvIHRoZSBjdXJyZW50IG5hdGl2ZSByZXF1ZXN0XG5SZWRpcmVjdGFibGVSZXF1ZXN0LnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uIChkYXRhLCBlbmNvZGluZywgY2FsbGJhY2spIHtcbiAgLy8gVmFsaWRhdGUgaW5wdXQgYW5kIHNoaWZ0IHBhcmFtZXRlcnMgaWYgbmVjZXNzYXJ5XG4gIGlmICghKHR5cGVvZiBkYXRhID09PSBcInN0cmluZ1wiIHx8IHR5cGVvZiBkYXRhID09PSBcIm9iamVjdFwiICYmIChcImxlbmd0aFwiIGluIGRhdGEpKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcImRhdGEgc2hvdWxkIGJlIGEgc3RyaW5nLCBCdWZmZXIgb3IgVWludDhBcnJheVwiKTtcbiAgfVxuICBpZiAodHlwZW9mIGVuY29kaW5nID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBjYWxsYmFjayA9IGVuY29kaW5nO1xuICAgIGVuY29kaW5nID0gbnVsbDtcbiAgfVxuXG4gIC8vIElnbm9yZSBlbXB0eSBidWZmZXJzLCBzaW5jZSB3cml0aW5nIHRoZW0gZG9lc24ndCBpbnZva2UgdGhlIGNhbGxiYWNrXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9ub2RlanMvbm9kZS9pc3N1ZXMvMjIwNjZcbiAgaWYgKGRhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH1cbiAgICByZXR1cm47XG4gIH1cbiAgLy8gT25seSB3cml0ZSB3aGVuIHdlIGRvbid0IGV4Y2VlZCB0aGUgbWF4aW11bSBib2R5IGxlbmd0aFxuICBpZiAodGhpcy5fcmVxdWVzdEJvZHlMZW5ndGggKyBkYXRhLmxlbmd0aCA8PSB0aGlzLl9vcHRpb25zLm1heEJvZHlMZW5ndGgpIHtcbiAgICB0aGlzLl9yZXF1ZXN0Qm9keUxlbmd0aCArPSBkYXRhLmxlbmd0aDtcbiAgICB0aGlzLl9yZXF1ZXN0Qm9keUJ1ZmZlcnMucHVzaCh7IGRhdGE6IGRhdGEsIGVuY29kaW5nOiBlbmNvZGluZyB9KTtcbiAgICB0aGlzLl9jdXJyZW50UmVxdWVzdC53cml0ZShkYXRhLCBlbmNvZGluZywgY2FsbGJhY2spO1xuICB9XG4gIC8vIEVycm9yIHdoZW4gd2UgZXhjZWVkIHRoZSBtYXhpbXVtIGJvZHkgbGVuZ3RoXG4gIGVsc2Uge1xuICAgIHRoaXMuZW1pdChcImVycm9yXCIsIG5ldyBFcnJvcihcIlJlcXVlc3QgYm9keSBsYXJnZXIgdGhhbiBtYXhCb2R5TGVuZ3RoIGxpbWl0XCIpKTtcbiAgICB0aGlzLmFib3J0KCk7XG4gIH1cbn07XG5cbi8vIEVuZHMgdGhlIGN1cnJlbnQgbmF0aXZlIHJlcXVlc3RcblJlZGlyZWN0YWJsZVJlcXVlc3QucHJvdG90eXBlLmVuZCA9IGZ1bmN0aW9uIChkYXRhLCBlbmNvZGluZywgY2FsbGJhY2spIHtcbiAgLy8gU2hpZnQgcGFyYW1ldGVycyBpZiBuZWNlc3NhcnlcbiAgaWYgKHR5cGVvZiBkYXRhID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBjYWxsYmFjayA9IGRhdGE7XG4gICAgZGF0YSA9IGVuY29kaW5nID0gbnVsbDtcbiAgfVxuICBlbHNlIGlmICh0eXBlb2YgZW5jb2RpbmcgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIGNhbGxiYWNrID0gZW5jb2Rpbmc7XG4gICAgZW5jb2RpbmcgPSBudWxsO1xuICB9XG5cbiAgLy8gV3JpdGUgZGF0YSBhbmQgZW5kXG4gIHZhciBjdXJyZW50UmVxdWVzdCA9IHRoaXMuX2N1cnJlbnRSZXF1ZXN0O1xuICB0aGlzLndyaXRlKGRhdGEgfHwgXCJcIiwgZW5jb2RpbmcsIGZ1bmN0aW9uICgpIHtcbiAgICBjdXJyZW50UmVxdWVzdC5lbmQobnVsbCwgbnVsbCwgY2FsbGJhY2spO1xuICB9KTtcbn07XG5cbi8vIFNldHMgYSBoZWFkZXIgdmFsdWUgb24gdGhlIGN1cnJlbnQgbmF0aXZlIHJlcXVlc3RcblJlZGlyZWN0YWJsZVJlcXVlc3QucHJvdG90eXBlLnNldEhlYWRlciA9IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuICB0aGlzLl9vcHRpb25zLmhlYWRlcnNbbmFtZV0gPSB2YWx1ZTtcbiAgdGhpcy5fY3VycmVudFJlcXVlc3Quc2V0SGVhZGVyKG5hbWUsIHZhbHVlKTtcbn07XG5cbi8vIENsZWFycyBhIGhlYWRlciB2YWx1ZSBvbiB0aGUgY3VycmVudCBuYXRpdmUgcmVxdWVzdFxuUmVkaXJlY3RhYmxlUmVxdWVzdC5wcm90b3R5cGUucmVtb3ZlSGVhZGVyID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgZGVsZXRlIHRoaXMuX29wdGlvbnMuaGVhZGVyc1tuYW1lXTtcbiAgdGhpcy5fY3VycmVudFJlcXVlc3QucmVtb3ZlSGVhZGVyKG5hbWUpO1xufTtcblxuLy8gUHJveHkgYWxsIG90aGVyIHB1YmxpYyBDbGllbnRSZXF1ZXN0IG1ldGhvZHNcbltcbiAgXCJhYm9ydFwiLCBcImZsdXNoSGVhZGVyc1wiLCBcImdldEhlYWRlclwiLFxuICBcInNldE5vRGVsYXlcIiwgXCJzZXRTb2NrZXRLZWVwQWxpdmVcIiwgXCJzZXRUaW1lb3V0XCIsXG5dLmZvckVhY2goZnVuY3Rpb24gKG1ldGhvZCkge1xuICBSZWRpcmVjdGFibGVSZXF1ZXN0LnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICByZXR1cm4gdGhpcy5fY3VycmVudFJlcXVlc3RbbWV0aG9kXShhLCBiKTtcbiAgfTtcbn0pO1xuXG4vLyBQcm94eSBhbGwgcHVibGljIENsaWVudFJlcXVlc3QgcHJvcGVydGllc1xuW1wiYWJvcnRlZFwiLCBcImNvbm5lY3Rpb25cIiwgXCJzb2NrZXRcIl0uZm9yRWFjaChmdW5jdGlvbiAocHJvcGVydHkpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFJlZGlyZWN0YWJsZVJlcXVlc3QucHJvdG90eXBlLCBwcm9wZXJ0eSwge1xuICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5fY3VycmVudFJlcXVlc3RbcHJvcGVydHldOyB9LFxuICB9KTtcbn0pO1xuXG4vLyBFeGVjdXRlcyB0aGUgbmV4dCBuYXRpdmUgcmVxdWVzdCAoaW5pdGlhbCBvciByZWRpcmVjdClcblJlZGlyZWN0YWJsZVJlcXVlc3QucHJvdG90eXBlLl9wZXJmb3JtUmVxdWVzdCA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gTG9hZCB0aGUgbmF0aXZlIHByb3RvY29sXG4gIHZhciBwcm90b2NvbCA9IHRoaXMuX29wdGlvbnMucHJvdG9jb2w7XG4gIHZhciBuYXRpdmVQcm90b2NvbCA9IHRoaXMuX29wdGlvbnMubmF0aXZlUHJvdG9jb2xzW3Byb3RvY29sXTtcbiAgaWYgKCFuYXRpdmVQcm90b2NvbCkge1xuICAgIHRoaXMuZW1pdChcImVycm9yXCIsIG5ldyBFcnJvcihcIlVuc3VwcG9ydGVkIHByb3RvY29sIFwiICsgcHJvdG9jb2wpKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBJZiBzcGVjaWZpZWQsIHVzZSB0aGUgYWdlbnQgY29ycmVzcG9uZGluZyB0byB0aGUgcHJvdG9jb2xcbiAgLy8gKEhUVFAgYW5kIEhUVFBTIHVzZSBkaWZmZXJlbnQgdHlwZXMgb2YgYWdlbnRzKVxuICBpZiAodGhpcy5fb3B0aW9ucy5hZ2VudHMpIHtcbiAgICB2YXIgc2NoZW1lID0gcHJvdG9jb2wuc3Vic3RyKDAsIHByb3RvY29sLmxlbmd0aCAtIDEpO1xuICAgIHRoaXMuX29wdGlvbnMuYWdlbnQgPSB0aGlzLl9vcHRpb25zLmFnZW50c1tzY2hlbWVdO1xuICB9XG5cbiAgLy8gQ3JlYXRlIHRoZSBuYXRpdmUgcmVxdWVzdFxuICB2YXIgcmVxdWVzdCA9IHRoaXMuX2N1cnJlbnRSZXF1ZXN0ID1cbiAgICAgICAgbmF0aXZlUHJvdG9jb2wucmVxdWVzdCh0aGlzLl9vcHRpb25zLCB0aGlzLl9vbk5hdGl2ZVJlc3BvbnNlKTtcbiAgdGhpcy5fY3VycmVudFVybCA9IHVybC5mb3JtYXQodGhpcy5fb3B0aW9ucyk7XG5cbiAgLy8gU2V0IHVwIGV2ZW50IGhhbmRsZXJzXG4gIHJlcXVlc3QuX3JlZGlyZWN0YWJsZSA9IHRoaXM7XG4gIGZvciAodmFyIGV2ZW50IGluIGV2ZW50SGFuZGxlcnMpIHtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgIGlmIChldmVudCkge1xuICAgICAgcmVxdWVzdC5vbihldmVudCwgZXZlbnRIYW5kbGVyc1tldmVudF0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIEVuZCBhIHJlZGlyZWN0ZWQgcmVxdWVzdFxuICAvLyAoVGhlIGZpcnN0IHJlcXVlc3QgbXVzdCBiZSBlbmRlZCBleHBsaWNpdGx5IHdpdGggUmVkaXJlY3RhYmxlUmVxdWVzdCNlbmQpXG4gIGlmICh0aGlzLl9pc1JlZGlyZWN0KSB7XG4gICAgLy8gV3JpdGUgdGhlIHJlcXVlc3QgZW50aXR5IGFuZCBlbmQuXG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBidWZmZXJzID0gdGhpcy5fcmVxdWVzdEJvZHlCdWZmZXJzO1xuICAgIChmdW5jdGlvbiB3cml0ZU5leHQoKSB7XG4gICAgICBpZiAoaSA8IGJ1ZmZlcnMubGVuZ3RoKSB7XG4gICAgICAgIHZhciBidWZmZXIgPSBidWZmZXJzW2krK107XG4gICAgICAgIHJlcXVlc3Qud3JpdGUoYnVmZmVyLmRhdGEsIGJ1ZmZlci5lbmNvZGluZywgd3JpdGVOZXh0KTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICByZXF1ZXN0LmVuZCgpO1xuICAgICAgfVxuICAgIH0oKSk7XG4gIH1cbn07XG5cbi8vIFByb2Nlc3NlcyBhIHJlc3BvbnNlIGZyb20gdGhlIGN1cnJlbnQgbmF0aXZlIHJlcXVlc3RcblJlZGlyZWN0YWJsZVJlcXVlc3QucHJvdG90eXBlLl9wcm9jZXNzUmVzcG9uc2UgPSBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgLy8gU3RvcmUgdGhlIHJlZGlyZWN0ZWQgcmVzcG9uc2VcbiAgaWYgKHRoaXMuX29wdGlvbnMudHJhY2tSZWRpcmVjdHMpIHtcbiAgICB0aGlzLl9yZWRpcmVjdHMucHVzaCh7XG4gICAgICB1cmw6IHRoaXMuX2N1cnJlbnRVcmwsXG4gICAgICBoZWFkZXJzOiByZXNwb25zZS5oZWFkZXJzLFxuICAgICAgc3RhdHVzQ29kZTogcmVzcG9uc2Uuc3RhdHVzQ29kZSxcbiAgICB9KTtcbiAgfVxuXG4gIC8vIFJGQzcyMzHCpzYuNDogVGhlIDN4eCAoUmVkaXJlY3Rpb24pIGNsYXNzIG9mIHN0YXR1cyBjb2RlIGluZGljYXRlc1xuICAvLyB0aGF0IGZ1cnRoZXIgYWN0aW9uIG5lZWRzIHRvIGJlIHRha2VuIGJ5IHRoZSB1c2VyIGFnZW50IGluIG9yZGVyIHRvXG4gIC8vIGZ1bGZpbGwgdGhlIHJlcXVlc3QuIElmIGEgTG9jYXRpb24gaGVhZGVyIGZpZWxkIGlzIHByb3ZpZGVkLFxuICAvLyB0aGUgdXNlciBhZ2VudCBNQVkgYXV0b21hdGljYWxseSByZWRpcmVjdCBpdHMgcmVxdWVzdCB0byB0aGUgVVJJXG4gIC8vIHJlZmVyZW5jZWQgYnkgdGhlIExvY2F0aW9uIGZpZWxkIHZhbHVlLFxuICAvLyBldmVuIGlmIHRoZSBzcGVjaWZpYyBzdGF0dXMgY29kZSBpcyBub3QgdW5kZXJzdG9vZC5cbiAgdmFyIGxvY2F0aW9uID0gcmVzcG9uc2UuaGVhZGVycy5sb2NhdGlvbjtcbiAgaWYgKGxvY2F0aW9uICYmIHRoaXMuX29wdGlvbnMuZm9sbG93UmVkaXJlY3RzICE9PSBmYWxzZSAmJlxuICAgICAgcmVzcG9uc2Uuc3RhdHVzQ29kZSA+PSAzMDAgJiYgcmVzcG9uc2Uuc3RhdHVzQ29kZSA8IDQwMCkge1xuICAgIC8vIFJGQzcyMzHCpzYuNDogQSBjbGllbnQgU0hPVUxEIGRldGVjdCBhbmQgaW50ZXJ2ZW5lXG4gICAgLy8gaW4gY3ljbGljYWwgcmVkaXJlY3Rpb25zIChpLmUuLCBcImluZmluaXRlXCIgcmVkaXJlY3Rpb24gbG9vcHMpLlxuICAgIGlmICgrK3RoaXMuX3JlZGlyZWN0Q291bnQgPiB0aGlzLl9vcHRpb25zLm1heFJlZGlyZWN0cykge1xuICAgICAgdGhpcy5lbWl0KFwiZXJyb3JcIiwgbmV3IEVycm9yKFwiTWF4IHJlZGlyZWN0cyBleGNlZWRlZC5cIikpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFJGQzcyMzHCpzYuNDogQXV0b21hdGljIHJlZGlyZWN0aW9uIG5lZWRzIHRvIGRvbmUgd2l0aFxuICAgIC8vIGNhcmUgZm9yIG1ldGhvZHMgbm90IGtub3duIHRvIGJlIHNhZmUgW+KApl0sXG4gICAgLy8gc2luY2UgdGhlIHVzZXIgbWlnaHQgbm90IHdpc2ggdG8gcmVkaXJlY3QgYW4gdW5zYWZlIHJlcXVlc3QuXG4gICAgLy8gUkZDNzIzMcKnNi40Ljc6IFRoZSAzMDcgKFRlbXBvcmFyeSBSZWRpcmVjdCkgc3RhdHVzIGNvZGUgaW5kaWNhdGVzXG4gICAgLy8gdGhhdCB0aGUgdGFyZ2V0IHJlc291cmNlIHJlc2lkZXMgdGVtcG9yYXJpbHkgdW5kZXIgYSBkaWZmZXJlbnQgVVJJXG4gICAgLy8gYW5kIHRoZSB1c2VyIGFnZW50IE1VU1QgTk9UIGNoYW5nZSB0aGUgcmVxdWVzdCBtZXRob2RcbiAgICAvLyBpZiBpdCBwZXJmb3JtcyBhbiBhdXRvbWF0aWMgcmVkaXJlY3Rpb24gdG8gdGhhdCBVUkkuXG4gICAgdmFyIGhlYWRlcjtcbiAgICB2YXIgaGVhZGVycyA9IHRoaXMuX29wdGlvbnMuaGVhZGVycztcbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzQ29kZSAhPT0gMzA3ICYmICEodGhpcy5fb3B0aW9ucy5tZXRob2QgaW4gU0FGRV9NRVRIT0RTKSkge1xuICAgICAgdGhpcy5fb3B0aW9ucy5tZXRob2QgPSBcIkdFVFwiO1xuICAgICAgLy8gRHJvcCBhIHBvc3NpYmxlIGVudGl0eSBhbmQgaGVhZGVycyByZWxhdGVkIHRvIGl0XG4gICAgICB0aGlzLl9yZXF1ZXN0Qm9keUJ1ZmZlcnMgPSBbXTtcbiAgICAgIGZvciAoaGVhZGVyIGluIGhlYWRlcnMpIHtcbiAgICAgICAgaWYgKC9eY29udGVudC0vaS50ZXN0KGhlYWRlcikpIHtcbiAgICAgICAgICBkZWxldGUgaGVhZGVyc1toZWFkZXJdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gRHJvcCB0aGUgSG9zdCBoZWFkZXIsIGFzIHRoZSByZWRpcmVjdCBtaWdodCBsZWFkIHRvIGEgZGlmZmVyZW50IGhvc3RcbiAgICBpZiAoIXRoaXMuX2lzUmVkaXJlY3QpIHtcbiAgICAgIGZvciAoaGVhZGVyIGluIGhlYWRlcnMpIHtcbiAgICAgICAgaWYgKC9eaG9zdCQvaS50ZXN0KGhlYWRlcikpIHtcbiAgICAgICAgICBkZWxldGUgaGVhZGVyc1toZWFkZXJdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUGVyZm9ybSB0aGUgcmVkaXJlY3RlZCByZXF1ZXN0XG4gICAgdmFyIHJlZGlyZWN0VXJsID0gdXJsLnJlc29sdmUodGhpcy5fY3VycmVudFVybCwgbG9jYXRpb24pO1xuICAgIGRlYnVnKFwicmVkaXJlY3RpbmcgdG9cIiwgcmVkaXJlY3RVcmwpO1xuICAgIE9iamVjdC5hc3NpZ24odGhpcy5fb3B0aW9ucywgdXJsLnBhcnNlKHJlZGlyZWN0VXJsKSk7XG4gICAgdGhpcy5faXNSZWRpcmVjdCA9IHRydWU7XG4gICAgdGhpcy5fcGVyZm9ybVJlcXVlc3QoKTtcblxuICAgIC8vIERpc2NhcmQgdGhlIHJlbWFpbmRlciBvZiB0aGUgcmVzcG9uc2UgdG8gYXZvaWQgd2FpdGluZyBmb3IgZGF0YVxuICAgIHJlc3BvbnNlLmRlc3Ryb3koKTtcbiAgfVxuICBlbHNlIHtcbiAgICAvLyBUaGUgcmVzcG9uc2UgaXMgbm90IGEgcmVkaXJlY3Q7IHJldHVybiBpdCBhcy1pc1xuICAgIHJlc3BvbnNlLnJlc3BvbnNlVXJsID0gdGhpcy5fY3VycmVudFVybDtcbiAgICByZXNwb25zZS5yZWRpcmVjdHMgPSB0aGlzLl9yZWRpcmVjdHM7XG4gICAgdGhpcy5lbWl0KFwicmVzcG9uc2VcIiwgcmVzcG9uc2UpO1xuXG4gICAgLy8gQ2xlYW4gdXBcbiAgICB0aGlzLl9yZXF1ZXN0Qm9keUJ1ZmZlcnMgPSBbXTtcbiAgfVxufTtcblxuLy8gV3JhcHMgdGhlIGtleS92YWx1ZSBvYmplY3Qgb2YgcHJvdG9jb2xzIHdpdGggcmVkaXJlY3QgZnVuY3Rpb25hbGl0eVxuZnVuY3Rpb24gd3JhcChwcm90b2NvbHMpIHtcbiAgLy8gRGVmYXVsdCBzZXR0aW5nc1xuICB2YXIgZXhwb3J0cyA9IHtcbiAgICBtYXhSZWRpcmVjdHM6IDIxLFxuICAgIG1heEJvZHlMZW5ndGg6IDEwICogMTAyNCAqIDEwMjQsXG4gIH07XG5cbiAgLy8gV3JhcCBlYWNoIHByb3RvY29sXG4gIHZhciBuYXRpdmVQcm90b2NvbHMgPSB7fTtcbiAgT2JqZWN0LmtleXMocHJvdG9jb2xzKS5mb3JFYWNoKGZ1bmN0aW9uIChzY2hlbWUpIHtcbiAgICB2YXIgcHJvdG9jb2wgPSBzY2hlbWUgKyBcIjpcIjtcbiAgICB2YXIgbmF0aXZlUHJvdG9jb2wgPSBuYXRpdmVQcm90b2NvbHNbcHJvdG9jb2xdID0gcHJvdG9jb2xzW3NjaGVtZV07XG4gICAgdmFyIHdyYXBwZWRQcm90b2NvbCA9IGV4cG9ydHNbc2NoZW1lXSA9IE9iamVjdC5jcmVhdGUobmF0aXZlUHJvdG9jb2wpO1xuXG4gICAgLy8gRXhlY3V0ZXMgYSByZXF1ZXN0LCBmb2xsb3dpbmcgcmVkaXJlY3RzXG4gICAgd3JhcHBlZFByb3RvY29sLnJlcXVlc3QgPSBmdW5jdGlvbiAob3B0aW9ucywgY2FsbGJhY2spIHtcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICBvcHRpb25zID0gdXJsLnBhcnNlKG9wdGlvbnMpO1xuICAgICAgICBvcHRpb25zLm1heFJlZGlyZWN0cyA9IGV4cG9ydHMubWF4UmVkaXJlY3RzO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgICAgICBwcm90b2NvbDogcHJvdG9jb2wsXG4gICAgICAgICAgbWF4UmVkaXJlY3RzOiBleHBvcnRzLm1heFJlZGlyZWN0cyxcbiAgICAgICAgICBtYXhCb2R5TGVuZ3RoOiBleHBvcnRzLm1heEJvZHlMZW5ndGgsXG4gICAgICAgIH0sIG9wdGlvbnMpO1xuICAgICAgfVxuICAgICAgb3B0aW9ucy5uYXRpdmVQcm90b2NvbHMgPSBuYXRpdmVQcm90b2NvbHM7XG4gICAgICBhc3NlcnQuZXF1YWwob3B0aW9ucy5wcm90b2NvbCwgcHJvdG9jb2wsIFwicHJvdG9jb2wgbWlzbWF0Y2hcIik7XG4gICAgICBkZWJ1ZyhcIm9wdGlvbnNcIiwgb3B0aW9ucyk7XG4gICAgICByZXR1cm4gbmV3IFJlZGlyZWN0YWJsZVJlcXVlc3Qob3B0aW9ucywgY2FsbGJhY2spO1xuICAgIH07XG5cbiAgICAvLyBFeGVjdXRlcyBhIEdFVCByZXF1ZXN0LCBmb2xsb3dpbmcgcmVkaXJlY3RzXG4gICAgd3JhcHBlZFByb3RvY29sLmdldCA9IGZ1bmN0aW9uIChvcHRpb25zLCBjYWxsYmFjaykge1xuICAgICAgdmFyIHJlcXVlc3QgPSB3cmFwcGVkUHJvdG9jb2wucmVxdWVzdChvcHRpb25zLCBjYWxsYmFjayk7XG4gICAgICByZXF1ZXN0LmVuZCgpO1xuICAgICAgcmV0dXJuIHJlcXVlc3Q7XG4gICAgfTtcbiAgfSk7XG4gIHJldHVybiBleHBvcnRzO1xufVxuXG4vLyBFeHBvcnRzXG5tb2R1bGUuZXhwb3J0cyA9IHdyYXAoeyBodHRwOiBodHRwLCBodHRwczogaHR0cHMgfSk7XG5tb2R1bGUuZXhwb3J0cy53cmFwID0gd3JhcDtcbiIsIi8qKlxuICogVGhpcyBpcyB0aGUgd2ViIGJyb3dzZXIgaW1wbGVtZW50YXRpb24gb2YgYGRlYnVnKClgLlxuICpcbiAqIEV4cG9zZSBgZGVidWcoKWAgYXMgdGhlIG1vZHVsZS5cbiAqL1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2RlYnVnJyk7XG5leHBvcnRzLmxvZyA9IGxvZztcbmV4cG9ydHMuZm9ybWF0QXJncyA9IGZvcm1hdEFyZ3M7XG5leHBvcnRzLnNhdmUgPSBzYXZlO1xuZXhwb3J0cy5sb2FkID0gbG9hZDtcbmV4cG9ydHMudXNlQ29sb3JzID0gdXNlQ29sb3JzO1xuZXhwb3J0cy5zdG9yYWdlID0gJ3VuZGVmaW5lZCcgIT0gdHlwZW9mIGNocm9tZVxuICAgICAgICAgICAgICAgJiYgJ3VuZGVmaW5lZCcgIT0gdHlwZW9mIGNocm9tZS5zdG9yYWdlXG4gICAgICAgICAgICAgICAgICA/IGNocm9tZS5zdG9yYWdlLmxvY2FsXG4gICAgICAgICAgICAgICAgICA6IGxvY2Fsc3RvcmFnZSgpO1xuXG4vKipcbiAqIENvbG9ycy5cbiAqL1xuXG5leHBvcnRzLmNvbG9ycyA9IFtcbiAgJyMwMDAwQ0MnLCAnIzAwMDBGRicsICcjMDAzM0NDJywgJyMwMDMzRkYnLCAnIzAwNjZDQycsICcjMDA2NkZGJywgJyMwMDk5Q0MnLFxuICAnIzAwOTlGRicsICcjMDBDQzAwJywgJyMwMENDMzMnLCAnIzAwQ0M2NicsICcjMDBDQzk5JywgJyMwMENDQ0MnLCAnIzAwQ0NGRicsXG4gICcjMzMwMENDJywgJyMzMzAwRkYnLCAnIzMzMzNDQycsICcjMzMzM0ZGJywgJyMzMzY2Q0MnLCAnIzMzNjZGRicsICcjMzM5OUNDJyxcbiAgJyMzMzk5RkYnLCAnIzMzQ0MwMCcsICcjMzNDQzMzJywgJyMzM0NDNjYnLCAnIzMzQ0M5OScsICcjMzNDQ0NDJywgJyMzM0NDRkYnLFxuICAnIzY2MDBDQycsICcjNjYwMEZGJywgJyM2NjMzQ0MnLCAnIzY2MzNGRicsICcjNjZDQzAwJywgJyM2NkNDMzMnLCAnIzk5MDBDQycsXG4gICcjOTkwMEZGJywgJyM5OTMzQ0MnLCAnIzk5MzNGRicsICcjOTlDQzAwJywgJyM5OUNDMzMnLCAnI0NDMDAwMCcsICcjQ0MwMDMzJyxcbiAgJyNDQzAwNjYnLCAnI0NDMDA5OScsICcjQ0MwMENDJywgJyNDQzAwRkYnLCAnI0NDMzMwMCcsICcjQ0MzMzMzJywgJyNDQzMzNjYnLFxuICAnI0NDMzM5OScsICcjQ0MzM0NDJywgJyNDQzMzRkYnLCAnI0NDNjYwMCcsICcjQ0M2NjMzJywgJyNDQzk5MDAnLCAnI0NDOTkzMycsXG4gICcjQ0NDQzAwJywgJyNDQ0NDMzMnLCAnI0ZGMDAwMCcsICcjRkYwMDMzJywgJyNGRjAwNjYnLCAnI0ZGMDA5OScsICcjRkYwMENDJyxcbiAgJyNGRjAwRkYnLCAnI0ZGMzMwMCcsICcjRkYzMzMzJywgJyNGRjMzNjYnLCAnI0ZGMzM5OScsICcjRkYzM0NDJywgJyNGRjMzRkYnLFxuICAnI0ZGNjYwMCcsICcjRkY2NjMzJywgJyNGRjk5MDAnLCAnI0ZGOTkzMycsICcjRkZDQzAwJywgJyNGRkNDMzMnXG5dO1xuXG4vKipcbiAqIEN1cnJlbnRseSBvbmx5IFdlYktpdC1iYXNlZCBXZWIgSW5zcGVjdG9ycywgRmlyZWZveCA+PSB2MzEsXG4gKiBhbmQgdGhlIEZpcmVidWcgZXh0ZW5zaW9uIChhbnkgRmlyZWZveCB2ZXJzaW9uKSBhcmUga25vd25cbiAqIHRvIHN1cHBvcnQgXCIlY1wiIENTUyBjdXN0b21pemF0aW9ucy5cbiAqXG4gKiBUT0RPOiBhZGQgYSBgbG9jYWxTdG9yYWdlYCB2YXJpYWJsZSB0byBleHBsaWNpdGx5IGVuYWJsZS9kaXNhYmxlIGNvbG9yc1xuICovXG5cbmZ1bmN0aW9uIHVzZUNvbG9ycygpIHtcbiAgLy8gTkI6IEluIGFuIEVsZWN0cm9uIHByZWxvYWQgc2NyaXB0LCBkb2N1bWVudCB3aWxsIGJlIGRlZmluZWQgYnV0IG5vdCBmdWxseVxuICAvLyBpbml0aWFsaXplZC4gU2luY2Ugd2Uga25vdyB3ZSdyZSBpbiBDaHJvbWUsIHdlJ2xsIGp1c3QgZGV0ZWN0IHRoaXMgY2FzZVxuICAvLyBleHBsaWNpdGx5XG4gIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cucHJvY2VzcyAmJiB3aW5kb3cucHJvY2Vzcy50eXBlID09PSAncmVuZGVyZXInKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyBJbnRlcm5ldCBFeHBsb3JlciBhbmQgRWRnZSBkbyBub3Qgc3VwcG9ydCBjb2xvcnMuXG4gIGlmICh0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyAmJiBuYXZpZ2F0b3IudXNlckFnZW50ICYmIG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5tYXRjaCgvKGVkZ2V8dHJpZGVudClcXC8oXFxkKykvKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIGlzIHdlYmtpdD8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMTY0NTk2MDYvMzc2NzczXG4gIC8vIGRvY3VtZW50IGlzIHVuZGVmaW5lZCBpbiByZWFjdC1uYXRpdmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC1uYXRpdmUvcHVsbC8xNjMyXG4gIHJldHVybiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS5XZWJraXRBcHBlYXJhbmNlKSB8fFxuICAgIC8vIGlzIGZpcmVidWc/IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzM5ODEyMC8zNzY3NzNcbiAgICAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmNvbnNvbGUgJiYgKHdpbmRvdy5jb25zb2xlLmZpcmVidWcgfHwgKHdpbmRvdy5jb25zb2xlLmV4Y2VwdGlvbiAmJiB3aW5kb3cuY29uc29sZS50YWJsZSkpKSB8fFxuICAgIC8vIGlzIGZpcmVmb3ggPj0gdjMxP1xuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvVG9vbHMvV2ViX0NvbnNvbGUjU3R5bGluZ19tZXNzYWdlc1xuICAgICh0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyAmJiBuYXZpZ2F0b3IudXNlckFnZW50ICYmIG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5tYXRjaCgvZmlyZWZveFxcLyhcXGQrKS8pICYmIHBhcnNlSW50KFJlZ0V4cC4kMSwgMTApID49IDMxKSB8fFxuICAgIC8vIGRvdWJsZSBjaGVjayB3ZWJraXQgaW4gdXNlckFnZW50IGp1c3QgaW4gY2FzZSB3ZSBhcmUgaW4gYSB3b3JrZXJcbiAgICAodHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudCAmJiBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkubWF0Y2goL2FwcGxld2Via2l0XFwvKFxcZCspLykpO1xufVxuXG4vKipcbiAqIE1hcCAlaiB0byBgSlNPTi5zdHJpbmdpZnkoKWAsIHNpbmNlIG5vIFdlYiBJbnNwZWN0b3JzIGRvIHRoYXQgYnkgZGVmYXVsdC5cbiAqL1xuXG5leHBvcnRzLmZvcm1hdHRlcnMuaiA9IGZ1bmN0aW9uKHYpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodik7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHJldHVybiAnW1VuZXhwZWN0ZWRKU09OUGFyc2VFcnJvcl06ICcgKyBlcnIubWVzc2FnZTtcbiAgfVxufTtcblxuXG4vKipcbiAqIENvbG9yaXplIGxvZyBhcmd1bWVudHMgaWYgZW5hYmxlZC5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGZvcm1hdEFyZ3MoYXJncykge1xuICB2YXIgdXNlQ29sb3JzID0gdGhpcy51c2VDb2xvcnM7XG5cbiAgYXJnc1swXSA9ICh1c2VDb2xvcnMgPyAnJWMnIDogJycpXG4gICAgKyB0aGlzLm5hbWVzcGFjZVxuICAgICsgKHVzZUNvbG9ycyA/ICcgJWMnIDogJyAnKVxuICAgICsgYXJnc1swXVxuICAgICsgKHVzZUNvbG9ycyA/ICclYyAnIDogJyAnKVxuICAgICsgJysnICsgZXhwb3J0cy5odW1hbml6ZSh0aGlzLmRpZmYpO1xuXG4gIGlmICghdXNlQ29sb3JzKSByZXR1cm47XG5cbiAgdmFyIGMgPSAnY29sb3I6ICcgKyB0aGlzLmNvbG9yO1xuICBhcmdzLnNwbGljZSgxLCAwLCBjLCAnY29sb3I6IGluaGVyaXQnKVxuXG4gIC8vIHRoZSBmaW5hbCBcIiVjXCIgaXMgc29tZXdoYXQgdHJpY2t5LCBiZWNhdXNlIHRoZXJlIGNvdWxkIGJlIG90aGVyXG4gIC8vIGFyZ3VtZW50cyBwYXNzZWQgZWl0aGVyIGJlZm9yZSBvciBhZnRlciB0aGUgJWMsIHNvIHdlIG5lZWQgdG9cbiAgLy8gZmlndXJlIG91dCB0aGUgY29ycmVjdCBpbmRleCB0byBpbnNlcnQgdGhlIENTUyBpbnRvXG4gIHZhciBpbmRleCA9IDA7XG4gIHZhciBsYXN0QyA9IDA7XG4gIGFyZ3NbMF0ucmVwbGFjZSgvJVthLXpBLVolXS9nLCBmdW5jdGlvbihtYXRjaCkge1xuICAgIGlmICgnJSUnID09PSBtYXRjaCkgcmV0dXJuO1xuICAgIGluZGV4Kys7XG4gICAgaWYgKCclYycgPT09IG1hdGNoKSB7XG4gICAgICAvLyB3ZSBvbmx5IGFyZSBpbnRlcmVzdGVkIGluIHRoZSAqbGFzdCogJWNcbiAgICAgIC8vICh0aGUgdXNlciBtYXkgaGF2ZSBwcm92aWRlZCB0aGVpciBvd24pXG4gICAgICBsYXN0QyA9IGluZGV4O1xuICAgIH1cbiAgfSk7XG5cbiAgYXJncy5zcGxpY2UobGFzdEMsIDAsIGMpO1xufVxuXG4vKipcbiAqIEludm9rZXMgYGNvbnNvbGUubG9nKClgIHdoZW4gYXZhaWxhYmxlLlxuICogTm8tb3Agd2hlbiBgY29uc29sZS5sb2dgIGlzIG5vdCBhIFwiZnVuY3Rpb25cIi5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGxvZygpIHtcbiAgLy8gdGhpcyBoYWNrZXJ5IGlzIHJlcXVpcmVkIGZvciBJRTgvOSwgd2hlcmVcbiAgLy8gdGhlIGBjb25zb2xlLmxvZ2AgZnVuY3Rpb24gZG9lc24ndCBoYXZlICdhcHBseSdcbiAgcmV0dXJuICdvYmplY3QnID09PSB0eXBlb2YgY29uc29sZVxuICAgICYmIGNvbnNvbGUubG9nXG4gICAgJiYgRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmNhbGwoY29uc29sZS5sb2csIGNvbnNvbGUsIGFyZ3VtZW50cyk7XG59XG5cbi8qKlxuICogU2F2ZSBgbmFtZXNwYWNlc2AuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZXNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHNhdmUobmFtZXNwYWNlcykge1xuICB0cnkge1xuICAgIGlmIChudWxsID09IG5hbWVzcGFjZXMpIHtcbiAgICAgIGV4cG9ydHMuc3RvcmFnZS5yZW1vdmVJdGVtKCdkZWJ1ZycpO1xuICAgIH0gZWxzZSB7XG4gICAgICBleHBvcnRzLnN0b3JhZ2UuZGVidWcgPSBuYW1lc3BhY2VzO1xuICAgIH1cbiAgfSBjYXRjaChlKSB7fVxufVxuXG4vKipcbiAqIExvYWQgYG5hbWVzcGFjZXNgLlxuICpcbiAqIEByZXR1cm4ge1N0cmluZ30gcmV0dXJucyB0aGUgcHJldmlvdXNseSBwZXJzaXN0ZWQgZGVidWcgbW9kZXNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGxvYWQoKSB7XG4gIHZhciByO1xuICB0cnkge1xuICAgIHIgPSBleHBvcnRzLnN0b3JhZ2UuZGVidWc7XG4gIH0gY2F0Y2goZSkge31cblxuICAvLyBJZiBkZWJ1ZyBpc24ndCBzZXQgaW4gTFMsIGFuZCB3ZSdyZSBpbiBFbGVjdHJvbiwgdHJ5IHRvIGxvYWQgJERFQlVHXG4gIGlmICghciAmJiB0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgJ2VudicgaW4gcHJvY2Vzcykge1xuICAgIHIgPSBwcm9jZXNzLmVudi5ERUJVRztcbiAgfVxuXG4gIHJldHVybiByO1xufVxuXG4vKipcbiAqIEVuYWJsZSBuYW1lc3BhY2VzIGxpc3RlZCBpbiBgbG9jYWxTdG9yYWdlLmRlYnVnYCBpbml0aWFsbHkuXG4gKi9cblxuZXhwb3J0cy5lbmFibGUobG9hZCgpKTtcblxuLyoqXG4gKiBMb2NhbHN0b3JhZ2UgYXR0ZW1wdHMgdG8gcmV0dXJuIHRoZSBsb2NhbHN0b3JhZ2UuXG4gKlxuICogVGhpcyBpcyBuZWNlc3NhcnkgYmVjYXVzZSBzYWZhcmkgdGhyb3dzXG4gKiB3aGVuIGEgdXNlciBkaXNhYmxlcyBjb29raWVzL2xvY2Fsc3RvcmFnZVxuICogYW5kIHlvdSBhdHRlbXB0IHRvIGFjY2VzcyBpdC5cbiAqXG4gKiBAcmV0dXJuIHtMb2NhbFN0b3JhZ2V9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBsb2NhbHN0b3JhZ2UoKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHdpbmRvdy5sb2NhbFN0b3JhZ2U7XG4gIH0gY2F0Y2ggKGUpIHt9XG59XG4iLCJcbi8qKlxuICogVGhpcyBpcyB0aGUgY29tbW9uIGxvZ2ljIGZvciBib3RoIHRoZSBOb2RlLmpzIGFuZCB3ZWIgYnJvd3NlclxuICogaW1wbGVtZW50YXRpb25zIG9mIGBkZWJ1ZygpYC5cbiAqXG4gKiBFeHBvc2UgYGRlYnVnKClgIGFzIHRoZSBtb2R1bGUuXG4gKi9cblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gY3JlYXRlRGVidWcuZGVidWcgPSBjcmVhdGVEZWJ1Z1snZGVmYXVsdCddID0gY3JlYXRlRGVidWc7XG5leHBvcnRzLmNvZXJjZSA9IGNvZXJjZTtcbmV4cG9ydHMuZGlzYWJsZSA9IGRpc2FibGU7XG5leHBvcnRzLmVuYWJsZSA9IGVuYWJsZTtcbmV4cG9ydHMuZW5hYmxlZCA9IGVuYWJsZWQ7XG5leHBvcnRzLmh1bWFuaXplID0gcmVxdWlyZSgnbXMnKTtcblxuLyoqXG4gKiBBY3RpdmUgYGRlYnVnYCBpbnN0YW5jZXMuXG4gKi9cbmV4cG9ydHMuaW5zdGFuY2VzID0gW107XG5cbi8qKlxuICogVGhlIGN1cnJlbnRseSBhY3RpdmUgZGVidWcgbW9kZSBuYW1lcywgYW5kIG5hbWVzIHRvIHNraXAuXG4gKi9cblxuZXhwb3J0cy5uYW1lcyA9IFtdO1xuZXhwb3J0cy5za2lwcyA9IFtdO1xuXG4vKipcbiAqIE1hcCBvZiBzcGVjaWFsIFwiJW5cIiBoYW5kbGluZyBmdW5jdGlvbnMsIGZvciB0aGUgZGVidWcgXCJmb3JtYXRcIiBhcmd1bWVudC5cbiAqXG4gKiBWYWxpZCBrZXkgbmFtZXMgYXJlIGEgc2luZ2xlLCBsb3dlciBvciB1cHBlci1jYXNlIGxldHRlciwgaS5lLiBcIm5cIiBhbmQgXCJOXCIuXG4gKi9cblxuZXhwb3J0cy5mb3JtYXR0ZXJzID0ge307XG5cbi8qKlxuICogU2VsZWN0IGEgY29sb3IuXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZXNwYWNlXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBzZWxlY3RDb2xvcihuYW1lc3BhY2UpIHtcbiAgdmFyIGhhc2ggPSAwLCBpO1xuXG4gIGZvciAoaSBpbiBuYW1lc3BhY2UpIHtcbiAgICBoYXNoICA9ICgoaGFzaCA8PCA1KSAtIGhhc2gpICsgbmFtZXNwYWNlLmNoYXJDb2RlQXQoaSk7XG4gICAgaGFzaCB8PSAwOyAvLyBDb252ZXJ0IHRvIDMyYml0IGludGVnZXJcbiAgfVxuXG4gIHJldHVybiBleHBvcnRzLmNvbG9yc1tNYXRoLmFicyhoYXNoKSAlIGV4cG9ydHMuY29sb3JzLmxlbmd0aF07XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgZGVidWdnZXIgd2l0aCB0aGUgZ2l2ZW4gYG5hbWVzcGFjZWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZVxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGNyZWF0ZURlYnVnKG5hbWVzcGFjZSkge1xuXG4gIHZhciBwcmV2VGltZTtcblxuICBmdW5jdGlvbiBkZWJ1ZygpIHtcbiAgICAvLyBkaXNhYmxlZD9cbiAgICBpZiAoIWRlYnVnLmVuYWJsZWQpIHJldHVybjtcblxuICAgIHZhciBzZWxmID0gZGVidWc7XG5cbiAgICAvLyBzZXQgYGRpZmZgIHRpbWVzdGFtcFxuICAgIHZhciBjdXJyID0gK25ldyBEYXRlKCk7XG4gICAgdmFyIG1zID0gY3VyciAtIChwcmV2VGltZSB8fCBjdXJyKTtcbiAgICBzZWxmLmRpZmYgPSBtcztcbiAgICBzZWxmLnByZXYgPSBwcmV2VGltZTtcbiAgICBzZWxmLmN1cnIgPSBjdXJyO1xuICAgIHByZXZUaW1lID0gY3VycjtcblxuICAgIC8vIHR1cm4gdGhlIGBhcmd1bWVudHNgIGludG8gYSBwcm9wZXIgQXJyYXlcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaV07XG4gICAgfVxuXG4gICAgYXJnc1swXSA9IGV4cG9ydHMuY29lcmNlKGFyZ3NbMF0pO1xuXG4gICAgaWYgKCdzdHJpbmcnICE9PSB0eXBlb2YgYXJnc1swXSkge1xuICAgICAgLy8gYW55dGhpbmcgZWxzZSBsZXQncyBpbnNwZWN0IHdpdGggJU9cbiAgICAgIGFyZ3MudW5zaGlmdCgnJU8nKTtcbiAgICB9XG5cbiAgICAvLyBhcHBseSBhbnkgYGZvcm1hdHRlcnNgIHRyYW5zZm9ybWF0aW9uc1xuICAgIHZhciBpbmRleCA9IDA7XG4gICAgYXJnc1swXSA9IGFyZ3NbMF0ucmVwbGFjZSgvJShbYS16QS1aJV0pL2csIGZ1bmN0aW9uKG1hdGNoLCBmb3JtYXQpIHtcbiAgICAgIC8vIGlmIHdlIGVuY291bnRlciBhbiBlc2NhcGVkICUgdGhlbiBkb24ndCBpbmNyZWFzZSB0aGUgYXJyYXkgaW5kZXhcbiAgICAgIGlmIChtYXRjaCA9PT0gJyUlJykgcmV0dXJuIG1hdGNoO1xuICAgICAgaW5kZXgrKztcbiAgICAgIHZhciBmb3JtYXR0ZXIgPSBleHBvcnRzLmZvcm1hdHRlcnNbZm9ybWF0XTtcbiAgICAgIGlmICgnZnVuY3Rpb24nID09PSB0eXBlb2YgZm9ybWF0dGVyKSB7XG4gICAgICAgIHZhciB2YWwgPSBhcmdzW2luZGV4XTtcbiAgICAgICAgbWF0Y2ggPSBmb3JtYXR0ZXIuY2FsbChzZWxmLCB2YWwpO1xuXG4gICAgICAgIC8vIG5vdyB3ZSBuZWVkIHRvIHJlbW92ZSBgYXJnc1tpbmRleF1gIHNpbmNlIGl0J3MgaW5saW5lZCBpbiB0aGUgYGZvcm1hdGBcbiAgICAgICAgYXJncy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICBpbmRleC0tO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1hdGNoO1xuICAgIH0pO1xuXG4gICAgLy8gYXBwbHkgZW52LXNwZWNpZmljIGZvcm1hdHRpbmcgKGNvbG9ycywgZXRjLilcbiAgICBleHBvcnRzLmZvcm1hdEFyZ3MuY2FsbChzZWxmLCBhcmdzKTtcblxuICAgIHZhciBsb2dGbiA9IGRlYnVnLmxvZyB8fCBleHBvcnRzLmxvZyB8fCBjb25zb2xlLmxvZy5iaW5kKGNvbnNvbGUpO1xuICAgIGxvZ0ZuLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICB9XG5cbiAgZGVidWcubmFtZXNwYWNlID0gbmFtZXNwYWNlO1xuICBkZWJ1Zy5lbmFibGVkID0gZXhwb3J0cy5lbmFibGVkKG5hbWVzcGFjZSk7XG4gIGRlYnVnLnVzZUNvbG9ycyA9IGV4cG9ydHMudXNlQ29sb3JzKCk7XG4gIGRlYnVnLmNvbG9yID0gc2VsZWN0Q29sb3IobmFtZXNwYWNlKTtcbiAgZGVidWcuZGVzdHJveSA9IGRlc3Ryb3k7XG5cbiAgLy8gZW52LXNwZWNpZmljIGluaXRpYWxpemF0aW9uIGxvZ2ljIGZvciBkZWJ1ZyBpbnN0YW5jZXNcbiAgaWYgKCdmdW5jdGlvbicgPT09IHR5cGVvZiBleHBvcnRzLmluaXQpIHtcbiAgICBleHBvcnRzLmluaXQoZGVidWcpO1xuICB9XG5cbiAgZXhwb3J0cy5pbnN0YW5jZXMucHVzaChkZWJ1Zyk7XG5cbiAgcmV0dXJuIGRlYnVnO1xufVxuXG5mdW5jdGlvbiBkZXN0cm95ICgpIHtcbiAgdmFyIGluZGV4ID0gZXhwb3J0cy5pbnN0YW5jZXMuaW5kZXhPZih0aGlzKTtcbiAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgIGV4cG9ydHMuaW5zdGFuY2VzLnNwbGljZShpbmRleCwgMSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbi8qKlxuICogRW5hYmxlcyBhIGRlYnVnIG1vZGUgYnkgbmFtZXNwYWNlcy4gVGhpcyBjYW4gaW5jbHVkZSBtb2Rlc1xuICogc2VwYXJhdGVkIGJ5IGEgY29sb24gYW5kIHdpbGRjYXJkcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZXNwYWNlc1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBlbmFibGUobmFtZXNwYWNlcykge1xuICBleHBvcnRzLnNhdmUobmFtZXNwYWNlcyk7XG5cbiAgZXhwb3J0cy5uYW1lcyA9IFtdO1xuICBleHBvcnRzLnNraXBzID0gW107XG5cbiAgdmFyIGk7XG4gIHZhciBzcGxpdCA9ICh0eXBlb2YgbmFtZXNwYWNlcyA9PT0gJ3N0cmluZycgPyBuYW1lc3BhY2VzIDogJycpLnNwbGl0KC9bXFxzLF0rLyk7XG4gIHZhciBsZW4gPSBzcGxpdC5sZW5ndGg7XG5cbiAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaWYgKCFzcGxpdFtpXSkgY29udGludWU7IC8vIGlnbm9yZSBlbXB0eSBzdHJpbmdzXG4gICAgbmFtZXNwYWNlcyA9IHNwbGl0W2ldLnJlcGxhY2UoL1xcKi9nLCAnLio/Jyk7XG4gICAgaWYgKG5hbWVzcGFjZXNbMF0gPT09ICctJykge1xuICAgICAgZXhwb3J0cy5za2lwcy5wdXNoKG5ldyBSZWdFeHAoJ14nICsgbmFtZXNwYWNlcy5zdWJzdHIoMSkgKyAnJCcpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXhwb3J0cy5uYW1lcy5wdXNoKG5ldyBSZWdFeHAoJ14nICsgbmFtZXNwYWNlcyArICckJykpO1xuICAgIH1cbiAgfVxuXG4gIGZvciAoaSA9IDA7IGkgPCBleHBvcnRzLmluc3RhbmNlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpbnN0YW5jZSA9IGV4cG9ydHMuaW5zdGFuY2VzW2ldO1xuICAgIGluc3RhbmNlLmVuYWJsZWQgPSBleHBvcnRzLmVuYWJsZWQoaW5zdGFuY2UubmFtZXNwYWNlKTtcbiAgfVxufVxuXG4vKipcbiAqIERpc2FibGUgZGVidWcgb3V0cHV0LlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gZGlzYWJsZSgpIHtcbiAgZXhwb3J0cy5lbmFibGUoJycpO1xufVxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgZ2l2ZW4gbW9kZSBuYW1lIGlzIGVuYWJsZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gZW5hYmxlZChuYW1lKSB7XG4gIGlmIChuYW1lW25hbWUubGVuZ3RoIC0gMV0gPT09ICcqJykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHZhciBpLCBsZW47XG4gIGZvciAoaSA9IDAsIGxlbiA9IGV4cG9ydHMuc2tpcHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBpZiAoZXhwb3J0cy5za2lwc1tpXS50ZXN0KG5hbWUpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIGZvciAoaSA9IDAsIGxlbiA9IGV4cG9ydHMubmFtZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBpZiAoZXhwb3J0cy5uYW1lc1tpXS50ZXN0KG5hbWUpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIENvZXJjZSBgdmFsYC5cbiAqXG4gKiBAcGFyYW0ge01peGVkfSB2YWxcbiAqIEByZXR1cm4ge01peGVkfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gY29lcmNlKHZhbCkge1xuICBpZiAodmFsIGluc3RhbmNlb2YgRXJyb3IpIHJldHVybiB2YWwuc3RhY2sgfHwgdmFsLm1lc3NhZ2U7XG4gIHJldHVybiB2YWw7XG59XG4iLCIvKipcbiAqIERldGVjdCBFbGVjdHJvbiByZW5kZXJlciBwcm9jZXNzLCB3aGljaCBpcyBub2RlLCBidXQgd2Ugc2hvdWxkXG4gKiB0cmVhdCBhcyBhIGJyb3dzZXIuXG4gKi9cblxuaWYgKHR5cGVvZiBwcm9jZXNzID09PSAndW5kZWZpbmVkJyB8fCBwcm9jZXNzLnR5cGUgPT09ICdyZW5kZXJlcicpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Jyb3dzZXIuanMnKTtcbn0gZWxzZSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9ub2RlLmpzJyk7XG59XG4iLCIvKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gKi9cblxudmFyIHR0eSA9IHJlcXVpcmUoJ3R0eScpO1xudmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsJyk7XG5cbi8qKlxuICogVGhpcyBpcyB0aGUgTm9kZS5qcyBpbXBsZW1lbnRhdGlvbiBvZiBgZGVidWcoKWAuXG4gKlxuICogRXhwb3NlIGBkZWJ1ZygpYCBhcyB0aGUgbW9kdWxlLlxuICovXG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZGVidWcnKTtcbmV4cG9ydHMuaW5pdCA9IGluaXQ7XG5leHBvcnRzLmxvZyA9IGxvZztcbmV4cG9ydHMuZm9ybWF0QXJncyA9IGZvcm1hdEFyZ3M7XG5leHBvcnRzLnNhdmUgPSBzYXZlO1xuZXhwb3J0cy5sb2FkID0gbG9hZDtcbmV4cG9ydHMudXNlQ29sb3JzID0gdXNlQ29sb3JzO1xuXG4vKipcbiAqIENvbG9ycy5cbiAqL1xuXG5leHBvcnRzLmNvbG9ycyA9IFsgNiwgMiwgMywgNCwgNSwgMSBdO1xuXG50cnkge1xuICB2YXIgc3VwcG9ydHNDb2xvciA9IHJlcXVpcmUoJ3N1cHBvcnRzLWNvbG9yJyk7XG4gIGlmIChzdXBwb3J0c0NvbG9yICYmIHN1cHBvcnRzQ29sb3IubGV2ZWwgPj0gMikge1xuICAgIGV4cG9ydHMuY29sb3JzID0gW1xuICAgICAgMjAsIDIxLCAyNiwgMjcsIDMyLCAzMywgMzgsIDM5LCA0MCwgNDEsIDQyLCA0MywgNDQsIDQ1LCA1NiwgNTcsIDYyLCA2MywgNjgsXG4gICAgICA2OSwgNzQsIDc1LCA3NiwgNzcsIDc4LCA3OSwgODAsIDgxLCA5MiwgOTMsIDk4LCA5OSwgMTEyLCAxMTMsIDEyOCwgMTI5LCAxMzQsXG4gICAgICAxMzUsIDE0OCwgMTQ5LCAxNjAsIDE2MSwgMTYyLCAxNjMsIDE2NCwgMTY1LCAxNjYsIDE2NywgMTY4LCAxNjksIDE3MCwgMTcxLFxuICAgICAgMTcyLCAxNzMsIDE3OCwgMTc5LCAxODQsIDE4NSwgMTk2LCAxOTcsIDE5OCwgMTk5LCAyMDAsIDIwMSwgMjAyLCAyMDMsIDIwNCxcbiAgICAgIDIwNSwgMjA2LCAyMDcsIDIwOCwgMjA5LCAyMTQsIDIxNSwgMjIwLCAyMjFcbiAgICBdO1xuICB9XG59IGNhdGNoIChlcnIpIHtcbiAgLy8gc3dhbGxvdyAtIHdlIG9ubHkgY2FyZSBpZiBgc3VwcG9ydHMtY29sb3JgIGlzIGF2YWlsYWJsZTsgaXQgZG9lc24ndCBoYXZlIHRvIGJlLlxufVxuXG4vKipcbiAqIEJ1aWxkIHVwIHRoZSBkZWZhdWx0IGBpbnNwZWN0T3B0c2Agb2JqZWN0IGZyb20gdGhlIGVudmlyb25tZW50IHZhcmlhYmxlcy5cbiAqXG4gKiAgICQgREVCVUdfQ09MT1JTPW5vIERFQlVHX0RFUFRIPTEwIERFQlVHX1NIT1dfSElEREVOPWVuYWJsZWQgbm9kZSBzY3JpcHQuanNcbiAqL1xuXG5leHBvcnRzLmluc3BlY3RPcHRzID0gT2JqZWN0LmtleXMocHJvY2Vzcy5lbnYpLmZpbHRlcihmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiAvXmRlYnVnXy9pLnRlc3Qoa2V5KTtcbn0pLnJlZHVjZShmdW5jdGlvbiAob2JqLCBrZXkpIHtcbiAgLy8gY2FtZWwtY2FzZVxuICB2YXIgcHJvcCA9IGtleVxuICAgIC5zdWJzdHJpbmcoNilcbiAgICAudG9Mb3dlckNhc2UoKVxuICAgIC5yZXBsYWNlKC9fKFthLXpdKS9nLCBmdW5jdGlvbiAoXywgaykgeyByZXR1cm4gay50b1VwcGVyQ2FzZSgpIH0pO1xuXG4gIC8vIGNvZXJjZSBzdHJpbmcgdmFsdWUgaW50byBKUyB2YWx1ZVxuICB2YXIgdmFsID0gcHJvY2Vzcy5lbnZba2V5XTtcbiAgaWYgKC9eKHllc3xvbnx0cnVlfGVuYWJsZWQpJC9pLnRlc3QodmFsKSkgdmFsID0gdHJ1ZTtcbiAgZWxzZSBpZiAoL14obm98b2ZmfGZhbHNlfGRpc2FibGVkKSQvaS50ZXN0KHZhbCkpIHZhbCA9IGZhbHNlO1xuICBlbHNlIGlmICh2YWwgPT09ICdudWxsJykgdmFsID0gbnVsbDtcbiAgZWxzZSB2YWwgPSBOdW1iZXIodmFsKTtcblxuICBvYmpbcHJvcF0gPSB2YWw7XG4gIHJldHVybiBvYmo7XG59LCB7fSk7XG5cbi8qKlxuICogSXMgc3Rkb3V0IGEgVFRZPyBDb2xvcmVkIG91dHB1dCBpcyBlbmFibGVkIHdoZW4gYHRydWVgLlxuICovXG5cbmZ1bmN0aW9uIHVzZUNvbG9ycygpIHtcbiAgcmV0dXJuICdjb2xvcnMnIGluIGV4cG9ydHMuaW5zcGVjdE9wdHNcbiAgICA/IEJvb2xlYW4oZXhwb3J0cy5pbnNwZWN0T3B0cy5jb2xvcnMpXG4gICAgOiB0dHkuaXNhdHR5KHByb2Nlc3Muc3RkZXJyLmZkKTtcbn1cblxuLyoqXG4gKiBNYXAgJW8gdG8gYHV0aWwuaW5zcGVjdCgpYCwgYWxsIG9uIGEgc2luZ2xlIGxpbmUuXG4gKi9cblxuZXhwb3J0cy5mb3JtYXR0ZXJzLm8gPSBmdW5jdGlvbih2KSB7XG4gIHRoaXMuaW5zcGVjdE9wdHMuY29sb3JzID0gdGhpcy51c2VDb2xvcnM7XG4gIHJldHVybiB1dGlsLmluc3BlY3QodiwgdGhpcy5pbnNwZWN0T3B0cylcbiAgICAuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihzdHIpIHtcbiAgICAgIHJldHVybiBzdHIudHJpbSgpXG4gICAgfSkuam9pbignICcpO1xufTtcblxuLyoqXG4gKiBNYXAgJW8gdG8gYHV0aWwuaW5zcGVjdCgpYCwgYWxsb3dpbmcgbXVsdGlwbGUgbGluZXMgaWYgbmVlZGVkLlxuICovXG5cbmV4cG9ydHMuZm9ybWF0dGVycy5PID0gZnVuY3Rpb24odikge1xuICB0aGlzLmluc3BlY3RPcHRzLmNvbG9ycyA9IHRoaXMudXNlQ29sb3JzO1xuICByZXR1cm4gdXRpbC5pbnNwZWN0KHYsIHRoaXMuaW5zcGVjdE9wdHMpO1xufTtcblxuLyoqXG4gKiBBZGRzIEFOU0kgY29sb3IgZXNjYXBlIGNvZGVzIGlmIGVuYWJsZWQuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBmb3JtYXRBcmdzKGFyZ3MpIHtcbiAgdmFyIG5hbWUgPSB0aGlzLm5hbWVzcGFjZTtcbiAgdmFyIHVzZUNvbG9ycyA9IHRoaXMudXNlQ29sb3JzO1xuXG4gIGlmICh1c2VDb2xvcnMpIHtcbiAgICB2YXIgYyA9IHRoaXMuY29sb3I7XG4gICAgdmFyIGNvbG9yQ29kZSA9ICdcXHUwMDFiWzMnICsgKGMgPCA4ID8gYyA6ICc4OzU7JyArIGMpO1xuICAgIHZhciBwcmVmaXggPSAnICAnICsgY29sb3JDb2RlICsgJzsxbScgKyBuYW1lICsgJyAnICsgJ1xcdTAwMWJbMG0nO1xuXG4gICAgYXJnc1swXSA9IHByZWZpeCArIGFyZ3NbMF0uc3BsaXQoJ1xcbicpLmpvaW4oJ1xcbicgKyBwcmVmaXgpO1xuICAgIGFyZ3MucHVzaChjb2xvckNvZGUgKyAnbSsnICsgZXhwb3J0cy5odW1hbml6ZSh0aGlzLmRpZmYpICsgJ1xcdTAwMWJbMG0nKTtcbiAgfSBlbHNlIHtcbiAgICBhcmdzWzBdID0gZ2V0RGF0ZSgpICsgbmFtZSArICcgJyArIGFyZ3NbMF07XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0RGF0ZSgpIHtcbiAgaWYgKGV4cG9ydHMuaW5zcGVjdE9wdHMuaGlkZURhdGUpIHtcbiAgICByZXR1cm4gJyc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSArICcgJztcbiAgfVxufVxuXG4vKipcbiAqIEludm9rZXMgYHV0aWwuZm9ybWF0KClgIHdpdGggdGhlIHNwZWNpZmllZCBhcmd1bWVudHMgYW5kIHdyaXRlcyB0byBzdGRlcnIuXG4gKi9cblxuZnVuY3Rpb24gbG9nKCkge1xuICByZXR1cm4gcHJvY2Vzcy5zdGRlcnIud3JpdGUodXRpbC5mb3JtYXQuYXBwbHkodXRpbCwgYXJndW1lbnRzKSArICdcXG4nKTtcbn1cblxuLyoqXG4gKiBTYXZlIGBuYW1lc3BhY2VzYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZXNwYWNlc1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gc2F2ZShuYW1lc3BhY2VzKSB7XG4gIGlmIChudWxsID09IG5hbWVzcGFjZXMpIHtcbiAgICAvLyBJZiB5b3Ugc2V0IGEgcHJvY2Vzcy5lbnYgZmllbGQgdG8gbnVsbCBvciB1bmRlZmluZWQsIGl0IGdldHMgY2FzdCB0byB0aGVcbiAgICAvLyBzdHJpbmcgJ251bGwnIG9yICd1bmRlZmluZWQnLiBKdXN0IGRlbGV0ZSBpbnN0ZWFkLlxuICAgIGRlbGV0ZSBwcm9jZXNzLmVudi5ERUJVRztcbiAgfSBlbHNlIHtcbiAgICBwcm9jZXNzLmVudi5ERUJVRyA9IG5hbWVzcGFjZXM7XG4gIH1cbn1cblxuLyoqXG4gKiBMb2FkIGBuYW1lc3BhY2VzYC5cbiAqXG4gKiBAcmV0dXJuIHtTdHJpbmd9IHJldHVybnMgdGhlIHByZXZpb3VzbHkgcGVyc2lzdGVkIGRlYnVnIG1vZGVzXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBsb2FkKCkge1xuICByZXR1cm4gcHJvY2Vzcy5lbnYuREVCVUc7XG59XG5cbi8qKlxuICogSW5pdCBsb2dpYyBmb3IgYGRlYnVnYCBpbnN0YW5jZXMuXG4gKlxuICogQ3JlYXRlIGEgbmV3IGBpbnNwZWN0T3B0c2Agb2JqZWN0IGluIGNhc2UgYHVzZUNvbG9yc2AgaXMgc2V0XG4gKiBkaWZmZXJlbnRseSBmb3IgYSBwYXJ0aWN1bGFyIGBkZWJ1Z2AgaW5zdGFuY2UuXG4gKi9cblxuZnVuY3Rpb24gaW5pdCAoZGVidWcpIHtcbiAgZGVidWcuaW5zcGVjdE9wdHMgPSB7fTtcblxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGV4cG9ydHMuaW5zcGVjdE9wdHMpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICBkZWJ1Zy5pbnNwZWN0T3B0c1trZXlzW2ldXSA9IGV4cG9ydHMuaW5zcGVjdE9wdHNba2V5c1tpXV07XG4gIH1cbn1cblxuLyoqXG4gKiBFbmFibGUgbmFtZXNwYWNlcyBsaXN0ZWQgaW4gYHByb2Nlc3MuZW52LkRFQlVHYCBpbml0aWFsbHkuXG4gKi9cblxuZXhwb3J0cy5lbmFibGUobG9hZCgpKTtcbiIsIid1c2Ugc3RyaWN0Jztcbm1vZHVsZS5leHBvcnRzID0gKGZsYWcsIGFyZ3YpID0+IHtcblx0YXJndiA9IGFyZ3YgfHwgcHJvY2Vzcy5hcmd2O1xuXHRjb25zdCBwcmVmaXggPSBmbGFnLnN0YXJ0c1dpdGgoJy0nKSA/ICcnIDogKGZsYWcubGVuZ3RoID09PSAxID8gJy0nIDogJy0tJyk7XG5cdGNvbnN0IHBvcyA9IGFyZ3YuaW5kZXhPZihwcmVmaXggKyBmbGFnKTtcblx0Y29uc3QgdGVybWluYXRvclBvcyA9IGFyZ3YuaW5kZXhPZignLS0nKTtcblx0cmV0dXJuIHBvcyAhPT0gLTEgJiYgKHRlcm1pbmF0b3JQb3MgPT09IC0xID8gdHJ1ZSA6IHBvcyA8IHRlcm1pbmF0b3JQb3MpO1xufTtcbiIsInRyeSB7XG4gIHZhciB1dGlsID0gcmVxdWlyZSgndXRpbCcpO1xuICBpZiAodHlwZW9mIHV0aWwuaW5oZXJpdHMgIT09ICdmdW5jdGlvbicpIHRocm93ICcnO1xuICBtb2R1bGUuZXhwb3J0cyA9IHV0aWwuaW5oZXJpdHM7XG59IGNhdGNoIChlKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9pbmhlcml0c19icm93c2VyLmpzJyk7XG59XG4iLCJpZiAodHlwZW9mIE9iamVjdC5jcmVhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgLy8gaW1wbGVtZW50YXRpb24gZnJvbSBzdGFuZGFyZCBub2RlLmpzICd1dGlsJyBtb2R1bGVcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLCB7XG4gICAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgICB2YWx1ZTogY3RvcixcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn0gZWxzZSB7XG4gIC8vIG9sZCBzY2hvb2wgc2hpbSBmb3Igb2xkIGJyb3dzZXJzXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICB2YXIgVGVtcEN0b3IgPSBmdW5jdGlvbiAoKSB7fVxuICAgIFRlbXBDdG9yLnByb3RvdHlwZSA9IHN1cGVyQ3Rvci5wcm90b3R5cGVcbiAgICBjdG9yLnByb3RvdHlwZSA9IG5ldyBUZW1wQ3RvcigpXG4gICAgY3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjdG9yXG4gIH1cbn1cbiIsIi8qIVxuICogRGV0ZXJtaW5lIGlmIGFuIG9iamVjdCBpcyBhIEJ1ZmZlclxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxodHRwczovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cblxuLy8gVGhlIF9pc0J1ZmZlciBjaGVjayBpcyBmb3IgU2FmYXJpIDUtNyBzdXBwb3J0LCBiZWNhdXNlIGl0J3MgbWlzc2luZ1xuLy8gT2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvci4gUmVtb3ZlIHRoaXMgZXZlbnR1YWxseVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBvYmogIT0gbnVsbCAmJiAoaXNCdWZmZXIob2JqKSB8fCBpc1Nsb3dCdWZmZXIob2JqKSB8fCAhIW9iai5faXNCdWZmZXIpXG59XG5cbmZ1bmN0aW9uIGlzQnVmZmVyIChvYmopIHtcbiAgcmV0dXJuICEhb2JqLmNvbnN0cnVjdG9yICYmIHR5cGVvZiBvYmouY29uc3RydWN0b3IuaXNCdWZmZXIgPT09ICdmdW5jdGlvbicgJiYgb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyKG9iailcbn1cblxuLy8gRm9yIE5vZGUgdjAuMTAgc3VwcG9ydC4gUmVtb3ZlIHRoaXMgZXZlbnR1YWxseS5cbmZ1bmN0aW9uIGlzU2xvd0J1ZmZlciAob2JqKSB7XG4gIHJldHVybiB0eXBlb2Ygb2JqLnJlYWRGbG9hdExFID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBvYmouc2xpY2UgPT09ICdmdW5jdGlvbicgJiYgaXNCdWZmZXIob2JqLnNsaWNlKDAsIDApKVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBhc3NlcnQ7XG5cbmZ1bmN0aW9uIGFzc2VydCh2YWwsIG1zZykge1xuICBpZiAoIXZhbClcbiAgICB0aHJvdyBuZXcgRXJyb3IobXNnIHx8ICdBc3NlcnRpb24gZmFpbGVkJyk7XG59XG5cbmFzc2VydC5lcXVhbCA9IGZ1bmN0aW9uIGFzc2VydEVxdWFsKGwsIHIsIG1zZykge1xuICBpZiAobCAhPSByKVxuICAgIHRocm93IG5ldyBFcnJvcihtc2cgfHwgKCdBc3NlcnRpb24gZmFpbGVkOiAnICsgbCArICcgIT0gJyArIHIpKTtcbn07XG4iLCIvKipcbiAqIEhlbHBlcnMuXG4gKi9cblxudmFyIHMgPSAxMDAwO1xudmFyIG0gPSBzICogNjA7XG52YXIgaCA9IG0gKiA2MDtcbnZhciBkID0gaCAqIDI0O1xudmFyIHkgPSBkICogMzY1LjI1O1xuXG4vKipcbiAqIFBhcnNlIG9yIGZvcm1hdCB0aGUgZ2l2ZW4gYHZhbGAuXG4gKlxuICogT3B0aW9uczpcbiAqXG4gKiAgLSBgbG9uZ2AgdmVyYm9zZSBmb3JtYXR0aW5nIFtmYWxzZV1cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ9IHZhbFxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICogQHRocm93cyB7RXJyb3J9IHRocm93IGFuIGVycm9yIGlmIHZhbCBpcyBub3QgYSBub24tZW1wdHkgc3RyaW5nIG9yIGEgbnVtYmVyXG4gKiBAcmV0dXJuIHtTdHJpbmd8TnVtYmVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHZhbCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsO1xuICBpZiAodHlwZSA9PT0gJ3N0cmluZycgJiYgdmFsLmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4gcGFyc2UodmFsKTtcbiAgfSBlbHNlIGlmICh0eXBlID09PSAnbnVtYmVyJyAmJiBpc05hTih2YWwpID09PSBmYWxzZSkge1xuICAgIHJldHVybiBvcHRpb25zLmxvbmcgPyBmbXRMb25nKHZhbCkgOiBmbXRTaG9ydCh2YWwpO1xuICB9XG4gIHRocm93IG5ldyBFcnJvcihcbiAgICAndmFsIGlzIG5vdCBhIG5vbi1lbXB0eSBzdHJpbmcgb3IgYSB2YWxpZCBudW1iZXIuIHZhbD0nICtcbiAgICAgIEpTT04uc3RyaW5naWZ5KHZhbClcbiAgKTtcbn07XG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIGBzdHJgIGFuZCByZXR1cm4gbWlsbGlzZWNvbmRzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHBhcnNlKHN0cikge1xuICBzdHIgPSBTdHJpbmcoc3RyKTtcbiAgaWYgKHN0ci5sZW5ndGggPiAxMDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIG1hdGNoID0gL14oKD86XFxkKyk/XFwuP1xcZCspICoobWlsbGlzZWNvbmRzP3xtc2Vjcz98bXN8c2Vjb25kcz98c2Vjcz98c3xtaW51dGVzP3xtaW5zP3xtfGhvdXJzP3xocnM/fGh8ZGF5cz98ZHx5ZWFycz98eXJzP3x5KT8kL2kuZXhlYyhcbiAgICBzdHJcbiAgKTtcbiAgaWYgKCFtYXRjaCkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgbiA9IHBhcnNlRmxvYXQobWF0Y2hbMV0pO1xuICB2YXIgdHlwZSA9IChtYXRjaFsyXSB8fCAnbXMnKS50b0xvd2VyQ2FzZSgpO1xuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlICd5ZWFycyc6XG4gICAgY2FzZSAneWVhcic6XG4gICAgY2FzZSAneXJzJzpcbiAgICBjYXNlICd5cic6XG4gICAgY2FzZSAneSc6XG4gICAgICByZXR1cm4gbiAqIHk7XG4gICAgY2FzZSAnZGF5cyc6XG4gICAgY2FzZSAnZGF5JzpcbiAgICBjYXNlICdkJzpcbiAgICAgIHJldHVybiBuICogZDtcbiAgICBjYXNlICdob3Vycyc6XG4gICAgY2FzZSAnaG91cic6XG4gICAgY2FzZSAnaHJzJzpcbiAgICBjYXNlICdocic6XG4gICAgY2FzZSAnaCc6XG4gICAgICByZXR1cm4gbiAqIGg7XG4gICAgY2FzZSAnbWludXRlcyc6XG4gICAgY2FzZSAnbWludXRlJzpcbiAgICBjYXNlICdtaW5zJzpcbiAgICBjYXNlICdtaW4nOlxuICAgIGNhc2UgJ20nOlxuICAgICAgcmV0dXJuIG4gKiBtO1xuICAgIGNhc2UgJ3NlY29uZHMnOlxuICAgIGNhc2UgJ3NlY29uZCc6XG4gICAgY2FzZSAnc2Vjcyc6XG4gICAgY2FzZSAnc2VjJzpcbiAgICBjYXNlICdzJzpcbiAgICAgIHJldHVybiBuICogcztcbiAgICBjYXNlICdtaWxsaXNlY29uZHMnOlxuICAgIGNhc2UgJ21pbGxpc2Vjb25kJzpcbiAgICBjYXNlICdtc2Vjcyc6XG4gICAgY2FzZSAnbXNlYyc6XG4gICAgY2FzZSAnbXMnOlxuICAgICAgcmV0dXJuIG47XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn1cblxuLyoqXG4gKiBTaG9ydCBmb3JtYXQgZm9yIGBtc2AuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IG1zXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBmbXRTaG9ydChtcykge1xuICBpZiAobXMgPj0gZCkge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gZCkgKyAnZCc7XG4gIH1cbiAgaWYgKG1zID49IGgpIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChtcyAvIGgpICsgJ2gnO1xuICB9XG4gIGlmIChtcyA+PSBtKSB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQobXMgLyBtKSArICdtJztcbiAgfVxuICBpZiAobXMgPj0gcykge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gcykgKyAncyc7XG4gIH1cbiAgcmV0dXJuIG1zICsgJ21zJztcbn1cblxuLyoqXG4gKiBMb25nIGZvcm1hdCBmb3IgYG1zYC5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gbXNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGZtdExvbmcobXMpIHtcbiAgcmV0dXJuIHBsdXJhbChtcywgZCwgJ2RheScpIHx8XG4gICAgcGx1cmFsKG1zLCBoLCAnaG91cicpIHx8XG4gICAgcGx1cmFsKG1zLCBtLCAnbWludXRlJykgfHxcbiAgICBwbHVyYWwobXMsIHMsICdzZWNvbmQnKSB8fFxuICAgIG1zICsgJyBtcyc7XG59XG5cbi8qKlxuICogUGx1cmFsaXphdGlvbiBoZWxwZXIuXG4gKi9cblxuZnVuY3Rpb24gcGx1cmFsKG1zLCBuLCBuYW1lKSB7XG4gIGlmIChtcyA8IG4pIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKG1zIDwgbiAqIDEuNSkge1xuICAgIHJldHVybiBNYXRoLmZsb29yKG1zIC8gbikgKyAnICcgKyBuYW1lO1xuICB9XG4gIHJldHVybiBNYXRoLmNlaWwobXMgLyBuKSArICcgJyArIG5hbWUgKyAncyc7XG59XG4iLCJ2YXIgYXNuID0gcmVxdWlyZSgnYXNuMS5qcycpXG52YXIgY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJylcbnZhciBCTiA9IGFzbi5iaWdudW1cblxudmFyIHplcm8gPSBuZXcgQk4oMClcbnZhciBvbmUgPSBuZXcgQk4oMSlcbnZhciB0d28gPSBuZXcgQk4oMilcblxuZnVuY3Rpb24gcmFuZChsb3csIGhpZ2gpIHtcbiAgZG8ge1xuICAgIHZhciBiID0gbmV3IEJOKGNyeXB0by5yYW5kb21CeXRlcyhoaWdoLmJ5dGVMZW5ndGgoKSkpXG4gIH0gd2hpbGUoYi5jbXAobG93KSA8PSAwIHx8IGIuY21wKGhpZ2gpID49IDApXG4gIHJldHVybiBiXG59XG5cbmZ1bmN0aW9uIG9kZChuKSB7XG4gIGlmIChuLmNtcCh6ZXJvKSA9PT0gMCkgeyByZXR1cm4gemVybyB9XG4gIHZhciByID0gblxuICB3aGlsZSAoci5pc0V2ZW4oKSkge1xuICAgIHIgPSByLmRpdih0d28pXG4gIH1cbiAgcmV0dXJuIHJcbn1cblxuZnVuY3Rpb24gcm9vdE9uZSh4LCByLCBuKSB7XG4gIHZhciBpID0geC50b1JlZChCTi5yZWQobikpLnJlZFBvdyhyKS5mcm9tUmVkKClcbiAgdmFyIG8gPSB6ZXJvXG4gIHdoaWxlIChpLmNtcChvbmUpICE9PSAwKSB7XG4gICAgbyA9IGlcbiAgICBpID0gaS5tdWwoaSkubW9kKG4pXG4gIH1cbiAgaWYgKG8uY21wKG4uc3ViKG9uZSkpID09PSAwKSB7XG4gICAgcmV0dXJuIHplcm9cbiAgfVxuICByZXR1cm4gb1xufVxuXG5mdW5jdGlvbiBmYWN0b3IoZSwgZCwgbikge1xuICB2YXIgayA9IGUubXVsKGQpLnN1YihvbmUpXG4gIHZhciByID0gb2RkKGspXG4gIGRvIHtcbiAgICB2YXIgeSA9IHJvb3RPbmUocmFuZCh0d28sIG4pLCByLCBuKVxuICB9IHdoaWxlICh5LmNtcCh6ZXJvKSA9PT0gMClcblxuICB2YXIgcCA9IHkuc3ViKG9uZSkuZ2NkKG4pXG4gIHJldHVybiB7XG4gICAgcDogcCxcbiAgICBxOiBuLmRpdihwKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZmFjdG9yXG4iLCJ2YXIgYXNuID0gcmVxdWlyZSgnYXNuMS5qcycpXG52YXIgZmFjdG9yID0gcmVxdWlyZSgnLi9mYWN0b3InKVxudmFyIG9uZSA9IG5ldyBhc24uYmlnbnVtKDEpXG5cbmZ1bmN0aW9uIHVybGl6ZShiYXNlNjQpIHtcbiAgcmV0dXJuIGJhc2U2NC5yZXBsYWNlKC9cXCsvZywgJy0nKVxuICAgIC5yZXBsYWNlKC9cXC8vZywgJ18nKVxuICAgIC5yZXBsYWNlKC89L2csICcnKVxufVxuXG5mdW5jdGlvbiBoZXgyYjY0dXJsKHN0cikge1xuICByZXR1cm4gdXJsaXplKEJ1ZmZlcihzdHIsICdoZXgnKS50b1N0cmluZygnYmFzZTY0JykpXG59XG5cbmZ1bmN0aW9uIGZyb21QRU0oZGF0YSkge1xuICB2YXIgdGV4dCA9IGRhdGEudG9TdHJpbmcoKS5zcGxpdCgvKFxcclxcbnxcXHJ8XFxuKSsvZyk7XG4gIHRleHQgPSB0ZXh0LmZpbHRlcihmdW5jdGlvbihsaW5lKSB7XG4gICAgcmV0dXJuIGxpbmUudHJpbSgpLmxlbmd0aCAhPT0gMDtcbiAgfSk7XG4gIHRleHQgPSB0ZXh0LnNsaWNlKDEsIC0xKS5qb2luKCcnKTtcbiAgcmV0dXJuIG5ldyBCdWZmZXIodGV4dC5yZXBsYWNlKC9bXlxcd1xcZFxcK1xcLz1dKy9nLCAnJyksICdiYXNlNjQnKTtcbn1cblxudmFyIFJTQVB1YmxpY0tleSA9IGFzbi5kZWZpbmUoJ1JTQVB1YmxpY0tleScsIGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5zZXEoKS5vYmooXG4gICAgdGhpcy5rZXkoJ24nKS5pbnQoKSxcbiAgICB0aGlzLmtleSgnZScpLmludCgpXG4gIClcbn0pXG5cbnZhciBBbGdvcml0aG1JZGVudGlmaWVyID0gYXNuLmRlZmluZSgnQWxnb3JpdGhtSWRlbnRpZmllcicsIGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5zZXEoKS5vYmooXG4gICAgdGhpcy5rZXkoJ2FsZ29yaXRobScpLm9iamlkKCksXG4gICAgdGhpcy5rZXkoJ3BhcmFtZXRlcnMnKS5vcHRpb25hbCgpLmFueSgpXG4gIClcbn0pXG5cbnZhciBQdWJsaWNLZXlJbmZvID0gYXNuLmRlZmluZSgnUHVibGljS2V5SW5mbycsIGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5zZXEoKS5vYmooXG4gICAgdGhpcy5rZXkoJ2FsZ29yaXRobScpLnVzZShBbGdvcml0aG1JZGVudGlmaWVyKSxcbiAgICB0aGlzLmtleSgncHVibGljS2V5JykuYml0c3RyKClcbiAgKVxufSlcblxudmFyIFZlcnNpb24gPSBhc24uZGVmaW5lKCdWZXJzaW9uJywgZnVuY3Rpb24gKCkge1xuICB0aGlzLmludCh7XG4gICAgMDogJ3R3by1wcmltZScsXG4gICAgMTogJ211bHRpJ1xuICB9KVxufSlcblxudmFyIE90aGVyUHJpbWVJbmZvcyA9IGFzbi5kZWZpbmUoJ090aGVyUHJpbWVJbmZvcycsIGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5zZXEoKS5vYmooXG4gICAgdGhpcy5rZXkoJ3JpJykuaW50KCksXG4gICAgdGhpcy5rZXkoJ2RpJykuaW50KCksXG4gICAgdGhpcy5rZXkoJ3RpJykuaW50KClcbiAgKVxufSlcblxudmFyIFJTQVByaXZhdGVLZXkgPSBhc24uZGVmaW5lKCdSU0FQcml2YXRlS2V5JywgZnVuY3Rpb24gKCkge1xuICB0aGlzLnNlcSgpLm9iaihcbiAgICB0aGlzLmtleSgndmVyc2lvbicpLnVzZShWZXJzaW9uKSxcbiAgICB0aGlzLmtleSgnbicpLmludCgpLFxuICAgIHRoaXMua2V5KCdlJykuaW50KCksXG4gICAgdGhpcy5rZXkoJ2QnKS5pbnQoKSxcbiAgICB0aGlzLmtleSgncCcpLmludCgpLFxuICAgIHRoaXMua2V5KCdxJykuaW50KCksXG4gICAgdGhpcy5rZXkoJ2RwJykuaW50KCksXG4gICAgdGhpcy5rZXkoJ2RxJykuaW50KCksXG4gICAgdGhpcy5rZXkoJ3FpJykuaW50KCksXG4gICAgdGhpcy5rZXkoJ290aGVyJykub3B0aW9uYWwoKS51c2UoT3RoZXJQcmltZUluZm9zKVxuICApXG59KVxuXG52YXIgUHJpdmF0ZUtleUluZm8gPSBhc24uZGVmaW5lKCdQcml2YXRlS2V5SW5mbycsIGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5zZXEoKS5vYmooXG4gICAgdGhpcy5rZXkoJ3ZlcnNpb24nKS51c2UoVmVyc2lvbiksXG4gICAgdGhpcy5rZXkoJ2FsZ29yaXRobScpLnVzZShBbGdvcml0aG1JZGVudGlmaWVyKSxcbiAgICB0aGlzLmtleSgncHJpdmF0ZUtleScpLmJpdHN0cigpXG4gIClcbn0pXG5cbmNvbnN0IFJTQV9PSUQgPSAnMS4yLjg0MC4xMTM1NDkuMS4xLjEnXG5cbmZ1bmN0aW9uIGFkZEV4dHJhcyhvYmosIGV4dHJhcykge1xuICBleHRyYXMgPSBleHRyYXMgfHwge31cbiAgT2JqZWN0LmtleXMoZXh0cmFzKS5mb3JFYWNoKFxuICAgIGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIG9ialtrZXldID0gZXh0cmFzW2tleV1cbiAgICB9XG4gIClcbiAgcmV0dXJuIG9ialxufVxuXG5mdW5jdGlvbiBwYWQoaGV4KSB7XG4gIHJldHVybiAoaGV4Lmxlbmd0aCAlIDIgPT09IDEpID8gJzAnICsgaGV4IDogaGV4XG59XG5cbmZ1bmN0aW9uIGRlY29kZVJzYVB1YmxpYyhidWZmZXIsIGV4dHJhcykge1xuICB2YXIga2V5ID0gUlNBUHVibGljS2V5LmRlY29kZShidWZmZXIsICdkZXInKVxuICB2YXIgZSA9IHBhZChrZXkuZS50b1N0cmluZygxNikpXG4gIHZhciBqd2sgPSB7XG4gICAga3R5OiAnUlNBJyxcbiAgICBuOiBibjJiYXNlNjR1cmwoa2V5Lm4pLFxuICAgIGU6IGhleDJiNjR1cmwoZSlcbiAgfVxuICByZXR1cm4gYWRkRXh0cmFzKGp3aywgZXh0cmFzKVxufVxuXG5mdW5jdGlvbiBkZWNvZGVSc2FQcml2YXRlKGJ1ZmZlciwgZXh0cmFzKSB7XG4gIHZhciBrZXkgPSBSU0FQcml2YXRlS2V5LmRlY29kZShidWZmZXIsICdkZXInKVxuICB2YXIgZSA9IHBhZChrZXkuZS50b1N0cmluZygxNikpXG4gIHZhciBqd2sgPSB7XG4gICAga3R5OiAnUlNBJyxcbiAgICBuOiBibjJiYXNlNjR1cmwoa2V5Lm4pLFxuICAgIGU6IGhleDJiNjR1cmwoZSksXG4gICAgZDogYm4yYmFzZTY0dXJsKGtleS5kKSxcbiAgICBwOiBibjJiYXNlNjR1cmwoa2V5LnApLFxuICAgIHE6IGJuMmJhc2U2NHVybChrZXkucSksXG4gICAgZHA6IGJuMmJhc2U2NHVybChrZXkuZHApLFxuICAgIGRxOiBibjJiYXNlNjR1cmwoa2V5LmRxKSxcbiAgICBxaTogYm4yYmFzZTY0dXJsKGtleS5xaSlcbiAgfVxuICByZXR1cm4gYWRkRXh0cmFzKGp3aywgZXh0cmFzKVxufVxuXG5mdW5jdGlvbiBkZWNvZGVQdWJsaWMoYnVmZmVyLCBleHRyYXMpIHtcbiAgdmFyIGluZm8gPSBQdWJsaWNLZXlJbmZvLmRlY29kZShidWZmZXIsICdkZXInKVxuICByZXR1cm4gZGVjb2RlUnNhUHVibGljKGluZm8ucHVibGljS2V5LmRhdGEsIGV4dHJhcylcbn1cblxuZnVuY3Rpb24gZGVjb2RlUHJpdmF0ZShidWZmZXIsIGV4dHJhcykge1xuICB2YXIgaW5mbyA9IFByaXZhdGVLZXlJbmZvLmRlY29kZShidWZmZXIsICdkZXInKVxuICByZXR1cm4gZGVjb2RlUnNhUHJpdmF0ZShpbmZvLnByaXZhdGVLZXkuZGF0YSwgZXh0cmFzKVxufVxuXG5mdW5jdGlvbiBnZXREZWNvZGVyKGhlYWRlcikge1xuICB2YXIgbWF0Y2ggPSAvXi0tLS0tQkVHSU4gKFJTQSApPyhQVUJMSUN8UFJJVkFURSkgS0VZLS0tLS0kLy5leGVjKGhlYWRlcilcbiAgaWYgKCFtYXRjaCkgeyByZXR1cm4gbnVsbCB9XG4gIHZhciBpc1JTQSA9ICEhKG1hdGNoWzFdKVxuICB2YXIgaXNQcml2YXRlID0gKG1hdGNoWzJdID09PSAnUFJJVkFURScpXG4gIGlmIChpc1ByaXZhdGUpIHtcbiAgICByZXR1cm4gaXNSU0EgPyBkZWNvZGVSc2FQcml2YXRlIDogZGVjb2RlUHJpdmF0ZVxuICB9XG4gIGVsc2Uge1xuICAgIHJldHVybiBpc1JTQSA/IGRlY29kZVJzYVB1YmxpYyA6IGRlY29kZVB1YmxpY1xuICB9XG59XG5cbmZ1bmN0aW9uIHBlbTJqd2socGVtLCBleHRyYXMpIHtcbiAgdmFyIHRleHQgPSBwZW0udG9TdHJpbmcoKS5zcGxpdCgvKFxcclxcbnxcXHJ8XFxuKSsvZylcbiAgdGV4dCA9IHRleHQuZmlsdGVyKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICByZXR1cm4gbGluZS50cmltKCkubGVuZ3RoICE9PSAwXG4gIH0pO1xuICB2YXIgZGVjb2RlciA9IGdldERlY29kZXIodGV4dFswXSlcblxuICB0ZXh0ID0gdGV4dC5zbGljZSgxLCAtMSkuam9pbignJylcbiAgcmV0dXJuIGRlY29kZXIobmV3IEJ1ZmZlcih0ZXh0LnJlcGxhY2UoL1teXFx3XFxkXFwrXFwvPV0rL2csICcnKSwgJ2Jhc2U2NCcpLCBleHRyYXMpXG59XG5cbmZ1bmN0aW9uIHJlY29tcHV0ZVByaW1lcyhqd2spIHtcbiAgdmFyIHBxID0gZmFjdG9yKGp3ay5lLCBqd2suZCwgandrLm4pXG4gIHZhciBwID0gcHEucFxuICB2YXIgcSA9IHBxLnFcbiAgdmFyIGRwID0gandrLmQubW9kKHAuc3ViKG9uZSkpXG4gIHZhciBkcSA9IGp3ay5kLm1vZChxLnN1YihvbmUpKVxuICB2YXIgcWkgPSBxLmludm0ocClcbiAgcmV0dXJuIHtcbiAgICBuOiBqd2subixcbiAgICBlOiBqd2suZSxcbiAgICBkOiBqd2suZCxcbiAgICBwOiBwLFxuICAgIHE6IHEsXG4gICAgZHA6IGRwLFxuICAgIGRxOiBkcSxcbiAgICBxaTogcWlcbiAgfVxufVxuXG5mdW5jdGlvbiBwYXJzZShqd2spIHtcbiAgcmV0dXJuIHtcbiAgICBuOiBzdHJpbmcyYm4oandrLm4pLFxuICAgIGU6IHN0cmluZzJibihqd2suZSksXG4gICAgZDogandrLmQgJiYgc3RyaW5nMmJuKGp3ay5kKSxcbiAgICBwOiBqd2sucCAmJiBzdHJpbmcyYm4oandrLnApLFxuICAgIHE6IGp3ay5xICYmIHN0cmluZzJibihqd2sucSksXG4gICAgZHA6IGp3ay5kcCAmJiBzdHJpbmcyYm4oandrLmRwKSxcbiAgICBkcTogandrLmRxICYmIHN0cmluZzJibihqd2suZHEpLFxuICAgIHFpOiBqd2sucWkgJiYgc3RyaW5nMmJuKGp3ay5xaSlcbiAgfVxufVxuXG5mdW5jdGlvbiBqd2sycGVtKGpzb24pIHtcbiAgdmFyIGp3ayA9IHBhcnNlKGpzb24pXG4gIHZhciBpc1ByaXZhdGUgPSAhIShqd2suZClcbiAgdmFyIHQgPSBpc1ByaXZhdGUgPyAnUFJJVkFURScgOiAnUFVCTElDJ1xuICB2YXIgaGVhZGVyID0gJy0tLS0tQkVHSU4gUlNBICcgKyB0ICsgJyBLRVktLS0tLVxcbidcbiAgdmFyIGZvb3RlciA9ICdcXG4tLS0tLUVORCBSU0EgJyArIHQgKyAnIEtFWS0tLS0tXFxuJ1xuICB2YXIgZGF0YSA9IEJ1ZmZlcigwKVxuICBpZiAoaXNQcml2YXRlKSB7XG4gICAgaWYgKCFqd2sucCkge1xuICAgICAgandrID0gcmVjb21wdXRlUHJpbWVzKGp3aylcbiAgICB9XG4gICAgandrLnZlcnNpb24gPSAndHdvLXByaW1lJ1xuICAgIGRhdGEgPSBSU0FQcml2YXRlS2V5LmVuY29kZShqd2ssICdkZXInKVxuICB9XG4gIGVsc2Uge1xuICAgIGRhdGEgPSBSU0FQdWJsaWNLZXkuZW5jb2RlKGp3aywgJ2RlcicpXG4gIH1cbiAgdmFyIGJvZHkgPSBkYXRhLnRvU3RyaW5nKCdiYXNlNjQnKS5tYXRjaCgvLnsxLDY0fS9nKS5qb2luKCdcXG4nKVxuICByZXR1cm4gaGVhZGVyICsgYm9keSArIGZvb3RlclxufVxuXG5mdW5jdGlvbiBibjJiYXNlNjR1cmwoYm4pIHtcbiAgcmV0dXJuIGhleDJiNjR1cmwocGFkKGJuLnRvU3RyaW5nKDE2KSkpXG59XG5cbmZ1bmN0aW9uIGJhc2U2NHVybDJibihzdHIpIHtcbiAgcmV0dXJuIG5ldyBhc24uYmlnbnVtKEJ1ZmZlcihzdHIsICdiYXNlNjQnKSlcbn1cblxuZnVuY3Rpb24gc3RyaW5nMmJuKHN0cikge1xuICBpZiAoL15bMC05XSskLy50ZXN0KHN0cikpIHtcbiAgICByZXR1cm4gbmV3IGFzbi5iaWdudW0oc3RyLCAxMClcbiAgfVxuICByZXR1cm4gYmFzZTY0dXJsMmJuKHN0cilcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHBlbTJqd2s6IHBlbTJqd2ssXG4gIGp3azJwZW06IGp3azJwZW0sXG4gIEJOOiBhc24uYmlnbnVtXG59XG4iLCJ2YXIgYXNuMSA9IGV4cG9ydHM7XG5cbmFzbjEuYmlnbnVtID0gcmVxdWlyZSgnYm4uanMnKTtcblxuYXNuMS5kZWZpbmUgPSByZXF1aXJlKCcuL2FzbjEvYXBpJykuZGVmaW5lO1xuYXNuMS5iYXNlID0gcmVxdWlyZSgnLi9hc24xL2Jhc2UnKTtcbmFzbjEuY29uc3RhbnRzID0gcmVxdWlyZSgnLi9hc24xL2NvbnN0YW50cycpO1xuYXNuMS5kZWNvZGVycyA9IHJlcXVpcmUoJy4vYXNuMS9kZWNvZGVycycpO1xuYXNuMS5lbmNvZGVycyA9IHJlcXVpcmUoJy4vYXNuMS9lbmNvZGVycycpO1xuIiwidmFyIGFzbjEgPSByZXF1aXJlKCcuLi9hc24xJyk7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xudmFyIHZtID0gcmVxdWlyZSgndm0nKTtcblxudmFyIGFwaSA9IGV4cG9ydHM7XG5cbmFwaS5kZWZpbmUgPSBmdW5jdGlvbiBkZWZpbmUobmFtZSwgYm9keSkge1xuICByZXR1cm4gbmV3IEVudGl0eShuYW1lLCBib2R5KTtcbn07XG5cbmZ1bmN0aW9uIEVudGl0eShuYW1lLCBib2R5KSB7XG4gIHRoaXMubmFtZSA9IG5hbWU7XG4gIHRoaXMuYm9keSA9IGJvZHk7XG5cbiAgdGhpcy5kZWNvZGVycyA9IHt9O1xuICB0aGlzLmVuY29kZXJzID0ge307XG59O1xuXG5FbnRpdHkucHJvdG90eXBlLl9jcmVhdGVOYW1lZCA9IGZ1bmN0aW9uIGNyZWF0ZU5hbWVkKGJhc2UpIHtcbiAgdmFyIG5hbWVkID0gdm0ucnVuSW5UaGlzQ29udGV4dCgnKGZ1bmN0aW9uICcgKyB0aGlzLm5hbWUgKyAnKGVudGl0eSkge1xcbicgK1xuICAgICcgIHRoaXMuX2luaXROYW1lZChlbnRpdHkpO1xcbicgK1xuICAgICd9KScpO1xuICBpbmhlcml0cyhuYW1lZCwgYmFzZSk7XG4gIG5hbWVkLnByb3RvdHlwZS5faW5pdE5hbWVkID0gZnVuY3Rpb24gaW5pdG5hbWVkKGVudGl0eSkge1xuICAgIGJhc2UuY2FsbCh0aGlzLCBlbnRpdHkpO1xuICB9O1xuXG4gIHJldHVybiBuZXcgbmFtZWQodGhpcyk7XG59O1xuXG5FbnRpdHkucHJvdG90eXBlLl9nZXREZWNvZGVyID0gZnVuY3Rpb24gX2dldERlY29kZXIoZW5jKSB7XG4gIC8vIExhemlseSBjcmVhdGUgZGVjb2RlclxuICBpZiAoIXRoaXMuZGVjb2RlcnMuaGFzT3duUHJvcGVydHkoZW5jKSlcbiAgICB0aGlzLmRlY29kZXJzW2VuY10gPSB0aGlzLl9jcmVhdGVOYW1lZChhc24xLmRlY29kZXJzW2VuY10pO1xuICByZXR1cm4gdGhpcy5kZWNvZGVyc1tlbmNdO1xufTtcblxuRW50aXR5LnByb3RvdHlwZS5kZWNvZGUgPSBmdW5jdGlvbiBkZWNvZGUoZGF0YSwgZW5jLCBvcHRpb25zKSB7XG4gIHJldHVybiB0aGlzLl9nZXREZWNvZGVyKGVuYykuZGVjb2RlKGRhdGEsIG9wdGlvbnMpO1xufTtcblxuRW50aXR5LnByb3RvdHlwZS5fZ2V0RW5jb2RlciA9IGZ1bmN0aW9uIF9nZXRFbmNvZGVyKGVuYykge1xuICAvLyBMYXppbHkgY3JlYXRlIGVuY29kZXJcbiAgaWYgKCF0aGlzLmVuY29kZXJzLmhhc093blByb3BlcnR5KGVuYykpXG4gICAgdGhpcy5lbmNvZGVyc1tlbmNdID0gdGhpcy5fY3JlYXRlTmFtZWQoYXNuMS5lbmNvZGVyc1tlbmNdKTtcbiAgcmV0dXJuIHRoaXMuZW5jb2RlcnNbZW5jXTtcbn07XG5cbkVudGl0eS5wcm90b3R5cGUuZW5jb2RlID0gZnVuY3Rpb24gZW5jb2RlKGRhdGEsIGVuYywgLyogaW50ZXJuYWwgKi8gcmVwb3J0ZXIpIHtcbiAgcmV0dXJuIHRoaXMuX2dldEVuY29kZXIoZW5jKS5lbmNvZGUoZGF0YSwgcmVwb3J0ZXIpO1xufTtcbiIsInZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG52YXIgUmVwb3J0ZXIgPSByZXF1aXJlKCcuLi9iYXNlJykuUmVwb3J0ZXI7XG52YXIgQnVmZmVyID0gcmVxdWlyZSgnYnVmZmVyJykuQnVmZmVyO1xuXG5mdW5jdGlvbiBEZWNvZGVyQnVmZmVyKGJhc2UsIG9wdGlvbnMpIHtcbiAgUmVwb3J0ZXIuY2FsbCh0aGlzLCBvcHRpb25zKTtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYmFzZSkpIHtcbiAgICB0aGlzLmVycm9yKCdJbnB1dCBub3QgQnVmZmVyJyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdGhpcy5iYXNlID0gYmFzZTtcbiAgdGhpcy5vZmZzZXQgPSAwO1xuICB0aGlzLmxlbmd0aCA9IGJhc2UubGVuZ3RoO1xufVxuaW5oZXJpdHMoRGVjb2RlckJ1ZmZlciwgUmVwb3J0ZXIpO1xuZXhwb3J0cy5EZWNvZGVyQnVmZmVyID0gRGVjb2RlckJ1ZmZlcjtcblxuRGVjb2RlckJ1ZmZlci5wcm90b3R5cGUuc2F2ZSA9IGZ1bmN0aW9uIHNhdmUoKSB7XG4gIHJldHVybiB7IG9mZnNldDogdGhpcy5vZmZzZXQgfTtcbn07XG5cbkRlY29kZXJCdWZmZXIucHJvdG90eXBlLnJlc3RvcmUgPSBmdW5jdGlvbiByZXN0b3JlKHNhdmUpIHtcbiAgLy8gUmV0dXJuIHNraXBwZWQgZGF0YVxuICB2YXIgcmVzID0gbmV3IERlY29kZXJCdWZmZXIodGhpcy5iYXNlKTtcbiAgcmVzLm9mZnNldCA9IHNhdmUub2Zmc2V0O1xuICByZXMubGVuZ3RoID0gdGhpcy5vZmZzZXQ7XG5cbiAgdGhpcy5vZmZzZXQgPSBzYXZlLm9mZnNldDtcblxuICByZXR1cm4gcmVzO1xufTtcblxuRGVjb2RlckJ1ZmZlci5wcm90b3R5cGUuaXNFbXB0eSA9IGZ1bmN0aW9uIGlzRW1wdHkoKSB7XG4gIHJldHVybiB0aGlzLm9mZnNldCA9PT0gdGhpcy5sZW5ndGg7XG59O1xuXG5EZWNvZGVyQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDggPSBmdW5jdGlvbiByZWFkVUludDgoZmFpbCkge1xuICBpZiAodGhpcy5vZmZzZXQgKyAxIDw9IHRoaXMubGVuZ3RoKVxuICAgIHJldHVybiB0aGlzLmJhc2UucmVhZFVJbnQ4KHRoaXMub2Zmc2V0KyssIHRydWUpO1xuICBlbHNlXG4gICAgcmV0dXJuIHRoaXMuZXJyb3IoZmFpbCB8fCAnRGVjb2RlckJ1ZmZlciBvdmVycnVuJyk7XG59XG5cbkRlY29kZXJCdWZmZXIucHJvdG90eXBlLnNraXAgPSBmdW5jdGlvbiBza2lwKGJ5dGVzLCBmYWlsKSB7XG4gIGlmICghKHRoaXMub2Zmc2V0ICsgYnl0ZXMgPD0gdGhpcy5sZW5ndGgpKVxuICAgIHJldHVybiB0aGlzLmVycm9yKGZhaWwgfHwgJ0RlY29kZXJCdWZmZXIgb3ZlcnJ1bicpO1xuXG4gIHZhciByZXMgPSBuZXcgRGVjb2RlckJ1ZmZlcih0aGlzLmJhc2UpO1xuXG4gIC8vIFNoYXJlIHJlcG9ydGVyIHN0YXRlXG4gIHJlcy5fcmVwb3J0ZXJTdGF0ZSA9IHRoaXMuX3JlcG9ydGVyU3RhdGU7XG5cbiAgcmVzLm9mZnNldCA9IHRoaXMub2Zmc2V0O1xuICByZXMubGVuZ3RoID0gdGhpcy5vZmZzZXQgKyBieXRlcztcbiAgdGhpcy5vZmZzZXQgKz0gYnl0ZXM7XG4gIHJldHVybiByZXM7XG59XG5cbkRlY29kZXJCdWZmZXIucHJvdG90eXBlLnJhdyA9IGZ1bmN0aW9uIHJhdyhzYXZlKSB7XG4gIHJldHVybiB0aGlzLmJhc2Uuc2xpY2Uoc2F2ZSA/IHNhdmUub2Zmc2V0IDogdGhpcy5vZmZzZXQsIHRoaXMubGVuZ3RoKTtcbn1cblxuZnVuY3Rpb24gRW5jb2RlckJ1ZmZlcih2YWx1ZSwgcmVwb3J0ZXIpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgdGhpcy5sZW5ndGggPSAwO1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZS5tYXAoZnVuY3Rpb24oaXRlbSkge1xuICAgICAgaWYgKCEoaXRlbSBpbnN0YW5jZW9mIEVuY29kZXJCdWZmZXIpKVxuICAgICAgICBpdGVtID0gbmV3IEVuY29kZXJCdWZmZXIoaXRlbSwgcmVwb3J0ZXIpO1xuICAgICAgdGhpcy5sZW5ndGggKz0gaXRlbS5sZW5ndGg7XG4gICAgICByZXR1cm4gaXRlbTtcbiAgICB9LCB0aGlzKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgaWYgKCEoMCA8PSB2YWx1ZSAmJiB2YWx1ZSA8PSAweGZmKSlcbiAgICAgIHJldHVybiByZXBvcnRlci5lcnJvcignbm9uLWJ5dGUgRW5jb2RlckJ1ZmZlciB2YWx1ZScpO1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLmxlbmd0aCA9IDE7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLmxlbmd0aCA9IEJ1ZmZlci5ieXRlTGVuZ3RoKHZhbHVlKTtcbiAgfSBlbHNlIGlmIChCdWZmZXIuaXNCdWZmZXIodmFsdWUpKSB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIHRoaXMubGVuZ3RoID0gdmFsdWUubGVuZ3RoO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiByZXBvcnRlci5lcnJvcignVW5zdXBwb3J0ZWQgdHlwZTogJyArIHR5cGVvZiB2YWx1ZSk7XG4gIH1cbn1cbmV4cG9ydHMuRW5jb2RlckJ1ZmZlciA9IEVuY29kZXJCdWZmZXI7XG5cbkVuY29kZXJCdWZmZXIucHJvdG90eXBlLmpvaW4gPSBmdW5jdGlvbiBqb2luKG91dCwgb2Zmc2V0KSB7XG4gIGlmICghb3V0KVxuICAgIG91dCA9IG5ldyBCdWZmZXIodGhpcy5sZW5ndGgpO1xuICBpZiAoIW9mZnNldClcbiAgICBvZmZzZXQgPSAwO1xuXG4gIGlmICh0aGlzLmxlbmd0aCA9PT0gMClcbiAgICByZXR1cm4gb3V0O1xuXG4gIGlmIChBcnJheS5pc0FycmF5KHRoaXMudmFsdWUpKSB7XG4gICAgdGhpcy52YWx1ZS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgIGl0ZW0uam9pbihvdXQsIG9mZnNldCk7XG4gICAgICBvZmZzZXQgKz0gaXRlbS5sZW5ndGg7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLnZhbHVlID09PSAnbnVtYmVyJylcbiAgICAgIG91dFtvZmZzZXRdID0gdGhpcy52YWx1ZTtcbiAgICBlbHNlIGlmICh0eXBlb2YgdGhpcy52YWx1ZSA9PT0gJ3N0cmluZycpXG4gICAgICBvdXQud3JpdGUodGhpcy52YWx1ZSwgb2Zmc2V0KTtcbiAgICBlbHNlIGlmIChCdWZmZXIuaXNCdWZmZXIodGhpcy52YWx1ZSkpXG4gICAgICB0aGlzLnZhbHVlLmNvcHkob3V0LCBvZmZzZXQpO1xuICAgIG9mZnNldCArPSB0aGlzLmxlbmd0aDtcbiAgfVxuXG4gIHJldHVybiBvdXQ7XG59O1xuIiwidmFyIGJhc2UgPSBleHBvcnRzO1xuXG5iYXNlLlJlcG9ydGVyID0gcmVxdWlyZSgnLi9yZXBvcnRlcicpLlJlcG9ydGVyO1xuYmFzZS5EZWNvZGVyQnVmZmVyID0gcmVxdWlyZSgnLi9idWZmZXInKS5EZWNvZGVyQnVmZmVyO1xuYmFzZS5FbmNvZGVyQnVmZmVyID0gcmVxdWlyZSgnLi9idWZmZXInKS5FbmNvZGVyQnVmZmVyO1xuYmFzZS5Ob2RlID0gcmVxdWlyZSgnLi9ub2RlJyk7XG4iLCJ2YXIgUmVwb3J0ZXIgPSByZXF1aXJlKCcuLi9iYXNlJykuUmVwb3J0ZXI7XG52YXIgRW5jb2RlckJ1ZmZlciA9IHJlcXVpcmUoJy4uL2Jhc2UnKS5FbmNvZGVyQnVmZmVyO1xudmFyIGFzc2VydCA9IHJlcXVpcmUoJ21pbmltYWxpc3RpYy1hc3NlcnQnKTtcblxuLy8gU3VwcG9ydGVkIHRhZ3NcbnZhciB0YWdzID0gW1xuICAnc2VxJywgJ3NlcW9mJywgJ3NldCcsICdzZXRvZicsICdvY3RzdHInLCAnYml0c3RyJywgJ29iamlkJywgJ2Jvb2wnLFxuICAnZ2VudGltZScsICd1dGN0aW1lJywgJ251bGxfJywgJ2VudW0nLCAnaW50JywgJ2lhNXN0cidcbl07XG5cbi8vIFB1YmxpYyBtZXRob2RzIGxpc3RcbnZhciBtZXRob2RzID0gW1xuICAna2V5JywgJ29iaicsICd1c2UnLCAnb3B0aW9uYWwnLCAnZXhwbGljaXQnLCAnaW1wbGljaXQnLCAnZGVmJywgJ2Nob2ljZScsXG4gICdhbnknXG5dLmNvbmNhdCh0YWdzKTtcblxuLy8gT3ZlcnJpZGVkIG1ldGhvZHMgbGlzdFxudmFyIG92ZXJyaWRlZCA9IFtcbiAgJ19wZWVrVGFnJywgJ19kZWNvZGVUYWcnLCAnX3VzZScsXG4gICdfZGVjb2RlU3RyJywgJ19kZWNvZGVPYmppZCcsICdfZGVjb2RlVGltZScsXG4gICdfZGVjb2RlTnVsbCcsICdfZGVjb2RlSW50JywgJ19kZWNvZGVCb29sJywgJ19kZWNvZGVMaXN0JyxcblxuICAnX2VuY29kZUNvbXBvc2l0ZScsICdfZW5jb2RlU3RyJywgJ19lbmNvZGVPYmppZCcsICdfZW5jb2RlVGltZScsXG4gICdfZW5jb2RlTnVsbCcsICdfZW5jb2RlSW50JywgJ19lbmNvZGVCb29sJ1xuXTtcblxuZnVuY3Rpb24gTm9kZShlbmMsIHBhcmVudCkge1xuICB2YXIgc3RhdGUgPSB7fTtcbiAgdGhpcy5fYmFzZVN0YXRlID0gc3RhdGU7XG5cbiAgc3RhdGUuZW5jID0gZW5jO1xuXG4gIHN0YXRlLnBhcmVudCA9IHBhcmVudCB8fCBudWxsO1xuICBzdGF0ZS5jaGlsZHJlbiA9IG51bGw7XG5cbiAgLy8gU3RhdGVcbiAgc3RhdGUudGFnID0gbnVsbDtcbiAgc3RhdGUuYXJncyA9IG51bGw7XG4gIHN0YXRlLnJldmVyc2VBcmdzID0gbnVsbDtcbiAgc3RhdGUuY2hvaWNlID0gbnVsbDtcbiAgc3RhdGUub3B0aW9uYWwgPSBmYWxzZTtcbiAgc3RhdGUuYW55ID0gZmFsc2U7XG4gIHN0YXRlLm9iaiA9IGZhbHNlO1xuICBzdGF0ZS51c2UgPSBudWxsO1xuICBzdGF0ZS51c2VEZWNvZGVyID0gbnVsbDtcbiAgc3RhdGUua2V5ID0gbnVsbDtcbiAgc3RhdGVbJ2RlZmF1bHQnXSA9IG51bGw7XG4gIHN0YXRlLmV4cGxpY2l0ID0gbnVsbDtcbiAgc3RhdGUuaW1wbGljaXQgPSBudWxsO1xuXG4gIC8vIFNob3VsZCBjcmVhdGUgbmV3IGluc3RhbmNlIG9uIGVhY2ggbWV0aG9kXG4gIGlmICghc3RhdGUucGFyZW50KSB7XG4gICAgc3RhdGUuY2hpbGRyZW4gPSBbXTtcbiAgICB0aGlzLl93cmFwKCk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gTm9kZTtcblxudmFyIHN0YXRlUHJvcHMgPSBbXG4gICdlbmMnLCAncGFyZW50JywgJ2NoaWxkcmVuJywgJ3RhZycsICdhcmdzJywgJ3JldmVyc2VBcmdzJywgJ2Nob2ljZScsXG4gICdvcHRpb25hbCcsICdhbnknLCAnb2JqJywgJ3VzZScsICdhbHRlcmVkVXNlJywgJ2tleScsICdkZWZhdWx0JywgJ2V4cGxpY2l0JyxcbiAgJ2ltcGxpY2l0J1xuXTtcblxuTm9kZS5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbiBjbG9uZSgpIHtcbiAgdmFyIHN0YXRlID0gdGhpcy5fYmFzZVN0YXRlO1xuICB2YXIgY3N0YXRlID0ge307XG4gIHN0YXRlUHJvcHMuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XG4gICAgY3N0YXRlW3Byb3BdID0gc3RhdGVbcHJvcF07XG4gIH0pO1xuICB2YXIgcmVzID0gbmV3IHRoaXMuY29uc3RydWN0b3IoY3N0YXRlLnBhcmVudCk7XG4gIHJlcy5fYmFzZVN0YXRlID0gY3N0YXRlO1xuICByZXR1cm4gcmVzO1xufTtcblxuTm9kZS5wcm90b3R5cGUuX3dyYXAgPSBmdW5jdGlvbiB3cmFwKCkge1xuICB2YXIgc3RhdGUgPSB0aGlzLl9iYXNlU3RhdGU7XG4gIG1ldGhvZHMuZm9yRWFjaChmdW5jdGlvbihtZXRob2QpIHtcbiAgICB0aGlzW21ldGhvZF0gPSBmdW5jdGlvbiBfd3JhcHBlZE1ldGhvZCgpIHtcbiAgICAgIHZhciBjbG9uZSA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMpO1xuICAgICAgc3RhdGUuY2hpbGRyZW4ucHVzaChjbG9uZSk7XG4gICAgICByZXR1cm4gY2xvbmVbbWV0aG9kXS5hcHBseShjbG9uZSwgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9LCB0aGlzKTtcbn07XG5cbk5vZGUucHJvdG90eXBlLl9pbml0ID0gZnVuY3Rpb24gaW5pdChib2R5KSB7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX2Jhc2VTdGF0ZTtcblxuICBhc3NlcnQoc3RhdGUucGFyZW50ID09PSBudWxsKTtcbiAgYm9keS5jYWxsKHRoaXMpO1xuXG4gIC8vIEZpbHRlciBjaGlsZHJlblxuICBzdGF0ZS5jaGlsZHJlbiA9IHN0YXRlLmNoaWxkcmVuLmZpbHRlcihmdW5jdGlvbihjaGlsZCkge1xuICAgIHJldHVybiBjaGlsZC5fYmFzZVN0YXRlLnBhcmVudCA9PT0gdGhpcztcbiAgfSwgdGhpcyk7XG4gIGFzc2VydC5lcXVhbChzdGF0ZS5jaGlsZHJlbi5sZW5ndGgsIDEsICdSb290IG5vZGUgY2FuIGhhdmUgb25seSBvbmUgY2hpbGQnKTtcbn07XG5cbk5vZGUucHJvdG90eXBlLl91c2VBcmdzID0gZnVuY3Rpb24gdXNlQXJncyhhcmdzKSB7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX2Jhc2VTdGF0ZTtcblxuICAvLyBGaWx0ZXIgY2hpbGRyZW4gYW5kIGFyZ3NcbiAgdmFyIGNoaWxkcmVuID0gYXJncy5maWx0ZXIoZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIGFyZyBpbnN0YW5jZW9mIHRoaXMuY29uc3RydWN0b3I7XG4gIH0sIHRoaXMpO1xuICBhcmdzID0gYXJncy5maWx0ZXIoZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuICEoYXJnIGluc3RhbmNlb2YgdGhpcy5jb25zdHJ1Y3Rvcik7XG4gIH0sIHRoaXMpO1xuXG4gIGlmIChjaGlsZHJlbi5sZW5ndGggIT09IDApIHtcbiAgICBhc3NlcnQoc3RhdGUuY2hpbGRyZW4gPT09IG51bGwpO1xuICAgIHN0YXRlLmNoaWxkcmVuID0gY2hpbGRyZW47XG5cbiAgICAvLyBSZXBsYWNlIHBhcmVudCB0byBtYWludGFpbiBiYWNrd2FyZCBsaW5rXG4gICAgY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbihjaGlsZCkge1xuICAgICAgY2hpbGQuX2Jhc2VTdGF0ZS5wYXJlbnQgPSB0aGlzO1xuICAgIH0sIHRoaXMpO1xuICB9XG4gIGlmIChhcmdzLmxlbmd0aCAhPT0gMCkge1xuICAgIGFzc2VydChzdGF0ZS5hcmdzID09PSBudWxsKTtcbiAgICBzdGF0ZS5hcmdzID0gYXJncztcbiAgICBzdGF0ZS5yZXZlcnNlQXJncyA9IGFyZ3MubWFwKGZ1bmN0aW9uKGFyZykge1xuICAgICAgaWYgKHR5cGVvZiBhcmcgIT09ICdvYmplY3QnIHx8IGFyZy5jb25zdHJ1Y3RvciAhPT0gT2JqZWN0KVxuICAgICAgICByZXR1cm4gYXJnO1xuXG4gICAgICB2YXIgcmVzID0ge307XG4gICAgICBPYmplY3Qua2V5cyhhcmcpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIGlmIChrZXkgPT0gKGtleSB8IDApKVxuICAgICAgICAgIGtleSB8PSAwO1xuICAgICAgICB2YXIgdmFsdWUgPSBhcmdba2V5XTtcbiAgICAgICAgcmVzW3ZhbHVlXSA9IGtleTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlcztcbiAgICB9KTtcbiAgfVxufTtcblxuLy9cbi8vIE92ZXJyaWRlZCBtZXRob2RzXG4vL1xuXG5vdmVycmlkZWQuZm9yRWFjaChmdW5jdGlvbihtZXRob2QpIHtcbiAgTm9kZS5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uIF9vdmVycmlkZWQoKSB7XG4gICAgdmFyIHN0YXRlID0gdGhpcy5fYmFzZVN0YXRlO1xuICAgIHRocm93IG5ldyBFcnJvcihtZXRob2QgKyAnIG5vdCBpbXBsZW1lbnRlZCBmb3IgZW5jb2Rpbmc6ICcgKyBzdGF0ZS5lbmMpO1xuICB9O1xufSk7XG5cbi8vXG4vLyBQdWJsaWMgbWV0aG9kc1xuLy9cblxudGFncy5mb3JFYWNoKGZ1bmN0aW9uKHRhZykge1xuICBOb2RlLnByb3RvdHlwZVt0YWddID0gZnVuY3Rpb24gX3RhZ01ldGhvZCgpIHtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLl9iYXNlU3RhdGU7XG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuXG4gICAgYXNzZXJ0KHN0YXRlLnRhZyA9PT0gbnVsbCk7XG4gICAgc3RhdGUudGFnID0gdGFnO1xuXG4gICAgdGhpcy5fdXNlQXJncyhhcmdzKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xufSk7XG5cbk5vZGUucHJvdG90eXBlLnVzZSA9IGZ1bmN0aW9uIHVzZShpdGVtKSB7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX2Jhc2VTdGF0ZTtcblxuICBhc3NlcnQoc3RhdGUudXNlID09PSBudWxsKTtcbiAgc3RhdGUudXNlID0gaXRlbTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbk5vZGUucHJvdG90eXBlLm9wdGlvbmFsID0gZnVuY3Rpb24gb3B0aW9uYWwoKSB7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX2Jhc2VTdGF0ZTtcblxuICBzdGF0ZS5vcHRpb25hbCA9IHRydWU7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5kZWYgPSBmdW5jdGlvbiBkZWYodmFsKSB7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX2Jhc2VTdGF0ZTtcblxuICBhc3NlcnQoc3RhdGVbJ2RlZmF1bHQnXSA9PT0gbnVsbCk7XG4gIHN0YXRlWydkZWZhdWx0J10gPSB2YWw7XG4gIHN0YXRlLm9wdGlvbmFsID0gdHJ1ZTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbk5vZGUucHJvdG90eXBlLmV4cGxpY2l0ID0gZnVuY3Rpb24gZXhwbGljaXQobnVtKSB7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX2Jhc2VTdGF0ZTtcblxuICBhc3NlcnQoc3RhdGUuZXhwbGljaXQgPT09IG51bGwgJiYgc3RhdGUuaW1wbGljaXQgPT09IG51bGwpO1xuICBzdGF0ZS5leHBsaWNpdCA9IG51bTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbk5vZGUucHJvdG90eXBlLmltcGxpY2l0ID0gZnVuY3Rpb24gaW1wbGljaXQobnVtKSB7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX2Jhc2VTdGF0ZTtcblxuICBhc3NlcnQoc3RhdGUuZXhwbGljaXQgPT09IG51bGwgJiYgc3RhdGUuaW1wbGljaXQgPT09IG51bGwpO1xuICBzdGF0ZS5pbXBsaWNpdCA9IG51bTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbk5vZGUucHJvdG90eXBlLm9iaiA9IGZ1bmN0aW9uIG9iaigpIHtcbiAgdmFyIHN0YXRlID0gdGhpcy5fYmFzZVN0YXRlO1xuICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG5cbiAgc3RhdGUub2JqID0gdHJ1ZTtcblxuICBpZiAoYXJncy5sZW5ndGggIT09IDApXG4gICAgdGhpcy5fdXNlQXJncyhhcmdzKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbk5vZGUucHJvdG90eXBlLmtleSA9IGZ1bmN0aW9uIGtleShuZXdLZXkpIHtcbiAgdmFyIHN0YXRlID0gdGhpcy5fYmFzZVN0YXRlO1xuXG4gIGFzc2VydChzdGF0ZS5rZXkgPT09IG51bGwpO1xuICBzdGF0ZS5rZXkgPSBuZXdLZXk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5hbnkgPSBmdW5jdGlvbiBhbnkoKSB7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX2Jhc2VTdGF0ZTtcblxuICBzdGF0ZS5hbnkgPSB0cnVlO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuTm9kZS5wcm90b3R5cGUuY2hvaWNlID0gZnVuY3Rpb24gY2hvaWNlKG9iaikge1xuICB2YXIgc3RhdGUgPSB0aGlzLl9iYXNlU3RhdGU7XG5cbiAgYXNzZXJ0KHN0YXRlLmNob2ljZSA9PT0gbnVsbCk7XG4gIHN0YXRlLmNob2ljZSA9IG9iajtcbiAgdGhpcy5fdXNlQXJncyhPYmplY3Qua2V5cyhvYmopLm1hcChmdW5jdGlvbihrZXkpIHtcbiAgICByZXR1cm4gb2JqW2tleV07XG4gIH0pKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vXG4vLyBEZWNvZGluZ1xuLy9cblxuTm9kZS5wcm90b3R5cGUuX2RlY29kZSA9IGZ1bmN0aW9uIGRlY29kZShpbnB1dCkge1xuICB2YXIgc3RhdGUgPSB0aGlzLl9iYXNlU3RhdGU7XG5cbiAgLy8gRGVjb2RlIHJvb3Qgbm9kZVxuICBpZiAoc3RhdGUucGFyZW50ID09PSBudWxsKVxuICAgIHJldHVybiBpbnB1dC53cmFwUmVzdWx0KHN0YXRlLmNoaWxkcmVuWzBdLl9kZWNvZGUoaW5wdXQpKTtcblxuICB2YXIgcmVzdWx0ID0gc3RhdGVbJ2RlZmF1bHQnXTtcbiAgdmFyIHByZXNlbnQgPSB0cnVlO1xuXG4gIHZhciBwcmV2S2V5O1xuICBpZiAoc3RhdGUua2V5ICE9PSBudWxsKVxuICAgIHByZXZLZXkgPSBpbnB1dC5lbnRlcktleShzdGF0ZS5rZXkpO1xuXG4gIC8vIENoZWNrIGlmIHRhZyBpcyB0aGVyZVxuICBpZiAoc3RhdGUub3B0aW9uYWwpIHtcbiAgICBwcmVzZW50ID0gdGhpcy5fcGVla1RhZyhcbiAgICAgIGlucHV0LFxuICAgICAgc3RhdGUuZXhwbGljaXQgIT09IG51bGwgPyBzdGF0ZS5leHBsaWNpdCA6XG4gICAgICAgICAgc3RhdGUuaW1wbGljaXQgIT09IG51bGwgPyBzdGF0ZS5pbXBsaWNpdCA6XG4gICAgICAgICAgICAgIHN0YXRlLnRhZyB8fCAwXG4gICAgKTtcbiAgICBpZiAoaW5wdXQuaXNFcnJvcihwcmVzZW50KSlcbiAgICAgIHJldHVybiBwcmVzZW50O1xuICB9XG5cbiAgLy8gUHVzaCBvYmplY3Qgb24gc3RhY2tcbiAgdmFyIHByZXZPYmo7XG4gIGlmIChzdGF0ZS5vYmogJiYgcHJlc2VudClcbiAgICBwcmV2T2JqID0gaW5wdXQuZW50ZXJPYmplY3QoKTtcblxuICBpZiAocHJlc2VudCkge1xuICAgIC8vIFVud3JhcCBleHBsaWNpdCB2YWx1ZXNcbiAgICBpZiAoc3RhdGUuZXhwbGljaXQgIT09IG51bGwpIHtcbiAgICAgIHZhciBleHBsaWNpdCA9IHRoaXMuX2RlY29kZVRhZyhpbnB1dCwgc3RhdGUuZXhwbGljaXQpO1xuICAgICAgaWYgKGlucHV0LmlzRXJyb3IoZXhwbGljaXQpKVxuICAgICAgICByZXR1cm4gZXhwbGljaXQ7XG4gICAgICBpbnB1dCA9IGV4cGxpY2l0O1xuICAgIH1cblxuICAgIC8vIFVud3JhcCBpbXBsaWNpdCBhbmQgbm9ybWFsIHZhbHVlc1xuICAgIGlmIChzdGF0ZS51c2UgPT09IG51bGwgJiYgc3RhdGUuY2hvaWNlID09PSBudWxsKSB7XG4gICAgICBpZiAoc3RhdGUuYW55KVxuICAgICAgICB2YXIgc2F2ZSA9IGlucHV0LnNhdmUoKTtcbiAgICAgIHZhciBib2R5ID0gdGhpcy5fZGVjb2RlVGFnKFxuICAgICAgICBpbnB1dCxcbiAgICAgICAgc3RhdGUuaW1wbGljaXQgIT09IG51bGwgPyBzdGF0ZS5pbXBsaWNpdCA6IHN0YXRlLnRhZyxcbiAgICAgICAgc3RhdGUuYW55XG4gICAgICApO1xuICAgICAgaWYgKGlucHV0LmlzRXJyb3IoYm9keSkpXG4gICAgICAgIHJldHVybiBib2R5O1xuXG4gICAgICBpZiAoc3RhdGUuYW55KVxuICAgICAgICByZXN1bHQgPSBpbnB1dC5yYXcoc2F2ZSk7XG4gICAgICBlbHNlXG4gICAgICAgIGlucHV0ID0gYm9keTtcbiAgICB9XG5cbiAgICAvLyBTZWxlY3QgcHJvcGVyIG1ldGhvZCBmb3IgdGFnXG4gICAgaWYgKHN0YXRlLmFueSlcbiAgICAgIHJlc3VsdCA9IHJlc3VsdDtcbiAgICBlbHNlIGlmIChzdGF0ZS5jaG9pY2UgPT09IG51bGwpXG4gICAgICByZXN1bHQgPSB0aGlzLl9kZWNvZGVHZW5lcmljKHN0YXRlLnRhZywgaW5wdXQpO1xuICAgIGVsc2VcbiAgICAgIHJlc3VsdCA9IHRoaXMuX2RlY29kZUNob2ljZShpbnB1dCk7XG5cbiAgICBpZiAoaW5wdXQuaXNFcnJvcihyZXN1bHQpKVxuICAgICAgcmV0dXJuIHJlc3VsdDtcblxuICAgIC8vIERlY29kZSBjaGlsZHJlblxuICAgIGlmICghc3RhdGUuYW55ICYmIHN0YXRlLmNob2ljZSA9PT0gbnVsbCAmJiBzdGF0ZS5jaGlsZHJlbiAhPT0gbnVsbCkge1xuICAgICAgdmFyIGZhaWwgPSBzdGF0ZS5jaGlsZHJlbi5zb21lKGZ1bmN0aW9uIGRlY29kZUNoaWxkcmVuKGNoaWxkKSB7XG4gICAgICAgIC8vIE5PVEU6IFdlIGFyZSBpZ25vcmluZyBlcnJvcnMgaGVyZSwgdG8gbGV0IHBhcnNlciBjb250aW51ZSB3aXRoIG90aGVyXG4gICAgICAgIC8vIHBhcnRzIG9mIGVuY29kZWQgZGF0YVxuICAgICAgICBjaGlsZC5fZGVjb2RlKGlucHV0KTtcbiAgICAgIH0pO1xuICAgICAgaWYgKGZhaWwpXG4gICAgICAgIHJldHVybiBlcnI7XG4gICAgfVxuICB9XG5cbiAgLy8gUG9wIG9iamVjdFxuICBpZiAoc3RhdGUub2JqICYmIHByZXNlbnQpXG4gICAgcmVzdWx0ID0gaW5wdXQubGVhdmVPYmplY3QocHJldk9iaik7XG5cbiAgLy8gU2V0IGtleVxuICBpZiAoc3RhdGUua2V5ICE9PSBudWxsICYmIChyZXN1bHQgIT09IG51bGwgfHwgcHJlc2VudCA9PT0gdHJ1ZSkpXG4gICAgaW5wdXQubGVhdmVLZXkocHJldktleSwgc3RhdGUua2V5LCByZXN1bHQpO1xuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5fZGVjb2RlR2VuZXJpYyA9IGZ1bmN0aW9uIGRlY29kZUdlbmVyaWModGFnLCBpbnB1dCkge1xuICB2YXIgc3RhdGUgPSB0aGlzLl9iYXNlU3RhdGU7XG5cbiAgaWYgKHRhZyA9PT0gJ3NlcScgfHwgdGFnID09PSAnc2V0JylcbiAgICByZXR1cm4gbnVsbDtcbiAgaWYgKHRhZyA9PT0gJ3NlcW9mJyB8fCB0YWcgPT09ICdzZXRvZicpXG4gICAgcmV0dXJuIHRoaXMuX2RlY29kZUxpc3QoaW5wdXQsIHRhZywgc3RhdGUuYXJnc1swXSk7XG4gIGVsc2UgaWYgKHRhZyA9PT0gJ29jdHN0cicgfHwgdGFnID09PSAnYml0c3RyJyB8fCB0YWcgPT09ICdpYTVzdHInKVxuICAgIHJldHVybiB0aGlzLl9kZWNvZGVTdHIoaW5wdXQsIHRhZyk7XG4gIGVsc2UgaWYgKHRhZyA9PT0gJ29iamlkJyAmJiBzdGF0ZS5hcmdzKVxuICAgIHJldHVybiB0aGlzLl9kZWNvZGVPYmppZChpbnB1dCwgc3RhdGUuYXJnc1swXSwgc3RhdGUuYXJnc1sxXSk7XG4gIGVsc2UgaWYgKHRhZyA9PT0gJ29iamlkJylcbiAgICByZXR1cm4gdGhpcy5fZGVjb2RlT2JqaWQoaW5wdXQsIG51bGwsIG51bGwpO1xuICBlbHNlIGlmICh0YWcgPT09ICdnZW50aW1lJyB8fCB0YWcgPT09ICd1dGN0aW1lJylcbiAgICByZXR1cm4gdGhpcy5fZGVjb2RlVGltZShpbnB1dCwgdGFnKTtcbiAgZWxzZSBpZiAodGFnID09PSAnbnVsbF8nKVxuICAgIHJldHVybiB0aGlzLl9kZWNvZGVOdWxsKGlucHV0KTtcbiAgZWxzZSBpZiAodGFnID09PSAnYm9vbCcpXG4gICAgcmV0dXJuIHRoaXMuX2RlY29kZUJvb2woaW5wdXQpO1xuICBlbHNlIGlmICh0YWcgPT09ICdpbnQnIHx8IHRhZyA9PT0gJ2VudW0nKVxuICAgIHJldHVybiB0aGlzLl9kZWNvZGVJbnQoaW5wdXQsIHN0YXRlLmFyZ3MgJiYgc3RhdGUuYXJnc1swXSk7XG4gIGVsc2UgaWYgKHN0YXRlLnVzZSAhPT0gbnVsbClcbiAgICByZXR1cm4gdGhpcy5fZ2V0VXNlKHN0YXRlLnVzZSwgaW5wdXQuX3JlcG9ydGVyU3RhdGUub2JqKS5fZGVjb2RlKGlucHV0KTtcbiAgZWxzZVxuICAgIHJldHVybiBpbnB1dC5lcnJvcigndW5rbm93biB0YWc6ICcgKyB0YWcpO1xuXG4gIHJldHVybiBudWxsO1xufTtcblxuTm9kZS5wcm90b3R5cGUuX2dldFVzZSA9IGZ1bmN0aW9uIF9nZXRVc2UoZW50aXR5LCBvYmopIHtcblxuICB2YXIgc3RhdGUgPSB0aGlzLl9iYXNlU3RhdGU7XG4gIC8vIENyZWF0ZSBhbHRlcmVkIHVzZSBkZWNvZGVyIGlmIGltcGxpY2l0IGlzIHNldFxuICBzdGF0ZS51c2VEZWNvZGVyID0gdGhpcy5fdXNlKGVudGl0eSwgb2JqKTtcbiAgYXNzZXJ0KHN0YXRlLnVzZURlY29kZXIuX2Jhc2VTdGF0ZS5wYXJlbnQgPT09IG51bGwpO1xuICBzdGF0ZS51c2VEZWNvZGVyID0gc3RhdGUudXNlRGVjb2Rlci5fYmFzZVN0YXRlLmNoaWxkcmVuWzBdO1xuICBpZiAoc3RhdGUuaW1wbGljaXQgIT09IHN0YXRlLnVzZURlY29kZXIuX2Jhc2VTdGF0ZS5pbXBsaWNpdCkge1xuICAgIHN0YXRlLnVzZURlY29kZXIgPSBzdGF0ZS51c2VEZWNvZGVyLmNsb25lKCk7XG4gICAgc3RhdGUudXNlRGVjb2Rlci5fYmFzZVN0YXRlLmltcGxpY2l0ID0gc3RhdGUuaW1wbGljaXQ7XG4gIH1cbiAgcmV0dXJuIHN0YXRlLnVzZURlY29kZXI7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5fZGVjb2RlQ2hvaWNlID0gZnVuY3Rpb24gZGVjb2RlQ2hvaWNlKGlucHV0KSB7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX2Jhc2VTdGF0ZTtcbiAgdmFyIHJlc3VsdCA9IG51bGw7XG4gIHZhciBtYXRjaCA9IGZhbHNlO1xuXG4gIE9iamVjdC5rZXlzKHN0YXRlLmNob2ljZSkuc29tZShmdW5jdGlvbihrZXkpIHtcbiAgICB2YXIgc2F2ZSA9IGlucHV0LnNhdmUoKTtcbiAgICB2YXIgbm9kZSA9IHN0YXRlLmNob2ljZVtrZXldO1xuICAgIHRyeSB7XG4gICAgICB2YXIgdmFsdWUgPSBub2RlLl9kZWNvZGUoaW5wdXQpO1xuICAgICAgaWYgKGlucHV0LmlzRXJyb3IodmFsdWUpKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgIHJlc3VsdCA9IHsgdHlwZToga2V5LCB2YWx1ZTogdmFsdWUgfTtcbiAgICAgIG1hdGNoID0gdHJ1ZTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpbnB1dC5yZXN0b3JlKHNhdmUpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSwgdGhpcyk7XG5cbiAgaWYgKCFtYXRjaClcbiAgICByZXR1cm4gaW5wdXQuZXJyb3IoJ0Nob2ljZSBub3QgbWF0Y2hlZCcpO1xuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG4vL1xuLy8gRW5jb2Rpbmdcbi8vXG5cbk5vZGUucHJvdG90eXBlLl9jcmVhdGVFbmNvZGVyQnVmZmVyID0gZnVuY3Rpb24gY3JlYXRlRW5jb2RlckJ1ZmZlcihkYXRhKSB7XG4gIHJldHVybiBuZXcgRW5jb2RlckJ1ZmZlcihkYXRhLCB0aGlzLnJlcG9ydGVyKTtcbn07XG5cbk5vZGUucHJvdG90eXBlLl9lbmNvZGUgPSBmdW5jdGlvbiBlbmNvZGUoZGF0YSwgcmVwb3J0ZXIsIHBhcmVudCkge1xuICB2YXIgc3RhdGUgPSB0aGlzLl9iYXNlU3RhdGU7XG4gIGlmIChzdGF0ZVsnZGVmYXVsdCddICE9PSBudWxsICYmIHN0YXRlWydkZWZhdWx0J10gPT09IGRhdGEpXG4gICAgcmV0dXJuO1xuXG4gIHZhciByZXN1bHQgPSB0aGlzLl9lbmNvZGVWYWx1ZShkYXRhLCByZXBvcnRlciwgcGFyZW50KTtcbiAgaWYgKHJlc3VsdCA9PT0gdW5kZWZpbmVkKVxuICAgIHJldHVybjtcblxuICBpZiAodGhpcy5fc2tpcERlZmF1bHQocmVzdWx0LCByZXBvcnRlciwgcGFyZW50KSlcbiAgICByZXR1cm47XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbk5vZGUucHJvdG90eXBlLl9lbmNvZGVWYWx1ZSA9IGZ1bmN0aW9uIGVuY29kZShkYXRhLCByZXBvcnRlciwgcGFyZW50KSB7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX2Jhc2VTdGF0ZTtcblxuICAvLyBEZWNvZGUgcm9vdCBub2RlXG4gIGlmIChzdGF0ZS5wYXJlbnQgPT09IG51bGwpXG4gICAgcmV0dXJuIHN0YXRlLmNoaWxkcmVuWzBdLl9lbmNvZGUoZGF0YSwgcmVwb3J0ZXIgfHwgbmV3IFJlcG9ydGVyKCkpO1xuXG4gIHZhciByZXN1bHQgPSBudWxsO1xuICB2YXIgcHJlc2VudCA9IHRydWU7XG5cbiAgLy8gU2V0IHJlcG9ydGVyIHRvIHNoYXJlIGl0IHdpdGggYSBjaGlsZCBjbGFzc1xuICB0aGlzLnJlcG9ydGVyID0gcmVwb3J0ZXI7XG5cbiAgLy8gQ2hlY2sgaWYgZGF0YSBpcyB0aGVyZVxuICBpZiAoc3RhdGUub3B0aW9uYWwgJiYgZGF0YSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgaWYgKHN0YXRlWydkZWZhdWx0J10gIT09IG51bGwpXG4gICAgICBkYXRhID0gc3RhdGVbJ2RlZmF1bHQnXVxuICAgIGVsc2VcbiAgICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIEZvciBlcnJvciByZXBvcnRpbmdcbiAgdmFyIHByZXZLZXk7XG5cbiAgLy8gRW5jb2RlIGNoaWxkcmVuIGZpcnN0XG4gIHZhciBjb250ZW50ID0gbnVsbDtcbiAgdmFyIHByaW1pdGl2ZSA9IGZhbHNlO1xuICBpZiAoc3RhdGUuYW55KSB7XG4gICAgLy8gQW55dGhpbmcgdGhhdCB3YXMgZ2l2ZW4gaXMgdHJhbnNsYXRlZCB0byBidWZmZXJcbiAgICByZXN1bHQgPSB0aGlzLl9jcmVhdGVFbmNvZGVyQnVmZmVyKGRhdGEpO1xuICB9IGVsc2UgaWYgKHN0YXRlLmNob2ljZSkge1xuICAgIHJlc3VsdCA9IHRoaXMuX2VuY29kZUNob2ljZShkYXRhLCByZXBvcnRlcik7XG4gIH0gZWxzZSBpZiAoc3RhdGUuY2hpbGRyZW4pIHtcbiAgICBjb250ZW50ID0gc3RhdGUuY2hpbGRyZW4ubWFwKGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICBpZiAoY2hpbGQuX2Jhc2VTdGF0ZS50YWcgPT09ICdudWxsXycpXG4gICAgICAgIHJldHVybiBjaGlsZC5fZW5jb2RlKG51bGwsIHJlcG9ydGVyLCBkYXRhKTtcblxuICAgICAgaWYgKGNoaWxkLl9iYXNlU3RhdGUua2V5ID09PSBudWxsKVxuICAgICAgICByZXR1cm4gcmVwb3J0ZXIuZXJyb3IoJ0NoaWxkIHNob3VsZCBoYXZlIGEga2V5Jyk7XG4gICAgICB2YXIgcHJldktleSA9IHJlcG9ydGVyLmVudGVyS2V5KGNoaWxkLl9iYXNlU3RhdGUua2V5KTtcblxuICAgICAgaWYgKHR5cGVvZiBkYXRhICE9PSAnb2JqZWN0JylcbiAgICAgICAgcmV0dXJuIHJlcG9ydGVyLmVycm9yKCdDaGlsZCBleHBlY3RlZCwgYnV0IGlucHV0IGlzIG5vdCBvYmplY3QnKTtcblxuICAgICAgdmFyIHJlcyA9IGNoaWxkLl9lbmNvZGUoZGF0YVtjaGlsZC5fYmFzZVN0YXRlLmtleV0sIHJlcG9ydGVyLCBkYXRhKTtcbiAgICAgIHJlcG9ydGVyLmxlYXZlS2V5KHByZXZLZXkpO1xuXG4gICAgICByZXR1cm4gcmVzO1xuICAgIH0sIHRoaXMpLmZpbHRlcihmdW5jdGlvbihjaGlsZCkge1xuICAgICAgcmV0dXJuIGNoaWxkO1xuICAgIH0pO1xuXG4gICAgY29udGVudCA9IHRoaXMuX2NyZWF0ZUVuY29kZXJCdWZmZXIoY29udGVudCk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKHN0YXRlLnRhZyA9PT0gJ3NlcW9mJyB8fCBzdGF0ZS50YWcgPT09ICdzZXRvZicpIHtcbiAgICAgIC8vIFRPRE8oaW5kdXRueSk6IHRoaXMgc2hvdWxkIGJlIHRocm93biBvbiBEU0wgbGV2ZWxcbiAgICAgIGlmICghKHN0YXRlLmFyZ3MgJiYgc3RhdGUuYXJncy5sZW5ndGggPT09IDEpKVxuICAgICAgICByZXR1cm4gcmVwb3J0ZXIuZXJyb3IoJ1RvbyBtYW55IGFyZ3MgZm9yIDogJyArIHN0YXRlLnRhZyk7XG5cbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShkYXRhKSlcbiAgICAgICAgcmV0dXJuIHJlcG9ydGVyLmVycm9yKCdzZXFvZi9zZXRvZiwgYnV0IGRhdGEgaXMgbm90IEFycmF5Jyk7XG5cbiAgICAgIHZhciBjaGlsZCA9IHRoaXMuY2xvbmUoKTtcbiAgICAgIGNoaWxkLl9iYXNlU3RhdGUuaW1wbGljaXQgPSBudWxsO1xuICAgICAgY29udGVudCA9IHRoaXMuX2NyZWF0ZUVuY29kZXJCdWZmZXIoZGF0YS5tYXAoZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICB2YXIgc3RhdGUgPSB0aGlzLl9iYXNlU3RhdGU7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2dldFVzZShzdGF0ZS5hcmdzWzBdLCBkYXRhKS5fZW5jb2RlKGl0ZW0sIHJlcG9ydGVyKTtcbiAgICAgIH0sIGNoaWxkKSk7XG4gICAgfSBlbHNlIGlmIChzdGF0ZS51c2UgIT09IG51bGwpIHtcbiAgICAgIHJlc3VsdCA9IHRoaXMuX2dldFVzZShzdGF0ZS51c2UsIHBhcmVudCkuX2VuY29kZShkYXRhLCByZXBvcnRlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnRlbnQgPSB0aGlzLl9lbmNvZGVQcmltaXRpdmUoc3RhdGUudGFnLCBkYXRhKTtcbiAgICAgIHByaW1pdGl2ZSA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgLy8gRW5jb2RlIGRhdGEgaXRzZWxmXG4gIHZhciByZXN1bHQ7XG4gIGlmICghc3RhdGUuYW55ICYmIHN0YXRlLmNob2ljZSA9PT0gbnVsbCkge1xuICAgIHZhciB0YWcgPSBzdGF0ZS5pbXBsaWNpdCAhPT0gbnVsbCA/IHN0YXRlLmltcGxpY2l0IDogc3RhdGUudGFnO1xuICAgIHZhciBjbHMgPSBzdGF0ZS5pbXBsaWNpdCA9PT0gbnVsbCA/ICd1bml2ZXJzYWwnIDogJ2NvbnRleHQnO1xuXG4gICAgaWYgKHRhZyA9PT0gbnVsbCkge1xuICAgICAgaWYgKHN0YXRlLnVzZSA9PT0gbnVsbClcbiAgICAgICAgcmVwb3J0ZXIuZXJyb3IoJ1RhZyBjb3VsZCBiZSBvbW1pdGVkIG9ubHkgZm9yIC51c2UoKScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoc3RhdGUudXNlID09PSBudWxsKVxuICAgICAgICByZXN1bHQgPSB0aGlzLl9lbmNvZGVDb21wb3NpdGUodGFnLCBwcmltaXRpdmUsIGNscywgY29udGVudCk7XG4gICAgfVxuICB9XG5cbiAgLy8gV3JhcCBpbiBleHBsaWNpdFxuICBpZiAoc3RhdGUuZXhwbGljaXQgIT09IG51bGwpXG4gICAgcmVzdWx0ID0gdGhpcy5fZW5jb2RlQ29tcG9zaXRlKHN0YXRlLmV4cGxpY2l0LCBmYWxzZSwgJ2NvbnRleHQnLCByZXN1bHQpO1xuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5fZW5jb2RlQ2hvaWNlID0gZnVuY3Rpb24gZW5jb2RlQ2hvaWNlKGRhdGEsIHJlcG9ydGVyKSB7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX2Jhc2VTdGF0ZTtcblxuICB2YXIgbm9kZSA9IHN0YXRlLmNob2ljZVtkYXRhLnR5cGVdO1xuICBpZiAoIW5vZGUpIHtcbiAgICBhc3NlcnQoXG4gICAgICAgIGZhbHNlLFxuICAgICAgICBkYXRhLnR5cGUgKyAnIG5vdCBmb3VuZCBpbiAnICtcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KE9iamVjdC5rZXlzKHN0YXRlLmNob2ljZSkpKTtcbiAgfVxuICByZXR1cm4gbm9kZS5fZW5jb2RlKGRhdGEudmFsdWUsIHJlcG9ydGVyKTtcbn07XG5cbk5vZGUucHJvdG90eXBlLl9lbmNvZGVQcmltaXRpdmUgPSBmdW5jdGlvbiBlbmNvZGVQcmltaXRpdmUodGFnLCBkYXRhKSB7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX2Jhc2VTdGF0ZTtcblxuICBpZiAodGFnID09PSAnb2N0c3RyJyB8fCB0YWcgPT09ICdiaXRzdHInIHx8IHRhZyA9PT0gJ2lhNXN0cicpXG4gICAgcmV0dXJuIHRoaXMuX2VuY29kZVN0cihkYXRhLCB0YWcpO1xuICBlbHNlIGlmICh0YWcgPT09ICdvYmppZCcgJiYgc3RhdGUuYXJncylcbiAgICByZXR1cm4gdGhpcy5fZW5jb2RlT2JqaWQoZGF0YSwgc3RhdGUucmV2ZXJzZUFyZ3NbMF0sIHN0YXRlLmFyZ3NbMV0pO1xuICBlbHNlIGlmICh0YWcgPT09ICdvYmppZCcpXG4gICAgcmV0dXJuIHRoaXMuX2VuY29kZU9iamlkKGRhdGEsIG51bGwsIG51bGwpO1xuICBlbHNlIGlmICh0YWcgPT09ICdnZW50aW1lJyB8fCB0YWcgPT09ICd1dGN0aW1lJylcbiAgICByZXR1cm4gdGhpcy5fZW5jb2RlVGltZShkYXRhLCB0YWcpO1xuICBlbHNlIGlmICh0YWcgPT09ICdudWxsXycpXG4gICAgcmV0dXJuIHRoaXMuX2VuY29kZU51bGwoKTtcbiAgZWxzZSBpZiAodGFnID09PSAnaW50JyB8fCB0YWcgPT09ICdlbnVtJylcbiAgICByZXR1cm4gdGhpcy5fZW5jb2RlSW50KGRhdGEsIHN0YXRlLmFyZ3MgJiYgc3RhdGUucmV2ZXJzZUFyZ3NbMF0pO1xuICBlbHNlIGlmICh0YWcgPT09ICdib29sJylcbiAgICByZXR1cm4gdGhpcy5fZW5jb2RlQm9vbChkYXRhKTtcbiAgZWxzZVxuICAgIHRocm93IG5ldyBFcnJvcignVW5zdXBwb3J0ZWQgdGFnOiAnICsgdGFnKTtcbn07XG4iLCJ2YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG5mdW5jdGlvbiBSZXBvcnRlcihvcHRpb25zKSB7XG4gIHRoaXMuX3JlcG9ydGVyU3RhdGUgPSB7XG4gICAgb2JqOiBudWxsLFxuICAgIHBhdGg6IFtdLFxuICAgIG9wdGlvbnM6IG9wdGlvbnMgfHwge30sXG4gICAgZXJyb3JzOiBbXVxuICB9O1xufVxuZXhwb3J0cy5SZXBvcnRlciA9IFJlcG9ydGVyO1xuXG5SZXBvcnRlci5wcm90b3R5cGUuaXNFcnJvciA9IGZ1bmN0aW9uIGlzRXJyb3Iob2JqKSB7XG4gIHJldHVybiBvYmogaW5zdGFuY2VvZiBSZXBvcnRlckVycm9yO1xufTtcblxuUmVwb3J0ZXIucHJvdG90eXBlLmVudGVyS2V5ID0gZnVuY3Rpb24gZW50ZXJLZXkoa2V5KSB7XG4gIHJldHVybiB0aGlzLl9yZXBvcnRlclN0YXRlLnBhdGgucHVzaChrZXkpO1xufTtcblxuUmVwb3J0ZXIucHJvdG90eXBlLmxlYXZlS2V5ID0gZnVuY3Rpb24gbGVhdmVLZXkoaW5kZXgsIGtleSwgdmFsdWUpIHtcbiAgdmFyIHN0YXRlID0gdGhpcy5fcmVwb3J0ZXJTdGF0ZTtcblxuICBzdGF0ZS5wYXRoID0gc3RhdGUucGF0aC5zbGljZSgwLCBpbmRleCAtIDEpO1xuICBpZiAoc3RhdGUub2JqICE9PSBudWxsKVxuICAgIHN0YXRlLm9ialtrZXldID0gdmFsdWU7XG59O1xuXG5SZXBvcnRlci5wcm90b3R5cGUuZW50ZXJPYmplY3QgPSBmdW5jdGlvbiBlbnRlck9iamVjdCgpIHtcbiAgdmFyIHN0YXRlID0gdGhpcy5fcmVwb3J0ZXJTdGF0ZTtcblxuICB2YXIgcHJldiA9IHN0YXRlLm9iajtcbiAgc3RhdGUub2JqID0ge307XG4gIHJldHVybiBwcmV2O1xufTtcblxuUmVwb3J0ZXIucHJvdG90eXBlLmxlYXZlT2JqZWN0ID0gZnVuY3Rpb24gbGVhdmVPYmplY3QocHJldikge1xuICB2YXIgc3RhdGUgPSB0aGlzLl9yZXBvcnRlclN0YXRlO1xuXG4gIHZhciBub3cgPSBzdGF0ZS5vYmo7XG4gIHN0YXRlLm9iaiA9IHByZXY7XG4gIHJldHVybiBub3c7XG59O1xuXG5SZXBvcnRlci5wcm90b3R5cGUuZXJyb3IgPSBmdW5jdGlvbiBlcnJvcihtc2cpIHtcbiAgdmFyIGVycjtcbiAgdmFyIHN0YXRlID0gdGhpcy5fcmVwb3J0ZXJTdGF0ZTtcblxuICB2YXIgaW5oZXJpdGVkID0gbXNnIGluc3RhbmNlb2YgUmVwb3J0ZXJFcnJvcjtcbiAgaWYgKGluaGVyaXRlZCkge1xuICAgIGVyciA9IG1zZztcbiAgfSBlbHNlIHtcbiAgICBlcnIgPSBuZXcgUmVwb3J0ZXJFcnJvcihzdGF0ZS5wYXRoLm1hcChmdW5jdGlvbihlbGVtKSB7XG4gICAgICByZXR1cm4gJ1snICsgSlNPTi5zdHJpbmdpZnkoZWxlbSkgKyAnXSc7XG4gICAgfSkuam9pbignJyksIG1zZy5tZXNzYWdlIHx8IG1zZywgbXNnLnN0YWNrKTtcbiAgfVxuXG4gIGlmICghc3RhdGUub3B0aW9ucy5wYXJ0aWFsKVxuICAgIHRocm93IGVycjtcblxuICBpZiAoIWluaGVyaXRlZClcbiAgICBzdGF0ZS5lcnJvcnMucHVzaChlcnIpO1xuXG4gIHJldHVybiBlcnI7XG59O1xuXG5SZXBvcnRlci5wcm90b3R5cGUud3JhcFJlc3VsdCA9IGZ1bmN0aW9uIHdyYXBSZXN1bHQocmVzdWx0KSB7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX3JlcG9ydGVyU3RhdGU7XG4gIGlmICghc3RhdGUub3B0aW9ucy5wYXJ0aWFsKVxuICAgIHJldHVybiByZXN1bHQ7XG5cbiAgcmV0dXJuIHtcbiAgICByZXN1bHQ6IHRoaXMuaXNFcnJvcihyZXN1bHQpID8gbnVsbCA6IHJlc3VsdCxcbiAgICBlcnJvcnM6IHN0YXRlLmVycm9yc1xuICB9O1xufTtcblxuZnVuY3Rpb24gUmVwb3J0ZXJFcnJvcihwYXRoLCBtc2cpIHtcbiAgdGhpcy5wYXRoID0gcGF0aDtcbiAgdGhpcy5yZXRocm93KG1zZyk7XG59O1xuaW5oZXJpdHMoUmVwb3J0ZXJFcnJvciwgRXJyb3IpO1xuXG5SZXBvcnRlckVycm9yLnByb3RvdHlwZS5yZXRocm93ID0gZnVuY3Rpb24gcmV0aHJvdyhtc2cpIHtcbiAgdGhpcy5tZXNzYWdlID0gbXNnICsgJyBhdDogJyArICh0aGlzLnBhdGggfHwgJyhzaGFsbG93KScpO1xuICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCBSZXBvcnRlckVycm9yKTtcblxuICByZXR1cm4gdGhpcztcbn07XG4iLCJ2YXIgY29uc3RhbnRzID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzJyk7XG5cbmV4cG9ydHMudGFnQ2xhc3MgPSB7XG4gIDA6ICd1bml2ZXJzYWwnLFxuICAxOiAnYXBwbGljYXRpb24nLFxuICAyOiAnY29udGV4dCcsXG4gIDM6ICdwcml2YXRlJ1xufTtcbmV4cG9ydHMudGFnQ2xhc3NCeU5hbWUgPSBjb25zdGFudHMuX3JldmVyc2UoZXhwb3J0cy50YWdDbGFzcyk7XG5cbmV4cG9ydHMudGFnID0ge1xuICAweDAwOiAnZW5kJyxcbiAgMHgwMTogJ2Jvb2wnLFxuICAweDAyOiAnaW50JyxcbiAgMHgwMzogJ2JpdHN0cicsXG4gIDB4MDQ6ICdvY3RzdHInLFxuICAweDA1OiAnbnVsbF8nLFxuICAweDA2OiAnb2JqaWQnLFxuICAweDA3OiAnb2JqRGVzYycsXG4gIDB4MDg6ICdleHRlcm5hbCcsXG4gIDB4MDk6ICdyZWFsJyxcbiAgMHgwYTogJ2VudW0nLFxuICAweDBiOiAnZW1iZWQnLFxuICAweDBjOiAndXRmOHN0cicsXG4gIDB4MGQ6ICdyZWxhdGl2ZU9pZCcsXG4gIDB4MTA6ICdzZXEnLFxuICAweDExOiAnc2V0JyxcbiAgMHgxMjogJ251bXN0cicsXG4gIDB4MTM6ICdwcmludHN0cicsXG4gIDB4MTQ6ICd0NjFzdHInLFxuICAweDE1OiAndmlkZW9zdHInLFxuICAweDE2OiAnaWE1c3RyJyxcbiAgMHgxNzogJ3V0Y3RpbWUnLFxuICAweDE4OiAnZ2VudGltZScsXG4gIDB4MTk6ICdncmFwaHN0cicsXG4gIDB4MWE6ICdpc282NDZzdHInLFxuICAweDFiOiAnZ2Vuc3RyJyxcbiAgMHgxYzogJ3VuaXN0cicsXG4gIDB4MWQ6ICdjaGFyc3RyJyxcbiAgMHgxZTogJ2JtcHN0cidcbn07XG5leHBvcnRzLnRhZ0J5TmFtZSA9IGNvbnN0YW50cy5fcmV2ZXJzZShleHBvcnRzLnRhZyk7XG4iLCJ2YXIgY29uc3RhbnRzID0gZXhwb3J0cztcblxuLy8gSGVscGVyXG5jb25zdGFudHMuX3JldmVyc2UgPSBmdW5jdGlvbiByZXZlcnNlKG1hcCkge1xuICB2YXIgcmVzID0ge307XG5cbiAgT2JqZWN0LmtleXMobWFwKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgIC8vIENvbnZlcnQga2V5IHRvIGludGVnZXIgaWYgaXQgaXMgc3RyaW5naWZpZWRcbiAgICBpZiAoKGtleSB8IDApID09IGtleSlcbiAgICAgIGtleSA9IGtleSB8IDA7XG5cbiAgICB2YXIgdmFsdWUgPSBtYXBba2V5XTtcbiAgICByZXNbdmFsdWVdID0ga2V5O1xuICB9KTtcblxuICByZXR1cm4gcmVzO1xufTtcblxuY29uc3RhbnRzLmRlciA9IHJlcXVpcmUoJy4vZGVyJyk7XG4iLCJ2YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG52YXIgYXNuMSA9IHJlcXVpcmUoJy4uLy4uL2FzbjEnKTtcbnZhciBiYXNlID0gYXNuMS5iYXNlO1xudmFyIGJpZ251bSA9IGFzbjEuYmlnbnVtO1xuXG4vLyBJbXBvcnQgREVSIGNvbnN0YW50c1xudmFyIGRlciA9IGFzbjEuY29uc3RhbnRzLmRlcjtcblxuZnVuY3Rpb24gREVSRGVjb2RlcihlbnRpdHkpIHtcbiAgdGhpcy5lbmMgPSAnZGVyJztcbiAgdGhpcy5uYW1lID0gZW50aXR5Lm5hbWU7XG4gIHRoaXMuZW50aXR5ID0gZW50aXR5O1xuXG4gIC8vIENvbnN0cnVjdCBiYXNlIHRyZWVcbiAgdGhpcy50cmVlID0gbmV3IERFUk5vZGUoKTtcbiAgdGhpcy50cmVlLl9pbml0KGVudGl0eS5ib2R5KTtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IERFUkRlY29kZXI7XG5cbkRFUkRlY29kZXIucHJvdG90eXBlLmRlY29kZSA9IGZ1bmN0aW9uIGRlY29kZShkYXRhLCBvcHRpb25zKSB7XG4gIGlmICghKGRhdGEgaW5zdGFuY2VvZiBiYXNlLkRlY29kZXJCdWZmZXIpKVxuICAgIGRhdGEgPSBuZXcgYmFzZS5EZWNvZGVyQnVmZmVyKGRhdGEsIG9wdGlvbnMpO1xuXG4gIHJldHVybiB0aGlzLnRyZWUuX2RlY29kZShkYXRhLCBvcHRpb25zKTtcbn07XG5cbi8vIFRyZWUgbWV0aG9kc1xuXG5mdW5jdGlvbiBERVJOb2RlKHBhcmVudCkge1xuICBiYXNlLk5vZGUuY2FsbCh0aGlzLCAnZGVyJywgcGFyZW50KTtcbn1cbmluaGVyaXRzKERFUk5vZGUsIGJhc2UuTm9kZSk7XG5cbkRFUk5vZGUucHJvdG90eXBlLl9wZWVrVGFnID0gZnVuY3Rpb24gcGVla1RhZyhidWZmZXIsIHRhZykge1xuICBpZiAoYnVmZmVyLmlzRW1wdHkoKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgdmFyIHN0YXRlID0gYnVmZmVyLnNhdmUoKTtcbiAgdmFyIGRlY29kZWRUYWcgPSBkZXJEZWNvZGVUYWcoYnVmZmVyLCAnRmFpbGVkIHRvIHBlZWsgdGFnOiBcIicgKyB0YWcgKyAnXCInKTtcbiAgaWYgKGJ1ZmZlci5pc0Vycm9yKGRlY29kZWRUYWcpKVxuICAgIHJldHVybiBkZWNvZGVkVGFnO1xuXG4gIGJ1ZmZlci5yZXN0b3JlKHN0YXRlKTtcblxuICByZXR1cm4gZGVjb2RlZFRhZy50YWcgPT09IHRhZyB8fCBkZWNvZGVkVGFnLnRhZ1N0ciA9PT0gdGFnO1xufTtcblxuREVSTm9kZS5wcm90b3R5cGUuX2RlY29kZVRhZyA9IGZ1bmN0aW9uIGRlY29kZVRhZyhidWZmZXIsIHRhZywgYW55KSB7XG4gIHZhciBkZWNvZGVkVGFnID0gZGVyRGVjb2RlVGFnKGJ1ZmZlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0ZhaWxlZCB0byBkZWNvZGUgdGFnIG9mIFwiJyArIHRhZyArICdcIicpO1xuICBpZiAoYnVmZmVyLmlzRXJyb3IoZGVjb2RlZFRhZykpXG4gICAgcmV0dXJuIGRlY29kZWRUYWc7XG5cbiAgdmFyIGxlbiA9IGRlckRlY29kZUxlbihidWZmZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgZGVjb2RlZFRhZy5wcmltaXRpdmUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgJ0ZhaWxlZCB0byBnZXQgbGVuZ3RoIG9mIFwiJyArIHRhZyArICdcIicpO1xuXG4gIC8vIEZhaWx1cmVcbiAgaWYgKGJ1ZmZlci5pc0Vycm9yKGxlbikpXG4gICAgcmV0dXJuIGxlbjtcblxuICBpZiAoIWFueSAmJlxuICAgICAgZGVjb2RlZFRhZy50YWcgIT09IHRhZyAmJlxuICAgICAgZGVjb2RlZFRhZy50YWdTdHIgIT09IHRhZyAmJlxuICAgICAgZGVjb2RlZFRhZy50YWdTdHIgKyAnb2YnICE9PSB0YWcpIHtcbiAgICByZXR1cm4gYnVmZmVyLmVycm9yKCdGYWlsZWQgdG8gbWF0Y2ggdGFnOiBcIicgKyB0YWcgKyAnXCInKTtcbiAgfVxuXG4gIGlmIChkZWNvZGVkVGFnLnByaW1pdGl2ZSB8fCBsZW4gIT09IG51bGwpXG4gICAgcmV0dXJuIGJ1ZmZlci5za2lwKGxlbiwgJ0ZhaWxlZCB0byBtYXRjaCBib2R5IG9mOiBcIicgKyB0YWcgKyAnXCInKTtcblxuICAvLyBJbmRlZmluaXRlIGxlbmd0aC4uLiBmaW5kIEVORCB0YWdcbiAgdmFyIHN0YXRlID0gYnVmZmVyLnN0YXJ0KCk7XG4gIHZhciByZXMgPSB0aGlzLl9za2lwVW50aWxFbmQoXG4gICAgICBidWZmZXIsXG4gICAgICAnRmFpbGVkIHRvIHNraXAgaW5kZWZpbml0ZSBsZW5ndGggYm9keTogXCInICsgdGhpcy50YWcgKyAnXCInKTtcbiAgaWYgKGJ1ZmZlci5pc0Vycm9yKHJlcykpXG4gICAgcmV0dXJuIHJlcztcblxuICByZXR1cm4gYnVmZmVyLmN1dChzdGF0ZSk7XG59O1xuXG5ERVJOb2RlLnByb3RvdHlwZS5fc2tpcFVudGlsRW5kID0gZnVuY3Rpb24gc2tpcFVudGlsRW5kKGJ1ZmZlciwgZmFpbCkge1xuICB3aGlsZSAodHJ1ZSkge1xuICAgIHZhciB0YWcgPSBkZXJEZWNvZGVUYWcoYnVmZmVyLCBmYWlsKTtcbiAgICBpZiAoYnVmZmVyLmlzRXJyb3IodGFnKSlcbiAgICAgIHJldHVybiB0YWc7XG4gICAgdmFyIGxlbiA9IGRlckRlY29kZUxlbihidWZmZXIsIHRhZy5wcmltaXRpdmUsIGZhaWwpO1xuICAgIGlmIChidWZmZXIuaXNFcnJvcihsZW4pKVxuICAgICAgcmV0dXJuIGxlbjtcblxuICAgIHZhciByZXM7XG4gICAgaWYgKHRhZy5wcmltaXRpdmUgfHwgbGVuICE9PSBudWxsKVxuICAgICAgcmVzID0gYnVmZmVyLnNraXAobGVuKVxuICAgIGVsc2VcbiAgICAgIHJlcyA9IHRoaXMuX3NraXBVbnRpbEVuZChidWZmZXIsIGZhaWwpO1xuXG4gICAgLy8gRmFpbHVyZVxuICAgIGlmIChidWZmZXIuaXNFcnJvcihyZXMpKVxuICAgICAgcmV0dXJuIHJlcztcblxuICAgIGlmICh0YWcudGFnU3RyID09PSAnZW5kJylcbiAgICAgIGJyZWFrO1xuICB9XG59O1xuXG5ERVJOb2RlLnByb3RvdHlwZS5fZGVjb2RlTGlzdCA9IGZ1bmN0aW9uIGRlY29kZUxpc3QoYnVmZmVyLCB0YWcsIGRlY29kZXIpIHtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICB3aGlsZSAoIWJ1ZmZlci5pc0VtcHR5KCkpIHtcbiAgICB2YXIgcG9zc2libGVFbmQgPSB0aGlzLl9wZWVrVGFnKGJ1ZmZlciwgJ2VuZCcpO1xuICAgIGlmIChidWZmZXIuaXNFcnJvcihwb3NzaWJsZUVuZCkpXG4gICAgICByZXR1cm4gcG9zc2libGVFbmQ7XG5cbiAgICB2YXIgcmVzID0gZGVjb2Rlci5kZWNvZGUoYnVmZmVyLCAnZGVyJyk7XG4gICAgaWYgKGJ1ZmZlci5pc0Vycm9yKHJlcykgJiYgcG9zc2libGVFbmQpXG4gICAgICBicmVhaztcbiAgICByZXN1bHQucHVzaChyZXMpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5ERVJOb2RlLnByb3RvdHlwZS5fZGVjb2RlU3RyID0gZnVuY3Rpb24gZGVjb2RlU3RyKGJ1ZmZlciwgdGFnKSB7XG4gIGlmICh0YWcgPT09ICdvY3RzdHInKSB7XG4gICAgcmV0dXJuIGJ1ZmZlci5yYXcoKTtcbiAgfSBlbHNlIGlmICh0YWcgPT09ICdiaXRzdHInKSB7XG4gICAgdmFyIHVudXNlZCA9IGJ1ZmZlci5yZWFkVUludDgoKTtcbiAgICBpZiAoYnVmZmVyLmlzRXJyb3IodW51c2VkKSlcbiAgICAgIHJldHVybiB1bnVzZWQ7XG5cbiAgICByZXR1cm4geyB1bnVzZWQ6IHVudXNlZCwgZGF0YTogYnVmZmVyLnJhdygpIH07XG4gIH0gZWxzZSBpZiAodGFnID09PSAnaWE1c3RyJykge1xuICAgIHJldHVybiBidWZmZXIucmF3KCkudG9TdHJpbmcoKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdGhpcy5lcnJvcignRGVjb2Rpbmcgb2Ygc3RyaW5nIHR5cGU6ICcgKyB0YWcgKyAnIHVuc3VwcG9ydGVkJyk7XG4gIH1cbn07XG5cbkRFUk5vZGUucHJvdG90eXBlLl9kZWNvZGVPYmppZCA9IGZ1bmN0aW9uIGRlY29kZU9iamlkKGJ1ZmZlciwgdmFsdWVzLCByZWxhdGl2ZSkge1xuICB2YXIgaWRlbnRpZmllcnMgPSBbXTtcbiAgdmFyIGlkZW50ID0gMDtcbiAgd2hpbGUgKCFidWZmZXIuaXNFbXB0eSgpKSB7XG4gICAgdmFyIHN1YmlkZW50ID0gYnVmZmVyLnJlYWRVSW50OCgpO1xuICAgIGlkZW50IDw8PSA3O1xuICAgIGlkZW50IHw9IHN1YmlkZW50ICYgMHg3ZjtcbiAgICBpZiAoKHN1YmlkZW50ICYgMHg4MCkgPT09IDApIHtcbiAgICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnQpO1xuICAgICAgaWRlbnQgPSAwO1xuICAgIH1cbiAgfVxuICBpZiAoc3ViaWRlbnQgJiAweDgwKVxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnQpO1xuXG4gIHZhciBmaXJzdCA9IChpZGVudGlmaWVyc1swXSAvIDQwKSB8IDA7XG4gIHZhciBzZWNvbmQgPSBpZGVudGlmaWVyc1swXSAlIDQwO1xuXG4gIGlmIChyZWxhdGl2ZSlcbiAgICByZXN1bHQgPSBpZGVudGlmaWVycztcbiAgZWxzZVxuICAgIHJlc3VsdCA9IFtmaXJzdCwgc2Vjb25kXS5jb25jYXQoaWRlbnRpZmllcnMuc2xpY2UoMSkpO1xuXG4gIGlmICh2YWx1ZXMpXG4gICAgcmVzdWx0ID0gdmFsdWVzW3Jlc3VsdC5qb2luKCcgJyldO1xuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5ERVJOb2RlLnByb3RvdHlwZS5fZGVjb2RlVGltZSA9IGZ1bmN0aW9uIGRlY29kZVRpbWUoYnVmZmVyLCB0YWcpIHtcbiAgdmFyIHN0ciA9IGJ1ZmZlci5yYXcoKS50b1N0cmluZygpO1xuICBpZiAodGFnID09PSAnZ2VudGltZScpIHtcbiAgICB2YXIgeWVhciA9IHN0ci5zbGljZSgwLCA0KSB8IDA7XG4gICAgdmFyIG1vbiA9IHN0ci5zbGljZSg0LCA2KSB8IDA7XG4gICAgdmFyIGRheSA9IHN0ci5zbGljZSg2LCA4KSB8IDA7XG4gICAgdmFyIGhvdXIgPSBzdHIuc2xpY2UoOCwgMTApIHwgMDtcbiAgICB2YXIgbWluID0gc3RyLnNsaWNlKDEwLCAxMikgfCAwO1xuICAgIHZhciBzZWMgPSBzdHIuc2xpY2UoMTIsIDE0KSB8IDA7XG4gIH0gZWxzZSBpZiAodGFnID09PSAndXRjdGltZScpIHtcbiAgICB2YXIgeWVhciA9IHN0ci5zbGljZSgwLCAyKSB8IDA7XG4gICAgdmFyIG1vbiA9IHN0ci5zbGljZSgyLCA0KSB8IDA7XG4gICAgdmFyIGRheSA9IHN0ci5zbGljZSg0LCA2KSB8IDA7XG4gICAgdmFyIGhvdXIgPSBzdHIuc2xpY2UoNiwgOCkgfCAwO1xuICAgIHZhciBtaW4gPSBzdHIuc2xpY2UoOCwgMTApIHwgMDtcbiAgICB2YXIgc2VjID0gc3RyLnNsaWNlKDEwLCAxMikgfCAwO1xuICAgIGlmICh5ZWFyIDwgNzApXG4gICAgICB5ZWFyID0gMjAwMCArIHllYXI7XG4gICAgZWxzZVxuICAgICAgeWVhciA9IDE5MDAgKyB5ZWFyO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0aGlzLmVycm9yKCdEZWNvZGluZyAnICsgdGFnICsgJyB0aW1lIGlzIG5vdCBzdXBwb3J0ZWQgeWV0Jyk7XG4gIH1cblxuICByZXR1cm4gRGF0ZS5VVEMoeWVhciwgbW9uIC0gMSwgZGF5LCBob3VyLCBtaW4sIHNlYywgMCk7XG59O1xuXG5ERVJOb2RlLnByb3RvdHlwZS5fZGVjb2RlTnVsbCA9IGZ1bmN0aW9uIGRlY29kZU51bGwoYnVmZmVyKSB7XG4gIHJldHVybiBudWxsO1xufTtcblxuREVSTm9kZS5wcm90b3R5cGUuX2RlY29kZUJvb2wgPSBmdW5jdGlvbiBkZWNvZGVCb29sKGJ1ZmZlcikge1xuICB2YXIgcmVzID0gYnVmZmVyLnJlYWRVSW50OCgpO1xuICBpZiAoYnVmZmVyLmlzRXJyb3IocmVzKSlcbiAgICByZXR1cm4gcmVzO1xuICBlbHNlXG4gICAgcmV0dXJuIHJlcyAhPT0gMDtcbn07XG5cbkRFUk5vZGUucHJvdG90eXBlLl9kZWNvZGVJbnQgPSBmdW5jdGlvbiBkZWNvZGVJbnQoYnVmZmVyLCB2YWx1ZXMpIHtcbiAgdmFyIHJlcyA9IDA7XG5cbiAgLy8gQmlnaW50LCByZXR1cm4gYXMgaXQgaXMgKGFzc3VtZSBiaWcgZW5kaWFuKVxuICB2YXIgcmF3ID0gYnVmZmVyLnJhdygpO1xuICBpZiAocmF3Lmxlbmd0aCA+IDMpXG4gICAgcmV0dXJuIG5ldyBiaWdudW0ocmF3KTtcblxuICB3aGlsZSAoIWJ1ZmZlci5pc0VtcHR5KCkpIHtcbiAgICByZXMgPDw9IDg7XG4gICAgdmFyIGkgPSBidWZmZXIucmVhZFVJbnQ4KCk7XG4gICAgaWYgKGJ1ZmZlci5pc0Vycm9yKGkpKVxuICAgICAgcmV0dXJuIGk7XG4gICAgcmVzIHw9IGk7XG4gIH1cblxuICBpZiAodmFsdWVzKVxuICAgIHJlcyA9IHZhbHVlc1tyZXNdIHx8IHJlcztcblxuICByZXR1cm4gcmVzO1xufTtcblxuREVSTm9kZS5wcm90b3R5cGUuX3VzZSA9IGZ1bmN0aW9uIHVzZShlbnRpdHksIG9iaikge1xuICBpZiAodHlwZW9mIGVudGl0eSA9PT0gJ2Z1bmN0aW9uJylcbiAgICBlbnRpdHkgPSBlbnRpdHkob2JqKTtcbiAgcmV0dXJuIGVudGl0eS5fZ2V0RGVjb2RlcignZGVyJykudHJlZTtcbn07XG5cbi8vIFV0aWxpdHkgbWV0aG9kc1xuXG5mdW5jdGlvbiBkZXJEZWNvZGVUYWcoYnVmLCBmYWlsKSB7XG4gIHZhciB0YWcgPSBidWYucmVhZFVJbnQ4KGZhaWwpO1xuICBpZiAoYnVmLmlzRXJyb3IodGFnKSlcbiAgICByZXR1cm4gdGFnO1xuXG4gIHZhciBjbHMgPSBkZXIudGFnQ2xhc3NbdGFnID4+IDZdO1xuICB2YXIgcHJpbWl0aXZlID0gKHRhZyAmIDB4MjApID09PSAwO1xuXG4gIC8vIE11bHRpLW9jdGV0IHRhZyAtIGxvYWRcbiAgaWYgKCh0YWcgJiAweDFmKSA9PT0gMHgxZikge1xuICAgIHZhciBvY3QgPSB0YWc7XG4gICAgdGFnID0gMDtcbiAgICB3aGlsZSAoKG9jdCAmIDB4ODApID09PSAweDgwKSB7XG4gICAgICBvY3QgPSBidWYucmVhZFVJbnQ4KGZhaWwpO1xuICAgICAgaWYgKGJ1Zi5pc0Vycm9yKG9jdCkpXG4gICAgICAgIHJldHVybiBvY3Q7XG5cbiAgICAgIHRhZyA8PD0gNztcbiAgICAgIHRhZyB8PSBvY3QgJiAweDdmO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0YWcgJj0gMHgxZjtcbiAgfVxuICB2YXIgdGFnU3RyID0gZGVyLnRhZ1t0YWddO1xuXG4gIHJldHVybiB7XG4gICAgY2xzOiBjbHMsXG4gICAgcHJpbWl0aXZlOiBwcmltaXRpdmUsXG4gICAgdGFnOiB0YWcsXG4gICAgdGFnU3RyOiB0YWdTdHJcbiAgfTtcbn1cblxuZnVuY3Rpb24gZGVyRGVjb2RlTGVuKGJ1ZiwgcHJpbWl0aXZlLCBmYWlsKSB7XG4gIHZhciBsZW4gPSBidWYucmVhZFVJbnQ4KGZhaWwpO1xuICBpZiAoYnVmLmlzRXJyb3IobGVuKSlcbiAgICByZXR1cm4gbGVuO1xuXG4gIC8vIEluZGVmaW5pdGUgZm9ybVxuICBpZiAoIXByaW1pdGl2ZSAmJiBsZW4gPT09IDB4ODApXG4gICAgcmV0dXJuIG51bGw7XG5cbiAgLy8gRGVmaW5pdGUgZm9ybVxuICBpZiAoKGxlbiAmIDB4ODApID09PSAwKSB7XG4gICAgLy8gU2hvcnQgZm9ybVxuICAgIHJldHVybiBsZW47XG4gIH1cblxuICAvLyBMb25nIGZvcm1cbiAgdmFyIG51bSA9IGxlbiAmIDB4N2Y7XG4gIGlmIChudW0gPj0gNClcbiAgICByZXR1cm4gYnVmLmVycm9yKCdsZW5ndGggb2N0ZWN0IGlzIHRvbyBsb25nJyk7XG5cbiAgbGVuID0gMDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW07IGkrKykge1xuICAgIGxlbiA8PD0gODtcbiAgICB2YXIgaiA9IGJ1Zi5yZWFkVUludDgoZmFpbCk7XG4gICAgaWYgKGJ1Zi5pc0Vycm9yKGopKVxuICAgICAgcmV0dXJuIGo7XG4gICAgbGVuIHw9IGo7XG4gIH1cblxuICByZXR1cm4gbGVuO1xufVxuIiwidmFyIGRlY29kZXJzID0gZXhwb3J0cztcblxuZGVjb2RlcnMuZGVyID0gcmVxdWlyZSgnLi9kZXInKTtcbiIsInZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG52YXIgQnVmZmVyID0gcmVxdWlyZSgnYnVmZmVyJykuQnVmZmVyO1xuXG52YXIgYXNuMSA9IHJlcXVpcmUoJy4uLy4uL2FzbjEnKTtcbnZhciBiYXNlID0gYXNuMS5iYXNlO1xudmFyIGJpZ251bSA9IGFzbjEuYmlnbnVtO1xuXG4vLyBJbXBvcnQgREVSIGNvbnN0YW50c1xudmFyIGRlciA9IGFzbjEuY29uc3RhbnRzLmRlcjtcblxuZnVuY3Rpb24gREVSRW5jb2RlcihlbnRpdHkpIHtcbiAgdGhpcy5lbmMgPSAnZGVyJztcbiAgdGhpcy5uYW1lID0gZW50aXR5Lm5hbWU7XG4gIHRoaXMuZW50aXR5ID0gZW50aXR5O1xuXG4gIC8vIENvbnN0cnVjdCBiYXNlIHRyZWVcbiAgdGhpcy50cmVlID0gbmV3IERFUk5vZGUoKTtcbiAgdGhpcy50cmVlLl9pbml0KGVudGl0eS5ib2R5KTtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IERFUkVuY29kZXI7XG5cbkRFUkVuY29kZXIucHJvdG90eXBlLmVuY29kZSA9IGZ1bmN0aW9uIGVuY29kZShkYXRhLCByZXBvcnRlcikge1xuICByZXR1cm4gdGhpcy50cmVlLl9lbmNvZGUoZGF0YSwgcmVwb3J0ZXIpLmpvaW4oKTtcbn07XG5cbi8vIFRyZWUgbWV0aG9kc1xuXG5mdW5jdGlvbiBERVJOb2RlKHBhcmVudCkge1xuICBiYXNlLk5vZGUuY2FsbCh0aGlzLCAnZGVyJywgcGFyZW50KTtcbn1cbmluaGVyaXRzKERFUk5vZGUsIGJhc2UuTm9kZSk7XG5cbkRFUk5vZGUucHJvdG90eXBlLl9lbmNvZGVDb21wb3NpdGUgPSBmdW5jdGlvbiBlbmNvZGVDb21wb3NpdGUodGFnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmltaXRpdmUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNscyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudCkge1xuICB2YXIgZW5jb2RlZFRhZyA9IGVuY29kZVRhZyh0YWcsIHByaW1pdGl2ZSwgY2xzLCB0aGlzLnJlcG9ydGVyKTtcblxuICAvLyBTaG9ydCBmb3JtXG4gIGlmIChjb250ZW50Lmxlbmd0aCA8IDB4ODApIHtcbiAgICB2YXIgaGVhZGVyID0gbmV3IEJ1ZmZlcigyKTtcbiAgICBoZWFkZXJbMF0gPSBlbmNvZGVkVGFnO1xuICAgIGhlYWRlclsxXSA9IGNvbnRlbnQubGVuZ3RoO1xuICAgIHJldHVybiB0aGlzLl9jcmVhdGVFbmNvZGVyQnVmZmVyKFsgaGVhZGVyLCBjb250ZW50IF0pO1xuICB9XG5cbiAgLy8gTG9uZyBmb3JtXG4gIC8vIENvdW50IG9jdGV0cyByZXF1aXJlZCB0byBzdG9yZSBsZW5ndGhcbiAgdmFyIGxlbk9jdGV0cyA9IDE7XG4gIGZvciAodmFyIGkgPSBjb250ZW50Lmxlbmd0aDsgaSA+PSAweDEwMDsgaSA+Pj0gOClcbiAgICBsZW5PY3RldHMrKztcblxuICB2YXIgaGVhZGVyID0gbmV3IEJ1ZmZlcigxICsgMSArIGxlbk9jdGV0cyk7XG4gIGhlYWRlclswXSA9IGVuY29kZWRUYWc7XG4gIGhlYWRlclsxXSA9IDB4ODAgfCBsZW5PY3RldHM7XG5cbiAgZm9yICh2YXIgaSA9IDEgKyBsZW5PY3RldHMsIGogPSBjb250ZW50Lmxlbmd0aDsgaiA+IDA7IGktLSwgaiA+Pj0gOClcbiAgICBoZWFkZXJbaV0gPSBqICYgMHhmZjtcblxuICByZXR1cm4gdGhpcy5fY3JlYXRlRW5jb2RlckJ1ZmZlcihbIGhlYWRlciwgY29udGVudCBdKTtcbn07XG5cbkRFUk5vZGUucHJvdG90eXBlLl9lbmNvZGVTdHIgPSBmdW5jdGlvbiBlbmNvZGVTdHIoc3RyLCB0YWcpIHtcbiAgaWYgKHRhZyA9PT0gJ29jdHN0cicpXG4gICAgcmV0dXJuIHRoaXMuX2NyZWF0ZUVuY29kZXJCdWZmZXIoc3RyKTtcbiAgZWxzZSBpZiAodGFnID09PSAnYml0c3RyJylcbiAgICByZXR1cm4gdGhpcy5fY3JlYXRlRW5jb2RlckJ1ZmZlcihbIHN0ci51bnVzZWQgfCAwLCBzdHIuZGF0YSBdKTtcbiAgZWxzZSBpZiAodGFnID09PSAnaWE1c3RyJylcbiAgICByZXR1cm4gdGhpcy5fY3JlYXRlRW5jb2RlckJ1ZmZlcihzdHIpO1xuICByZXR1cm4gdGhpcy5yZXBvcnRlci5lcnJvcignRW5jb2Rpbmcgb2Ygc3RyaW5nIHR5cGU6ICcgKyB0YWcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnIHVuc3VwcG9ydGVkJyk7XG59O1xuXG5ERVJOb2RlLnByb3RvdHlwZS5fZW5jb2RlT2JqaWQgPSBmdW5jdGlvbiBlbmNvZGVPYmppZChpZCwgdmFsdWVzLCByZWxhdGl2ZSkge1xuICBpZiAodHlwZW9mIGlkID09PSAnc3RyaW5nJykge1xuICAgIGlmICghdmFsdWVzKVxuICAgICAgcmV0dXJuIHRoaXMucmVwb3J0ZXIuZXJyb3IoJ3N0cmluZyBvYmppZCBnaXZlbiwgYnV0IG5vIHZhbHVlcyBtYXAgZm91bmQnKTtcbiAgICBpZiAoIXZhbHVlcy5oYXNPd25Qcm9wZXJ0eShpZCkpXG4gICAgICByZXR1cm4gdGhpcy5yZXBvcnRlci5lcnJvcignb2JqaWQgbm90IGZvdW5kIGluIHZhbHVlcyBtYXAnKTtcbiAgICBpZCA9IHZhbHVlc1tpZF0uc3BsaXQoL1xccysvZyk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpZC5sZW5ndGg7IGkrKylcbiAgICAgIGlkW2ldIHw9IDA7XG4gIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShpZCkpIHtcbiAgICBpZCA9IGlkLnNsaWNlKCk7XG4gIH1cblxuICBpZiAoIUFycmF5LmlzQXJyYXkoaWQpKSB7XG4gICAgcmV0dXJuIHRoaXMucmVwb3J0ZXIuZXJyb3IoJ29iamlkKCkgc2hvdWxkIGJlIGVpdGhlciBhcnJheSBvciBzdHJpbmcsICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdnb3Q6ICcgKyBKU09OLnN0cmluZ2lmeShpZCkpO1xuICB9XG5cbiAgaWYgKCFyZWxhdGl2ZSkge1xuICAgIGlmIChpZFsxXSA+PSA0MClcbiAgICAgIHJldHVybiB0aGlzLnJlcG9ydGVyLmVycm9yKCdTZWNvbmQgb2JqaWQgaWRlbnRpZmllciBPT0InKTtcbiAgICBpZC5zcGxpY2UoMCwgMiwgaWRbMF0gKiA0MCArIGlkWzFdKTtcbiAgfVxuXG4gIC8vIENvdW50IG51bWJlciBvZiBvY3RldHNcbiAgdmFyIHNpemUgPSAwO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGlkLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGlkZW50ID0gaWRbaV07XG4gICAgZm9yIChzaXplKys7IGlkZW50ID49IDB4ODA7IGlkZW50ID4+PSA3KVxuICAgICAgc2l6ZSsrO1xuICB9XG5cbiAgdmFyIG9iamlkID0gbmV3IEJ1ZmZlcihzaXplKTtcbiAgdmFyIG9mZnNldCA9IG9iamlkLmxlbmd0aCAtIDE7XG4gIGZvciAodmFyIGkgPSBpZC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIHZhciBpZGVudCA9IGlkW2ldO1xuICAgIG9iamlkW29mZnNldC0tXSA9IGlkZW50ICYgMHg3ZjtcbiAgICB3aGlsZSAoKGlkZW50ID4+PSA3KSA+IDApXG4gICAgICBvYmppZFtvZmZzZXQtLV0gPSAweDgwIHwgKGlkZW50ICYgMHg3Zik7XG4gIH1cblxuICByZXR1cm4gdGhpcy5fY3JlYXRlRW5jb2RlckJ1ZmZlcihvYmppZCk7XG59O1xuXG5mdW5jdGlvbiB0d28obnVtKSB7XG4gIGlmIChudW0gPD0gMTApXG4gICAgcmV0dXJuICcwJyArIG51bTtcbiAgZWxzZVxuICAgIHJldHVybiBudW07XG59XG5cbkRFUk5vZGUucHJvdG90eXBlLl9lbmNvZGVUaW1lID0gZnVuY3Rpb24gZW5jb2RlVGltZSh0aW1lLCB0YWcpIHtcbiAgdmFyIHN0cjtcbiAgdmFyIGRhdGUgPSBuZXcgRGF0ZSh0aW1lKTtcblxuICBpZiAodGFnID09PSAnZ2VudGltZScpIHtcbiAgICBzdHIgPSBbXG4gICAgICBkYXRlLmdldEZ1bGxZZWFyKCksXG4gICAgICB0d28oZGF0ZS5nZXRVVENNb250aCgpICsgMSksXG4gICAgICB0d28oZGF0ZS5nZXRVVENEYXRlKCkpLFxuICAgICAgdHdvKGRhdGUuZ2V0VVRDSG91cnMoKSksXG4gICAgICB0d28oZGF0ZS5nZXRVVENNaW51dGVzKCkpLFxuICAgICAgdHdvKGRhdGUuZ2V0VVRDU2Vjb25kcygpKSxcbiAgICAgICdaJ1xuICAgIF0uam9pbignJyk7XG4gIH0gZWxzZSBpZiAodGFnID09PSAndXRjdGltZScpIHtcbiAgICBzdHIgPSBbXG4gICAgICBkYXRlLmdldEZ1bGxZZWFyKCkgJSAxMDAsXG4gICAgICB0d28oZGF0ZS5nZXRVVENNb250aCgpICsgMSksXG4gICAgICB0d28oZGF0ZS5nZXRVVENEYXRlKCkpLFxuICAgICAgdHdvKGRhdGUuZ2V0VVRDSG91cnMoKSksXG4gICAgICB0d28oZGF0ZS5nZXRVVENNaW51dGVzKCkpLFxuICAgICAgdHdvKGRhdGUuZ2V0VVRDU2Vjb25kcygpKSxcbiAgICAgICdaJ1xuICAgIF0uam9pbignJyk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5yZXBvcnRlci5lcnJvcignRW5jb2RpbmcgJyArIHRhZyArICcgdGltZSBpcyBub3Qgc3VwcG9ydGVkIHlldCcpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXMuX2VuY29kZVN0cihzdHIsICdvY3RzdHInKTtcbn07XG5cbkRFUk5vZGUucHJvdG90eXBlLl9lbmNvZGVOdWxsID0gZnVuY3Rpb24gZW5jb2RlTnVsbCgpIHtcbiAgcmV0dXJuIHRoaXMuX2NyZWF0ZUVuY29kZXJCdWZmZXIoJycpO1xufTtcblxuREVSTm9kZS5wcm90b3R5cGUuX2VuY29kZUludCA9IGZ1bmN0aW9uIGVuY29kZUludChudW0sIHZhbHVlcykge1xuICBpZiAodHlwZW9mIG51bSA9PT0gJ3N0cmluZycpIHtcbiAgICBpZiAoIXZhbHVlcylcbiAgICAgIHJldHVybiB0aGlzLnJlcG9ydGVyLmVycm9yKCdTdHJpbmcgaW50IG9yIGVudW0gZ2l2ZW4sIGJ1dCBubyB2YWx1ZXMgbWFwJyk7XG4gICAgaWYgKCF2YWx1ZXMuaGFzT3duUHJvcGVydHkobnVtKSkge1xuICAgICAgcmV0dXJuIHRoaXMucmVwb3J0ZXIuZXJyb3IoJ1ZhbHVlcyBtYXAgZG9lc25cXCd0IGNvbnRhaW46ICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkobnVtKSk7XG4gICAgfVxuICAgIG51bSA9IHZhbHVlc1tudW1dO1xuICB9XG5cbiAgLy8gQmlnbnVtLCBhc3N1bWUgYmlnIGVuZGlhblxuICBpZiAoYmlnbnVtICE9PSBudWxsICYmIG51bSBpbnN0YW5jZW9mIGJpZ251bSkge1xuICAgIHZhciBudW1BcnJheSA9IG51bS50b0FycmF5KCk7XG4gICAgaWYobnVtLnNpZ24gPT09IGZhbHNlICYmIG51bUFycmF5WzBdICYgMHg4MCkge1xuICAgICAgbnVtQXJyYXkudW5zaGlmdCgwKTtcbiAgICB9XG4gICAgbnVtID0gbmV3IEJ1ZmZlcihudW1BcnJheSk7XG4gIH1cblxuICBpZiAoQnVmZmVyLmlzQnVmZmVyKG51bSkpIHtcbiAgICB2YXIgc2l6ZSA9IG51bS5sZW5ndGg7XG4gICAgaWYgKG51bS5sZW5ndGggPT09IDApXG4gICAgICBzaXplKys7XG5cbiAgICB2YXIgb3V0ID0gbmV3IEJ1ZmZlcihzaXplKTtcbiAgICBudW0uY29weShvdXQpO1xuICAgIGlmIChudW0ubGVuZ3RoID09PSAwKVxuICAgICAgb3V0WzBdID0gMFxuICAgIHJldHVybiB0aGlzLl9jcmVhdGVFbmNvZGVyQnVmZmVyKG91dCk7XG4gIH1cblxuICBpZiAobnVtIDwgMHg4MClcbiAgICByZXR1cm4gdGhpcy5fY3JlYXRlRW5jb2RlckJ1ZmZlcihudW0pO1xuXG4gIGlmIChudW0gPCAweDEwMClcbiAgICByZXR1cm4gdGhpcy5fY3JlYXRlRW5jb2RlckJ1ZmZlcihbMCwgbnVtXSk7XG5cbiAgdmFyIHNpemUgPSAxO1xuICBmb3IgKHZhciBpID0gbnVtOyBpID49IDB4MTAwOyBpID4+PSA4KVxuICAgIHNpemUrKztcblxuICB2YXIgb3V0ID0gbmV3IEFycmF5KHNpemUpO1xuICBmb3IgKHZhciBpID0gb3V0Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgb3V0W2ldID0gbnVtICYgMHhmZjtcbiAgICBudW0gPj49IDg7XG4gIH1cbiAgaWYob3V0WzBdICYgMHg4MCkge1xuICAgIG91dC51bnNoaWZ0KDApO1xuICB9XG5cbiAgcmV0dXJuIHRoaXMuX2NyZWF0ZUVuY29kZXJCdWZmZXIobmV3IEJ1ZmZlcihvdXQpKTtcbn07XG5cbkRFUk5vZGUucHJvdG90eXBlLl9lbmNvZGVCb29sID0gZnVuY3Rpb24gZW5jb2RlQm9vbCh2YWx1ZSkge1xuICByZXR1cm4gdGhpcy5fY3JlYXRlRW5jb2RlckJ1ZmZlcih2YWx1ZSA/IDB4ZmYgOiAwKTtcbn07XG5cbkRFUk5vZGUucHJvdG90eXBlLl91c2UgPSBmdW5jdGlvbiB1c2UoZW50aXR5LCBvYmopIHtcbiAgaWYgKHR5cGVvZiBlbnRpdHkgPT09ICdmdW5jdGlvbicpXG4gICAgZW50aXR5ID0gZW50aXR5KG9iaik7XG4gIHJldHVybiBlbnRpdHkuX2dldEVuY29kZXIoJ2RlcicpLnRyZWU7XG59O1xuXG5ERVJOb2RlLnByb3RvdHlwZS5fc2tpcERlZmF1bHQgPSBmdW5jdGlvbiBza2lwRGVmYXVsdChkYXRhQnVmZmVyLCByZXBvcnRlciwgcGFyZW50KSB7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX2Jhc2VTdGF0ZTtcbiAgdmFyIGk7XG4gIGlmIChzdGF0ZVsnZGVmYXVsdCddID09PSBudWxsKVxuICAgIHJldHVybiBmYWxzZTtcblxuICB2YXIgZGF0YSA9IGRhdGFCdWZmZXIuam9pbigpO1xuICBpZiAoc3RhdGUuZGVmYXVsdEJ1ZmZlciA9PT0gdW5kZWZpbmVkKVxuICAgIHN0YXRlLmRlZmF1bHRCdWZmZXIgPSB0aGlzLl9lbmNvZGVWYWx1ZShzdGF0ZVsnZGVmYXVsdCddLCByZXBvcnRlciwgcGFyZW50KS5qb2luKCk7XG5cbiAgaWYgKGRhdGEubGVuZ3RoICE9PSBzdGF0ZS5kZWZhdWx0QnVmZmVyLmxlbmd0aClcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgZm9yIChpPTA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKVxuICAgIGlmIChkYXRhW2ldICE9PSBzdGF0ZS5kZWZhdWx0QnVmZmVyW2ldKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gIHJldHVybiB0cnVlO1xufTtcblxuLy8gVXRpbGl0eSBtZXRob2RzXG5cbmZ1bmN0aW9uIGVuY29kZVRhZyh0YWcsIHByaW1pdGl2ZSwgY2xzLCByZXBvcnRlcikge1xuICB2YXIgcmVzO1xuXG4gIGlmICh0YWcgPT09ICdzZXFvZicpXG4gICAgdGFnID0gJ3NlcSc7XG4gIGVsc2UgaWYgKHRhZyA9PT0gJ3NldG9mJylcbiAgICB0YWcgPSAnc2V0JztcblxuICBpZiAoZGVyLnRhZ0J5TmFtZS5oYXNPd25Qcm9wZXJ0eSh0YWcpKVxuICAgIHJlcyA9IGRlci50YWdCeU5hbWVbdGFnXTtcbiAgZWxzZSBpZiAodHlwZW9mIHRhZyA9PT0gJ251bWJlcicgJiYgKHRhZyB8IDApID09PSB0YWcpXG4gICAgcmVzID0gdGFnO1xuICBlbHNlXG4gICAgcmV0dXJuIHJlcG9ydGVyLmVycm9yKCdVbmtub3duIHRhZzogJyArIHRhZyk7XG5cbiAgaWYgKHJlcyA+PSAweDFmKVxuICAgIHJldHVybiByZXBvcnRlci5lcnJvcignTXVsdGktb2N0ZXQgdGFnIGVuY29kaW5nIHVuc3VwcG9ydGVkJyk7XG5cbiAgaWYgKCFwcmltaXRpdmUpXG4gICAgcmVzIHw9IDB4MjA7XG5cbiAgcmVzIHw9IChkZXIudGFnQ2xhc3NCeU5hbWVbY2xzIHx8ICd1bml2ZXJzYWwnXSA8PCA2KTtcblxuICByZXR1cm4gcmVzO1xufVxuIiwidmFyIGVuY29kZXJzID0gZXhwb3J0cztcblxuZW5jb2RlcnMuZGVyID0gcmVxdWlyZSgnLi9kZXInKTtcbiIsIihmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuJ3VzZSBzdHJpY3QnO1xuXG4vLyBVdGlsc1xuXG5mdW5jdGlvbiBhc3NlcnQodmFsLCBtc2cpIHtcbiAgaWYgKCF2YWwpXG4gICAgdGhyb3cgbmV3IEVycm9yKG1zZyB8fCAnQXNzZXJ0aW9uIGZhaWxlZCcpO1xufVxuXG4vLyBDb3VsZCB1c2UgYGluaGVyaXRzYCBtb2R1bGUsIGJ1dCBkb24ndCB3YW50IHRvIG1vdmUgZnJvbSBzaW5nbGUgZmlsZVxuLy8gYXJjaGl0ZWN0dXJlIHlldC5cbmZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvcjtcbiAgdmFyIFRlbXBDdG9yID0gZnVuY3Rpb24gKCkge307XG4gIFRlbXBDdG9yLnByb3RvdHlwZSA9IHN1cGVyQ3Rvci5wcm90b3R5cGU7XG4gIGN0b3IucHJvdG90eXBlID0gbmV3IFRlbXBDdG9yKCk7XG4gIGN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY3Rvcjtcbn1cblxuLy8gQk5cblxuZnVuY3Rpb24gQk4obnVtYmVyLCBiYXNlLCBlbmRpYW4pIHtcbiAgLy8gTWF5IGJlIGBuZXcgQk4oYm4pYCA/XG4gIGlmIChudW1iZXIgIT09IG51bGwgJiZcbiAgICAgIHR5cGVvZiBudW1iZXIgPT09ICdvYmplY3QnICYmXG4gICAgICBBcnJheS5pc0FycmF5KG51bWJlci53b3JkcykpIHtcbiAgICByZXR1cm4gbnVtYmVyO1xuICB9XG5cbiAgdGhpcy5zaWduID0gZmFsc2U7XG4gIHRoaXMud29yZHMgPSBudWxsO1xuICB0aGlzLmxlbmd0aCA9IDA7XG5cbiAgLy8gUmVkdWN0aW9uIGNvbnRleHRcbiAgdGhpcy5yZWQgPSBudWxsO1xuXG4gIGlmIChiYXNlID09PSAnbGUnIHx8IGJhc2UgPT09ICdiZScpIHtcbiAgICBlbmRpYW4gPSBiYXNlO1xuICAgIGJhc2UgPSAxMDtcbiAgfVxuXG4gIGlmIChudW1iZXIgIT09IG51bGwpXG4gICAgdGhpcy5faW5pdChudW1iZXIgfHwgMCwgYmFzZSB8fCAxMCwgZW5kaWFuIHx8ICdiZScpO1xufVxuaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuICBtb2R1bGUuZXhwb3J0cyA9IEJOO1xuZWxzZVxuICBleHBvcnRzLkJOID0gQk47XG5cbkJOLkJOID0gQk47XG5CTi53b3JkU2l6ZSA9IDI2O1xuXG5CTi5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbiBpbml0KG51bWJlciwgYmFzZSwgZW5kaWFuKSB7XG4gIGlmICh0eXBlb2YgbnVtYmVyID09PSAnbnVtYmVyJykge1xuICAgIGlmIChudW1iZXIgPCAwKSB7XG4gICAgICB0aGlzLnNpZ24gPSB0cnVlO1xuICAgICAgbnVtYmVyID0gLW51bWJlcjtcbiAgICB9XG4gICAgaWYgKG51bWJlciA8IDB4NDAwMDAwMCkge1xuICAgICAgdGhpcy53b3JkcyA9IFsgbnVtYmVyICYgMHgzZmZmZmZmIF07XG4gICAgICB0aGlzLmxlbmd0aCA9IDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMud29yZHMgPSBbXG4gICAgICAgIG51bWJlciAmIDB4M2ZmZmZmZixcbiAgICAgICAgKG51bWJlciAvIDB4NDAwMDAwMCkgJiAweDNmZmZmZmZcbiAgICAgIF07XG4gICAgICB0aGlzLmxlbmd0aCA9IDI7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfSBlbHNlIGlmICh0eXBlb2YgbnVtYmVyID09PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiB0aGlzLl9pbml0QXJyYXkobnVtYmVyLCBiYXNlLCBlbmRpYW4pO1xuICB9XG4gIGlmIChiYXNlID09PSAnaGV4JylcbiAgICBiYXNlID0gMTY7XG4gIGFzc2VydChiYXNlID09PSAoYmFzZSB8IDApICYmIGJhc2UgPj0gMiAmJiBiYXNlIDw9IDM2KTtcblxuICBudW1iZXIgPSBudW1iZXIudG9TdHJpbmcoKS5yZXBsYWNlKC9cXHMrL2csICcnKTtcbiAgdmFyIHN0YXJ0ID0gMDtcbiAgaWYgKG51bWJlclswXSA9PT0gJy0nKVxuICAgIHN0YXJ0Kys7XG5cbiAgaWYgKGJhc2UgPT09IDE2KVxuICAgIHRoaXMuX3BhcnNlSGV4KG51bWJlciwgc3RhcnQpO1xuICBlbHNlXG4gICAgdGhpcy5fcGFyc2VCYXNlKG51bWJlciwgYmFzZSwgc3RhcnQpO1xuXG4gIGlmIChudW1iZXJbMF0gPT09ICctJylcbiAgICB0aGlzLnNpZ24gPSB0cnVlO1xuXG4gIHRoaXMuc3RyaXAoKTtcbn07XG5cbkJOLnByb3RvdHlwZS5faW5pdEFycmF5ID0gZnVuY3Rpb24gX2luaXRBcnJheShudW1iZXIsIGJhc2UsIGVuZGlhbikge1xuICAvLyBQZXJoYXBzIGEgVWludDhBcnJheVxuICBhc3NlcnQodHlwZW9mIG51bWJlci5sZW5ndGggPT09ICdudW1iZXInKTtcbiAgdGhpcy5sZW5ndGggPSBNYXRoLmNlaWwobnVtYmVyLmxlbmd0aCAvIDMpO1xuICB0aGlzLndvcmRzID0gbmV3IEFycmF5KHRoaXMubGVuZ3RoKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKVxuICAgIHRoaXMud29yZHNbaV0gPSAwO1xuXG4gIHZhciBvZmYgPSAwO1xuICBpZiAoZW5kaWFuID09PSAnYmUnKSB7XG4gICAgZm9yICh2YXIgaSA9IG51bWJlci5sZW5ndGggLSAxLCBqID0gMDsgaSA+PSAwOyBpIC09IDMpIHtcbiAgICAgIHZhciB3ID0gbnVtYmVyW2ldIHwgKG51bWJlcltpIC0gMV0gPDwgOCkgfCAobnVtYmVyW2kgLSAyXSA8PCAxNik7XG4gICAgICB0aGlzLndvcmRzW2pdIHw9ICh3IDw8IG9mZikgJiAweDNmZmZmZmY7XG4gICAgICB0aGlzLndvcmRzW2ogKyAxXSA9ICh3ID4+PiAoMjYgLSBvZmYpKSAmIDB4M2ZmZmZmZjtcbiAgICAgIG9mZiArPSAyNDtcbiAgICAgIGlmIChvZmYgPj0gMjYpIHtcbiAgICAgICAgb2ZmIC09IDI2O1xuICAgICAgICBqKys7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKGVuZGlhbiA9PT0gJ2xlJykge1xuICAgIGZvciAodmFyIGkgPSAwLCBqID0gMDsgaSA8IG51bWJlci5sZW5ndGg7IGkgKz0gMykge1xuICAgICAgdmFyIHcgPSBudW1iZXJbaV0gfCAobnVtYmVyW2kgKyAxXSA8PCA4KSB8IChudW1iZXJbaSArIDJdIDw8IDE2KTtcbiAgICAgIHRoaXMud29yZHNbal0gfD0gKHcgPDwgb2ZmKSAmIDB4M2ZmZmZmZjtcbiAgICAgIHRoaXMud29yZHNbaiArIDFdID0gKHcgPj4+ICgyNiAtIG9mZikpICYgMHgzZmZmZmZmO1xuICAgICAgb2ZmICs9IDI0O1xuICAgICAgaWYgKG9mZiA+PSAyNikge1xuICAgICAgICBvZmYgLT0gMjY7XG4gICAgICAgIGorKztcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoaXMuc3RyaXAoKTtcbn07XG5cbmZ1bmN0aW9uIHBhcnNlSGV4KHN0ciwgc3RhcnQsIGVuZCkge1xuICB2YXIgciA9IDA7XG4gIHZhciBsZW4gPSBNYXRoLm1pbihzdHIubGVuZ3RoLCBlbmQpO1xuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBsZW47IGkrKykge1xuICAgIHZhciBjID0gc3RyLmNoYXJDb2RlQXQoaSkgLSA0ODtcblxuICAgIHIgPDw9IDQ7XG5cbiAgICAvLyAnYScgLSAnZidcbiAgICBpZiAoYyA+PSA0OSAmJiBjIDw9IDU0KVxuICAgICAgciB8PSBjIC0gNDkgKyAweGE7XG5cbiAgICAvLyAnQScgLSAnRidcbiAgICBlbHNlIGlmIChjID49IDE3ICYmIGMgPD0gMjIpXG4gICAgICByIHw9IGMgLSAxNyArIDB4YTtcblxuICAgIC8vICcwJyAtICc5J1xuICAgIGVsc2VcbiAgICAgIHIgfD0gYyAmIDB4ZjtcbiAgfVxuICByZXR1cm4gcjtcbn1cblxuQk4ucHJvdG90eXBlLl9wYXJzZUhleCA9IGZ1bmN0aW9uIF9wYXJzZUhleChudW1iZXIsIHN0YXJ0KSB7XG4gIC8vIENyZWF0ZSBwb3NzaWJseSBiaWdnZXIgYXJyYXkgdG8gZW5zdXJlIHRoYXQgaXQgZml0cyB0aGUgbnVtYmVyXG4gIHRoaXMubGVuZ3RoID0gTWF0aC5jZWlsKChudW1iZXIubGVuZ3RoIC0gc3RhcnQpIC8gNik7XG4gIHRoaXMud29yZHMgPSBuZXcgQXJyYXkodGhpcy5sZW5ndGgpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspXG4gICAgdGhpcy53b3Jkc1tpXSA9IDA7XG5cbiAgLy8gU2NhbiAyNC1iaXQgY2h1bmtzIGFuZCBhZGQgdGhlbSB0byB0aGUgbnVtYmVyXG4gIHZhciBvZmYgPSAwO1xuICBmb3IgKHZhciBpID0gbnVtYmVyLmxlbmd0aCAtIDYsIGogPSAwOyBpID49IHN0YXJ0OyBpIC09IDYpIHtcbiAgICB2YXIgdyA9IHBhcnNlSGV4KG51bWJlciwgaSwgaSArIDYpO1xuICAgIHRoaXMud29yZHNbal0gfD0gKHcgPDwgb2ZmKSAmIDB4M2ZmZmZmZjtcbiAgICB0aGlzLndvcmRzW2ogKyAxXSB8PSB3ID4+PiAoMjYgLSBvZmYpICYgMHgzZmZmZmY7XG4gICAgb2ZmICs9IDI0O1xuICAgIGlmIChvZmYgPj0gMjYpIHtcbiAgICAgIG9mZiAtPSAyNjtcbiAgICAgIGorKztcbiAgICB9XG4gIH1cbiAgaWYgKGkgKyA2ICE9PSBzdGFydCkge1xuICAgIHZhciB3ID0gcGFyc2VIZXgobnVtYmVyLCBzdGFydCwgaSArIDYpO1xuICAgIHRoaXMud29yZHNbal0gfD0gKHcgPDwgb2ZmKSAmIDB4M2ZmZmZmZjtcbiAgICB0aGlzLndvcmRzW2ogKyAxXSB8PSB3ID4+PiAoMjYgLSBvZmYpICYgMHgzZmZmZmY7XG4gIH1cbiAgdGhpcy5zdHJpcCgpO1xufTtcblxuZnVuY3Rpb24gcGFyc2VCYXNlKHN0ciwgc3RhcnQsIGVuZCwgbXVsKSB7XG4gIHZhciByID0gMDtcbiAgdmFyIGxlbiA9IE1hdGgubWluKHN0ci5sZW5ndGgsIGVuZCk7XG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgdmFyIGMgPSBzdHIuY2hhckNvZGVBdChpKSAtIDQ4O1xuXG4gICAgciAqPSBtdWw7XG5cbiAgICAvLyAnYSdcbiAgICBpZiAoYyA+PSA0OSlcbiAgICAgIHIgKz0gYyAtIDQ5ICsgMHhhO1xuXG4gICAgLy8gJ0EnXG4gICAgZWxzZSBpZiAoYyA+PSAxNylcbiAgICAgIHIgKz0gYyAtIDE3ICsgMHhhO1xuXG4gICAgLy8gJzAnIC0gJzknXG4gICAgZWxzZVxuICAgICAgciArPSBjO1xuICB9XG4gIHJldHVybiByO1xufVxuXG5CTi5wcm90b3R5cGUuX3BhcnNlQmFzZSA9IGZ1bmN0aW9uIF9wYXJzZUJhc2UobnVtYmVyLCBiYXNlLCBzdGFydCkge1xuICAvLyBJbml0aWFsaXplIGFzIHplcm9cbiAgdGhpcy53b3JkcyA9IFsgMCBdO1xuICB0aGlzLmxlbmd0aCA9IDE7XG5cbiAgLy8gRmluZCBsZW5ndGggb2YgbGltYiBpbiBiYXNlXG4gIGZvciAodmFyIGxpbWJMZW4gPSAwLCBsaW1iUG93ID0gMTsgbGltYlBvdyA8PSAweDNmZmZmZmY7IGxpbWJQb3cgKj0gYmFzZSlcbiAgICBsaW1iTGVuKys7XG4gIGxpbWJMZW4tLTtcbiAgbGltYlBvdyA9IChsaW1iUG93IC8gYmFzZSkgfCAwO1xuXG4gIHZhciB0b3RhbCA9IG51bWJlci5sZW5ndGggLSBzdGFydDtcbiAgdmFyIG1vZCA9IHRvdGFsICUgbGltYkxlbjtcbiAgdmFyIGVuZCA9IE1hdGgubWluKHRvdGFsLCB0b3RhbCAtIG1vZCkgKyBzdGFydDtcblxuICB2YXIgd29yZCA9IDA7XG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSArPSBsaW1iTGVuKSB7XG4gICAgd29yZCA9IHBhcnNlQmFzZShudW1iZXIsIGksIGkgKyBsaW1iTGVuLCBiYXNlKTtcblxuICAgIHRoaXMuaW11bG4obGltYlBvdyk7XG4gICAgaWYgKHRoaXMud29yZHNbMF0gKyB3b3JkIDwgMHg0MDAwMDAwKVxuICAgICAgdGhpcy53b3Jkc1swXSArPSB3b3JkO1xuICAgIGVsc2VcbiAgICAgIHRoaXMuX2lhZGRuKHdvcmQpO1xuICB9XG5cbiAgaWYgKG1vZCAhPT0gMCkge1xuICAgIHZhciBwb3cgPSAxO1xuICAgIHZhciB3b3JkID0gcGFyc2VCYXNlKG51bWJlciwgaSwgbnVtYmVyLmxlbmd0aCwgYmFzZSk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1vZDsgaSsrKVxuICAgICAgcG93ICo9IGJhc2U7XG4gICAgdGhpcy5pbXVsbihwb3cpO1xuICAgIGlmICh0aGlzLndvcmRzWzBdICsgd29yZCA8IDB4NDAwMDAwMClcbiAgICAgIHRoaXMud29yZHNbMF0gKz0gd29yZDtcbiAgICBlbHNlXG4gICAgICB0aGlzLl9pYWRkbih3b3JkKTtcbiAgfVxufTtcblxuQk4ucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbiBjb3B5KGRlc3QpIHtcbiAgZGVzdC53b3JkcyA9IG5ldyBBcnJheSh0aGlzLmxlbmd0aCk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKylcbiAgICBkZXN0LndvcmRzW2ldID0gdGhpcy53b3Jkc1tpXTtcbiAgZGVzdC5sZW5ndGggPSB0aGlzLmxlbmd0aDtcbiAgZGVzdC5zaWduID0gdGhpcy5zaWduO1xuICBkZXN0LnJlZCA9IHRoaXMucmVkO1xufTtcblxuQk4ucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24gY2xvbmUoKSB7XG4gIHZhciByID0gbmV3IEJOKG51bGwpO1xuICB0aGlzLmNvcHkocik7XG4gIHJldHVybiByO1xufTtcblxuLy8gUmVtb3ZlIGxlYWRpbmcgYDBgIGZyb20gYHRoaXNgXG5CTi5wcm90b3R5cGUuc3RyaXAgPSBmdW5jdGlvbiBzdHJpcCgpIHtcbiAgd2hpbGUgKHRoaXMubGVuZ3RoID4gMSAmJiB0aGlzLndvcmRzW3RoaXMubGVuZ3RoIC0gMV0gPT09IDApXG4gICAgdGhpcy5sZW5ndGgtLTtcbiAgcmV0dXJuIHRoaXMuX25vcm1TaWduKCk7XG59O1xuXG5CTi5wcm90b3R5cGUuX25vcm1TaWduID0gZnVuY3Rpb24gX25vcm1TaWduKCkge1xuICAvLyAtMCA9IDBcbiAgaWYgKHRoaXMubGVuZ3RoID09PSAxICYmIHRoaXMud29yZHNbMF0gPT09IDApXG4gICAgdGhpcy5zaWduID0gZmFsc2U7XG4gIHJldHVybiB0aGlzO1xufTtcblxuQk4ucHJvdG90eXBlLmluc3BlY3QgPSBmdW5jdGlvbiBpbnNwZWN0KCkge1xuICByZXR1cm4gKHRoaXMucmVkID8gJzxCTi1SOiAnIDogJzxCTjogJykgKyB0aGlzLnRvU3RyaW5nKDE2KSArICc+Jztcbn07XG5cbi8qXG5cbnZhciB6ZXJvcyA9IFtdO1xudmFyIGdyb3VwU2l6ZXMgPSBbXTtcbnZhciBncm91cEJhc2VzID0gW107XG5cbnZhciBzID0gJyc7XG52YXIgaSA9IC0xO1xud2hpbGUgKCsraSA8IEJOLndvcmRTaXplKSB7XG4gIHplcm9zW2ldID0gcztcbiAgcyArPSAnMCc7XG59XG5ncm91cFNpemVzWzBdID0gMDtcbmdyb3VwU2l6ZXNbMV0gPSAwO1xuZ3JvdXBCYXNlc1swXSA9IDA7XG5ncm91cEJhc2VzWzFdID0gMDtcbnZhciBiYXNlID0gMiAtIDE7XG53aGlsZSAoKytiYXNlIDwgMzYgKyAxKSB7XG4gIHZhciBncm91cFNpemUgPSAwO1xuICB2YXIgZ3JvdXBCYXNlID0gMTtcbiAgd2hpbGUgKGdyb3VwQmFzZSA8ICgxIDw8IEJOLndvcmRTaXplKSAvIGJhc2UpIHtcbiAgICBncm91cEJhc2UgKj0gYmFzZTtcbiAgICBncm91cFNpemUgKz0gMTtcbiAgfVxuICBncm91cFNpemVzW2Jhc2VdID0gZ3JvdXBTaXplO1xuICBncm91cEJhc2VzW2Jhc2VdID0gZ3JvdXBCYXNlO1xufVxuXG4qL1xuXG52YXIgemVyb3MgPSBbXG4gICcnLFxuICAnMCcsXG4gICcwMCcsXG4gICcwMDAnLFxuICAnMDAwMCcsXG4gICcwMDAwMCcsXG4gICcwMDAwMDAnLFxuICAnMDAwMDAwMCcsXG4gICcwMDAwMDAwMCcsXG4gICcwMDAwMDAwMDAnLFxuICAnMDAwMDAwMDAwMCcsXG4gICcwMDAwMDAwMDAwMCcsXG4gICcwMDAwMDAwMDAwMDAnLFxuICAnMDAwMDAwMDAwMDAwMCcsXG4gICcwMDAwMDAwMDAwMDAwMCcsXG4gICcwMDAwMDAwMDAwMDAwMDAnLFxuICAnMDAwMDAwMDAwMDAwMDAwMCcsXG4gICcwMDAwMDAwMDAwMDAwMDAwMCcsXG4gICcwMDAwMDAwMDAwMDAwMDAwMDAnLFxuICAnMDAwMDAwMDAwMDAwMDAwMDAwMCcsXG4gICcwMDAwMDAwMDAwMDAwMDAwMDAwMCcsXG4gICcwMDAwMDAwMDAwMDAwMDAwMDAwMDAnLFxuICAnMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCcsXG4gICcwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCcsXG4gICcwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAnLFxuICAnMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCdcbl07XG5cbnZhciBncm91cFNpemVzID0gW1xuICAwLCAwLFxuICAyNSwgMTYsIDEyLCAxMSwgMTAsIDksIDgsXG4gIDgsIDcsIDcsIDcsIDcsIDYsIDYsXG4gIDYsIDYsIDYsIDYsIDYsIDUsIDUsXG4gIDUsIDUsIDUsIDUsIDUsIDUsIDUsXG4gIDUsIDUsIDUsIDUsIDUsIDUsIDVcbl07XG5cbnZhciBncm91cEJhc2VzID0gW1xuICAwLCAwLFxuICAzMzU1NDQzMiwgNDMwNDY3MjEsIDE2Nzc3MjE2LCA0ODgyODEyNSwgNjA0NjYxNzYsIDQwMzUzNjA3LCAxNjc3NzIxNixcbiAgNDMwNDY3MjEsIDEwMDAwMDAwLCAxOTQ4NzE3MSwgMzU4MzE4MDgsIDYyNzQ4NTE3LCA3NTI5NTM2LCAxMTM5MDYyNSxcbiAgMTY3NzcyMTYsIDI0MTM3NTY5LCAzNDAxMjIyNCwgNDcwNDU4ODEsIDY0MDAwMDAwLCA0MDg0MTAxLCA1MTUzNjMyLFxuICA2NDM2MzQzLCA3OTYyNjI0LCA5NzY1NjI1LCAxMTg4MTM3NiwgMTQzNDg5MDcsIDE3MjEwMzY4LCAyMDUxMTE0OSxcbiAgMjQzMDAwMDAsIDI4NjI5MTUxLCAzMzU1NDQzMiwgMzkxMzUzOTMsIDQ1NDM1NDI0LCA1MjUyMTg3NSwgNjA0NjYxNzZcbl07XG5cbkJOLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKGJhc2UsIHBhZGRpbmcpIHtcbiAgYmFzZSA9IGJhc2UgfHwgMTA7XG4gIGlmIChiYXNlID09PSAxNiB8fCBiYXNlID09PSAnaGV4Jykge1xuICAgIHZhciBvdXQgPSAnJztcbiAgICB2YXIgb2ZmID0gMDtcbiAgICB2YXIgcGFkZGluZyA9IHBhZGRpbmcgfCAwIHx8IDE7XG4gICAgdmFyIGNhcnJ5ID0gMDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB3ID0gdGhpcy53b3Jkc1tpXTtcbiAgICAgIHZhciB3b3JkID0gKCgodyA8PCBvZmYpIHwgY2FycnkpICYgMHhmZmZmZmYpLnRvU3RyaW5nKDE2KTtcbiAgICAgIGNhcnJ5ID0gKHcgPj4+ICgyNCAtIG9mZikpICYgMHhmZmZmZmY7XG4gICAgICBpZiAoY2FycnkgIT09IDAgfHwgaSAhPT0gdGhpcy5sZW5ndGggLSAxKVxuICAgICAgICBvdXQgPSB6ZXJvc1s2IC0gd29yZC5sZW5ndGhdICsgd29yZCArIG91dDtcbiAgICAgIGVsc2VcbiAgICAgICAgb3V0ID0gd29yZCArIG91dDtcbiAgICAgIG9mZiArPSAyO1xuICAgICAgaWYgKG9mZiA+PSAyNikge1xuICAgICAgICBvZmYgLT0gMjY7XG4gICAgICAgIGktLTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGNhcnJ5ICE9PSAwKVxuICAgICAgb3V0ID0gY2FycnkudG9TdHJpbmcoMTYpICsgb3V0O1xuICAgIHdoaWxlIChvdXQubGVuZ3RoICUgcGFkZGluZyAhPT0gMClcbiAgICAgIG91dCA9ICcwJyArIG91dDtcbiAgICBpZiAodGhpcy5zaWduKVxuICAgICAgb3V0ID0gJy0nICsgb3V0O1xuICAgIHJldHVybiBvdXQ7XG4gIH0gZWxzZSBpZiAoYmFzZSA9PT0gKGJhc2UgfCAwKSAmJiBiYXNlID49IDIgJiYgYmFzZSA8PSAzNikge1xuICAgIC8vIHZhciBncm91cFNpemUgPSBNYXRoLmZsb29yKEJOLndvcmRTaXplICogTWF0aC5MTjIgLyBNYXRoLmxvZyhiYXNlKSk7XG4gICAgdmFyIGdyb3VwU2l6ZSA9IGdyb3VwU2l6ZXNbYmFzZV07XG4gICAgLy8gdmFyIGdyb3VwQmFzZSA9IE1hdGgucG93KGJhc2UsIGdyb3VwU2l6ZSk7XG4gICAgdmFyIGdyb3VwQmFzZSA9IGdyb3VwQmFzZXNbYmFzZV07XG4gICAgdmFyIG91dCA9ICcnO1xuICAgIHZhciBjID0gdGhpcy5jbG9uZSgpO1xuICAgIGMuc2lnbiA9IGZhbHNlO1xuICAgIHdoaWxlIChjLmNtcG4oMCkgIT09IDApIHtcbiAgICAgIHZhciByID0gYy5tb2RuKGdyb3VwQmFzZSkudG9TdHJpbmcoYmFzZSk7XG4gICAgICBjID0gYy5pZGl2bihncm91cEJhc2UpO1xuXG4gICAgICBpZiAoYy5jbXBuKDApICE9PSAwKVxuICAgICAgICBvdXQgPSB6ZXJvc1tncm91cFNpemUgLSByLmxlbmd0aF0gKyByICsgb3V0O1xuICAgICAgZWxzZVxuICAgICAgICBvdXQgPSByICsgb3V0O1xuICAgIH1cbiAgICBpZiAodGhpcy5jbXBuKDApID09PSAwKVxuICAgICAgb3V0ID0gJzAnICsgb3V0O1xuICAgIGlmICh0aGlzLnNpZ24pXG4gICAgICBvdXQgPSAnLScgKyBvdXQ7XG4gICAgcmV0dXJuIG91dDtcbiAgfSBlbHNlIHtcbiAgICBhc3NlcnQoZmFsc2UsICdCYXNlIHNob3VsZCBiZSBiZXR3ZWVuIDIgYW5kIDM2Jyk7XG4gIH1cbn07XG5cbkJOLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiB0b0pTT04oKSB7XG4gIHJldHVybiB0aGlzLnRvU3RyaW5nKDE2KTtcbn07XG5cbkJOLnByb3RvdHlwZS50b0FycmF5ID0gZnVuY3Rpb24gdG9BcnJheSgpIHtcbiAgdGhpcy5zdHJpcCgpO1xuICB2YXIgcmVzID0gbmV3IEFycmF5KHRoaXMuYnl0ZUxlbmd0aCgpKTtcbiAgcmVzWzBdID0gMDtcblxuICB2YXIgcSA9IHRoaXMuY2xvbmUoKTtcbiAgZm9yICh2YXIgaSA9IDA7IHEuY21wbigwKSAhPT0gMDsgaSsrKSB7XG4gICAgdmFyIGIgPSBxLmFuZGxuKDB4ZmYpO1xuICAgIHEuaXNocm4oOCk7XG5cbiAgICAvLyBBc3N1bWUgYmlnLWVuZGlhblxuICAgIHJlc1tyZXMubGVuZ3RoIC0gaSAtIDFdID0gYjtcbiAgfVxuXG4gIHJldHVybiByZXM7XG59O1xuXG4vKlxuZnVuY3Rpb24gZ2VuQ291bnRCaXRzKGJpdHMpIHtcbiAgdmFyIGFyciA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSBiaXRzIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICB2YXIgYml0ID0gJzB4JyArICgxIDw8IGkpLnRvU3RyaW5nKDE2KTtcbiAgICBhcnIucHVzaCgndyA+PSAnICsgYml0ICsgJyA/ICcgKyAoaSArIDEpKTtcbiAgfVxuXG4gIHJldHVybiBuZXcgRnVuY3Rpb24oJ3cnLCAncmV0dXJuICcgKyBhcnIuam9pbignIDpcXG4nKSArICcgOlxcbjA7Jyk7XG59O1xuXG5CTi5wcm90b3R5cGUuX2NvdW50Qml0cyA9IGdlbkNvdW50Qml0cygyNik7XG4qL1xuXG4vLyBTYWRseSBjaHJvbWUgYXBwcyBjb3VsZCBub3QgY29udGFpbiBgbmV3IEZ1bmN0aW9uKClgIGNhbGxzXG5CTi5wcm90b3R5cGUuX2NvdW50Qml0cyA9IGZ1bmN0aW9uIF9jb3VudEJpdHModykge1xuICByZXR1cm4gdyA+PSAweDIwMDAwMDAgPyAyNiA6XG4gICAgICAgICB3ID49IDB4MTAwMDAwMCA/IDI1IDpcbiAgICAgICAgIHcgPj0gMHg4MDAwMDAgPyAyNCA6XG4gICAgICAgICB3ID49IDB4NDAwMDAwID8gMjMgOlxuICAgICAgICAgdyA+PSAweDIwMDAwMCA/IDIyIDpcbiAgICAgICAgIHcgPj0gMHgxMDAwMDAgPyAyMSA6XG4gICAgICAgICB3ID49IDB4ODAwMDAgPyAyMCA6XG4gICAgICAgICB3ID49IDB4NDAwMDAgPyAxOSA6XG4gICAgICAgICB3ID49IDB4MjAwMDAgPyAxOCA6XG4gICAgICAgICB3ID49IDB4MTAwMDAgPyAxNyA6XG4gICAgICAgICB3ID49IDB4ODAwMCA/IDE2IDpcbiAgICAgICAgIHcgPj0gMHg0MDAwID8gMTUgOlxuICAgICAgICAgdyA+PSAweDIwMDAgPyAxNCA6XG4gICAgICAgICB3ID49IDB4MTAwMCA/IDEzIDpcbiAgICAgICAgIHcgPj0gMHg4MDAgPyAxMiA6XG4gICAgICAgICB3ID49IDB4NDAwID8gMTEgOlxuICAgICAgICAgdyA+PSAweDIwMCA/IDEwIDpcbiAgICAgICAgIHcgPj0gMHgxMDAgPyA5IDpcbiAgICAgICAgIHcgPj0gMHg4MCA/IDggOlxuICAgICAgICAgdyA+PSAweDQwID8gNyA6XG4gICAgICAgICB3ID49IDB4MjAgPyA2IDpcbiAgICAgICAgIHcgPj0gMHgxMCA/IDUgOlxuICAgICAgICAgdyA+PSAweDggPyA0IDpcbiAgICAgICAgIHcgPj0gMHg0ID8gMyA6XG4gICAgICAgICB3ID49IDB4MiA/IDIgOlxuICAgICAgICAgdyA+PSAweDEgPyAxIDpcbiAgICAgICAgIDA7XG59O1xuXG4vLyBSZXR1cm4gbnVtYmVyIG9mIHVzZWQgYml0cyBpbiBhIEJOXG5CTi5wcm90b3R5cGUuYml0TGVuZ3RoID0gZnVuY3Rpb24gYml0TGVuZ3RoKCkge1xuICB2YXIgaGkgPSAwO1xuICB2YXIgdyA9IHRoaXMud29yZHNbdGhpcy5sZW5ndGggLSAxXTtcbiAgdmFyIGhpID0gdGhpcy5fY291bnRCaXRzKHcpO1xuICByZXR1cm4gKHRoaXMubGVuZ3RoIC0gMSkgKiAyNiArIGhpO1xufTtcblxuQk4ucHJvdG90eXBlLmJ5dGVMZW5ndGggPSBmdW5jdGlvbiBieXRlTGVuZ3RoKCkge1xuICByZXR1cm4gTWF0aC5jZWlsKHRoaXMuYml0TGVuZ3RoKCkgLyA4KTtcbn07XG5cbi8vIFJldHVybiBuZWdhdGl2ZSBjbG9uZSBvZiBgdGhpc2BcbkJOLnByb3RvdHlwZS5uZWcgPSBmdW5jdGlvbiBuZWcoKSB7XG4gIGlmICh0aGlzLmNtcG4oMCkgPT09IDApXG4gICAgcmV0dXJuIHRoaXMuY2xvbmUoKTtcblxuICB2YXIgciA9IHRoaXMuY2xvbmUoKTtcbiAgci5zaWduID0gIXRoaXMuc2lnbjtcbiAgcmV0dXJuIHI7XG59O1xuXG5cbi8vIE9yIGBudW1gIHdpdGggYHRoaXNgIGluLXBsYWNlXG5CTi5wcm90b3R5cGUuaW9yID0gZnVuY3Rpb24gaW9yKG51bSkge1xuICB0aGlzLnNpZ24gPSB0aGlzLnNpZ24gfHwgbnVtLnNpZ247XG5cbiAgd2hpbGUgKHRoaXMubGVuZ3RoIDwgbnVtLmxlbmd0aClcbiAgICB0aGlzLndvcmRzW3RoaXMubGVuZ3RoKytdID0gMDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IG51bS5sZW5ndGg7IGkrKylcbiAgICB0aGlzLndvcmRzW2ldID0gdGhpcy53b3Jkc1tpXSB8IG51bS53b3Jkc1tpXTtcblxuICByZXR1cm4gdGhpcy5zdHJpcCgpO1xufTtcblxuXG4vLyBPciBgbnVtYCB3aXRoIGB0aGlzYFxuQk4ucHJvdG90eXBlLm9yID0gZnVuY3Rpb24gb3IobnVtKSB7XG4gIGlmICh0aGlzLmxlbmd0aCA+IG51bS5sZW5ndGgpXG4gICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5pb3IobnVtKTtcbiAgZWxzZVxuICAgIHJldHVybiBudW0uY2xvbmUoKS5pb3IodGhpcyk7XG59O1xuXG5cbi8vIEFuZCBgbnVtYCB3aXRoIGB0aGlzYCBpbi1wbGFjZVxuQk4ucHJvdG90eXBlLmlhbmQgPSBmdW5jdGlvbiBpYW5kKG51bSkge1xuICB0aGlzLnNpZ24gPSB0aGlzLnNpZ24gJiYgbnVtLnNpZ247XG5cbiAgLy8gYiA9IG1pbi1sZW5ndGgobnVtLCB0aGlzKVxuICB2YXIgYjtcbiAgaWYgKHRoaXMubGVuZ3RoID4gbnVtLmxlbmd0aClcbiAgICBiID0gbnVtO1xuICBlbHNlXG4gICAgYiA9IHRoaXM7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBiLmxlbmd0aDsgaSsrKVxuICAgIHRoaXMud29yZHNbaV0gPSB0aGlzLndvcmRzW2ldICYgbnVtLndvcmRzW2ldO1xuXG4gIHRoaXMubGVuZ3RoID0gYi5sZW5ndGg7XG5cbiAgcmV0dXJuIHRoaXMuc3RyaXAoKTtcbn07XG5cblxuLy8gQW5kIGBudW1gIHdpdGggYHRoaXNgXG5CTi5wcm90b3R5cGUuYW5kID0gZnVuY3Rpb24gYW5kKG51bSkge1xuICBpZiAodGhpcy5sZW5ndGggPiBudW0ubGVuZ3RoKVxuICAgIHJldHVybiB0aGlzLmNsb25lKCkuaWFuZChudW0pO1xuICBlbHNlXG4gICAgcmV0dXJuIG51bS5jbG9uZSgpLmlhbmQodGhpcyk7XG59O1xuXG5cbi8vIFhvciBgbnVtYCB3aXRoIGB0aGlzYCBpbi1wbGFjZVxuQk4ucHJvdG90eXBlLml4b3IgPSBmdW5jdGlvbiBpeG9yKG51bSkge1xuICB0aGlzLnNpZ24gPSB0aGlzLnNpZ24gfHwgbnVtLnNpZ247XG5cbiAgLy8gYS5sZW5ndGggPiBiLmxlbmd0aFxuICB2YXIgYTtcbiAgdmFyIGI7XG4gIGlmICh0aGlzLmxlbmd0aCA+IG51bS5sZW5ndGgpIHtcbiAgICBhID0gdGhpcztcbiAgICBiID0gbnVtO1xuICB9IGVsc2Uge1xuICAgIGEgPSBudW07XG4gICAgYiA9IHRoaXM7XG4gIH1cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGIubGVuZ3RoOyBpKyspXG4gICAgdGhpcy53b3Jkc1tpXSA9IGEud29yZHNbaV0gXiBiLndvcmRzW2ldO1xuXG4gIGlmICh0aGlzICE9PSBhKVxuICAgIGZvciAoOyBpIDwgYS5sZW5ndGg7IGkrKylcbiAgICAgIHRoaXMud29yZHNbaV0gPSBhLndvcmRzW2ldO1xuXG4gIHRoaXMubGVuZ3RoID0gYS5sZW5ndGg7XG5cbiAgcmV0dXJuIHRoaXMuc3RyaXAoKTtcbn07XG5cblxuLy8gWG9yIGBudW1gIHdpdGggYHRoaXNgXG5CTi5wcm90b3R5cGUueG9yID0gZnVuY3Rpb24geG9yKG51bSkge1xuICBpZiAodGhpcy5sZW5ndGggPiBudW0ubGVuZ3RoKVxuICAgIHJldHVybiB0aGlzLmNsb25lKCkuaXhvcihudW0pO1xuICBlbHNlXG4gICAgcmV0dXJuIG51bS5jbG9uZSgpLml4b3IodGhpcyk7XG59O1xuXG5cbi8vIFNldCBgYml0YCBvZiBgdGhpc2BcbkJOLnByb3RvdHlwZS5zZXRuID0gZnVuY3Rpb24gc2V0bihiaXQsIHZhbCkge1xuICBhc3NlcnQodHlwZW9mIGJpdCA9PT0gJ251bWJlcicgJiYgYml0ID49IDApO1xuXG4gIHZhciBvZmYgPSAoYml0IC8gMjYpIHwgMDtcbiAgdmFyIHdiaXQgPSBiaXQgJSAyNjtcblxuICB3aGlsZSAodGhpcy5sZW5ndGggPD0gb2ZmKVxuICAgIHRoaXMud29yZHNbdGhpcy5sZW5ndGgrK10gPSAwO1xuXG4gIGlmICh2YWwpXG4gICAgdGhpcy53b3Jkc1tvZmZdID0gdGhpcy53b3Jkc1tvZmZdIHwgKDEgPDwgd2JpdCk7XG4gIGVsc2VcbiAgICB0aGlzLndvcmRzW29mZl0gPSB0aGlzLndvcmRzW29mZl0gJiB+KDEgPDwgd2JpdCk7XG5cbiAgcmV0dXJuIHRoaXMuc3RyaXAoKTtcbn07XG5cblxuLy8gQWRkIGBudW1gIHRvIGB0aGlzYCBpbi1wbGFjZVxuQk4ucHJvdG90eXBlLmlhZGQgPSBmdW5jdGlvbiBpYWRkKG51bSkge1xuICAvLyBuZWdhdGl2ZSArIHBvc2l0aXZlXG4gIGlmICh0aGlzLnNpZ24gJiYgIW51bS5zaWduKSB7XG4gICAgdGhpcy5zaWduID0gZmFsc2U7XG4gICAgdmFyIHIgPSB0aGlzLmlzdWIobnVtKTtcbiAgICB0aGlzLnNpZ24gPSAhdGhpcy5zaWduO1xuICAgIHJldHVybiB0aGlzLl9ub3JtU2lnbigpO1xuXG4gIC8vIHBvc2l0aXZlICsgbmVnYXRpdmVcbiAgfSBlbHNlIGlmICghdGhpcy5zaWduICYmIG51bS5zaWduKSB7XG4gICAgbnVtLnNpZ24gPSBmYWxzZTtcbiAgICB2YXIgciA9IHRoaXMuaXN1YihudW0pO1xuICAgIG51bS5zaWduID0gdHJ1ZTtcbiAgICByZXR1cm4gci5fbm9ybVNpZ24oKTtcbiAgfVxuXG4gIC8vIGEubGVuZ3RoID4gYi5sZW5ndGhcbiAgdmFyIGE7XG4gIHZhciBiO1xuICBpZiAodGhpcy5sZW5ndGggPiBudW0ubGVuZ3RoKSB7XG4gICAgYSA9IHRoaXM7XG4gICAgYiA9IG51bTtcbiAgfSBlbHNlIHtcbiAgICBhID0gbnVtO1xuICAgIGIgPSB0aGlzO1xuICB9XG5cbiAgdmFyIGNhcnJ5ID0gMDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBiLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHIgPSBhLndvcmRzW2ldICsgYi53b3Jkc1tpXSArIGNhcnJ5O1xuICAgIHRoaXMud29yZHNbaV0gPSByICYgMHgzZmZmZmZmO1xuICAgIGNhcnJ5ID0gciA+Pj4gMjY7XG4gIH1cbiAgZm9yICg7IGNhcnJ5ICE9PSAwICYmIGkgPCBhLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHIgPSBhLndvcmRzW2ldICsgY2Fycnk7XG4gICAgdGhpcy53b3Jkc1tpXSA9IHIgJiAweDNmZmZmZmY7XG4gICAgY2FycnkgPSByID4+PiAyNjtcbiAgfVxuXG4gIHRoaXMubGVuZ3RoID0gYS5sZW5ndGg7XG4gIGlmIChjYXJyeSAhPT0gMCkge1xuICAgIHRoaXMud29yZHNbdGhpcy5sZW5ndGhdID0gY2Fycnk7XG4gICAgdGhpcy5sZW5ndGgrKztcbiAgLy8gQ29weSB0aGUgcmVzdCBvZiB0aGUgd29yZHNcbiAgfSBlbHNlIGlmIChhICE9PSB0aGlzKSB7XG4gICAgZm9yICg7IGkgPCBhLmxlbmd0aDsgaSsrKVxuICAgICAgdGhpcy53b3Jkc1tpXSA9IGEud29yZHNbaV07XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIEFkZCBgbnVtYCB0byBgdGhpc2BcbkJOLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiBhZGQobnVtKSB7XG4gIGlmIChudW0uc2lnbiAmJiAhdGhpcy5zaWduKSB7XG4gICAgbnVtLnNpZ24gPSBmYWxzZTtcbiAgICB2YXIgcmVzID0gdGhpcy5zdWIobnVtKTtcbiAgICBudW0uc2lnbiA9IHRydWU7XG4gICAgcmV0dXJuIHJlcztcbiAgfSBlbHNlIGlmICghbnVtLnNpZ24gJiYgdGhpcy5zaWduKSB7XG4gICAgdGhpcy5zaWduID0gZmFsc2U7XG4gICAgdmFyIHJlcyA9IG51bS5zdWIodGhpcyk7XG4gICAgdGhpcy5zaWduID0gdHJ1ZTtcbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgaWYgKHRoaXMubGVuZ3RoID4gbnVtLmxlbmd0aClcbiAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmlhZGQobnVtKTtcbiAgZWxzZVxuICAgIHJldHVybiBudW0uY2xvbmUoKS5pYWRkKHRoaXMpO1xufTtcblxuLy8gU3VidHJhY3QgYG51bWAgZnJvbSBgdGhpc2AgaW4tcGxhY2VcbkJOLnByb3RvdHlwZS5pc3ViID0gZnVuY3Rpb24gaXN1YihudW0pIHtcbiAgLy8gdGhpcyAtICgtbnVtKSA9IHRoaXMgKyBudW1cbiAgaWYgKG51bS5zaWduKSB7XG4gICAgbnVtLnNpZ24gPSBmYWxzZTtcbiAgICB2YXIgciA9IHRoaXMuaWFkZChudW0pO1xuICAgIG51bS5zaWduID0gdHJ1ZTtcbiAgICByZXR1cm4gci5fbm9ybVNpZ24oKTtcblxuICAvLyAtdGhpcyAtIG51bSA9IC0odGhpcyArIG51bSlcbiAgfSBlbHNlIGlmICh0aGlzLnNpZ24pIHtcbiAgICB0aGlzLnNpZ24gPSBmYWxzZTtcbiAgICB0aGlzLmlhZGQobnVtKTtcbiAgICB0aGlzLnNpZ24gPSB0cnVlO1xuICAgIHJldHVybiB0aGlzLl9ub3JtU2lnbigpO1xuICB9XG5cbiAgLy8gQXQgdGhpcyBwb2ludCBib3RoIG51bWJlcnMgYXJlIHBvc2l0aXZlXG4gIHZhciBjbXAgPSB0aGlzLmNtcChudW0pO1xuXG4gIC8vIE9wdGltaXphdGlvbiAtIHplcm9pZnlcbiAgaWYgKGNtcCA9PT0gMCkge1xuICAgIHRoaXMuc2lnbiA9IGZhbHNlO1xuICAgIHRoaXMubGVuZ3RoID0gMTtcbiAgICB0aGlzLndvcmRzWzBdID0gMDtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGEgPiBiXG4gIHZhciBhO1xuICB2YXIgYjtcbiAgaWYgKGNtcCA+IDApIHtcbiAgICBhID0gdGhpcztcbiAgICBiID0gbnVtO1xuICB9IGVsc2Uge1xuICAgIGEgPSBudW07XG4gICAgYiA9IHRoaXM7XG4gIH1cblxuICB2YXIgY2FycnkgPSAwO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGIubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgciA9IGEud29yZHNbaV0gLSBiLndvcmRzW2ldICsgY2Fycnk7XG4gICAgY2FycnkgPSByID4+IDI2O1xuICAgIHRoaXMud29yZHNbaV0gPSByICYgMHgzZmZmZmZmO1xuICB9XG4gIGZvciAoOyBjYXJyeSAhPT0gMCAmJiBpIDwgYS5sZW5ndGg7IGkrKykge1xuICAgIHZhciByID0gYS53b3Jkc1tpXSArIGNhcnJ5O1xuICAgIGNhcnJ5ID0gciA+PiAyNjtcbiAgICB0aGlzLndvcmRzW2ldID0gciAmIDB4M2ZmZmZmZjtcbiAgfVxuXG4gIC8vIENvcHkgcmVzdCBvZiB0aGUgd29yZHNcbiAgaWYgKGNhcnJ5ID09PSAwICYmIGkgPCBhLmxlbmd0aCAmJiBhICE9PSB0aGlzKVxuICAgIGZvciAoOyBpIDwgYS5sZW5ndGg7IGkrKylcbiAgICAgIHRoaXMud29yZHNbaV0gPSBhLndvcmRzW2ldO1xuICB0aGlzLmxlbmd0aCA9IE1hdGgubWF4KHRoaXMubGVuZ3RoLCBpKTtcblxuICBpZiAoYSAhPT0gdGhpcylcbiAgICB0aGlzLnNpZ24gPSB0cnVlO1xuXG4gIHJldHVybiB0aGlzLnN0cmlwKCk7XG59O1xuXG4vLyBTdWJ0cmFjdCBgbnVtYCBmcm9tIGB0aGlzYFxuQk4ucHJvdG90eXBlLnN1YiA9IGZ1bmN0aW9uIHN1YihudW0pIHtcbiAgcmV0dXJuIHRoaXMuY2xvbmUoKS5pc3ViKG51bSk7XG59O1xuXG4vKlxuLy8gTk9URTogVGhpcyBjb3VsZCBiZSBwb3RlbnRpb25hbGx5IHVzZWQgdG8gZ2VuZXJhdGUgbG9vcC1sZXNzIG11bHRpcGxpY2F0aW9uc1xuZnVuY3Rpb24gX2dlbkNvbWJNdWxUbyhhbGVuLCBibGVuKSB7XG4gIHZhciBsZW4gPSBhbGVuICsgYmxlbiAtIDE7XG4gIHZhciBzcmMgPSBbXG4gICAgJ3ZhciBhID0gdGhpcy53b3JkcywgYiA9IG51bS53b3JkcywgbyA9IG91dC53b3JkcywgYyA9IDAsIHcsICcgK1xuICAgICAgICAnbWFzayA9IDB4M2ZmZmZmZiwgc2hpZnQgPSAweDQwMDAwMDA7JyxcbiAgICAnb3V0Lmxlbmd0aCA9ICcgKyBsZW4gKyAnOydcbiAgXTtcbiAgZm9yICh2YXIgayA9IDA7IGsgPCBsZW47IGsrKykge1xuICAgIHZhciBtaW5KID0gTWF0aC5tYXgoMCwgayAtIGFsZW4gKyAxKTtcbiAgICB2YXIgbWF4SiA9IE1hdGgubWluKGssIGJsZW4gLSAxKTtcblxuICAgIGZvciAodmFyIGogPSBtaW5KOyBqIDw9IG1heEo7IGorKykge1xuICAgICAgdmFyIGkgPSBrIC0gajtcbiAgICAgIHZhciBtdWwgPSAnYVsnICsgaSArICddICogYlsnICsgaiArICddJztcblxuICAgICAgaWYgKGogPT09IG1pbkopIHtcbiAgICAgICAgc3JjLnB1c2goJ3cgPSAnICsgbXVsICsgJyArIGM7Jyk7XG4gICAgICAgIHNyYy5wdXNoKCdjID0gKHcgLyBzaGlmdCkgfCAwOycpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3JjLnB1c2goJ3cgKz0gJyArIG11bCArICc7Jyk7XG4gICAgICAgIHNyYy5wdXNoKCdjICs9ICh3IC8gc2hpZnQpIHwgMDsnKTtcbiAgICAgIH1cbiAgICAgIHNyYy5wdXNoKCd3ICY9IG1hc2s7Jyk7XG4gICAgfVxuICAgIHNyYy5wdXNoKCdvWycgKyBrICsgJ10gPSB3OycpO1xuICB9XG4gIHNyYy5wdXNoKCdpZiAoYyAhPT0gMCkgeycsXG4gICAgICAgICAgICcgIG9bJyArIGsgKyAnXSA9IGM7JyxcbiAgICAgICAgICAgJyAgb3V0Lmxlbmd0aCsrOycsXG4gICAgICAgICAgICd9JyxcbiAgICAgICAgICAgJ3JldHVybiBvdXQ7Jyk7XG5cbiAgcmV0dXJuIHNyYy5qb2luKCdcXG4nKTtcbn1cbiovXG5cbkJOLnByb3RvdHlwZS5fc21hbGxNdWxUbyA9IGZ1bmN0aW9uIF9zbWFsbE11bFRvKG51bSwgb3V0KSB7XG4gIG91dC5zaWduID0gbnVtLnNpZ24gIT09IHRoaXMuc2lnbjtcbiAgb3V0Lmxlbmd0aCA9IHRoaXMubGVuZ3RoICsgbnVtLmxlbmd0aDtcblxuICB2YXIgY2FycnkgPSAwO1xuICBmb3IgKHZhciBrID0gMDsgayA8IG91dC5sZW5ndGggLSAxOyBrKyspIHtcbiAgICAvLyBTdW0gYWxsIHdvcmRzIHdpdGggdGhlIHNhbWUgYGkgKyBqID0ga2AgYW5kIGFjY3VtdWxhdGUgYG5jYXJyeWAsXG4gICAgLy8gbm90ZSB0aGF0IG5jYXJyeSBjb3VsZCBiZSA+PSAweDNmZmZmZmZcbiAgICB2YXIgbmNhcnJ5ID0gY2FycnkgPj4+IDI2O1xuICAgIHZhciByd29yZCA9IGNhcnJ5ICYgMHgzZmZmZmZmO1xuICAgIHZhciBtYXhKID0gTWF0aC5taW4oaywgbnVtLmxlbmd0aCAtIDEpO1xuICAgIGZvciAodmFyIGogPSBNYXRoLm1heCgwLCBrIC0gdGhpcy5sZW5ndGggKyAxKTsgaiA8PSBtYXhKOyBqKyspIHtcbiAgICAgIHZhciBpID0gayAtIGo7XG4gICAgICB2YXIgYSA9IHRoaXMud29yZHNbaV0gfCAwO1xuICAgICAgdmFyIGIgPSBudW0ud29yZHNbal0gfCAwO1xuICAgICAgdmFyIHIgPSBhICogYjtcblxuICAgICAgdmFyIGxvID0gciAmIDB4M2ZmZmZmZjtcbiAgICAgIG5jYXJyeSA9IChuY2FycnkgKyAoKHIgLyAweDQwMDAwMDApIHwgMCkpIHwgMDtcbiAgICAgIGxvID0gKGxvICsgcndvcmQpIHwgMDtcbiAgICAgIHJ3b3JkID0gbG8gJiAweDNmZmZmZmY7XG4gICAgICBuY2FycnkgPSAobmNhcnJ5ICsgKGxvID4+PiAyNikpIHwgMDtcbiAgICB9XG4gICAgb3V0LndvcmRzW2tdID0gcndvcmQ7XG4gICAgY2FycnkgPSBuY2Fycnk7XG4gIH1cbiAgaWYgKGNhcnJ5ICE9PSAwKSB7XG4gICAgb3V0LndvcmRzW2tdID0gY2Fycnk7XG4gIH0gZWxzZSB7XG4gICAgb3V0Lmxlbmd0aC0tO1xuICB9XG5cbiAgcmV0dXJuIG91dC5zdHJpcCgpO1xufTtcblxuQk4ucHJvdG90eXBlLl9iaWdNdWxUbyA9IGZ1bmN0aW9uIF9iaWdNdWxUbyhudW0sIG91dCkge1xuICBvdXQuc2lnbiA9IG51bS5zaWduICE9PSB0aGlzLnNpZ247XG4gIG91dC5sZW5ndGggPSB0aGlzLmxlbmd0aCArIG51bS5sZW5ndGg7XG5cbiAgdmFyIGNhcnJ5ID0gMDtcbiAgdmFyIGhuY2FycnkgPSAwO1xuICBmb3IgKHZhciBrID0gMDsgayA8IG91dC5sZW5ndGggLSAxOyBrKyspIHtcbiAgICAvLyBTdW0gYWxsIHdvcmRzIHdpdGggdGhlIHNhbWUgYGkgKyBqID0ga2AgYW5kIGFjY3VtdWxhdGUgYG5jYXJyeWAsXG4gICAgLy8gbm90ZSB0aGF0IG5jYXJyeSBjb3VsZCBiZSA+PSAweDNmZmZmZmZcbiAgICB2YXIgbmNhcnJ5ID0gaG5jYXJyeTtcbiAgICBobmNhcnJ5ID0gMDtcbiAgICB2YXIgcndvcmQgPSBjYXJyeSAmIDB4M2ZmZmZmZjtcbiAgICB2YXIgbWF4SiA9IE1hdGgubWluKGssIG51bS5sZW5ndGggLSAxKTtcbiAgICBmb3IgKHZhciBqID0gTWF0aC5tYXgoMCwgayAtIHRoaXMubGVuZ3RoICsgMSk7IGogPD0gbWF4SjsgaisrKSB7XG4gICAgICB2YXIgaSA9IGsgLSBqO1xuICAgICAgdmFyIGEgPSB0aGlzLndvcmRzW2ldIHwgMDtcbiAgICAgIHZhciBiID0gbnVtLndvcmRzW2pdIHwgMDtcbiAgICAgIHZhciByID0gYSAqIGI7XG5cbiAgICAgIHZhciBsbyA9IHIgJiAweDNmZmZmZmY7XG4gICAgICBuY2FycnkgPSAobmNhcnJ5ICsgKChyIC8gMHg0MDAwMDAwKSB8IDApKSB8IDA7XG4gICAgICBsbyA9IChsbyArIHJ3b3JkKSB8IDA7XG4gICAgICByd29yZCA9IGxvICYgMHgzZmZmZmZmO1xuICAgICAgbmNhcnJ5ID0gKG5jYXJyeSArIChsbyA+Pj4gMjYpKSB8IDA7XG5cbiAgICAgIGhuY2FycnkgKz0gbmNhcnJ5ID4+PiAyNjtcbiAgICAgIG5jYXJyeSAmPSAweDNmZmZmZmY7XG4gICAgfVxuICAgIG91dC53b3Jkc1trXSA9IHJ3b3JkO1xuICAgIGNhcnJ5ID0gbmNhcnJ5O1xuICAgIG5jYXJyeSA9IGhuY2Fycnk7XG4gIH1cbiAgaWYgKGNhcnJ5ICE9PSAwKSB7XG4gICAgb3V0LndvcmRzW2tdID0gY2Fycnk7XG4gIH0gZWxzZSB7XG4gICAgb3V0Lmxlbmd0aC0tO1xuICB9XG5cbiAgcmV0dXJuIG91dC5zdHJpcCgpO1xufTtcblxuQk4ucHJvdG90eXBlLm11bFRvID0gZnVuY3Rpb24gbXVsVG8obnVtLCBvdXQpIHtcbiAgdmFyIHJlcztcbiAgaWYgKHRoaXMubGVuZ3RoICsgbnVtLmxlbmd0aCA8IDYzKVxuICAgIHJlcyA9IHRoaXMuX3NtYWxsTXVsVG8obnVtLCBvdXQpO1xuICBlbHNlXG4gICAgcmVzID0gdGhpcy5fYmlnTXVsVG8obnVtLCBvdXQpO1xuICByZXR1cm4gcmVzO1xufTtcblxuLy8gTXVsdGlwbHkgYHRoaXNgIGJ5IGBudW1gXG5CTi5wcm90b3R5cGUubXVsID0gZnVuY3Rpb24gbXVsKG51bSkge1xuICB2YXIgb3V0ID0gbmV3IEJOKG51bGwpO1xuICBvdXQud29yZHMgPSBuZXcgQXJyYXkodGhpcy5sZW5ndGggKyBudW0ubGVuZ3RoKTtcbiAgcmV0dXJuIHRoaXMubXVsVG8obnVtLCBvdXQpO1xufTtcblxuLy8gSW4tcGxhY2UgTXVsdGlwbGljYXRpb25cbkJOLnByb3RvdHlwZS5pbXVsID0gZnVuY3Rpb24gaW11bChudW0pIHtcbiAgaWYgKHRoaXMuY21wbigwKSA9PT0gMCB8fCBudW0uY21wbigwKSA9PT0gMCkge1xuICAgIHRoaXMud29yZHNbMF0gPSAwO1xuICAgIHRoaXMubGVuZ3RoID0gMTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHZhciB0bGVuID0gdGhpcy5sZW5ndGg7XG4gIHZhciBubGVuID0gbnVtLmxlbmd0aDtcblxuICB0aGlzLnNpZ24gPSBudW0uc2lnbiAhPT0gdGhpcy5zaWduO1xuICB0aGlzLmxlbmd0aCA9IHRoaXMubGVuZ3RoICsgbnVtLmxlbmd0aDtcbiAgdGhpcy53b3Jkc1t0aGlzLmxlbmd0aCAtIDFdID0gMDtcblxuICBmb3IgKHZhciBrID0gdGhpcy5sZW5ndGggLSAyOyBrID49IDA7IGstLSkge1xuICAgIC8vIFN1bSBhbGwgd29yZHMgd2l0aCB0aGUgc2FtZSBgaSArIGogPSBrYCBhbmQgYWNjdW11bGF0ZSBgY2FycnlgLFxuICAgIC8vIG5vdGUgdGhhdCBjYXJyeSBjb3VsZCBiZSA+PSAweDNmZmZmZmZcbiAgICB2YXIgY2FycnkgPSAwO1xuICAgIHZhciByd29yZCA9IDA7XG4gICAgdmFyIG1heEogPSBNYXRoLm1pbihrLCBubGVuIC0gMSk7XG4gICAgZm9yICh2YXIgaiA9IE1hdGgubWF4KDAsIGsgLSB0bGVuICsgMSk7IGogPD0gbWF4SjsgaisrKSB7XG4gICAgICB2YXIgaSA9IGsgLSBqO1xuICAgICAgdmFyIGEgPSB0aGlzLndvcmRzW2ldO1xuICAgICAgdmFyIGIgPSBudW0ud29yZHNbal07XG4gICAgICB2YXIgciA9IGEgKiBiO1xuXG4gICAgICB2YXIgbG8gPSByICYgMHgzZmZmZmZmO1xuICAgICAgY2FycnkgKz0gKHIgLyAweDQwMDAwMDApIHwgMDtcbiAgICAgIGxvICs9IHJ3b3JkO1xuICAgICAgcndvcmQgPSBsbyAmIDB4M2ZmZmZmZjtcbiAgICAgIGNhcnJ5ICs9IGxvID4+PiAyNjtcbiAgICB9XG4gICAgdGhpcy53b3Jkc1trXSA9IHJ3b3JkO1xuICAgIHRoaXMud29yZHNbayArIDFdICs9IGNhcnJ5O1xuICAgIGNhcnJ5ID0gMDtcbiAgfVxuXG4gIC8vIFByb3BhZ2F0ZSBvdmVyZmxvd3NcbiAgdmFyIGNhcnJ5ID0gMDtcbiAgZm9yICh2YXIgaSA9IDE7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHcgPSB0aGlzLndvcmRzW2ldICsgY2Fycnk7XG4gICAgdGhpcy53b3Jkc1tpXSA9IHcgJiAweDNmZmZmZmY7XG4gICAgY2FycnkgPSB3ID4+PiAyNjtcbiAgfVxuXG4gIHJldHVybiB0aGlzLnN0cmlwKCk7XG59O1xuXG5CTi5wcm90b3R5cGUuaW11bG4gPSBmdW5jdGlvbiBpbXVsbihudW0pIHtcbiAgYXNzZXJ0KHR5cGVvZiBudW0gPT09ICdudW1iZXInKTtcblxuICAvLyBDYXJyeVxuICB2YXIgY2FycnkgPSAwO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgdyA9IHRoaXMud29yZHNbaV0gKiBudW07XG4gICAgdmFyIGxvID0gKHcgJiAweDNmZmZmZmYpICsgKGNhcnJ5ICYgMHgzZmZmZmZmKTtcbiAgICBjYXJyeSA+Pj0gMjY7XG4gICAgY2FycnkgKz0gKHcgLyAweDQwMDAwMDApIHwgMDtcbiAgICAvLyBOT1RFOiBsbyBpcyAyN2JpdCBtYXhpbXVtXG4gICAgY2FycnkgKz0gbG8gPj4+IDI2O1xuICAgIHRoaXMud29yZHNbaV0gPSBsbyAmIDB4M2ZmZmZmZjtcbiAgfVxuXG4gIGlmIChjYXJyeSAhPT0gMCkge1xuICAgIHRoaXMud29yZHNbaV0gPSBjYXJyeTtcbiAgICB0aGlzLmxlbmd0aCsrO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBgdGhpc2AgKiBgdGhpc2BcbkJOLnByb3RvdHlwZS5zcXIgPSBmdW5jdGlvbiBzcXIoKSB7XG4gIHJldHVybiB0aGlzLm11bCh0aGlzKTtcbn07XG5cbi8vIGB0aGlzYCAqIGB0aGlzYCBpbi1wbGFjZVxuQk4ucHJvdG90eXBlLmlzcXIgPSBmdW5jdGlvbiBpc3FyKCkge1xuICByZXR1cm4gdGhpcy5tdWwodGhpcyk7XG59O1xuXG4vLyBTaGlmdC1sZWZ0IGluLXBsYWNlXG5CTi5wcm90b3R5cGUuaXNobG4gPSBmdW5jdGlvbiBpc2hsbihiaXRzKSB7XG4gIGFzc2VydCh0eXBlb2YgYml0cyA9PT0gJ251bWJlcicgJiYgYml0cyA+PSAwKTtcbiAgdmFyIHIgPSBiaXRzICUgMjY7XG4gIHZhciBzID0gKGJpdHMgLSByKSAvIDI2O1xuICB2YXIgY2FycnlNYXNrID0gKDB4M2ZmZmZmZiA+Pj4gKDI2IC0gcikpIDw8ICgyNiAtIHIpO1xuXG4gIGlmIChyICE9PSAwKSB7XG4gICAgdmFyIGNhcnJ5ID0gMDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBuZXdDYXJyeSA9IHRoaXMud29yZHNbaV0gJiBjYXJyeU1hc2s7XG4gICAgICB2YXIgYyA9ICh0aGlzLndvcmRzW2ldIC0gbmV3Q2FycnkpIDw8IHI7XG4gICAgICB0aGlzLndvcmRzW2ldID0gYyB8IGNhcnJ5O1xuICAgICAgY2FycnkgPSBuZXdDYXJyeSA+Pj4gKDI2IC0gcik7XG4gICAgfVxuICAgIGlmIChjYXJyeSkge1xuICAgICAgdGhpcy53b3Jkc1tpXSA9IGNhcnJ5O1xuICAgICAgdGhpcy5sZW5ndGgrKztcbiAgICB9XG4gIH1cblxuICBpZiAocyAhPT0gMCkge1xuICAgIGZvciAodmFyIGkgPSB0aGlzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKVxuICAgICAgdGhpcy53b3Jkc1tpICsgc10gPSB0aGlzLndvcmRzW2ldO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgczsgaSsrKVxuICAgICAgdGhpcy53b3Jkc1tpXSA9IDA7XG4gICAgdGhpcy5sZW5ndGggKz0gcztcbiAgfVxuXG4gIHJldHVybiB0aGlzLnN0cmlwKCk7XG59O1xuXG4vLyBTaGlmdC1yaWdodCBpbi1wbGFjZVxuLy8gTk9URTogYGhpbnRgIGlzIGEgbG93ZXN0IGJpdCBiZWZvcmUgdHJhaWxpbmcgemVyb2VzXG4vLyBOT1RFOiBpZiBgZXh0ZW5kZWRgIGlzIHRydWUgLSB7IGxvOiAuLi4sIGhpOiB9IG9iamVjdCB3aWxsIGJlIHJldHVybmVkXG5CTi5wcm90b3R5cGUuaXNocm4gPSBmdW5jdGlvbiBpc2hybihiaXRzLCBoaW50LCBleHRlbmRlZCkge1xuICBhc3NlcnQodHlwZW9mIGJpdHMgPT09ICdudW1iZXInICYmIGJpdHMgPj0gMCk7XG4gIGlmIChoaW50KVxuICAgIGhpbnQgPSAoaGludCAtIChoaW50ICUgMjYpKSAvIDI2O1xuICBlbHNlXG4gICAgaGludCA9IDA7XG5cbiAgdmFyIHIgPSBiaXRzICUgMjY7XG4gIHZhciBzID0gTWF0aC5taW4oKGJpdHMgLSByKSAvIDI2LCB0aGlzLmxlbmd0aCk7XG4gIHZhciBtYXNrID0gMHgzZmZmZmZmIF4gKCgweDNmZmZmZmYgPj4+IHIpIDw8IHIpO1xuICB2YXIgbWFza2VkV29yZHMgPSBleHRlbmRlZDtcblxuICBoaW50IC09IHM7XG4gIGhpbnQgPSBNYXRoLm1heCgwLCBoaW50KTtcblxuICAvLyBFeHRlbmRlZCBtb2RlLCBjb3B5IG1hc2tlZCBwYXJ0XG4gIGlmIChtYXNrZWRXb3Jkcykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgczsgaSsrKVxuICAgICAgbWFza2VkV29yZHMud29yZHNbaV0gPSB0aGlzLndvcmRzW2ldO1xuICAgIG1hc2tlZFdvcmRzLmxlbmd0aCA9IHM7XG4gIH1cblxuICBpZiAocyA9PT0gMCkge1xuICAgIC8vIE5vLW9wLCB3ZSBzaG91bGQgbm90IG1vdmUgYW55dGhpbmcgYXQgYWxsXG4gIH0gZWxzZSBpZiAodGhpcy5sZW5ndGggPiBzKSB7XG4gICAgdGhpcy5sZW5ndGggLT0gcztcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspXG4gICAgICB0aGlzLndvcmRzW2ldID0gdGhpcy53b3Jkc1tpICsgc107XG4gIH0gZWxzZSB7XG4gICAgdGhpcy53b3Jkc1swXSA9IDA7XG4gICAgdGhpcy5sZW5ndGggPSAxO1xuICB9XG5cbiAgdmFyIGNhcnJ5ID0gMDtcbiAgZm9yICh2YXIgaSA9IHRoaXMubGVuZ3RoIC0gMTsgaSA+PSAwICYmIChjYXJyeSAhPT0gMCB8fCBpID49IGhpbnQpOyBpLS0pIHtcbiAgICB2YXIgd29yZCA9IHRoaXMud29yZHNbaV07XG4gICAgdGhpcy53b3Jkc1tpXSA9IChjYXJyeSA8PCAoMjYgLSByKSkgfCAod29yZCA+Pj4gcik7XG4gICAgY2FycnkgPSB3b3JkICYgbWFzaztcbiAgfVxuXG4gIC8vIFB1c2ggY2FycmllZCBiaXRzIGFzIGEgbWFza1xuICBpZiAobWFza2VkV29yZHMgJiYgY2FycnkgIT09IDApXG4gICAgbWFza2VkV29yZHMud29yZHNbbWFza2VkV29yZHMubGVuZ3RoKytdID0gY2Fycnk7XG5cbiAgaWYgKHRoaXMubGVuZ3RoID09PSAwKSB7XG4gICAgdGhpcy53b3Jkc1swXSA9IDA7XG4gICAgdGhpcy5sZW5ndGggPSAxO1xuICB9XG5cbiAgdGhpcy5zdHJpcCgpO1xuICBpZiAoZXh0ZW5kZWQpXG4gICAgcmV0dXJuIHsgaGk6IHRoaXMsIGxvOiBtYXNrZWRXb3JkcyB9O1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gU2hpZnQtbGVmdFxuQk4ucHJvdG90eXBlLnNobG4gPSBmdW5jdGlvbiBzaGxuKGJpdHMpIHtcbiAgcmV0dXJuIHRoaXMuY2xvbmUoKS5pc2hsbihiaXRzKTtcbn07XG5cbi8vIFNoaWZ0LXJpZ2h0XG5CTi5wcm90b3R5cGUuc2hybiA9IGZ1bmN0aW9uIHNocm4oYml0cykge1xuICByZXR1cm4gdGhpcy5jbG9uZSgpLmlzaHJuKGJpdHMpO1xufTtcblxuLy8gVGVzdCBpZiBuIGJpdCBpcyBzZXRcbkJOLnByb3RvdHlwZS50ZXN0biA9IGZ1bmN0aW9uIHRlc3RuKGJpdCkge1xuICBhc3NlcnQodHlwZW9mIGJpdCA9PT0gJ251bWJlcicgJiYgYml0ID49IDApO1xuICB2YXIgciA9IGJpdCAlIDI2O1xuICB2YXIgcyA9IChiaXQgLSByKSAvIDI2O1xuICB2YXIgcSA9IDEgPDwgcjtcblxuICAvLyBGYXN0IGNhc2U6IGJpdCBpcyBtdWNoIGhpZ2hlciB0aGFuIGFsbCBleGlzdGluZyB3b3Jkc1xuICBpZiAodGhpcy5sZW5ndGggPD0gcykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIENoZWNrIGJpdCBhbmQgcmV0dXJuXG4gIHZhciB3ID0gdGhpcy53b3Jkc1tzXTtcblxuICByZXR1cm4gISEodyAmIHEpO1xufTtcblxuLy8gUmV0dXJuIG9ubHkgbG93ZXJzIGJpdHMgb2YgbnVtYmVyIChpbi1wbGFjZSlcbkJOLnByb3RvdHlwZS5pbWFza24gPSBmdW5jdGlvbiBpbWFza24oYml0cykge1xuICBhc3NlcnQodHlwZW9mIGJpdHMgPT09ICdudW1iZXInICYmIGJpdHMgPj0gMCk7XG4gIHZhciByID0gYml0cyAlIDI2O1xuICB2YXIgcyA9IChiaXRzIC0gcikgLyAyNjtcblxuICBhc3NlcnQoIXRoaXMuc2lnbiwgJ2ltYXNrbiB3b3JrcyBvbmx5IHdpdGggcG9zaXRpdmUgbnVtYmVycycpO1xuXG4gIGlmIChyICE9PSAwKVxuICAgIHMrKztcbiAgdGhpcy5sZW5ndGggPSBNYXRoLm1pbihzLCB0aGlzLmxlbmd0aCk7XG5cbiAgaWYgKHIgIT09IDApIHtcbiAgICB2YXIgbWFzayA9IDB4M2ZmZmZmZiBeICgoMHgzZmZmZmZmID4+PiByKSA8PCByKTtcbiAgICB0aGlzLndvcmRzW3RoaXMubGVuZ3RoIC0gMV0gJj0gbWFzaztcbiAgfVxuXG4gIHJldHVybiB0aGlzLnN0cmlwKCk7XG59O1xuXG4vLyBSZXR1cm4gb25seSBsb3dlcnMgYml0cyBvZiBudW1iZXJcbkJOLnByb3RvdHlwZS5tYXNrbiA9IGZ1bmN0aW9uIG1hc2tuKGJpdHMpIHtcbiAgcmV0dXJuIHRoaXMuY2xvbmUoKS5pbWFza24oYml0cyk7XG59O1xuXG4vLyBBZGQgcGxhaW4gbnVtYmVyIGBudW1gIHRvIGB0aGlzYFxuQk4ucHJvdG90eXBlLmlhZGRuID0gZnVuY3Rpb24gaWFkZG4obnVtKSB7XG4gIGFzc2VydCh0eXBlb2YgbnVtID09PSAnbnVtYmVyJyk7XG4gIGlmIChudW0gPCAwKVxuICAgIHJldHVybiB0aGlzLmlzdWJuKC1udW0pO1xuXG4gIC8vIFBvc3NpYmxlIHNpZ24gY2hhbmdlXG4gIGlmICh0aGlzLnNpZ24pIHtcbiAgICBpZiAodGhpcy5sZW5ndGggPT09IDEgJiYgdGhpcy53b3Jkc1swXSA8IG51bSkge1xuICAgICAgdGhpcy53b3Jkc1swXSA9IG51bSAtIHRoaXMud29yZHNbMF07XG4gICAgICB0aGlzLnNpZ24gPSBmYWxzZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHRoaXMuc2lnbiA9IGZhbHNlO1xuICAgIHRoaXMuaXN1Ym4obnVtKTtcbiAgICB0aGlzLnNpZ24gPSB0cnVlO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gQWRkIHdpdGhvdXQgY2hlY2tzXG4gIHJldHVybiB0aGlzLl9pYWRkbihudW0pO1xufTtcblxuQk4ucHJvdG90eXBlLl9pYWRkbiA9IGZ1bmN0aW9uIF9pYWRkbihudW0pIHtcbiAgdGhpcy53b3Jkc1swXSArPSBudW07XG5cbiAgLy8gQ2FycnlcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aCAmJiB0aGlzLndvcmRzW2ldID49IDB4NDAwMDAwMDsgaSsrKSB7XG4gICAgdGhpcy53b3Jkc1tpXSAtPSAweDQwMDAwMDA7XG4gICAgaWYgKGkgPT09IHRoaXMubGVuZ3RoIC0gMSlcbiAgICAgIHRoaXMud29yZHNbaSArIDFdID0gMTtcbiAgICBlbHNlXG4gICAgICB0aGlzLndvcmRzW2kgKyAxXSsrO1xuICB9XG4gIHRoaXMubGVuZ3RoID0gTWF0aC5tYXgodGhpcy5sZW5ndGgsIGkgKyAxKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIFN1YnRyYWN0IHBsYWluIG51bWJlciBgbnVtYCBmcm9tIGB0aGlzYFxuQk4ucHJvdG90eXBlLmlzdWJuID0gZnVuY3Rpb24gaXN1Ym4obnVtKSB7XG4gIGFzc2VydCh0eXBlb2YgbnVtID09PSAnbnVtYmVyJyk7XG4gIGlmIChudW0gPCAwKVxuICAgIHJldHVybiB0aGlzLmlhZGRuKC1udW0pO1xuXG4gIGlmICh0aGlzLnNpZ24pIHtcbiAgICB0aGlzLnNpZ24gPSBmYWxzZTtcbiAgICB0aGlzLmlhZGRuKG51bSk7XG4gICAgdGhpcy5zaWduID0gdHJ1ZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHRoaXMud29yZHNbMF0gLT0gbnVtO1xuXG4gIC8vIENhcnJ5XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGggJiYgdGhpcy53b3Jkc1tpXSA8IDA7IGkrKykge1xuICAgIHRoaXMud29yZHNbaV0gKz0gMHg0MDAwMDAwO1xuICAgIHRoaXMud29yZHNbaSArIDFdIC09IDE7XG4gIH1cblxuICByZXR1cm4gdGhpcy5zdHJpcCgpO1xufTtcblxuQk4ucHJvdG90eXBlLmFkZG4gPSBmdW5jdGlvbiBhZGRuKG51bSkge1xuICByZXR1cm4gdGhpcy5jbG9uZSgpLmlhZGRuKG51bSk7XG59O1xuXG5CTi5wcm90b3R5cGUuc3VibiA9IGZ1bmN0aW9uIHN1Ym4obnVtKSB7XG4gIHJldHVybiB0aGlzLmNsb25lKCkuaXN1Ym4obnVtKTtcbn07XG5cbkJOLnByb3RvdHlwZS5pYWJzID0gZnVuY3Rpb24gaWFicygpIHtcbiAgdGhpcy5zaWduID0gZmFsc2U7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5CTi5wcm90b3R5cGUuYWJzID0gZnVuY3Rpb24gYWJzKCkge1xuICByZXR1cm4gdGhpcy5jbG9uZSgpLmlhYnMoKTtcbn07XG5cbkJOLnByb3RvdHlwZS5faXNobG5zdWJtdWwgPSBmdW5jdGlvbiBfaXNobG5zdWJtdWwobnVtLCBtdWwsIHNoaWZ0KSB7XG4gIC8vIEJpZ2dlciBzdG9yYWdlIGlzIG5lZWRlZFxuICB2YXIgbGVuID0gbnVtLmxlbmd0aCArIHNoaWZ0O1xuICB2YXIgaTtcbiAgaWYgKHRoaXMud29yZHMubGVuZ3RoIDwgbGVuKSB7XG4gICAgdmFyIHQgPSBuZXcgQXJyYXkobGVuKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspXG4gICAgICB0W2ldID0gdGhpcy53b3Jkc1tpXTtcbiAgICB0aGlzLndvcmRzID0gdDtcbiAgfSBlbHNlIHtcbiAgICBpID0gdGhpcy5sZW5ndGg7XG4gIH1cblxuICAvLyBaZXJvaWZ5IHJlc3RcbiAgdGhpcy5sZW5ndGggPSBNYXRoLm1heCh0aGlzLmxlbmd0aCwgbGVuKTtcbiAgZm9yICg7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKVxuICAgIHRoaXMud29yZHNbaV0gPSAwO1xuXG4gIHZhciBjYXJyeSA9IDA7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHcgPSB0aGlzLndvcmRzW2kgKyBzaGlmdF0gKyBjYXJyeTtcbiAgICB2YXIgcmlnaHQgPSBudW0ud29yZHNbaV0gKiBtdWw7XG4gICAgdyAtPSByaWdodCAmIDB4M2ZmZmZmZjtcbiAgICBjYXJyeSA9ICh3ID4+IDI2KSAtICgocmlnaHQgLyAweDQwMDAwMDApIHwgMCk7XG4gICAgdGhpcy53b3Jkc1tpICsgc2hpZnRdID0gdyAmIDB4M2ZmZmZmZjtcbiAgfVxuICBmb3IgKDsgaSA8IHRoaXMubGVuZ3RoIC0gc2hpZnQ7IGkrKykge1xuICAgIHZhciB3ID0gdGhpcy53b3Jkc1tpICsgc2hpZnRdICsgY2Fycnk7XG4gICAgY2FycnkgPSB3ID4+IDI2O1xuICAgIHRoaXMud29yZHNbaSArIHNoaWZ0XSA9IHcgJiAweDNmZmZmZmY7XG4gIH1cblxuICBpZiAoY2FycnkgPT09IDApXG4gICAgcmV0dXJuIHRoaXMuc3RyaXAoKTtcblxuICAvLyBTdWJ0cmFjdGlvbiBvdmVyZmxvd1xuICBhc3NlcnQoY2FycnkgPT09IC0xKTtcbiAgY2FycnkgPSAwO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgdyA9IC10aGlzLndvcmRzW2ldICsgY2Fycnk7XG4gICAgY2FycnkgPSB3ID4+IDI2O1xuICAgIHRoaXMud29yZHNbaV0gPSB3ICYgMHgzZmZmZmZmO1xuICB9XG4gIHRoaXMuc2lnbiA9IHRydWU7XG5cbiAgcmV0dXJuIHRoaXMuc3RyaXAoKTtcbn07XG5cbkJOLnByb3RvdHlwZS5fd29yZERpdiA9IGZ1bmN0aW9uIF93b3JkRGl2KG51bSwgbW9kZSkge1xuICB2YXIgc2hpZnQgPSB0aGlzLmxlbmd0aCAtIG51bS5sZW5ndGg7XG5cbiAgdmFyIGEgPSB0aGlzLmNsb25lKCk7XG4gIHZhciBiID0gbnVtO1xuXG4gIC8vIE5vcm1hbGl6ZVxuICB2YXIgYmhpID0gYi53b3Jkc1tiLmxlbmd0aCAtIDFdO1xuICBmb3IgKHZhciBzaGlmdCA9IDA7IGJoaSA8IDB4MjAwMDAwMDsgc2hpZnQrKylcbiAgICBiaGkgPDw9IDE7XG4gIGlmIChzaGlmdCAhPT0gMCkge1xuICAgIGIgPSBiLnNobG4oc2hpZnQpO1xuICAgIGEuaXNobG4oc2hpZnQpO1xuICAgIGJoaSA9IGIud29yZHNbYi5sZW5ndGggLSAxXTtcbiAgfVxuXG4gIC8vIEluaXRpYWxpemUgcXVvdGllbnRcbiAgdmFyIG0gPSBhLmxlbmd0aCAtIGIubGVuZ3RoO1xuICB2YXIgcTtcblxuICBpZiAobW9kZSAhPT0gJ21vZCcpIHtcbiAgICBxID0gbmV3IEJOKG51bGwpO1xuICAgIHEubGVuZ3RoID0gbSArIDE7XG4gICAgcS53b3JkcyA9IG5ldyBBcnJheShxLmxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBxLmxlbmd0aDsgaSsrKVxuICAgICAgcS53b3Jkc1tpXSA9IDA7XG4gIH1cblxuICB2YXIgZGlmZiA9IGEuY2xvbmUoKS5faXNobG5zdWJtdWwoYiwgMSwgbSk7XG4gIGlmICghZGlmZi5zaWduKSB7XG4gICAgYSA9IGRpZmY7XG4gICAgaWYgKHEpXG4gICAgICBxLndvcmRzW21dID0gMTtcbiAgfVxuXG4gIGZvciAodmFyIGogPSBtIC0gMTsgaiA+PSAwOyBqLS0pIHtcbiAgICB2YXIgcWogPSBhLndvcmRzW2IubGVuZ3RoICsgal0gKiAweDQwMDAwMDAgKyBhLndvcmRzW2IubGVuZ3RoICsgaiAtIDFdO1xuXG4gICAgLy8gTk9URTogKHFqIC8gYmhpKSBpcyAoMHgzZmZmZmZmICogMHg0MDAwMDAwICsgMHgzZmZmZmZmKSAvIDB4MjAwMDAwMCBtYXhcbiAgICAvLyAoMHg3ZmZmZmZmKVxuICAgIHFqID0gTWF0aC5taW4oKHFqIC8gYmhpKSB8IDAsIDB4M2ZmZmZmZik7XG5cbiAgICBhLl9pc2hsbnN1Ym11bChiLCBxaiwgaik7XG4gICAgd2hpbGUgKGEuc2lnbikge1xuICAgICAgcWotLTtcbiAgICAgIGEuc2lnbiA9IGZhbHNlO1xuICAgICAgYS5faXNobG5zdWJtdWwoYiwgMSwgaik7XG4gICAgICBhLnNpZ24gPSAhYS5zaWduO1xuICAgIH1cbiAgICBpZiAocSlcbiAgICAgIHEud29yZHNbal0gPSBxajtcbiAgfVxuICBpZiAocSlcbiAgICBxLnN0cmlwKCk7XG4gIGEuc3RyaXAoKTtcblxuICAvLyBEZW5vcm1hbGl6ZVxuICBpZiAobW9kZSAhPT0gJ2RpdicgJiYgc2hpZnQgIT09IDApXG4gICAgYS5pc2hybihzaGlmdCk7XG4gIHJldHVybiB7IGRpdjogcSA/IHEgOiBudWxsLCBtb2Q6IGEgfTtcbn07XG5cbkJOLnByb3RvdHlwZS5kaXZtb2QgPSBmdW5jdGlvbiBkaXZtb2QobnVtLCBtb2RlKSB7XG4gIGFzc2VydChudW0uY21wbigwKSAhPT0gMCk7XG5cbiAgaWYgKHRoaXMuc2lnbiAmJiAhbnVtLnNpZ24pIHtcbiAgICB2YXIgcmVzID0gdGhpcy5uZWcoKS5kaXZtb2QobnVtLCBtb2RlKTtcbiAgICB2YXIgZGl2O1xuICAgIHZhciBtb2Q7XG4gICAgaWYgKG1vZGUgIT09ICdtb2QnKVxuICAgICAgZGl2ID0gcmVzLmRpdi5uZWcoKTtcbiAgICBpZiAobW9kZSAhPT0gJ2RpdicpXG4gICAgICBtb2QgPSByZXMubW9kLmNtcG4oMCkgPT09IDAgPyByZXMubW9kIDogbnVtLnN1YihyZXMubW9kKTtcbiAgICByZXR1cm4ge1xuICAgICAgZGl2OiBkaXYsXG4gICAgICBtb2Q6IG1vZFxuICAgIH07XG4gIH0gZWxzZSBpZiAoIXRoaXMuc2lnbiAmJiBudW0uc2lnbikge1xuICAgIHZhciByZXMgPSB0aGlzLmRpdm1vZChudW0ubmVnKCksIG1vZGUpO1xuICAgIHZhciBkaXY7XG4gICAgaWYgKG1vZGUgIT09ICdtb2QnKVxuICAgICAgZGl2ID0gcmVzLmRpdi5uZWcoKTtcbiAgICByZXR1cm4geyBkaXY6IGRpdiwgbW9kOiByZXMubW9kIH07XG4gIH0gZWxzZSBpZiAodGhpcy5zaWduICYmIG51bS5zaWduKSB7XG4gICAgcmV0dXJuIHRoaXMubmVnKCkuZGl2bW9kKG51bS5uZWcoKSwgbW9kZSk7XG4gIH1cblxuICAvLyBCb3RoIG51bWJlcnMgYXJlIHBvc2l0aXZlIGF0IHRoaXMgcG9pbnRcblxuICAvLyBTdHJpcCBib3RoIG51bWJlcnMgdG8gYXBwcm94aW1hdGUgc2hpZnQgdmFsdWVcbiAgaWYgKG51bS5sZW5ndGggPiB0aGlzLmxlbmd0aCB8fCB0aGlzLmNtcChudW0pIDwgMClcbiAgICByZXR1cm4geyBkaXY6IG5ldyBCTigwKSwgbW9kOiB0aGlzIH07XG5cbiAgLy8gVmVyeSBzaG9ydCByZWR1Y3Rpb25cbiAgaWYgKG51bS5sZW5ndGggPT09IDEpIHtcbiAgICBpZiAobW9kZSA9PT0gJ2RpdicpXG4gICAgICByZXR1cm4geyBkaXY6IHRoaXMuZGl2bihudW0ud29yZHNbMF0pLCBtb2Q6IG51bGwgfTtcbiAgICBlbHNlIGlmIChtb2RlID09PSAnbW9kJylcbiAgICAgIHJldHVybiB7IGRpdjogbnVsbCwgbW9kOiBuZXcgQk4odGhpcy5tb2RuKG51bS53b3Jkc1swXSkpIH07XG4gICAgcmV0dXJuIHtcbiAgICAgIGRpdjogdGhpcy5kaXZuKG51bS53b3Jkc1swXSksXG4gICAgICBtb2Q6IG5ldyBCTih0aGlzLm1vZG4obnVtLndvcmRzWzBdKSlcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHRoaXMuX3dvcmREaXYobnVtLCBtb2RlKTtcbn07XG5cbi8vIEZpbmQgYHRoaXNgIC8gYG51bWBcbkJOLnByb3RvdHlwZS5kaXYgPSBmdW5jdGlvbiBkaXYobnVtKSB7XG4gIHJldHVybiB0aGlzLmRpdm1vZChudW0sICdkaXYnKS5kaXY7XG59O1xuXG4vLyBGaW5kIGB0aGlzYCAlIGBudW1gXG5CTi5wcm90b3R5cGUubW9kID0gZnVuY3Rpb24gbW9kKG51bSkge1xuICByZXR1cm4gdGhpcy5kaXZtb2QobnVtLCAnbW9kJykubW9kO1xufTtcblxuLy8gRmluZCBSb3VuZChgdGhpc2AgLyBgbnVtYClcbkJOLnByb3RvdHlwZS5kaXZSb3VuZCA9IGZ1bmN0aW9uIGRpdlJvdW5kKG51bSkge1xuICB2YXIgZG0gPSB0aGlzLmRpdm1vZChudW0pO1xuXG4gIC8vIEZhc3QgY2FzZSAtIGV4YWN0IGRpdmlzaW9uXG4gIGlmIChkbS5tb2QuY21wbigwKSA9PT0gMClcbiAgICByZXR1cm4gZG0uZGl2O1xuXG4gIHZhciBtb2QgPSBkbS5kaXYuc2lnbiA/IGRtLm1vZC5pc3ViKG51bSkgOiBkbS5tb2Q7XG5cbiAgdmFyIGhhbGYgPSBudW0uc2hybigxKTtcbiAgdmFyIHIyID0gbnVtLmFuZGxuKDEpO1xuICB2YXIgY21wID0gbW9kLmNtcChoYWxmKTtcblxuICAvLyBSb3VuZCBkb3duXG4gIGlmIChjbXAgPCAwIHx8IHIyID09PSAxICYmIGNtcCA9PT0gMClcbiAgICByZXR1cm4gZG0uZGl2O1xuXG4gIC8vIFJvdW5kIHVwXG4gIHJldHVybiBkbS5kaXYuc2lnbiA/IGRtLmRpdi5pc3VibigxKSA6IGRtLmRpdi5pYWRkbigxKTtcbn07XG5cbkJOLnByb3RvdHlwZS5tb2RuID0gZnVuY3Rpb24gbW9kbihudW0pIHtcbiAgYXNzZXJ0KG51bSA8PSAweDNmZmZmZmYpO1xuICB2YXIgcCA9ICgxIDw8IDI2KSAlIG51bTtcblxuICB2YXIgYWNjID0gMDtcbiAgZm9yICh2YXIgaSA9IHRoaXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pXG4gICAgYWNjID0gKHAgKiBhY2MgKyB0aGlzLndvcmRzW2ldKSAlIG51bTtcblxuICByZXR1cm4gYWNjO1xufTtcblxuLy8gSW4tcGxhY2UgZGl2aXNpb24gYnkgbnVtYmVyXG5CTi5wcm90b3R5cGUuaWRpdm4gPSBmdW5jdGlvbiBpZGl2bihudW0pIHtcbiAgYXNzZXJ0KG51bSA8PSAweDNmZmZmZmYpO1xuXG4gIHZhciBjYXJyeSA9IDA7XG4gIGZvciAodmFyIGkgPSB0aGlzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgdmFyIHcgPSB0aGlzLndvcmRzW2ldICsgY2FycnkgKiAweDQwMDAwMDA7XG4gICAgdGhpcy53b3Jkc1tpXSA9ICh3IC8gbnVtKSB8IDA7XG4gICAgY2FycnkgPSB3ICUgbnVtO1xuICB9XG5cbiAgcmV0dXJuIHRoaXMuc3RyaXAoKTtcbn07XG5cbkJOLnByb3RvdHlwZS5kaXZuID0gZnVuY3Rpb24gZGl2bihudW0pIHtcbiAgcmV0dXJuIHRoaXMuY2xvbmUoKS5pZGl2bihudW0pO1xufTtcblxuQk4ucHJvdG90eXBlLl9lZ2NkID0gZnVuY3Rpb24gX2VnY2QoeDEsIHApIHtcbiAgYXNzZXJ0KCFwLnNpZ24pO1xuICBhc3NlcnQocC5jbXBuKDApICE9PSAwKTtcblxuICB2YXIgYSA9IHRoaXM7XG4gIHZhciBiID0gcC5jbG9uZSgpO1xuXG4gIGlmIChhLnNpZ24pXG4gICAgYSA9IGEubW9kKHApO1xuICBlbHNlXG4gICAgYSA9IGEuY2xvbmUoKTtcblxuICB2YXIgeDIgPSBuZXcgQk4oMCk7XG4gIHdoaWxlIChiLmlzRXZlbigpKVxuICAgIGIuaXNocm4oMSk7XG4gIHZhciBkZWx0YSA9IGIuY2xvbmUoKTtcbiAgd2hpbGUgKGEuY21wbigxKSA+IDAgJiYgYi5jbXBuKDEpID4gMCkge1xuICAgIHdoaWxlIChhLmlzRXZlbigpKSB7XG4gICAgICBhLmlzaHJuKDEpO1xuICAgICAgaWYgKHgxLmlzRXZlbigpKVxuICAgICAgICB4MS5pc2hybigxKTtcbiAgICAgIGVsc2VcbiAgICAgICAgeDEuaWFkZChkZWx0YSkuaXNocm4oMSk7XG4gICAgfVxuICAgIHdoaWxlIChiLmlzRXZlbigpKSB7XG4gICAgICBiLmlzaHJuKDEpO1xuICAgICAgaWYgKHgyLmlzRXZlbigpKVxuICAgICAgICB4Mi5pc2hybigxKTtcbiAgICAgIGVsc2VcbiAgICAgICAgeDIuaWFkZChkZWx0YSkuaXNocm4oMSk7XG4gICAgfVxuICAgIGlmIChhLmNtcChiKSA+PSAwKSB7XG4gICAgICBhLmlzdWIoYik7XG4gICAgICB4MS5pc3ViKHgyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYi5pc3ViKGEpO1xuICAgICAgeDIuaXN1Yih4MSk7XG4gICAgfVxuICB9XG4gIGlmIChhLmNtcG4oMSkgPT09IDApXG4gICAgcmV0dXJuIHgxO1xuICBlbHNlXG4gICAgcmV0dXJuIHgyO1xufTtcblxuQk4ucHJvdG90eXBlLmdjZCA9IGZ1bmN0aW9uIGdjZChudW0pIHtcbiAgaWYgKHRoaXMuY21wbigwKSA9PT0gMClcbiAgICByZXR1cm4gbnVtLmNsb25lKCk7XG4gIGlmIChudW0uY21wbigwKSA9PT0gMClcbiAgICByZXR1cm4gdGhpcy5jbG9uZSgpO1xuXG4gIHZhciBhID0gdGhpcy5jbG9uZSgpO1xuICB2YXIgYiA9IG51bS5jbG9uZSgpO1xuICBhLnNpZ24gPSBmYWxzZTtcbiAgYi5zaWduID0gZmFsc2U7XG5cbiAgLy8gUmVtb3ZlIGNvbW1vbiBmYWN0b3Igb2YgdHdvXG4gIGZvciAodmFyIHNoaWZ0ID0gMDsgYS5pc0V2ZW4oKSAmJiBiLmlzRXZlbigpOyBzaGlmdCsrKSB7XG4gICAgYS5pc2hybigxKTtcbiAgICBiLmlzaHJuKDEpO1xuICB9XG5cbiAgd2hpbGUgKGEuaXNFdmVuKCkpXG4gICAgYS5pc2hybigxKTtcblxuICBkbyB7XG4gICAgd2hpbGUgKGIuaXNFdmVuKCkpXG4gICAgICBiLmlzaHJuKDEpO1xuXG4gICAgLy8gU3dhcCBgYWAgYW5kIGBiYCB0byBtYWtlIGBhYCBhbHdheXMgYmlnZ2VyIHRoYW4gYGJgXG4gICAgaWYgKGEuY21wKGIpIDwgMCkge1xuICAgICAgdmFyIHQgPSBhO1xuICAgICAgYSA9IGI7XG4gICAgICBiID0gdDtcbiAgICB9XG4gICAgYS5pc3ViKGEuZGl2KGIpLm11bChiKSk7XG4gIH0gd2hpbGUgKGEuY21wbigwKSAhPT0gMCAmJiBiLmNtcG4oMCkgIT09IDApO1xuICBpZiAoYS5jbXBuKDApID09PSAwKVxuICAgIHJldHVybiBiLmlzaGxuKHNoaWZ0KTtcbiAgZWxzZVxuICAgIHJldHVybiBhLmlzaGxuKHNoaWZ0KTtcbn07XG5cbi8vIEludmVydCBudW1iZXIgaW4gdGhlIGZpZWxkIEYobnVtKVxuQk4ucHJvdG90eXBlLmludm0gPSBmdW5jdGlvbiBpbnZtKG51bSkge1xuICByZXR1cm4gdGhpcy5fZWdjZChuZXcgQk4oMSksIG51bSkubW9kKG51bSk7XG59O1xuXG5CTi5wcm90b3R5cGUuaXNFdmVuID0gZnVuY3Rpb24gaXNFdmVuKCkge1xuICByZXR1cm4gKHRoaXMud29yZHNbMF0gJiAxKSA9PT0gMDtcbn07XG5cbkJOLnByb3RvdHlwZS5pc09kZCA9IGZ1bmN0aW9uIGlzT2RkKCkge1xuICByZXR1cm4gKHRoaXMud29yZHNbMF0gJiAxKSA9PT0gMTtcbn07XG5cbi8vIEFuZCBmaXJzdCB3b3JkIGFuZCBudW1cbkJOLnByb3RvdHlwZS5hbmRsbiA9IGZ1bmN0aW9uIGFuZGxuKG51bSkge1xuICByZXR1cm4gdGhpcy53b3Jkc1swXSAmIG51bTtcbn07XG5cbi8vIEluY3JlbWVudCBhdCB0aGUgYml0IHBvc2l0aW9uIGluLWxpbmVcbkJOLnByb3RvdHlwZS5iaW5jbiA9IGZ1bmN0aW9uIGJpbmNuKGJpdCkge1xuICBhc3NlcnQodHlwZW9mIGJpdCA9PT0gJ251bWJlcicpO1xuICB2YXIgciA9IGJpdCAlIDI2O1xuICB2YXIgcyA9IChiaXQgLSByKSAvIDI2O1xuICB2YXIgcSA9IDEgPDwgcjtcblxuICAvLyBGYXN0IGNhc2U6IGJpdCBpcyBtdWNoIGhpZ2hlciB0aGFuIGFsbCBleGlzdGluZyB3b3Jkc1xuICBpZiAodGhpcy5sZW5ndGggPD0gcykge1xuICAgIGZvciAodmFyIGkgPSB0aGlzLmxlbmd0aDsgaSA8IHMgKyAxOyBpKyspXG4gICAgICB0aGlzLndvcmRzW2ldID0gMDtcbiAgICB0aGlzLndvcmRzW3NdIHw9IHE7XG4gICAgdGhpcy5sZW5ndGggPSBzICsgMTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIEFkZCBiaXQgYW5kIHByb3BhZ2F0ZSwgaWYgbmVlZGVkXG4gIHZhciBjYXJyeSA9IHE7XG4gIGZvciAodmFyIGkgPSBzOyBjYXJyeSAhPT0gMCAmJiBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciB3ID0gdGhpcy53b3Jkc1tpXTtcbiAgICB3ICs9IGNhcnJ5O1xuICAgIGNhcnJ5ID0gdyA+Pj4gMjY7XG4gICAgdyAmPSAweDNmZmZmZmY7XG4gICAgdGhpcy53b3Jkc1tpXSA9IHc7XG4gIH1cbiAgaWYgKGNhcnJ5ICE9PSAwKSB7XG4gICAgdGhpcy53b3Jkc1tpXSA9IGNhcnJ5O1xuICAgIHRoaXMubGVuZ3RoKys7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5CTi5wcm90b3R5cGUuY21wbiA9IGZ1bmN0aW9uIGNtcG4obnVtKSB7XG4gIHZhciBzaWduID0gbnVtIDwgMDtcbiAgaWYgKHNpZ24pXG4gICAgbnVtID0gLW51bTtcblxuICBpZiAodGhpcy5zaWduICYmICFzaWduKVxuICAgIHJldHVybiAtMTtcbiAgZWxzZSBpZiAoIXRoaXMuc2lnbiAmJiBzaWduKVxuICAgIHJldHVybiAxO1xuXG4gIG51bSAmPSAweDNmZmZmZmY7XG4gIHRoaXMuc3RyaXAoKTtcblxuICB2YXIgcmVzO1xuICBpZiAodGhpcy5sZW5ndGggPiAxKSB7XG4gICAgcmVzID0gMTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgdyA9IHRoaXMud29yZHNbMF07XG4gICAgcmVzID0gdyA9PT0gbnVtID8gMCA6IHcgPCBudW0gPyAtMSA6IDE7XG4gIH1cbiAgaWYgKHRoaXMuc2lnbilcbiAgICByZXMgPSAtcmVzO1xuICByZXR1cm4gcmVzO1xufTtcblxuLy8gQ29tcGFyZSB0d28gbnVtYmVycyBhbmQgcmV0dXJuOlxuLy8gMSAtIGlmIGB0aGlzYCA+IGBudW1gXG4vLyAwIC0gaWYgYHRoaXNgID09IGBudW1gXG4vLyAtMSAtIGlmIGB0aGlzYCA8IGBudW1gXG5CTi5wcm90b3R5cGUuY21wID0gZnVuY3Rpb24gY21wKG51bSkge1xuICBpZiAodGhpcy5zaWduICYmICFudW0uc2lnbilcbiAgICByZXR1cm4gLTE7XG4gIGVsc2UgaWYgKCF0aGlzLnNpZ24gJiYgbnVtLnNpZ24pXG4gICAgcmV0dXJuIDE7XG5cbiAgdmFyIHJlcyA9IHRoaXMudWNtcChudW0pO1xuICBpZiAodGhpcy5zaWduKVxuICAgIHJldHVybiAtcmVzO1xuICBlbHNlXG4gICAgcmV0dXJuIHJlcztcbn07XG5cbi8vIFVuc2lnbmVkIGNvbXBhcmlzb25cbkJOLnByb3RvdHlwZS51Y21wID0gZnVuY3Rpb24gdWNtcChudW0pIHtcbiAgLy8gQXQgdGhpcyBwb2ludCBib3RoIG51bWJlcnMgaGF2ZSB0aGUgc2FtZSBzaWduXG4gIGlmICh0aGlzLmxlbmd0aCA+IG51bS5sZW5ndGgpXG4gICAgcmV0dXJuIDE7XG4gIGVsc2UgaWYgKHRoaXMubGVuZ3RoIDwgbnVtLmxlbmd0aClcbiAgICByZXR1cm4gLTE7XG5cbiAgdmFyIHJlcyA9IDA7XG4gIGZvciAodmFyIGkgPSB0aGlzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgdmFyIGEgPSB0aGlzLndvcmRzW2ldO1xuICAgIHZhciBiID0gbnVtLndvcmRzW2ldO1xuXG4gICAgaWYgKGEgPT09IGIpXG4gICAgICBjb250aW51ZTtcbiAgICBpZiAoYSA8IGIpXG4gICAgICByZXMgPSAtMTtcbiAgICBlbHNlIGlmIChhID4gYilcbiAgICAgIHJlcyA9IDE7XG4gICAgYnJlYWs7XG4gIH1cbiAgcmV0dXJuIHJlcztcbn07XG5cbi8vXG4vLyBBIHJlZHVjZSBjb250ZXh0LCBjb3VsZCBiZSB1c2luZyBtb250Z29tZXJ5IG9yIHNvbWV0aGluZyBiZXR0ZXIsIGRlcGVuZGluZ1xuLy8gb24gdGhlIGBtYCBpdHNlbGYuXG4vL1xuQk4ucmVkID0gZnVuY3Rpb24gcmVkKG51bSkge1xuICByZXR1cm4gbmV3IFJlZChudW0pO1xufTtcblxuQk4ucHJvdG90eXBlLnRvUmVkID0gZnVuY3Rpb24gdG9SZWQoY3R4KSB7XG4gIGFzc2VydCghdGhpcy5yZWQsICdBbHJlYWR5IGEgbnVtYmVyIGluIHJlZHVjdGlvbiBjb250ZXh0Jyk7XG4gIGFzc2VydCghdGhpcy5zaWduLCAncmVkIHdvcmtzIG9ubHkgd2l0aCBwb3NpdGl2ZXMnKTtcbiAgcmV0dXJuIGN0eC5jb252ZXJ0VG8odGhpcykuX2ZvcmNlUmVkKGN0eCk7XG59O1xuXG5CTi5wcm90b3R5cGUuZnJvbVJlZCA9IGZ1bmN0aW9uIGZyb21SZWQoKSB7XG4gIGFzc2VydCh0aGlzLnJlZCwgJ2Zyb21SZWQgd29ya3Mgb25seSB3aXRoIG51bWJlcnMgaW4gcmVkdWN0aW9uIGNvbnRleHQnKTtcbiAgcmV0dXJuIHRoaXMucmVkLmNvbnZlcnRGcm9tKHRoaXMpO1xufTtcblxuQk4ucHJvdG90eXBlLl9mb3JjZVJlZCA9IGZ1bmN0aW9uIF9mb3JjZVJlZChjdHgpIHtcbiAgdGhpcy5yZWQgPSBjdHg7XG4gIHJldHVybiB0aGlzO1xufTtcblxuQk4ucHJvdG90eXBlLmZvcmNlUmVkID0gZnVuY3Rpb24gZm9yY2VSZWQoY3R4KSB7XG4gIGFzc2VydCghdGhpcy5yZWQsICdBbHJlYWR5IGEgbnVtYmVyIGluIHJlZHVjdGlvbiBjb250ZXh0Jyk7XG4gIHJldHVybiB0aGlzLl9mb3JjZVJlZChjdHgpO1xufTtcblxuQk4ucHJvdG90eXBlLnJlZEFkZCA9IGZ1bmN0aW9uIHJlZEFkZChudW0pIHtcbiAgYXNzZXJ0KHRoaXMucmVkLCAncmVkQWRkIHdvcmtzIG9ubHkgd2l0aCByZWQgbnVtYmVycycpO1xuICByZXR1cm4gdGhpcy5yZWQuYWRkKHRoaXMsIG51bSk7XG59O1xuXG5CTi5wcm90b3R5cGUucmVkSUFkZCA9IGZ1bmN0aW9uIHJlZElBZGQobnVtKSB7XG4gIGFzc2VydCh0aGlzLnJlZCwgJ3JlZElBZGQgd29ya3Mgb25seSB3aXRoIHJlZCBudW1iZXJzJyk7XG4gIHJldHVybiB0aGlzLnJlZC5pYWRkKHRoaXMsIG51bSk7XG59O1xuXG5CTi5wcm90b3R5cGUucmVkU3ViID0gZnVuY3Rpb24gcmVkU3ViKG51bSkge1xuICBhc3NlcnQodGhpcy5yZWQsICdyZWRTdWIgd29ya3Mgb25seSB3aXRoIHJlZCBudW1iZXJzJyk7XG4gIHJldHVybiB0aGlzLnJlZC5zdWIodGhpcywgbnVtKTtcbn07XG5cbkJOLnByb3RvdHlwZS5yZWRJU3ViID0gZnVuY3Rpb24gcmVkSVN1YihudW0pIHtcbiAgYXNzZXJ0KHRoaXMucmVkLCAncmVkSVN1YiB3b3JrcyBvbmx5IHdpdGggcmVkIG51bWJlcnMnKTtcbiAgcmV0dXJuIHRoaXMucmVkLmlzdWIodGhpcywgbnVtKTtcbn07XG5cbkJOLnByb3RvdHlwZS5yZWRTaGwgPSBmdW5jdGlvbiByZWRTaGwobnVtKSB7XG4gIGFzc2VydCh0aGlzLnJlZCwgJ3JlZFNobCB3b3JrcyBvbmx5IHdpdGggcmVkIG51bWJlcnMnKTtcbiAgcmV0dXJuIHRoaXMucmVkLnNobCh0aGlzLCBudW0pO1xufTtcblxuQk4ucHJvdG90eXBlLnJlZE11bCA9IGZ1bmN0aW9uIHJlZE11bChudW0pIHtcbiAgYXNzZXJ0KHRoaXMucmVkLCAncmVkTXVsIHdvcmtzIG9ubHkgd2l0aCByZWQgbnVtYmVycycpO1xuICB0aGlzLnJlZC5fdmVyaWZ5Mih0aGlzLCBudW0pO1xuICByZXR1cm4gdGhpcy5yZWQubXVsKHRoaXMsIG51bSk7XG59O1xuXG5CTi5wcm90b3R5cGUucmVkSU11bCA9IGZ1bmN0aW9uIHJlZElNdWwobnVtKSB7XG4gIGFzc2VydCh0aGlzLnJlZCwgJ3JlZE11bCB3b3JrcyBvbmx5IHdpdGggcmVkIG51bWJlcnMnKTtcbiAgdGhpcy5yZWQuX3ZlcmlmeTIodGhpcywgbnVtKTtcbiAgcmV0dXJuIHRoaXMucmVkLmltdWwodGhpcywgbnVtKTtcbn07XG5cbkJOLnByb3RvdHlwZS5yZWRTcXIgPSBmdW5jdGlvbiByZWRTcXIoKSB7XG4gIGFzc2VydCh0aGlzLnJlZCwgJ3JlZFNxciB3b3JrcyBvbmx5IHdpdGggcmVkIG51bWJlcnMnKTtcbiAgdGhpcy5yZWQuX3ZlcmlmeTEodGhpcyk7XG4gIHJldHVybiB0aGlzLnJlZC5zcXIodGhpcyk7XG59O1xuXG5CTi5wcm90b3R5cGUucmVkSVNxciA9IGZ1bmN0aW9uIHJlZElTcXIoKSB7XG4gIGFzc2VydCh0aGlzLnJlZCwgJ3JlZElTcXIgd29ya3Mgb25seSB3aXRoIHJlZCBudW1iZXJzJyk7XG4gIHRoaXMucmVkLl92ZXJpZnkxKHRoaXMpO1xuICByZXR1cm4gdGhpcy5yZWQuaXNxcih0aGlzKTtcbn07XG5cbi8vIFNxdWFyZSByb290IG92ZXIgcFxuQk4ucHJvdG90eXBlLnJlZFNxcnQgPSBmdW5jdGlvbiByZWRTcXJ0KCkge1xuICBhc3NlcnQodGhpcy5yZWQsICdyZWRTcXJ0IHdvcmtzIG9ubHkgd2l0aCByZWQgbnVtYmVycycpO1xuICB0aGlzLnJlZC5fdmVyaWZ5MSh0aGlzKTtcbiAgcmV0dXJuIHRoaXMucmVkLnNxcnQodGhpcyk7XG59O1xuXG5CTi5wcm90b3R5cGUucmVkSW52bSA9IGZ1bmN0aW9uIHJlZEludm0oKSB7XG4gIGFzc2VydCh0aGlzLnJlZCwgJ3JlZEludm0gd29ya3Mgb25seSB3aXRoIHJlZCBudW1iZXJzJyk7XG4gIHRoaXMucmVkLl92ZXJpZnkxKHRoaXMpO1xuICByZXR1cm4gdGhpcy5yZWQuaW52bSh0aGlzKTtcbn07XG5cbi8vIFJldHVybiBuZWdhdGl2ZSBjbG9uZSBvZiBgdGhpc2AgJSBgcmVkIG1vZHVsb2BcbkJOLnByb3RvdHlwZS5yZWROZWcgPSBmdW5jdGlvbiByZWROZWcoKSB7XG4gIGFzc2VydCh0aGlzLnJlZCwgJ3JlZE5lZyB3b3JrcyBvbmx5IHdpdGggcmVkIG51bWJlcnMnKTtcbiAgdGhpcy5yZWQuX3ZlcmlmeTEodGhpcyk7XG4gIHJldHVybiB0aGlzLnJlZC5uZWcodGhpcyk7XG59O1xuXG5CTi5wcm90b3R5cGUucmVkUG93ID0gZnVuY3Rpb24gcmVkUG93KG51bSkge1xuICBhc3NlcnQodGhpcy5yZWQgJiYgIW51bS5yZWQsICdyZWRQb3cobm9ybWFsTnVtKScpO1xuICB0aGlzLnJlZC5fdmVyaWZ5MSh0aGlzKTtcbiAgcmV0dXJuIHRoaXMucmVkLnBvdyh0aGlzLCBudW0pO1xufTtcblxuLy8gUHJpbWUgbnVtYmVycyB3aXRoIGVmZmljaWVudCByZWR1Y3Rpb25cbnZhciBwcmltZXMgPSB7XG4gIGsyNTY6IG51bGwsXG4gIHAyMjQ6IG51bGwsXG4gIHAxOTI6IG51bGwsXG4gIHAyNTUxOTogbnVsbFxufTtcblxuLy8gUHNldWRvLU1lcnNlbm5lIHByaW1lXG5mdW5jdGlvbiBNUHJpbWUobmFtZSwgcCkge1xuICAvLyBQID0gMiBeIE4gLSBLXG4gIHRoaXMubmFtZSA9IG5hbWU7XG4gIHRoaXMucCA9IG5ldyBCTihwLCAxNik7XG4gIHRoaXMubiA9IHRoaXMucC5iaXRMZW5ndGgoKTtcbiAgdGhpcy5rID0gbmV3IEJOKDEpLmlzaGxuKHRoaXMubikuaXN1Yih0aGlzLnApO1xuXG4gIHRoaXMudG1wID0gdGhpcy5fdG1wKCk7XG59XG5cbk1QcmltZS5wcm90b3R5cGUuX3RtcCA9IGZ1bmN0aW9uIF90bXAoKSB7XG4gIHZhciB0bXAgPSBuZXcgQk4obnVsbCk7XG4gIHRtcC53b3JkcyA9IG5ldyBBcnJheShNYXRoLmNlaWwodGhpcy5uIC8gMTMpKTtcbiAgcmV0dXJuIHRtcDtcbn07XG5cbk1QcmltZS5wcm90b3R5cGUuaXJlZHVjZSA9IGZ1bmN0aW9uIGlyZWR1Y2UobnVtKSB7XG4gIC8vIEFzc3VtZXMgdGhhdCBgbnVtYCBpcyBsZXNzIHRoYW4gYFBeMmBcbiAgLy8gbnVtID0gSEkgKiAoMiBeIE4gLSBLKSArIEhJICogSyArIExPID0gSEkgKiBLICsgTE8gKG1vZCBQKVxuICB2YXIgciA9IG51bTtcbiAgdmFyIHJsZW47XG5cbiAgZG8ge1xuICAgIHZhciBwYWlyID0gci5pc2hybih0aGlzLm4sIDAsIHRoaXMudG1wKTtcbiAgICByID0gdGhpcy5pbXVsSyhwYWlyLmhpKTtcbiAgICByID0gci5pYWRkKHBhaXIubG8pO1xuICAgIHJsZW4gPSByLmJpdExlbmd0aCgpO1xuICB9IHdoaWxlIChybGVuID4gdGhpcy5uKTtcblxuICB2YXIgY21wID0gcmxlbiA8IHRoaXMubiA/IC0xIDogci5jbXAodGhpcy5wKTtcbiAgaWYgKGNtcCA9PT0gMCkge1xuICAgIHIud29yZHNbMF0gPSAwO1xuICAgIHIubGVuZ3RoID0gMTtcbiAgfSBlbHNlIGlmIChjbXAgPiAwKSB7XG4gICAgci5pc3ViKHRoaXMucCk7XG4gIH0gZWxzZSB7XG4gICAgci5zdHJpcCgpO1xuICB9XG5cbiAgcmV0dXJuIHI7XG59O1xuXG5NUHJpbWUucHJvdG90eXBlLmltdWxLID0gZnVuY3Rpb24gaW11bEsobnVtKSB7XG4gIHJldHVybiBudW0uaW11bCh0aGlzLmspO1xufTtcblxuZnVuY3Rpb24gSzI1NigpIHtcbiAgTVByaW1lLmNhbGwoXG4gICAgdGhpcyxcbiAgICAnazI1NicsXG4gICAgJ2ZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZmIGZmZmZmZmZlIGZmZmZmYzJmJyk7XG59XG5pbmhlcml0cyhLMjU2LCBNUHJpbWUpO1xuXG5LMjU2LnByb3RvdHlwZS5pbXVsSyA9IGZ1bmN0aW9uIGltdWxLKG51bSkge1xuICAvLyBLID0gMHgxMDAwMDAzZDEgPSBbIDB4NDAsIDB4M2QxIF1cbiAgbnVtLndvcmRzW251bS5sZW5ndGhdID0gMDtcbiAgbnVtLndvcmRzW251bS5sZW5ndGggKyAxXSA9IDA7XG4gIG51bS5sZW5ndGggKz0gMjtcblxuICAvLyBib3VuZGVkIGF0OiAweDQwICogMHgzZmZmZmZmICsgMHgzZDAgPSAweDEwMDAwMDM5MFxuICB2YXIgaGk7XG4gIHZhciBsbyA9IDA7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHcgPSBudW0ud29yZHNbaV07XG4gICAgaGkgPSB3ICogMHg0MDtcbiAgICBsbyArPSB3ICogMHgzZDE7XG4gICAgaGkgKz0gKGxvIC8gMHg0MDAwMDAwKSB8IDA7XG4gICAgbG8gJj0gMHgzZmZmZmZmO1xuXG4gICAgbnVtLndvcmRzW2ldID0gbG87XG5cbiAgICBsbyA9IGhpO1xuICB9XG5cbiAgLy8gRmFzdCBsZW5ndGggcmVkdWN0aW9uXG4gIGlmIChudW0ud29yZHNbbnVtLmxlbmd0aCAtIDFdID09PSAwKSB7XG4gICAgbnVtLmxlbmd0aC0tO1xuICAgIGlmIChudW0ud29yZHNbbnVtLmxlbmd0aCAtIDFdID09PSAwKVxuICAgICAgbnVtLmxlbmd0aC0tO1xuICB9XG4gIHJldHVybiBudW07XG59O1xuXG5mdW5jdGlvbiBQMjI0KCkge1xuICBNUHJpbWUuY2FsbChcbiAgICB0aGlzLFxuICAgICdwMjI0JyxcbiAgICAnZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgZmZmZmZmZmYgMDAwMDAwMDAgMDAwMDAwMDAgMDAwMDAwMDEnKTtcbn1cbmluaGVyaXRzKFAyMjQsIE1QcmltZSk7XG5cbmZ1bmN0aW9uIFAxOTIoKSB7XG4gIE1QcmltZS5jYWxsKFxuICAgIHRoaXMsXG4gICAgJ3AxOTInLFxuICAgICdmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZiBmZmZmZmZmZSBmZmZmZmZmZiBmZmZmZmZmZicpO1xufVxuaW5oZXJpdHMoUDE5MiwgTVByaW1lKTtcblxuZnVuY3Rpb24gUDI1NTE5KCkge1xuICAvLyAyIF4gMjU1IC0gMTlcbiAgTVByaW1lLmNhbGwoXG4gICAgdGhpcyxcbiAgICAnMjU1MTknLFxuICAgICc3ZmZmZmZmZmZmZmZmZmZmIGZmZmZmZmZmZmZmZmZmZmYgZmZmZmZmZmZmZmZmZmZmZiBmZmZmZmZmZmZmZmZmZmVkJyk7XG59XG5pbmhlcml0cyhQMjU1MTksIE1QcmltZSk7XG5cblAyNTUxOS5wcm90b3R5cGUuaW11bEsgPSBmdW5jdGlvbiBpbXVsSyhudW0pIHtcbiAgLy8gSyA9IDB4MTNcbiAgdmFyIGNhcnJ5ID0gMDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW0ubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaGkgPSBudW0ud29yZHNbaV0gKiAweDEzICsgY2Fycnk7XG4gICAgdmFyIGxvID0gaGkgJiAweDNmZmZmZmY7XG4gICAgaGkgPj4+PSAyNjtcblxuICAgIG51bS53b3Jkc1tpXSA9IGxvO1xuICAgIGNhcnJ5ID0gaGk7XG4gIH1cbiAgaWYgKGNhcnJ5ICE9PSAwKVxuICAgIG51bS53b3Jkc1tudW0ubGVuZ3RoKytdID0gY2Fycnk7XG4gIHJldHVybiBudW07XG59O1xuXG4vLyBFeHBvcnRlZCBtb3N0bHkgZm9yIHRlc3RpbmcgcHVycG9zZXMsIHVzZSBwbGFpbiBuYW1lIGluc3RlYWRcbkJOLl9wcmltZSA9IGZ1bmN0aW9uIHByaW1lKG5hbWUpIHtcbiAgLy8gQ2FjaGVkIHZlcnNpb24gb2YgcHJpbWVcbiAgaWYgKHByaW1lc1tuYW1lXSlcbiAgICByZXR1cm4gcHJpbWVzW25hbWVdO1xuXG4gIHZhciBwcmltZTtcbiAgaWYgKG5hbWUgPT09ICdrMjU2JylcbiAgICBwcmltZSA9IG5ldyBLMjU2KCk7XG4gIGVsc2UgaWYgKG5hbWUgPT09ICdwMjI0JylcbiAgICBwcmltZSA9IG5ldyBQMjI0KCk7XG4gIGVsc2UgaWYgKG5hbWUgPT09ICdwMTkyJylcbiAgICBwcmltZSA9IG5ldyBQMTkyKCk7XG4gIGVsc2UgaWYgKG5hbWUgPT09ICdwMjU1MTknKVxuICAgIHByaW1lID0gbmV3IFAyNTUxOSgpO1xuICBlbHNlXG4gICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIHByaW1lICcgKyBuYW1lKTtcbiAgcHJpbWVzW25hbWVdID0gcHJpbWU7XG5cbiAgcmV0dXJuIHByaW1lO1xufTtcblxuLy9cbi8vIEJhc2UgcmVkdWN0aW9uIGVuZ2luZVxuLy9cbmZ1bmN0aW9uIFJlZChtKSB7XG4gIGlmICh0eXBlb2YgbSA9PT0gJ3N0cmluZycpIHtcbiAgICB2YXIgcHJpbWUgPSBCTi5fcHJpbWUobSk7XG4gICAgdGhpcy5tID0gcHJpbWUucDtcbiAgICB0aGlzLnByaW1lID0gcHJpbWU7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5tID0gbTtcbiAgICB0aGlzLnByaW1lID0gbnVsbDtcbiAgfVxufVxuXG5SZWQucHJvdG90eXBlLl92ZXJpZnkxID0gZnVuY3Rpb24gX3ZlcmlmeTEoYSkge1xuICBhc3NlcnQoIWEuc2lnbiwgJ3JlZCB3b3JrcyBvbmx5IHdpdGggcG9zaXRpdmVzJyk7XG4gIGFzc2VydChhLnJlZCwgJ3JlZCB3b3JrcyBvbmx5IHdpdGggcmVkIG51bWJlcnMnKTtcbn07XG5cblJlZC5wcm90b3R5cGUuX3ZlcmlmeTIgPSBmdW5jdGlvbiBfdmVyaWZ5MihhLCBiKSB7XG4gIGFzc2VydCghYS5zaWduICYmICFiLnNpZ24sICdyZWQgd29ya3Mgb25seSB3aXRoIHBvc2l0aXZlcycpO1xuICBhc3NlcnQoYS5yZWQgJiYgYS5yZWQgPT09IGIucmVkLFxuICAgICAgICAgJ3JlZCB3b3JrcyBvbmx5IHdpdGggcmVkIG51bWJlcnMnKTtcbn07XG5cblJlZC5wcm90b3R5cGUuaW1vZCA9IGZ1bmN0aW9uIGltb2QoYSkge1xuICBpZiAodGhpcy5wcmltZSlcbiAgICByZXR1cm4gdGhpcy5wcmltZS5pcmVkdWNlKGEpLl9mb3JjZVJlZCh0aGlzKTtcbiAgcmV0dXJuIGEubW9kKHRoaXMubSkuX2ZvcmNlUmVkKHRoaXMpO1xufTtcblxuUmVkLnByb3RvdHlwZS5uZWcgPSBmdW5jdGlvbiBuZWcoYSkge1xuICB2YXIgciA9IGEuY2xvbmUoKTtcbiAgci5zaWduID0gIXIuc2lnbjtcbiAgcmV0dXJuIHIuaWFkZCh0aGlzLm0pLl9mb3JjZVJlZCh0aGlzKTtcbn07XG5cblJlZC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gYWRkKGEsIGIpIHtcbiAgdGhpcy5fdmVyaWZ5MihhLCBiKTtcblxuICB2YXIgcmVzID0gYS5hZGQoYik7XG4gIGlmIChyZXMuY21wKHRoaXMubSkgPj0gMClcbiAgICByZXMuaXN1Yih0aGlzLm0pO1xuICByZXR1cm4gcmVzLl9mb3JjZVJlZCh0aGlzKTtcbn07XG5cblJlZC5wcm90b3R5cGUuaWFkZCA9IGZ1bmN0aW9uIGlhZGQoYSwgYikge1xuICB0aGlzLl92ZXJpZnkyKGEsIGIpO1xuXG4gIHZhciByZXMgPSBhLmlhZGQoYik7XG4gIGlmIChyZXMuY21wKHRoaXMubSkgPj0gMClcbiAgICByZXMuaXN1Yih0aGlzLm0pO1xuICByZXR1cm4gcmVzO1xufTtcblxuUmVkLnByb3RvdHlwZS5zdWIgPSBmdW5jdGlvbiBzdWIoYSwgYikge1xuICB0aGlzLl92ZXJpZnkyKGEsIGIpO1xuXG4gIHZhciByZXMgPSBhLnN1YihiKTtcbiAgaWYgKHJlcy5jbXBuKDApIDwgMClcbiAgICByZXMuaWFkZCh0aGlzLm0pO1xuICByZXR1cm4gcmVzLl9mb3JjZVJlZCh0aGlzKTtcbn07XG5cblJlZC5wcm90b3R5cGUuaXN1YiA9IGZ1bmN0aW9uIGlzdWIoYSwgYikge1xuICB0aGlzLl92ZXJpZnkyKGEsIGIpO1xuXG4gIHZhciByZXMgPSBhLmlzdWIoYik7XG4gIGlmIChyZXMuY21wbigwKSA8IDApXG4gICAgcmVzLmlhZGQodGhpcy5tKTtcbiAgcmV0dXJuIHJlcztcbn07XG5cblJlZC5wcm90b3R5cGUuc2hsID0gZnVuY3Rpb24gc2hsKGEsIG51bSkge1xuICB0aGlzLl92ZXJpZnkxKGEpO1xuICByZXR1cm4gdGhpcy5pbW9kKGEuc2hsbihudW0pKTtcbn07XG5cblJlZC5wcm90b3R5cGUuaW11bCA9IGZ1bmN0aW9uIGltdWwoYSwgYikge1xuICB0aGlzLl92ZXJpZnkyKGEsIGIpO1xuICByZXR1cm4gdGhpcy5pbW9kKGEuaW11bChiKSk7XG59O1xuXG5SZWQucHJvdG90eXBlLm11bCA9IGZ1bmN0aW9uIG11bChhLCBiKSB7XG4gIHRoaXMuX3ZlcmlmeTIoYSwgYik7XG4gIHJldHVybiB0aGlzLmltb2QoYS5tdWwoYikpO1xufTtcblxuUmVkLnByb3RvdHlwZS5pc3FyID0gZnVuY3Rpb24gaXNxcihhKSB7XG4gIHJldHVybiB0aGlzLmltdWwoYSwgYSk7XG59O1xuXG5SZWQucHJvdG90eXBlLnNxciA9IGZ1bmN0aW9uIHNxcihhKSB7XG4gIHJldHVybiB0aGlzLm11bChhLCBhKTtcbn07XG5cblJlZC5wcm90b3R5cGUuc3FydCA9IGZ1bmN0aW9uIHNxcnQoYSkge1xuICBpZiAoYS5jbXBuKDApID09PSAwKVxuICAgIHJldHVybiBhLmNsb25lKCk7XG5cbiAgdmFyIG1vZDMgPSB0aGlzLm0uYW5kbG4oMyk7XG4gIGFzc2VydChtb2QzICUgMiA9PT0gMSk7XG5cbiAgLy8gRmFzdCBjYXNlXG4gIGlmIChtb2QzID09PSAzKSB7XG4gICAgdmFyIHBvdyA9IHRoaXMubS5hZGQobmV3IEJOKDEpKS5pc2hybigyKTtcbiAgICB2YXIgciA9IHRoaXMucG93KGEsIHBvdyk7XG4gICAgcmV0dXJuIHI7XG4gIH1cblxuICAvLyBUb25lbGxpLVNoYW5rcyBhbGdvcml0aG0gKFRvdGFsbHkgdW5vcHRpbWl6ZWQgYW5kIHNsb3cpXG4gIC8vXG4gIC8vIEZpbmQgUSBhbmQgUywgdGhhdCBRICogMiBeIFMgPSAoUCAtIDEpXG4gIHZhciBxID0gdGhpcy5tLnN1Ym4oMSk7XG4gIHZhciBzID0gMDtcbiAgd2hpbGUgKHEuY21wbigwKSAhPT0gMCAmJiBxLmFuZGxuKDEpID09PSAwKSB7XG4gICAgcysrO1xuICAgIHEuaXNocm4oMSk7XG4gIH1cbiAgYXNzZXJ0KHEuY21wbigwKSAhPT0gMCk7XG5cbiAgdmFyIG9uZSA9IG5ldyBCTigxKS50b1JlZCh0aGlzKTtcbiAgdmFyIG5PbmUgPSBvbmUucmVkTmVnKCk7XG5cbiAgLy8gRmluZCBxdWFkcmF0aWMgbm9uLXJlc2lkdWVcbiAgLy8gTk9URTogTWF4IGlzIHN1Y2ggYmVjYXVzZSBvZiBnZW5lcmFsaXplZCBSaWVtYW5uIGh5cG90aGVzaXMuXG4gIHZhciBscG93ID0gdGhpcy5tLnN1Ym4oMSkuaXNocm4oMSk7XG4gIHZhciB6ID0gdGhpcy5tLmJpdExlbmd0aCgpO1xuICB6ID0gbmV3IEJOKDIgKiB6ICogeikudG9SZWQodGhpcyk7XG4gIHdoaWxlICh0aGlzLnBvdyh6LCBscG93KS5jbXAobk9uZSkgIT09IDApXG4gICAgei5yZWRJQWRkKG5PbmUpO1xuXG4gIHZhciBjID0gdGhpcy5wb3coeiwgcSk7XG4gIHZhciByID0gdGhpcy5wb3coYSwgcS5hZGRuKDEpLmlzaHJuKDEpKTtcbiAgdmFyIHQgPSB0aGlzLnBvdyhhLCBxKTtcbiAgdmFyIG0gPSBzO1xuICB3aGlsZSAodC5jbXAob25lKSAhPT0gMCkge1xuICAgIHZhciB0bXAgPSB0O1xuICAgIGZvciAodmFyIGkgPSAwOyB0bXAuY21wKG9uZSkgIT09IDA7IGkrKylcbiAgICAgIHRtcCA9IHRtcC5yZWRTcXIoKTtcbiAgICBhc3NlcnQoaSA8IG0pO1xuICAgIHZhciBiID0gdGhpcy5wb3coYywgbmV3IEJOKDEpLmlzaGxuKG0gLSBpIC0gMSkpO1xuXG4gICAgciA9IHIucmVkTXVsKGIpO1xuICAgIGMgPSBiLnJlZFNxcigpO1xuICAgIHQgPSB0LnJlZE11bChjKTtcbiAgICBtID0gaTtcbiAgfVxuXG4gIHJldHVybiByO1xufTtcblxuUmVkLnByb3RvdHlwZS5pbnZtID0gZnVuY3Rpb24gaW52bShhKSB7XG4gIHZhciBpbnYgPSBhLl9lZ2NkKG5ldyBCTigxKSwgdGhpcy5tKTtcbiAgaWYgKGludi5zaWduKSB7XG4gICAgaW52LnNpZ24gPSBmYWxzZTtcbiAgICByZXR1cm4gdGhpcy5pbW9kKGludikucmVkTmVnKCk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRoaXMuaW1vZChpbnYpO1xuICB9XG59O1xuXG5SZWQucHJvdG90eXBlLnBvdyA9IGZ1bmN0aW9uIHBvdyhhLCBudW0pIHtcbiAgdmFyIHcgPSBbXTtcbiAgdmFyIHEgPSBudW0uY2xvbmUoKTtcbiAgd2hpbGUgKHEuY21wbigwKSAhPT0gMCkge1xuICAgIHcucHVzaChxLmFuZGxuKDEpKTtcbiAgICBxLmlzaHJuKDEpO1xuICB9XG5cbiAgLy8gU2tpcCBsZWFkaW5nIHplcm9lc1xuICB2YXIgcmVzID0gYTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB3Lmxlbmd0aDsgaSsrLCByZXMgPSB0aGlzLnNxcihyZXMpKVxuICAgIGlmICh3W2ldICE9PSAwKVxuICAgICAgYnJlYWs7XG5cbiAgaWYgKCsraSA8IHcubGVuZ3RoKSB7XG4gICAgZm9yICh2YXIgcSA9IHRoaXMuc3FyKHJlcyk7IGkgPCB3Lmxlbmd0aDsgaSsrLCBxID0gdGhpcy5zcXIocSkpIHtcbiAgICAgIGlmICh3W2ldID09PSAwKVxuICAgICAgICBjb250aW51ZTtcbiAgICAgIHJlcyA9IHRoaXMubXVsKHJlcywgcSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlcztcbn07XG5cblJlZC5wcm90b3R5cGUuY29udmVydFRvID0gZnVuY3Rpb24gY29udmVydFRvKG51bSkge1xuICByZXR1cm4gbnVtLmNsb25lKCk7XG59O1xuXG5SZWQucHJvdG90eXBlLmNvbnZlcnRGcm9tID0gZnVuY3Rpb24gY29udmVydEZyb20obnVtKSB7XG4gIHZhciByZXMgPSBudW0uY2xvbmUoKTtcbiAgcmVzLnJlZCA9IG51bGw7XG4gIHJldHVybiByZXM7XG59O1xuXG4vL1xuLy8gTW9udGdvbWVyeSBtZXRob2QgZW5naW5lXG4vL1xuXG5CTi5tb250ID0gZnVuY3Rpb24gbW9udChudW0pIHtcbiAgcmV0dXJuIG5ldyBNb250KG51bSk7XG59O1xuXG5mdW5jdGlvbiBNb250KG0pIHtcbiAgUmVkLmNhbGwodGhpcywgbSk7XG5cbiAgdGhpcy5zaGlmdCA9IHRoaXMubS5iaXRMZW5ndGgoKTtcbiAgaWYgKHRoaXMuc2hpZnQgJSAyNiAhPT0gMClcbiAgICB0aGlzLnNoaWZ0ICs9IDI2IC0gKHRoaXMuc2hpZnQgJSAyNik7XG4gIHRoaXMuciA9IG5ldyBCTigxKS5pc2hsbih0aGlzLnNoaWZ0KTtcbiAgdGhpcy5yMiA9IHRoaXMuaW1vZCh0aGlzLnIuc3FyKCkpO1xuICB0aGlzLnJpbnYgPSB0aGlzLnIuaW52bSh0aGlzLm0pO1xuXG4gIHRoaXMubWludiA9IHRoaXMucmludi5tdWwodGhpcy5yKS5pc3VibigxKS5kaXYodGhpcy5tKTtcbiAgdGhpcy5taW52LnNpZ24gPSB0cnVlO1xuICB0aGlzLm1pbnYgPSB0aGlzLm1pbnYubW9kKHRoaXMucik7XG59XG5pbmhlcml0cyhNb250LCBSZWQpO1xuXG5Nb250LnByb3RvdHlwZS5jb252ZXJ0VG8gPSBmdW5jdGlvbiBjb252ZXJ0VG8obnVtKSB7XG4gIHJldHVybiB0aGlzLmltb2QobnVtLnNobG4odGhpcy5zaGlmdCkpO1xufTtcblxuTW9udC5wcm90b3R5cGUuY29udmVydEZyb20gPSBmdW5jdGlvbiBjb252ZXJ0RnJvbShudW0pIHtcbiAgdmFyIHIgPSB0aGlzLmltb2QobnVtLm11bCh0aGlzLnJpbnYpKTtcbiAgci5yZWQgPSBudWxsO1xuICByZXR1cm4gcjtcbn07XG5cbk1vbnQucHJvdG90eXBlLmltdWwgPSBmdW5jdGlvbiBpbXVsKGEsIGIpIHtcbiAgaWYgKGEuY21wbigwKSA9PT0gMCB8fCBiLmNtcG4oMCkgPT09IDApIHtcbiAgICBhLndvcmRzWzBdID0gMDtcbiAgICBhLmxlbmd0aCA9IDE7XG4gICAgcmV0dXJuIGE7XG4gIH1cblxuICB2YXIgdCA9IGEuaW11bChiKTtcbiAgdmFyIGMgPSB0Lm1hc2tuKHRoaXMuc2hpZnQpLm11bCh0aGlzLm1pbnYpLmltYXNrbih0aGlzLnNoaWZ0KS5tdWwodGhpcy5tKTtcbiAgdmFyIHUgPSB0LmlzdWIoYykuaXNocm4odGhpcy5zaGlmdCk7XG4gIHZhciByZXMgPSB1O1xuICBpZiAodS5jbXAodGhpcy5tKSA+PSAwKVxuICAgIHJlcyA9IHUuaXN1Yih0aGlzLm0pO1xuICBlbHNlIGlmICh1LmNtcG4oMCkgPCAwKVxuICAgIHJlcyA9IHUuaWFkZCh0aGlzLm0pO1xuXG4gIHJldHVybiByZXMuX2ZvcmNlUmVkKHRoaXMpO1xufTtcblxuTW9udC5wcm90b3R5cGUubXVsID0gZnVuY3Rpb24gbXVsKGEsIGIpIHtcbiAgaWYgKGEuY21wbigwKSA9PT0gMCB8fCBiLmNtcG4oMCkgPT09IDApXG4gICAgcmV0dXJuIG5ldyBCTigwKS5fZm9yY2VSZWQodGhpcyk7XG5cbiAgdmFyIHQgPSBhLm11bChiKTtcbiAgdmFyIGMgPSB0Lm1hc2tuKHRoaXMuc2hpZnQpLm11bCh0aGlzLm1pbnYpLmltYXNrbih0aGlzLnNoaWZ0KS5tdWwodGhpcy5tKTtcbiAgdmFyIHUgPSB0LmlzdWIoYykuaXNocm4odGhpcy5zaGlmdCk7XG4gIHZhciByZXMgPSB1O1xuICBpZiAodS5jbXAodGhpcy5tKSA+PSAwKVxuICAgIHJlcyA9IHUuaXN1Yih0aGlzLm0pO1xuICBlbHNlIGlmICh1LmNtcG4oMCkgPCAwKVxuICAgIHJlcyA9IHUuaWFkZCh0aGlzLm0pO1xuXG4gIHJldHVybiByZXMuX2ZvcmNlUmVkKHRoaXMpO1xufTtcblxuTW9udC5wcm90b3R5cGUuaW52bSA9IGZ1bmN0aW9uIGludm0oYSkge1xuICAvLyAoQVIpXi0xICogUl4yID0gKEFeLTEgKiBSXi0xKSAqIFJeMiA9IEFeLTEgKiBSXG4gIHZhciByZXMgPSB0aGlzLmltb2QoYS5pbnZtKHRoaXMubSkubXVsKHRoaXMucjIpKTtcbiAgcmV0dXJuIHJlcy5fZm9yY2VSZWQodGhpcyk7XG59O1xuXG59KSh0eXBlb2YgbW9kdWxlID09PSAndW5kZWZpbmVkJyB8fCBtb2R1bGUsIHRoaXMpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuY29uc3Qgb3MgPSByZXF1aXJlKCdvcycpO1xuY29uc3QgaGFzRmxhZyA9IHJlcXVpcmUoJ2hhcy1mbGFnJyk7XG5cbmNvbnN0IGVudiA9IHByb2Nlc3MuZW52O1xuXG5sZXQgZm9yY2VDb2xvcjtcbmlmIChoYXNGbGFnKCduby1jb2xvcicpIHx8XG5cdGhhc0ZsYWcoJ25vLWNvbG9ycycpIHx8XG5cdGhhc0ZsYWcoJ2NvbG9yPWZhbHNlJykpIHtcblx0Zm9yY2VDb2xvciA9IGZhbHNlO1xufSBlbHNlIGlmIChoYXNGbGFnKCdjb2xvcicpIHx8XG5cdGhhc0ZsYWcoJ2NvbG9ycycpIHx8XG5cdGhhc0ZsYWcoJ2NvbG9yPXRydWUnKSB8fFxuXHRoYXNGbGFnKCdjb2xvcj1hbHdheXMnKSkge1xuXHRmb3JjZUNvbG9yID0gdHJ1ZTtcbn1cbmlmICgnRk9SQ0VfQ09MT1InIGluIGVudikge1xuXHRmb3JjZUNvbG9yID0gZW52LkZPUkNFX0NPTE9SLmxlbmd0aCA9PT0gMCB8fCBwYXJzZUludChlbnYuRk9SQ0VfQ09MT1IsIDEwKSAhPT0gMDtcbn1cblxuZnVuY3Rpb24gdHJhbnNsYXRlTGV2ZWwobGV2ZWwpIHtcblx0aWYgKGxldmVsID09PSAwKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRsZXZlbCxcblx0XHRoYXNCYXNpYzogdHJ1ZSxcblx0XHRoYXMyNTY6IGxldmVsID49IDIsXG5cdFx0aGFzMTZtOiBsZXZlbCA+PSAzXG5cdH07XG59XG5cbmZ1bmN0aW9uIHN1cHBvcnRzQ29sb3Ioc3RyZWFtKSB7XG5cdGlmIChmb3JjZUNvbG9yID09PSBmYWxzZSkge1xuXHRcdHJldHVybiAwO1xuXHR9XG5cblx0aWYgKGhhc0ZsYWcoJ2NvbG9yPTE2bScpIHx8XG5cdFx0aGFzRmxhZygnY29sb3I9ZnVsbCcpIHx8XG5cdFx0aGFzRmxhZygnY29sb3I9dHJ1ZWNvbG9yJykpIHtcblx0XHRyZXR1cm4gMztcblx0fVxuXG5cdGlmIChoYXNGbGFnKCdjb2xvcj0yNTYnKSkge1xuXHRcdHJldHVybiAyO1xuXHR9XG5cblx0aWYgKHN0cmVhbSAmJiAhc3RyZWFtLmlzVFRZICYmIGZvcmNlQ29sb3IgIT09IHRydWUpIHtcblx0XHRyZXR1cm4gMDtcblx0fVxuXG5cdGNvbnN0IG1pbiA9IGZvcmNlQ29sb3IgPyAxIDogMDtcblxuXHRpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJykge1xuXHRcdC8vIE5vZGUuanMgNy41LjAgaXMgdGhlIGZpcnN0IHZlcnNpb24gb2YgTm9kZS5qcyB0byBpbmNsdWRlIGEgcGF0Y2ggdG9cblx0XHQvLyBsaWJ1diB0aGF0IGVuYWJsZXMgMjU2IGNvbG9yIG91dHB1dCBvbiBXaW5kb3dzLiBBbnl0aGluZyBlYXJsaWVyIGFuZCBpdFxuXHRcdC8vIHdvbid0IHdvcmsuIEhvd2V2ZXIsIGhlcmUgd2UgdGFyZ2V0IE5vZGUuanMgOCBhdCBtaW5pbXVtIGFzIGl0IGlzIGFuIExUU1xuXHRcdC8vIHJlbGVhc2UsIGFuZCBOb2RlLmpzIDcgaXMgbm90LiBXaW5kb3dzIDEwIGJ1aWxkIDEwNTg2IGlzIHRoZSBmaXJzdCBXaW5kb3dzXG5cdFx0Ly8gcmVsZWFzZSB0aGF0IHN1cHBvcnRzIDI1NiBjb2xvcnMuIFdpbmRvd3MgMTAgYnVpbGQgMTQ5MzEgaXMgdGhlIGZpcnN0IHJlbGVhc2Vcblx0XHQvLyB0aGF0IHN1cHBvcnRzIDE2bS9UcnVlQ29sb3IuXG5cdFx0Y29uc3Qgb3NSZWxlYXNlID0gb3MucmVsZWFzZSgpLnNwbGl0KCcuJyk7XG5cdFx0aWYgKFxuXHRcdFx0TnVtYmVyKHByb2Nlc3MudmVyc2lvbnMubm9kZS5zcGxpdCgnLicpWzBdKSA+PSA4ICYmXG5cdFx0XHROdW1iZXIob3NSZWxlYXNlWzBdKSA+PSAxMCAmJlxuXHRcdFx0TnVtYmVyKG9zUmVsZWFzZVsyXSkgPj0gMTA1ODZcblx0XHQpIHtcblx0XHRcdHJldHVybiBOdW1iZXIob3NSZWxlYXNlWzJdKSA+PSAxNDkzMSA/IDMgOiAyO1xuXHRcdH1cblxuXHRcdHJldHVybiAxO1xuXHR9XG5cblx0aWYgKCdDSScgaW4gZW52KSB7XG5cdFx0aWYgKFsnVFJBVklTJywgJ0NJUkNMRUNJJywgJ0FQUFZFWU9SJywgJ0dJVExBQl9DSSddLnNvbWUoc2lnbiA9PiBzaWduIGluIGVudikgfHwgZW52LkNJX05BTUUgPT09ICdjb2Rlc2hpcCcpIHtcblx0XHRcdHJldHVybiAxO1xuXHRcdH1cblxuXHRcdHJldHVybiBtaW47XG5cdH1cblxuXHRpZiAoJ1RFQU1DSVRZX1ZFUlNJT04nIGluIGVudikge1xuXHRcdHJldHVybiAvXig5XFwuKDAqWzEtOV1cXGQqKVxcLnxcXGR7Mix9XFwuKS8udGVzdChlbnYuVEVBTUNJVFlfVkVSU0lPTikgPyAxIDogMDtcblx0fVxuXG5cdGlmIChlbnYuQ09MT1JURVJNID09PSAndHJ1ZWNvbG9yJykge1xuXHRcdHJldHVybiAzO1xuXHR9XG5cblx0aWYgKCdURVJNX1BST0dSQU0nIGluIGVudikge1xuXHRcdGNvbnN0IHZlcnNpb24gPSBwYXJzZUludCgoZW52LlRFUk1fUFJPR1JBTV9WRVJTSU9OIHx8ICcnKS5zcGxpdCgnLicpWzBdLCAxMCk7XG5cblx0XHRzd2l0Y2ggKGVudi5URVJNX1BST0dSQU0pIHtcblx0XHRcdGNhc2UgJ2lUZXJtLmFwcCc6XG5cdFx0XHRcdHJldHVybiB2ZXJzaW9uID49IDMgPyAzIDogMjtcblx0XHRcdGNhc2UgJ0FwcGxlX1Rlcm1pbmFsJzpcblx0XHRcdFx0cmV0dXJuIDI7XG5cdFx0XHQvLyBObyBkZWZhdWx0XG5cdFx0fVxuXHR9XG5cblx0aWYgKC8tMjU2KGNvbG9yKT8kL2kudGVzdChlbnYuVEVSTSkpIHtcblx0XHRyZXR1cm4gMjtcblx0fVxuXG5cdGlmICgvXnNjcmVlbnxeeHRlcm18XnZ0MTAwfF52dDIyMHxecnh2dHxjb2xvcnxhbnNpfGN5Z3dpbnxsaW51eC9pLnRlc3QoZW52LlRFUk0pKSB7XG5cdFx0cmV0dXJuIDE7XG5cdH1cblxuXHRpZiAoJ0NPTE9SVEVSTScgaW4gZW52KSB7XG5cdFx0cmV0dXJuIDE7XG5cdH1cblxuXHRpZiAoZW52LlRFUk0gPT09ICdkdW1iJykge1xuXHRcdHJldHVybiBtaW47XG5cdH1cblxuXHRyZXR1cm4gbWluO1xufVxuXG5mdW5jdGlvbiBnZXRTdXBwb3J0TGV2ZWwoc3RyZWFtKSB7XG5cdGNvbnN0IGxldmVsID0gc3VwcG9ydHNDb2xvcihzdHJlYW0pO1xuXHRyZXR1cm4gdHJhbnNsYXRlTGV2ZWwobGV2ZWwpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0c3VwcG9ydHNDb2xvcjogZ2V0U3VwcG9ydExldmVsLFxuXHRzdGRvdXQ6IGdldFN1cHBvcnRMZXZlbChwcm9jZXNzLnN0ZG91dCksXG5cdHN0ZGVycjogZ2V0U3VwcG9ydExldmVsKHByb2Nlc3Muc3RkZXJyKVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obW9kdWxlKSB7XG5cdGlmICghbW9kdWxlLndlYnBhY2tQb2x5ZmlsbCkge1xuXHRcdG1vZHVsZS5kZXByZWNhdGUgPSBmdW5jdGlvbigpIHt9O1xuXHRcdG1vZHVsZS5wYXRocyA9IFtdO1xuXHRcdC8vIG1vZHVsZS5wYXJlbnQgPSB1bmRlZmluZWQgYnkgZGVmYXVsdFxuXHRcdGlmICghbW9kdWxlLmNoaWxkcmVuKSBtb2R1bGUuY2hpbGRyZW4gPSBbXTtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobW9kdWxlLCBcImxvYWRlZFwiLCB7XG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIG1vZHVsZS5sO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtb2R1bGUsIFwiaWRcIiwge1xuXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBtb2R1bGUuaTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRtb2R1bGUud2VicGFja1BvbHlmaWxsID0gMTtcblx0fVxuXHRyZXR1cm4gbW9kdWxlO1xufTtcbiIsImltcG9ydCB7IEJpZ051bWJlciB9IGZyb20gJ2JpZ251bWJlci5qcyc7XG5cbmV4cG9ydCBjbGFzcyBBciB7XG5cbiAgICAvKipcbiAgICAgKiBNZXRob2QgdG8gdGFrZSBhIHN0cmluZyB2YWx1ZSBhbmQgcmV0dXJuIGEgYmlnbnVtYmVyIG9iamVjdC5cbiAgICAgKlxuICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAgICogQG1lbWJlcm9mIEFyd2VhdmVcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgQmlnTnVtOiBGdW5jdGlvbjtcblxuXG5cdGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAvLyBDb25maWd1cmUgYW5kIGFzc2lnbiB0aGUgY29uc3RydWN0b3IgZnVuY3Rpb24gZm9yIHRoZSBiaWdudW1iZXIgbGlicmFyeS5cbiAgICAgICAgdGhpcy5CaWdOdW0gPSAodmFsdWU6IHN0cmluZywgZGVjaW1hbHM6IG51bWJlcik6IEJpZ051bWJlciA9PiB7XG4gICAgICAgICAgICBsZXQgaW5zdGFuY2UgPSBCaWdOdW1iZXIuY2xvbmUoeyBERUNJTUFMX1BMQUNFUzogZGVjaW1hbHMgfSk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IGluc3RhbmNlKHZhbHVlKTtcbiAgICAgICAgfVxuXHR9XG5cblxuICAgIHB1YmxpYyB3aW5zdG9uVG9Bcih3aW5zdG9uU3RyaW5nOiBzdHJpbmcsIHsgZm9ybWF0dGVkID0gZmFsc2UsIGRlY2ltYWxzID0gMTIsIHRyaW0gPSB0cnVlfSA9IHt9KXtcblxuICAgICAgICBsZXQgbnVtYmVyID0gdGhpcy5zdHJpbmdUb0JpZ051bSh3aW5zdG9uU3RyaW5nLCBkZWNpbWFscykuc2hpZnRlZEJ5KC0xMik7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gZm9ybWF0dGVkID8gbnVtYmVyLnRvRm9ybWF0KGRlY2ltYWxzKSA6IG51bWJlci50b0ZpeGVkKGRlY2ltYWxzKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXJUb1dpbnN0b24oYXJTdHJpbmc6IHN0cmluZywgeyBmb3JtYXR0ZWQgPSBmYWxzZX0gPSB7fSl7XG4gICAgICAgIGxldCBudW1iZXIgPSB0aGlzLnN0cmluZ1RvQmlnTnVtKGFyU3RyaW5nKS5zaGlmdGVkQnkoMTIpO1xuXG4gICAgICAgIHJldHVybiBmb3JtYXR0ZWQgPyBudW1iZXIudG9Gb3JtYXQoKSA6IG51bWJlci50b0ZpeGVkKDApO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RyaW5nVG9CaWdOdW0oc3RyaW5nVmFsdWU6IHN0cmluZywgZGVjaW1hbFBsYWNlczogbnVtYmVyID0gMTIpOiBCaWdOdW1iZXJ7XG4gICAgICAgIHJldHVybiB0aGlzLkJpZ051bShzdHJpbmdWYWx1ZSwgZGVjaW1hbFBsYWNlcyk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQXIgfSBmcm9tIFwiLi9hclwiO1xuaW1wb3J0IHsgQXBpLCBBcGlDb25maWcgfSBmcm9tIFwiLi9saWIvYXBpXCI7XG5pbXBvcnQgeyBDcnlwdG9JbnRlcmZhY2UgfSBmcm9tIFwiLi9saWIvY3J5cHRvL2NyeXB0by1pbnRlcmZhY2VcIjtcbmltcG9ydCB7IE5ldHdvcmsgfSBmcm9tIFwiLi9uZXR3b3JrXCI7XG5pbXBvcnQgeyBUcmFuc2FjdGlvbnMgfSBmcm9tICcuL3RyYW5zYWN0aW9ucyc7XG5pbXBvcnQgeyBXYWxsZXRzIH0gZnJvbSAnLi93YWxsZXRzJztcbmltcG9ydCB7IFRyYW5zYWN0aW9uSW50ZXJmYWNlLCBUcmFuc2FjdGlvbiB9IGZyb20gXCIuL2xpYi9UcmFuc2FjdGlvblwiO1xuaW1wb3J0IHsgSldLSW50ZXJmYWNlIH0gZnJvbSBcIi4vbGliL1dhbGxldFwiO1xuaW1wb3J0IHsgQXJ3ZWF2ZVV0aWxzIH0gZnJvbSBcIi4vbGliL3V0aWxzXCI7XG5cblxuaW50ZXJmYWNlIENvbmZpZzxUID0gb2JqZWN0PntcbiAgICBhcGk6IEFwaUNvbmZpZ1xuICAgIGNyeXB0bzogQ3J5cHRvSW50ZXJmYWNlXG59XG5cbmV4cG9ydCBjbGFzcyBBcndlYXZlIHtcbiAgICBcbiAgICBwdWJsaWMgYXBpOiBBcGk7XG5cbiAgICBwdWJsaWMgd2FsbGV0czogV2FsbGV0cztcblxuICAgIHB1YmxpYyB0cmFuc2FjdGlvbnM6IFRyYW5zYWN0aW9ucztcblxuICAgIHB1YmxpYyBuZXR3b3JrOiBOZXR3b3JrO1xuICAgIFxuICAgIHB1YmxpYyBhcjogQXI7XG4gICAgXG4gICAgcHVibGljIGNyeXB0bzogQ3J5cHRvSW50ZXJmYWNlO1xuICAgIFxuICAgIHB1YmxpYyB1dGlsczogQXJ3ZWF2ZVV0aWxzO1xuXG4gICAgY29uc3RydWN0b3IoY29uZmlnOiBDb25maWcpe1xuXG4gICAgICAgIHRoaXMuY3J5cHRvID0gY29uZmlnLmNyeXB0bztcblxuICAgICAgICB0aGlzLmFwaSA9IG5ldyBBcGkoY29uZmlnLmFwaSk7XG4gICAgICAgIHRoaXMud2FsbGV0cyA9IG5ldyBXYWxsZXRzKHRoaXMuYXBpLCBjb25maWcuY3J5cHRvKTtcbiAgICAgICAgdGhpcy50cmFuc2FjdGlvbnMgPSBuZXcgVHJhbnNhY3Rpb25zKHRoaXMuYXBpLCBjb25maWcuY3J5cHRvKTtcbiAgICAgICAgdGhpcy5uZXR3b3JrID0gbmV3IE5ldHdvcmsodGhpcy5hcGkpO1xuICAgICAgICB0aGlzLmFyID0gbmV3IEFyO1xuXG4gICAgICAgIHRoaXMudXRpbHMgPSBBcndlYXZlVXRpbHM7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGNyZWF0ZVRyYW5zYWN0aW9uKGF0dHJpYnV0ZXM6IFBhcnRpYWw8VHJhbnNhY3Rpb25JbnRlcmZhY2U+LCBqd2s6IEpXS0ludGVyZmFjZSl7XG5cbiAgICAgICAgaWYgKCAhYXR0cmlidXRlcy5kYXRhICYmICEoYXR0cmlidXRlcy50YXJnZXQgJiYgYXR0cmlidXRlcy5xdWFudGl0eSkgKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEEgbmV3IEFyd2VhdmUgdHJhbnNhY3Rpb24gbXVzdCBoYXZlIGEgJ2RhdGEnIHZhbHVlLCBvciAndGFyZ2V0JyBhbmQgJ3F1YW50aXR5JyB2YWx1ZXMuYCk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZnJvbSA9IGF3YWl0IHRoaXMud2FsbGV0cy5qd2tUb0FkZHJlc3MoandrKTtcblxuICAgICAgICBpZiAoYXR0cmlidXRlcy5vd25lciA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZXMub3duZXIgPSBqd2subjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhdHRyaWJ1dGVzLmxhc3RfdHggPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVzLmxhc3RfdHggPSBhd2FpdCB0aGlzLndhbGxldHMuZ2V0TGFzdFRyYW5zYWN0aW9uSUQoZnJvbSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXR0cmlidXRlcy5yZXdhcmQgPT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgICAgICAgIGxldCBsZW5ndGggPSAodHlwZW9mIGF0dHJpYnV0ZXMuZGF0YSA9PSAnc3RyaW5nJyAmJiBhdHRyaWJ1dGVzLmRhdGEubGVuZ3RoID4gMCkgPyBhdHRyaWJ1dGVzLmRhdGEubGVuZ3RoIDogMDtcblxuICAgICAgICAgICAgbGV0IHRhcmdldCA9ICh0eXBlb2YgYXR0cmlidXRlcy50YXJnZXQgPT0gJ3N0cmluZycgJiYgYXR0cmlidXRlcy50YXJnZXQubGVuZ3RoID4gMCkgPyBhdHRyaWJ1dGVzLnRhcmdldCA6IG51bGw7XG5cbiAgICAgICAgICAgIGF0dHJpYnV0ZXMucmV3YXJkID0gYXdhaXQgdGhpcy50cmFuc2FjdGlvbnMuZ2V0UHJpY2UobGVuZ3RoLCB0YXJnZXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGF0dHJpYnV0ZXMuZGF0YSkge1xuICAgICAgICAgICAgYXR0cmlidXRlcy5kYXRhID0gQXJ3ZWF2ZVV0aWxzLnN0cmluZ1RvQjY0VXJsKGF0dHJpYnV0ZXMuZGF0YSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFRyYW5zYWN0aW9uKGF0dHJpYnV0ZXMpO1xuICAgIH1cblxufVxuXG4iLCJpbXBvcnQgeyBBcndlYXZlVXRpbHMgfSBmcm9tICcuL3V0aWxzJztcblxuY2xhc3MgQmFzZU9iamVjdCB7XG5cbiAgICBba2V5OnN0cmluZ106IGFueTtcblxuICAgIHB1YmxpYyBnZXQoZmllbGQ6IHN0cmluZyk6IHN0cmluZztcbiAgICBwdWJsaWMgZ2V0KGZpZWxkOiBzdHJpbmcsIG9wdGlvbnM6IHtkZWNvZGU6IHRydWUsIHN0cmluZzogZmFsc2V9KTogVWludDhBcnJheTtcbiAgICBwdWJsaWMgZ2V0KGZpZWxkOiBzdHJpbmcsIG9wdGlvbnM6IHtkZWNvZGU6IHRydWUsIHN0cmluZzogdHJ1ZX0pOiBzdHJpbmc7XG5cbiAgICBwdWJsaWMgZ2V0KGZpZWxkOiBzdHJpbmcsIG9wdGlvbnM/OiB7XG4gICAgICAgIHN0cmluZz86IGJvb2xlYW4sXG4gICAgICAgIGRlY29kZT86IGJvb2xlYW5cbiAgICAgfSk6IHN0cmluZyB8IFVpbnQ4QXJyYXkgfCBUYWdbXSB7XG4gICAgIFxuICAgICAgICBpZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRoaXMpLmluY2x1ZGVzKGZpZWxkKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBGaWVsZCBcIiR7ZmllbGR9XCIgaXMgbm90IGEgcHJvcGVydHkgb2YgdGhlIEFyd2VhdmUgVHJhbnNhY3Rpb24gY2xhc3MuYCk7XG4gICAgICAgIH1cbiAgICAgXG4gICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuZGVjb2RlID09IHRydWUpIHtcbiAgICAgXG4gICAgICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnN0cmluZykge1xuICAgICAgICAgICAgICAgIHJldHVybiBBcndlYXZlVXRpbHMuYjY0VXJsVG9TdHJpbmcodGhpc1tmaWVsZF0pO1xuICAgICAgICAgICAgfVxuICAgICBcbiAgICAgICAgICAgIHJldHVybiBBcndlYXZlVXRpbHMuYjY0VXJsVG9CdWZmZXIodGhpc1tmaWVsZF0pO1xuICAgICAgICB9XG4gICAgIFxuICAgICAgICByZXR1cm4gdGhpc1tmaWVsZF07XG4gICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRhZyBleHRlbmRzIEJhc2VPYmplY3Qge1xuXG4gICAgcmVhZG9ubHkgbmFtZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IHZhbHVlOiBzdHJpbmc7XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nLCBkZWNvZGUgPSBmYWxzZSl7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG5cbn1cblxuZXhwb3J0IGludGVyZmFjZSBUcmFuc2FjdGlvbkludGVyZmFjZSB7XG5cbiAgICBba2V5OnN0cmluZ106IGFueVxuXG4gICAgaWQ6IHN0cmluZyxcbiAgICBsYXN0X3R4OiBzdHJpbmcsXG4gICAgb3duZXI6IHN0cmluZyxcbiAgICB0YWdzOiAgVGFnW10sXG4gICAgdGFyZ2V0OiBzdHJpbmcsXG4gICAgcXVhbnRpdHk6IHN0cmluZyxcbiAgICBkYXRhOiBzdHJpbmcsXG4gICAgcmV3YXJkOiBzdHJpbmcsXG4gICAgc2lnbmF0dXJlOiBzdHJpbmcsXG59XG5cblxuZXhwb3J0IGNsYXNzIFRyYW5zYWN0aW9uICBleHRlbmRzIEJhc2VPYmplY3QgaW1wbGVtZW50cyBUcmFuc2FjdGlvbkludGVyZmFjZSB7XG5cbiAgICBba2V5OnN0cmluZ106IGFueVxuXG4gICAgcHVibGljIGlkOiBzdHJpbmc7XG4gICAgcHVibGljIHJlYWRvbmx5IGxhc3RfdHg6c3RyaW5nID0gJyc7XG4gICAgcHVibGljIHJlYWRvbmx5IG93bmVyOnN0cmluZyAgPSAnJztcbiAgICBwdWJsaWMgcmVhZG9ubHkgdGFnczogVGFnW10gPSBbXTtcbiAgICBwdWJsaWMgcmVhZG9ubHkgdGFyZ2V0OiBzdHJpbmcgPSAnJztcbiAgICBwdWJsaWMgcmVhZG9ubHkgcXVhbnRpdHk6IHN0cmluZyA9ICcwJztcbiAgICBwdWJsaWMgcmVhZG9ubHkgZGF0YTogc3RyaW5nID0gJyc7XG4gICAgcHVibGljIHJlYWRvbmx5IHJld2FyZDogc3RyaW5nID0gJzAnO1xuICAgIHB1YmxpYyBzaWduYXR1cmU6IHN0cmluZyA9ICcnO1xuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGF0dHJpYnV0ZXM/OiBQYXJ0aWFsPFRyYW5zYWN0aW9uSW50ZXJmYWNlPikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIGF0dHJpYnV0ZXMpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhZGRUYWcobmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKXtcbiAgICAgICAgdGhpcy50YWdzLnB1c2gobmV3IFRhZyhcbiAgICAgICAgICAgIEFyd2VhdmVVdGlscy5zdHJpbmdUb0I2NFVybChuYW1lKSxcbiAgICAgICAgICAgIEFyd2VhdmVVdGlscy5zdHJpbmdUb0I2NFVybCh2YWx1ZSlcbiAgICAgICAgKSk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvSlNPTigpe1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICAgICAgICBsYXN0X3R4OiB0aGlzLmxhc3RfdHgsXG4gICAgICAgICAgICBvd25lcjogdGhpcy5vd25lcixcbiAgICAgICAgICAgIHRhZ3M6IHRoaXMudGFncyxcbiAgICAgICAgICAgIHRhcmdldDogdGhpcy50YXJnZXQsXG4gICAgICAgICAgICBxdWFudGl0eTogdGhpcy5xdWFudGl0eSxcbiAgICAgICAgICAgIGRhdGE6IHRoaXMuZGF0YSxcbiAgICAgICAgICAgIHJld2FyZDogdGhpcy5yZXdhcmQsXG4gICAgICAgICAgICBzaWduYXR1cmU6IHRoaXMuc2lnbmF0dXJlXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHVibGljIHNldFNpZ25hdHVyZSh7c2lnbmF0dXJlLCBpZH06IHtcbiAgICAgICAgc2lnbmF0dXJlOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgfSkge1xuICAgICAgICB0aGlzLnNpZ25hdHVyZSA9IHNpZ25hdHVyZTtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRTaWduYXR1cmVEYXRhKCk6IFVpbnQ4QXJyYXkge1xuXG4gICAgICAgIGxldCB0YWdTdHJpbmcgPSB0aGlzLnRhZ3MucmVkdWNlKChhY2N1bXVsYXRvcjogc3RyaW5nLCB0YWc6IFRhZykgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGFjY3VtdWxhdG9yICsgJycgKyB0YWcuZ2V0KCduYW1lJywge2RlY29kZTogdHJ1ZSwgc3RyaW5nOiB0cnVlfSkgKyAnJyArIHRhZy5nZXQoJ3ZhbHVlJywge2RlY29kZTogdHJ1ZSwgc3RyaW5nOiB0cnVlfSlcbiAgICAgICAgfSwgJycpO1xuXG4gICAgICAgIHJldHVybiBBcndlYXZlVXRpbHMuY29uY2F0QnVmZmVycyhbXG4gICAgICAgICAgICB0aGlzLmdldCgnb3duZXInLCB7ZGVjb2RlOiB0cnVlLCBzdHJpbmc6IGZhbHNlfSksXG4gICAgICAgICAgICB0aGlzLmdldCgndGFyZ2V0Jywge2RlY29kZTogdHJ1ZSwgc3RyaW5nOiBmYWxzZX0pLFxuICAgICAgICAgICAgdGhpcy5nZXQoJ2RhdGEnLCB7ZGVjb2RlOiB0cnVlLCBzdHJpbmc6IGZhbHNlfSksXG4gICAgICAgICAgICBBcndlYXZlVXRpbHMuc3RyaW5nVG9CdWZmZXIodGhpcy5xdWFudGl0eSksXG4gICAgICAgICAgICBBcndlYXZlVXRpbHMuc3RyaW5nVG9CdWZmZXIodGhpcy5yZXdhcmQpLFxuICAgICAgICAgICAgdGhpcy5nZXQoJ2xhc3RfdHgnLCB7ZGVjb2RlOiB0cnVlLCBzdHJpbmc6IGZhbHNlfSksXG4gICAgICAgICAgICBBcndlYXZlVXRpbHMuc3RyaW5nVG9CdWZmZXIodGFnU3RyaW5nKVxuICAgICAgICBdKTtcbiAgICB9XG59IiwiaW1wb3J0IEF4aW9zLCB7IEF4aW9zUmVzcG9uc2UsIEF4aW9zUmVxdWVzdENvbmZpZywgQXhpb3NJbnN0YW5jZSB9IGZyb20gJ2F4aW9zJztcblxuZXhwb3J0IGludGVyZmFjZSBBcGlDb25maWc8VCA9IG9iamVjdD4ge1xuICAgIGhvc3Q/OiBzdHJpbmcsXG4gICAgcHJvdG9jb2w/OiBzdHJpbmcsXG4gICAgcG9ydD86IHN0cmluZ3xudW1iZXIsXG4gICAgdGltZW91dD86IHN0cmluZ3xudW1iZXIsXG4gICAgbG9nZ2luZz86IGJvb2xlYW5cbn1cblxuZXhwb3J0IGNsYXNzIEFwaSB7XG5cbiAgICBwdWJsaWMgcmVhZG9ubHkgTUVUSE9EX0dFVCA9ICdHRVQnO1xuICAgIHB1YmxpYyByZWFkb25seSBNRVRIT0RfUE9TVCA9ICdQT1NUJztcblxuICAgIHByaXZhdGUgY29uZmlnOiBBcGlDb25maWc7XG5cbiAgICBjb25zdHJ1Y3Rvcihjb25maWc6IEFwaUNvbmZpZyl7XG4gICAgICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZURlZmF1bHRzKGNvbmZpZyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBtZXJnZURlZmF1bHRzKGNvbmZpZzogQXBpQ29uZmlnKTogQXBpQ29uZmlne1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaG9zdDogY29uZmlnLmhvc3QsXG4gICAgICAgICAgICBwcm90b2NvbDogY29uZmlnLnByb3RvY29sIHx8ICdodHRwJyxcbiAgICAgICAgICAgIHBvcnQ6IGNvbmZpZy5wb3J0IHx8IDE5ODQsXG4gICAgICAgICAgICB0aW1lb3V0OiBjb25maWcudGltZW91dCB8fCAyMDAwMCxcbiAgICAgICAgICAgIGxvZ2dpbmc6IGZhbHNlLFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBnZXQoZW5kcG9pbnQ6IHN0cmluZywgY29uZmlnPzogQXhpb3NSZXF1ZXN0Q29uZmlnKTogUHJvbWlzZTxBeGlvc1Jlc3BvbnNlPntcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMucmVxdWVzdCgpLmdldChlbmRwb2ludCwgY29uZmlnKTtcblxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuXG4gICAgICAgICAgICBpZiAoZXJyb3IucmVzcG9uc2UgJiYgZXJyb3IucmVzcG9uc2Uuc3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVycm9yLnJlc3BvbnNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBwb3N0KCl7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgYW4gQXhpb3NJbnN0YW5jZSB3aXRoIHRoZSBiYXNlIGNvbmZpZ3VyYXRpb24gc2V0dXAgdG8gZmlyZSBvZmZcbiAgICAgKiBhIHJlcXVlc3QgdG8gdGhlIG5ldHdvcmsuXG4gICAgICovXG4gICAgcHVibGljIHJlcXVlc3QoKTogQXhpb3NJbnN0YW5jZXtcblxuICAgICAgICBsZXQgaW5zdGFuY2UgPSBBeGlvcy5jcmVhdGUoe1xuICAgICAgICAgICAgYmFzZVVSTDogYCR7dGhpcy5jb25maWcucHJvdG9jb2x9Oi8vJHt0aGlzLmNvbmZpZy5ob3N0fToke3RoaXMuY29uZmlnLnBvcnR9YCxcbiAgICAgICAgICAgIHRpbWVvdXQ6IDEwMDAsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5sb2dnaW5nKSB7XG5cbiAgICAgICAgICAgIGluc3RhbmNlLmludGVyY2VwdG9ycy5yZXF1ZXN0LnVzZSggcmVxdWVzdCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFJlcXVlc3Rpbmc6ICR7cmVxdWVzdC5iYXNlVVJMfS8ke3JlcXVlc3QudXJsfWApO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0O1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGluc3RhbmNlLmludGVyY2VwdG9ycy5yZXNwb25zZS51c2UoIHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgUmVzcG9uc2U6ICAgJHtyZXNwb25zZS5jb25maWcudXJsfSAtICR7cmVzcG9uc2Uuc3RhdHVzfWApO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuXG4gICAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICB9XG59IiwiaW1wb3J0IHsgSldLSW50ZXJmYWNlIH0gZnJvbSBcIi4uL1dhbGxldFwiO1xuaW1wb3J0IHsgQ3J5cHRvSW50ZXJmYWNlIH0gZnJvbSBcIi4vY3J5cHRvLWludGVyZmFjZVwiO1xuXG5jb25zdCBwZW1Ub0pXSyA9IHJlcXVpcmUoJ3BlbS1qd2snKS5wZW0yandrO1xuY29uc3QgSldLVG9wZW0gPSByZXF1aXJlKCdwZW0tandrJykuandrMnBlbTtcbmNvbnN0IGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xuXG5leHBvcnQgY2xhc3MgTm9kZUNyeXB0b0RyaXZlciBpbXBsZW1lbnRzIENyeXB0b0ludGVyZmFjZSB7XG5cbiAgICBwdWJsaWMgcmVhZG9ubHkga2V5TGVuZ3RoID0gNDA5NjtcbiAgICBwdWJsaWMgcmVhZG9ubHkgcHVibGljRXhwb25lbnQgPSAweDEwMDAxO1xuICAgIHB1YmxpYyByZWFkb25seSBoYXNoQWxnb3JpdGhtID0gJ3NoYTI1Nic7XG5cbiAgICBnZW5lcmF0ZUpXSygpOiBQcm9taXNlPEpXS0ludGVyZmFjZT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY3J5cHRvXG4gICAgICAgICAgICAgICAgLmdlbmVyYXRlS2V5UGFpcigncnNhJywge1xuICAgICAgICAgICAgICAgICAgICBtb2R1bHVzTGVuZ3RoOiB0aGlzLmtleUxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgcHVibGljRXhwb25lbnQ6IHRoaXMucHVibGljRXhwb25lbnQsXG4gICAgICAgICAgICAgICAgICAgIHByaXZhdGVLZXlFbmNvZGluZzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3BrY3MxJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1hdDogJ3BlbSdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcHVibGljS2V5RW5jb2Rpbmc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwa2NzMScsXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtYXQ6ICdwZW0nXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCAoZXJyOiBhbnksIHB1YmxpY0tleTogc3RyaW5nLCBwcml2YXRlS2V5OiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLnBlbVRvSldLKHByaXZhdGVLZXkpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIGp3ayBcbiAgICAgKiBAcGFyYW0gZGF0YSBcbiAgICAgKi9cbiAgICBzaWduKGp3azogb2JqZWN0LCBkYXRhOiBVaW50OEFycmF5KTogUHJvbWlzZTxVaW50OEFycmF5PntcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHJlc29sdmUoY3J5cHRvXG4gICAgICAgICAgICAgICAgLmNyZWF0ZVNpZ24odGhpcy5oYXNoQWxnb3JpdGhtKVxuICAgICAgICAgICAgICAgIC51cGRhdGUoZGF0YSlcbiAgICAgICAgICAgICAgICAuc2lnbih7XG4gICAgICAgICAgICAgICAgICAgIGtleTogdGhpcy5qd2tUb1BlbShqd2spLFxuICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiBjcnlwdG8uY29uc3RhbnRzLlJTQV9QS0NTMV9QU1NfUEFERElORyxcbiAgICAgICAgICAgICAgICAgICAgc2FsdExlbmd0aDogMFxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaGFzaChkYXRhOiBCdWZmZXIpOiBQcm9taXNlPFVpbnQ4QXJyYXk+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHJlc29sdmUoY3J5cHRvXG4gICAgICAgICAgICAgICAgLmNyZWF0ZUhhc2godGhpcy5oYXNoQWxnb3JpdGhtKVxuICAgICAgICAgICAgICAgIC51cGRhdGUoZGF0YSlcbiAgICAgICAgICAgICAgICAuZGlnZXN0KClcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgandrVG9QZW0oandrOiBvYmplY3QpOiBzdHJpbmd7XG4gICAgICAgIHJldHVybiBKV0tUb3BlbShqd2spO1xuICAgIH1cblxuICAgIHByaXZhdGUgcGVtVG9KV0socGVtOiBzdHJpbmcpOiBKV0tJbnRlcmZhY2V7XG4gICAgICAgIHJldHVybiBwZW1Ub0pXSyhwZW0pO1xuICAgIH1cblxufSIsImltcG9ydCB7IEF4aW9zUmVzcG9uc2UgfSBmcm9tIFwiYXhpb3NcIjtcblxuZXhwb3J0IGNvbnN0IGVudW0gQXJ3ZWF2ZUVycm9yVHlwZSB7XG4gICAgVFhfUEVORElORyA9ICdUWF9QRU5ESU5HJyxcbiAgICBUWF9OT1RfRk9VTkQgPSAnVFhfTk9UX0ZPVU5EJyxcbiAgICBUWF9GQUlMRUQgPSAnVFhfRkFJTEVEJyxcbn07XG5cbmV4cG9ydCBjbGFzcyBBcndlYXZlRXJyb3IgZXh0ZW5kcyBFcnJvcntcblxuICAgIHB1YmxpYyByZWFkb25seSB0eXBlOiBBcndlYXZlRXJyb3JUeXBlO1xuICAgIHB1YmxpYyByZWFkb25seSByZXNwb25zZTogQXhpb3NSZXNwb25zZTtcblxuXHRjb25zdHJ1Y3Rvcih0eXBlOiBBcndlYXZlRXJyb3JUeXBlLCBvcHRpb25hbD86IHtcbiAgICAgICAgbWVzc2FnZT86IHN0cmluZyxcbiAgICAgICAgcmVzcG9uc2U/OiBBeGlvc1Jlc3BvbnNlLFxuICAgIH0pIHtcblxuXG4gICAgICAgIGlmIChvcHRpb25hbC5tZXNzYWdlKSB7XG4gICAgICAgICAgICBzdXBlcihvcHRpb25hbC5tZXNzYWdlKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBzdXBlcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgXG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgICAgIHRoaXMucmVzcG9uc2UgPSBvcHRpb25hbC5yZXNwb25zZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0VHlwZSgpOiBBcndlYXZlRXJyb3JUeXBle1xuICAgICAgICByZXR1cm4gdGhpcy50eXBlO1xuICAgIH1cblxufSIsImltcG9ydCB7IEFyd2VhdmVVdGlscyB9IGZyb20gJy4vdXRpbHMnO1xuXG5jbGFzcyBCYXNlT2JqZWN0IHtcblxuICAgIFtrZXk6c3RyaW5nXTogYW55O1xuXG4gICAgcHVibGljIGdldChmaWVsZDogc3RyaW5nKTogc3RyaW5nO1xuICAgIHB1YmxpYyBnZXQoZmllbGQ6IHN0cmluZywgb3B0aW9uczoge2RlY29kZTogdHJ1ZSwgc3RyaW5nOiBmYWxzZX0pOiBVaW50OEFycmF5O1xuICAgIHB1YmxpYyBnZXQoZmllbGQ6IHN0cmluZywgb3B0aW9uczoge2RlY29kZTogdHJ1ZSwgc3RyaW5nOiB0cnVlfSk6IHN0cmluZztcblxuICAgIHB1YmxpYyBnZXQoZmllbGQ6IHN0cmluZywgb3B0aW9ucz86IHtcbiAgICAgICAgc3RyaW5nPzogYm9vbGVhbixcbiAgICAgICAgZGVjb2RlPzogYm9vbGVhblxuICAgICB9KTogc3RyaW5nIHwgVWludDhBcnJheSB8IFRhZ1tdIHtcbiAgICAgXG4gICAgICAgIGlmICghT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGhpcykuaW5jbHVkZXMoZmllbGQpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEZpZWxkIFwiJHtmaWVsZH1cIiBpcyBub3QgYSBwcm9wZXJ0eSBvZiB0aGUgQXJ3ZWF2ZSBUcmFuc2FjdGlvbiBjbGFzcy5gKTtcbiAgICAgICAgfVxuICAgICBcbiAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5kZWNvZGUgPT0gdHJ1ZSkge1xuICAgICBcbiAgICAgICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuc3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEFyd2VhdmVVdGlscy5iNjRVcmxUb1N0cmluZyh0aGlzW2ZpZWxkXSk7XG4gICAgICAgICAgICB9XG4gICAgIFxuICAgICAgICAgICAgcmV0dXJuIEFyd2VhdmVVdGlscy5iNjRVcmxUb0J1ZmZlcih0aGlzW2ZpZWxkXSk7XG4gICAgICAgIH1cbiAgICAgXG4gICAgICAgIHJldHVybiB0aGlzW2ZpZWxkXTtcbiAgICAgfVxufVxuXG5leHBvcnQgY2xhc3MgVGFnIGV4dGVuZHMgQmFzZU9iamVjdCB7XG5cbiAgICByZWFkb25seSBuYW1lOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgdmFsdWU6IHN0cmluZztcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcsIGRlY29kZSA9IGZhbHNlKXtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIH1cblxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFRyYW5zYWN0aW9uSW50ZXJmYWNlIHtcblxuICAgIFtrZXk6c3RyaW5nXTogYW55XG5cbiAgICBpZDogc3RyaW5nLFxuICAgIGxhc3RfdHg6IHN0cmluZyxcbiAgICBvd25lcjogc3RyaW5nLFxuICAgIHRhZ3M6ICBUYWdbXSxcbiAgICB0YXJnZXQ6IHN0cmluZyxcbiAgICBxdWFudGl0eTogc3RyaW5nLFxuICAgIGRhdGE6IHN0cmluZyxcbiAgICByZXdhcmQ6IHN0cmluZyxcbiAgICBzaWduYXR1cmU6IHN0cmluZyxcbn1cblxuXG5leHBvcnQgY2xhc3MgVHJhbnNhY3Rpb24gIGV4dGVuZHMgQmFzZU9iamVjdCBpbXBsZW1lbnRzIFRyYW5zYWN0aW9uSW50ZXJmYWNlIHtcblxuICAgIFtrZXk6c3RyaW5nXTogYW55XG5cbiAgICBwdWJsaWMgaWQ6IHN0cmluZztcbiAgICBwdWJsaWMgcmVhZG9ubHkgbGFzdF90eDpzdHJpbmcgPSAnJztcbiAgICBwdWJsaWMgcmVhZG9ubHkgb3duZXI6c3RyaW5nICA9ICcnO1xuICAgIHB1YmxpYyByZWFkb25seSB0YWdzOiBUYWdbXSA9IFtdO1xuICAgIHB1YmxpYyByZWFkb25seSB0YXJnZXQ6IHN0cmluZyA9ICcnO1xuICAgIHB1YmxpYyByZWFkb25seSBxdWFudGl0eTogc3RyaW5nID0gJzAnO1xuICAgIHB1YmxpYyByZWFkb25seSBkYXRhOiBzdHJpbmcgPSAnJztcbiAgICBwdWJsaWMgcmVhZG9ubHkgcmV3YXJkOiBzdHJpbmcgPSAnMCc7XG4gICAgcHVibGljIHNpZ25hdHVyZTogc3RyaW5nID0gJyc7XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IoYXR0cmlidXRlcz86IFBhcnRpYWw8VHJhbnNhY3Rpb25JbnRlcmZhY2U+KSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgYXR0cmlidXRlcyk7XG4gICAgfVxuXG4gICAgcHVibGljIGFkZFRhZyhuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpe1xuICAgICAgICB0aGlzLnRhZ3MucHVzaChuZXcgVGFnKFxuICAgICAgICAgICAgQXJ3ZWF2ZVV0aWxzLnN0cmluZ1RvQjY0VXJsKG5hbWUpLFxuICAgICAgICAgICAgQXJ3ZWF2ZVV0aWxzLnN0cmluZ1RvQjY0VXJsKHZhbHVlKVxuICAgICAgICApKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9KU09OKCl7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpZDogdGhpcy5pZCxcbiAgICAgICAgICAgIGxhc3RfdHg6IHRoaXMubGFzdF90eCxcbiAgICAgICAgICAgIG93bmVyOiB0aGlzLm93bmVyLFxuICAgICAgICAgICAgdGFnczogdGhpcy50YWdzLFxuICAgICAgICAgICAgdGFyZ2V0OiB0aGlzLnRhcmdldCxcbiAgICAgICAgICAgIHF1YW50aXR5OiB0aGlzLnF1YW50aXR5LFxuICAgICAgICAgICAgZGF0YTogdGhpcy5kYXRhLFxuICAgICAgICAgICAgcmV3YXJkOiB0aGlzLnJld2FyZCxcbiAgICAgICAgICAgIHNpZ25hdHVyZTogdGhpcy5zaWduYXR1cmVcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0U2lnbmF0dXJlKHtzaWduYXR1cmUsIGlkfToge1xuICAgICAgICBzaWduYXR1cmU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICB9KSB7XG4gICAgICAgIHRoaXMuc2lnbmF0dXJlID0gc2lnbmF0dXJlO1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgfVxuXG4gICAgcHVibGljIGdldFNpZ25hdHVyZURhdGEoKTogVWludDhBcnJheSB7XG5cbiAgICAgICAgbGV0IHRhZ1N0cmluZyA9IHRoaXMudGFncy5yZWR1Y2UoKGFjY3VtdWxhdG9yOiBzdHJpbmcsIHRhZzogVGFnKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gYWNjdW11bGF0b3IgKyAnJyArIHRhZy5nZXQoJ25hbWUnLCB7ZGVjb2RlOiB0cnVlLCBzdHJpbmc6IHRydWV9KSArICcnICsgdGFnLmdldCgndmFsdWUnLCB7ZGVjb2RlOiB0cnVlLCBzdHJpbmc6IHRydWV9KVxuICAgICAgICB9LCAnJyk7XG5cbiAgICAgICAgcmV0dXJuIEFyd2VhdmVVdGlscy5jb25jYXRCdWZmZXJzKFtcbiAgICAgICAgICAgIHRoaXMuZ2V0KCdvd25lcicsIHtkZWNvZGU6IHRydWUsIHN0cmluZzogZmFsc2V9KSxcbiAgICAgICAgICAgIHRoaXMuZ2V0KCd0YXJnZXQnLCB7ZGVjb2RlOiB0cnVlLCBzdHJpbmc6IGZhbHNlfSksXG4gICAgICAgICAgICB0aGlzLmdldCgnZGF0YScsIHtkZWNvZGU6IHRydWUsIHN0cmluZzogZmFsc2V9KSxcbiAgICAgICAgICAgIEFyd2VhdmVVdGlscy5zdHJpbmdUb0J1ZmZlcih0aGlzLnF1YW50aXR5KSxcbiAgICAgICAgICAgIEFyd2VhdmVVdGlscy5zdHJpbmdUb0J1ZmZlcih0aGlzLnJld2FyZCksXG4gICAgICAgICAgICB0aGlzLmdldCgnbGFzdF90eCcsIHtkZWNvZGU6IHRydWUsIHN0cmluZzogZmFsc2V9KSxcbiAgICAgICAgICAgIEFyd2VhdmVVdGlscy5zdHJpbmdUb0J1ZmZlcih0YWdTdHJpbmcpXG4gICAgICAgIF0pO1xuICAgIH1cbn0iLCJjb25zdCBCNjRqcyA9IHJlcXVpcmUoJ2Jhc2U2NC1qcycpO1xuXG5cbmV4cG9ydCBjbGFzcyBBcndlYXZlVXRpbHMge1xuXG4gICAgcHVibGljIHN0YXRpYyBjb25jYXRCdWZmZXJzKGJ1ZmZlcnM6IFVpbnQ4QXJyYXlbXSk6IFVpbnQ4QXJyYXkge1xuXG4gICAgICAgIGxldCB0b3RhbF9sZW5ndGggPSAwO1xuXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBidWZmZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0b3RhbF9sZW5ndGggKz0gYnVmZmVyc1tpXS5ieXRlTGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHRlbXAgPSBuZXcgVWludDhBcnJheSh0b3RhbF9sZW5ndGgpO1xuICAgICAgICBsZXQgb2Zmc2V0ID0gMDtcblxuICAgICAgICB0ZW1wLnNldChuZXcgVWludDhBcnJheShidWZmZXJzWzBdKSwgb2Zmc2V0KTtcbiAgICAgICAgb2Zmc2V0ICs9IGJ1ZmZlcnNbMF0uYnl0ZUxlbmd0aDtcblxuICAgICAgICBmb3IobGV0IGkgPSAxOyBpIDwgYnVmZmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGVtcC5zZXQobmV3IFVpbnQ4QXJyYXkoYnVmZmVyc1tpXSksIG9mZnNldCk7XG4gICAgICAgICAgICBvZmZzZXQgKz0gYnVmZmVyc1tpXS5ieXRlTGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRlbXA7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBiNjRVcmxUb1N0cmluZyhiNjRVcmxTdHJpbmc6IHN0cmluZyk6IHN0cmluZyB7XG5cbiAgICAgICAgbGV0IGJ1ZmZlciA9IEFyd2VhdmVVdGlscy5iNjRVcmxUb0J1ZmZlcihiNjRVcmxTdHJpbmcpO1xuXG4gICAgICAgIC8vIFRleHRFbmNvZGVyIHdpbGwgYmUgYXZhaWxhYmxlIGluIGJyb3dzZXJzLCBidXQgbm90IGluIG5vZGVcbiAgICAgICAgaWYgKHR5cGVvZiBUZXh0RGVjb2RlciA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgY29uc3QgVGV4dERlY29kZXIgPSByZXF1aXJlKCd1dGlsJykuVGV4dERlY29kZXI7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFRleHREZWNvZGVyKCd1dGYtOCcsIHtmYXRhbDogdHJ1ZX0pLmRlY29kZShidWZmZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBUZXh0RGVjb2RlcigndXRmLTgnLCB7ZmF0YWw6IHRydWV9KS5kZWNvZGUoYnVmZmVyKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIHN0cmluZ1RvQnVmZmVyKHN0cmluZzogc3RyaW5nKTogVWludDhBcnJheSB7XG4gICAgICAgIC8vIFRleHRFbmNvZGVyIHdpbGwgYmUgYXZhaWxhYmxlIGluIGJyb3dzZXJzLCBidXQgbm90IGluIG5vZGVcbiAgICAgICAgaWYgKHR5cGVvZiBUZXh0RW5jb2RlciA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgY29uc3QgVGV4dEVuY29kZXIgPSByZXF1aXJlKCd1dGlsJykuVGV4dEVuY29kZXI7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFRleHRFbmNvZGVyKCkuZW5jb2RlKHN0cmluZyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBUZXh0RW5jb2RlcigpLmVuY29kZShzdHJpbmcpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgc3RyaW5nVG9CNjRVcmwoc3RyaW5nOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gQXJ3ZWF2ZVV0aWxzLmJ1ZmZlclRvYjY0VXJsKEFyd2VhdmVVdGlscy5zdHJpbmdUb0J1ZmZlcihzdHJpbmcpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGI2NFVybFRvQnVmZmVyKGI2NFVybFN0cmluZzogc3RyaW5nKTogVWludDhBcnJheSB7XG4gICAgICAgIHJldHVybiBuZXcgVWludDhBcnJheShCNjRqcy50b0J5dGVBcnJheShBcndlYXZlVXRpbHMuYjY0VXJsRGVjb2RlKGI2NFVybFN0cmluZykpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGJ1ZmZlclRvYjY0KGJ1ZmZlcjogYW55KTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIEI2NGpzLmZyb21CeXRlQXJyYXkobmV3IFVpbnQ4QXJyYXkoYnVmZmVyKSk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBidWZmZXJUb2I2NFVybChidWZmZXI6IGFueSk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBBcndlYXZlVXRpbHMuYjY0VXJsRW5jb2RlKEFyd2VhdmVVdGlscy5idWZmZXJUb2I2NChidWZmZXIpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGI2NFVybEVuY29kZShiNjRVcmxTdHJpbmc6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBiNjRVcmxTdHJpbmcucmVwbGFjZSgvXFwrL2csIFwiLVwiKS5yZXBsYWNlKC9cXC8vZywgXCJfXCIpLnJlcGxhY2UoL1xcPS9nLCBcIlwiKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGI2NFVybERlY29kZShiNjRVcmxTdHJpbmc6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGI2NFVybFN0cmluZyA9IGI2NFVybFN0cmluZy5yZXBsYWNlKC9cXC0vZywgXCIrXCIpLnJlcGxhY2UoL1xcXy9nLCBcIi9cIik7XG4gICAgICAgIGxldCBwYWRkaW5nO1xuICAgICAgICBiNjRVcmxTdHJpbmcubGVuZ3RoICUgNCA9PSAwID8gcGFkZGluZyA9IDAgOiBwYWRkaW5nID0gNCAtIChiNjRVcmxTdHJpbmcubGVuZ3RoICUgNCk7XG4gICAgICAgIHJldHVybiBiNjRVcmxTdHJpbmcuY29uY2F0KFwiPVwiLnJlcGVhdChwYWRkaW5nKSk7XG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQXBpIH0gZnJvbSBcIi4vbGliL2FwaVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIE5ldHdvcmtJbmZvSW50ZXJmYWNlIHtcbiAgICBob3NuZXR3b3JrdDogc3RyaW5nLFxuICAgIHZlcnNpb246IG51bWJlcixcbiAgICByZWxlYXNlOiBudW1iZXIsXG4gICAgaGVpZ2h0OiBudW1iZXIsXG4gICAgY3VycmVudDogc3RyaW5nLFxuICAgIGJsb2NrczogbnVtYmVyLFxuICAgIHBlZXJzOiBudW1iZXIsXG4gICAgcXVldWVfbGVuZ3RoOiBudW1iZXIsXG4gICAgbm9kZV9zdGF0ZV9sYXRlbmN5OiBudW1iZXJcbn1cblxuZXhwb3J0IGludGVyZmFjZSBQZWVyTGlzdCBleHRlbmRzIEFycmF5PHN0cmluZz4ge31cblxuZXhwb3J0IGNsYXNzIE5ldHdvcmsge1xuICAgIFxuICAgIHByaXZhdGUgYXBpOiBBcGk7XG5cbiAgICBjb25zdHJ1Y3RvcihhcGk6IEFwaSl7XG4gICAgICAgIHRoaXMuYXBpID0gYXBpO1xuICAgIH1cblxuICAgIHB1YmxpYyBpbmZvKCk6IFByb21pc2U8TmV0d29ya0luZm9JbnRlcmZhY2U+e1xuICAgICAgICByZXR1cm4gdGhpcy5hcGkuZ2V0KGBpbmZvYCkudGhlbiggcmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBwZWVycygpOiBQcm9taXNlPFBlZXJMaXN0PntcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBpLmdldChgcGVlcnNgKS50aGVuKCByZXNwb25zZSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG59XG5cbiIsImltcG9ydCB7IEFwaSB9IGZyb20gXCIuL2xpYi9hcGlcIjtcbmltcG9ydCB7IENyeXB0b0ludGVyZmFjZSB9IGZyb20gJy4vbGliL2NyeXB0by9jcnlwdG8taW50ZXJmYWNlJztcbmltcG9ydCB7IEFyd2VhdmVFcnJvciwgQXJ3ZWF2ZUVycm9yVHlwZSB9IGZyb20gJy4vbGliL2Vycm9yJztcbmltcG9ydCB7IFRyYW5zYWN0aW9uLCBUYWcsIFRyYW5zYWN0aW9uSW50ZXJmYWNlIH0gZnJvbSBcIi4vbGliL3RyYW5zYWN0aW9uXCI7XG5pbXBvcnQgeyBBcndlYXZlVXRpbHMgfSBmcm9tICcuL2xpYi91dGlscyc7XG5pbXBvcnQgeyBKV0tJbnRlcmZhY2UgfSBmcm9tICcuL2xpYi9XYWxsZXQnO1xuaW1wb3J0IHsgV2FsbGV0cyB9IGZyb20gXCIuL3dhbGxldHNcIjtcblxuZXhwb3J0IGNsYXNzIFRyYW5zYWN0aW9ucyB7XG4gICAgXG4gICAgcHJpdmF0ZSBhcGk6IEFwaTtcbiAgICBwcml2YXRlIGNyeXB0bzogQ3J5cHRvSW50ZXJmYWNlO1xuXG4gICAgY29uc3RydWN0b3IoYXBpOiBBcGksIGNyeXB0bzogQ3J5cHRvSW50ZXJmYWNlKXtcbiAgICAgICAgdGhpcy5hcGkgPSBhcGk7XG4gICAgICAgIHRoaXMuY3J5cHRvID0gY3J5cHRvO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRQcmljZShieXRlU2l6ZTogbnVtYmVyLCB0YXJnZXRBZGRyZXNzPzogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcblxuICAgICAgICBsZXQgZW5kcG9pbnQgPSB0YXJnZXRBZGRyZXNzID8gYHByaWNlLyR7Ynl0ZVNpemV9LyR7dGFyZ2V0QWRkcmVzc31gIDogYHByaWNlLyR7Ynl0ZVNpemV9YDtcblxuICAgICAgICByZXR1cm4gdGhpcy5hcGkuZ2V0KGVuZHBvaW50LCB7XG4gICAgICAgICAgICB0cmFuc2Zvcm1SZXNwb25zZTogW1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIFdlIG5lZWQgdG8gc3BlY2lmeSBhIHJlc3BvbnNlIHRyYW5zZm9ybWVyIHRvIG92ZXJyaWRlXG4gICAgICAgICAgICAgICAgICogdGhlIGRlZmF1bHQgSlNPTi5wYXJzZSBiZWhhdmlvdXIsIGFzIHRoaXMgY2F1c2VzXG4gICAgICAgICAgICAgICAgICogd2luc3RvbiB0byBiZSBjb252ZXJ0ZWQgdG8gYSBudW1iZXIgYW5kIHdlIHdhbnQgdG9cbiAgICAgICAgICAgICAgICAgKiByZXR1cm4gaXQgYXMgYSB3aW5zdG9uIHN0cmluZy5cbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gZGF0YSBcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBmdW5jdGlvbihkYXRhKTogc3RyaW5nIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9KS50aGVuKCByZXNwb25zZSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldChpZDogc3RyaW5nKTogUHJvbWlzZTxUcmFuc2FjdGlvbj4ge1xuICAgICAgICByZXR1cm4gdGhpcy5hcGkuZ2V0KGB0eC8ke2lkfWApLnRoZW4oIHJlc3BvbnNlID0+IHtcblxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PSAyMDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFRyYW5zYWN0aW9uKHJlc3BvbnNlLmRhdGEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09IDIwMikge1xuICAgICAgICAgICAgICAgIG5ldyBBcndlYXZlRXJyb3IoQXJ3ZWF2ZUVycm9yVHlwZS5UWF9QRU5ESU5HKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PSA0MDQpIHtcbiAgICAgICAgICAgICAgICBuZXcgQXJ3ZWF2ZUVycm9yKEFyd2VhdmVFcnJvclR5cGUuVFhfTk9UX0ZPVU5EKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PSA0MTApIHtcbiAgICAgICAgICAgICAgICBuZXcgQXJ3ZWF2ZUVycm9yKEFyd2VhdmVFcnJvclR5cGUuVFhfRkFJTEVEKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0U3RhdHVzKGlkOiBzdHJpbmcpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICByZXR1cm4gdGhpcy5hcGkuZ2V0KGB0eC8ke2lkfS9pZGApLnRoZW4oIHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5zdGF0dXM7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBzaWduKHRyYW5zYWN0aW9uOiBUcmFuc2FjdGlvbiwgandrOiBKV0tJbnRlcmZhY2UpOiBQcm9taXNlPFRyYW5zYWN0aW9uPiB7XG5cbiAgICAgICAgbGV0IGRhdGFUb1NpZ24gPSB0cmFuc2FjdGlvbi5nZXRTaWduYXR1cmVEYXRhKCk7XG5cbiAgICAgICAgbGV0IHJhd1NpZ25hdHVyZSA9IGF3YWl0IHRoaXMuY3J5cHRvLnNpZ24oandrLCBkYXRhVG9TaWduKTtcblxuICAgICAgICBsZXQgaWQgPSBhd2FpdCB0aGlzLmNyeXB0by5oYXNoKHJhd1NpZ25hdHVyZSk7XG5cbiAgICAgICAgdHJhbnNhY3Rpb24uc2V0U2lnbmF0dXJlKHtcbiAgICAgICAgICAgIHNpZ25hdHVyZTogQXJ3ZWF2ZVV0aWxzLmJ1ZmZlclRvYjY0VXJsKHJhd1NpZ25hdHVyZSksXG4gICAgICAgICAgICBpZDogQXJ3ZWF2ZVV0aWxzLmJ1ZmZlclRvYjY0VXJsKGlkKVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdHJhbnNhY3Rpb247XG4gICAgfVxuXG5cbn1cbiIsImltcG9ydCB7IEFwaSB9IGZyb20gXCIuL2xpYi9hcGlcIjtcbmltcG9ydCB7IENyeXB0b0ludGVyZmFjZSB9IGZyb20gXCIuL2xpYi9jcnlwdG8vY3J5cHRvLWludGVyZmFjZVwiO1xuaW1wb3J0IHsgSldLSW50ZXJmYWNlIH0gZnJvbSBcIi4vbGliL1dhbGxldFwiO1xuaW1wb3J0IHsgQXJ3ZWF2ZVV0aWxzIH0gZnJvbSBcIi4vbGliL3V0aWxzXCI7XG5cbmV4cG9ydCBjbGFzcyBXYWxsZXRzIHtcblxuICAgIHByaXZhdGUgYXBpOiBBcGk7XG5cbiAgICBwcml2YXRlIGNyeXB0bzogQ3J5cHRvSW50ZXJmYWNlO1xuXG4gICAgY29uc3RydWN0b3IoYXBpOiBBcGksIGNyeXB0bzogQ3J5cHRvSW50ZXJmYWNlKXtcbiAgICAgICAgdGhpcy5hcGkgPSBhcGk7XG4gICAgICAgIHRoaXMuY3J5cHRvID0gY3J5cHRvO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgd2FsbGV0IGJhbGFuY2UgZm9yIHRoZSBnaXZlbiBhZGRyZXNzLlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBhZGRyZXNzIC0gVGhlIGFyd2VhdmUgYWRkcmVzcyB0byBnZXQgdGhlIGJhbGFuY2UgZm9yLlxuICAgICAqIFxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPHN0cmluZz59IC0gUHJvbWlzZSB3aGljaCByZXNvbHZlcyB3aXRoIGEgd2luc3RvbiBzdHJpbmcgYmFsYW5jZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0QmFsYW5jZShhZGRyZXNzOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgICAgICByZXR1cm4gdGhpcy5hcGkuZ2V0KGB3YWxsZXQvJHthZGRyZXNzfS9iYWxhbmNlYCwge1xuICAgICAgICAgICAgdHJhbnNmb3JtUmVzcG9uc2U6IFtcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBXZSBuZWVkIHRvIHNwZWNpZnkgYSByZXNwb25zZSB0cmFuc2Zvcm1lciB0byBvdmVycmlkZVxuICAgICAgICAgICAgICAgICAqIHRoZSBkZWZhdWx0IEpTT04ucGFyc2UgYmVoYXZpb3VyLCBhcyB0aGlzIGNhdXNlc1xuICAgICAgICAgICAgICAgICAqIGJhbGFuY2VzIHRvIGJlIGNvbnZlcnRlZCB0byBhIG51bWJlciBhbmQgd2Ugd2FudCB0b1xuICAgICAgICAgICAgICAgICAqIHJldHVybiBpdCBhcyBhIHdpbnN0b24gc3RyaW5nLlxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSBkYXRhIFxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGRhdGEpOiBzdHJpbmcge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0pLnRoZW4oIHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGxhc3QgdHJhbnNhY3Rpb24gSUQgZm9yIHRoZSBnaXZlbiB3YWxsZXQgYWRkcmVzcy5cbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gYWRkcmVzcyAtIFRoZSBhcndlYXZlIGFkZHJlc3MgdG8gZ2V0IHRoZSBiYWxhbmNlIGZvci5cbiAgICAgKiBcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxzdHJpbmc+fSAtIFByb21pc2Ugd2hpY2ggcmVzb2x2ZXMgd2l0aCBhIHdpbnN0b24gc3RyaW5nIGJhbGFuY2UuXG4gICAgICovXG4gICAgcHVibGljIGdldExhc3RUcmFuc2FjdGlvbklEKGFkZHJlc3M6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgICAgIHJldHVybiB0aGlzLmFwaS5nZXQoYHdhbGxldC8ke2FkZHJlc3N9L2xhc3RfdHhgKS50aGVuKCByZXNwb25zZSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGdlbmVyYXRlKCl7XG4gICAgICAgIHJldHVybiB0aGlzLmNyeXB0by5nZW5lcmF0ZUpXSygpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBqd2tUb0FkZHJlc3MoandrOiBKV0tJbnRlcmZhY2UpOiBQcm9taXNlPHN0cmluZz57XG4gICAgICAgIHJldHVybiBBcndlYXZlVXRpbHMuYnVmZmVyVG9iNjRVcmwoYXdhaXQgdGhpcy5jcnlwdG8uaGFzaChBcndlYXZlVXRpbHMuYjY0VXJsVG9CdWZmZXIoandrLm4pKSk7XG4gICAgfVxuXG59XG5cbiIsImltcG9ydCB7IEFyd2VhdmUgfSBmcm9tIFwiLi9hcndlYXZlL2Fyd2VhdmVcIjtcbmltcG9ydCB7IE5vZGVDcnlwdG9Ecml2ZXIgfSBmcm9tIFwiLi9hcndlYXZlL2xpYi9jcnlwdG8vbm9kZS1kcml2ZXJcIjtcblxuXG5leHBvcnQgZnVuY3Rpb24gaW5pdChhcGlDb25maWc6IG9iamVjdCk6IEFyd2VhdmV7XG4gICAgcmV0dXJuIG5ldyBBcndlYXZlKHtcbiAgICAgICAgYXBpOiBhcGlDb25maWcsXG4gICAgICAgIGNyeXB0bzogbmV3IE5vZGVDcnlwdG9Ecml2ZXJcbiAgICB9KTtcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImFzc2VydFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJidWZmZXJcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY3J5cHRvXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImh0dHBcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaHR0cHNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwib3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwic3RyZWFtXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInR0eVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ1cmxcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidXRpbFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ2bVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ6bGliXCIpOyJdLCJzb3VyY2VSb290IjoiIn0=