/**
 * ajax module
 * A simple wrapper for making Ajax requests using fetch api.
 * @namespace ajax
 */
const ajax = (function () {
  "use strict";

  /**
   * Options object for fetch
   */
  const options = {
    credentials: "same-origin",
    headers: {},
  };

  // writable, configurable and enumerable defaults to false
  // X-Requested-With cannot be removed or changed
  // Accept header can be changed but not deleted
  Object.defineProperties(options.headers, {
    "X-Requested-With": { value: "XMLHttpRequest", enumerable: true },
    Accept: { value: "application/json", writable: true, enumerable: true },
  });

  /**
   * GET request
   * @public
   * @param {String} url
   * @param {Object|FormData} [data=null] query string to add to url
   * @param {Object} [headers=null] http headers to be added to request
   * @return {Promise.Array} Promise resolved to an array [statusCode, response]
   * @memberof ajax
   */
  async function get(url, data = null, headers = null) {
    const config = Object.assign({}, options);

    if (headers) updateHeaders(config, headers);

    if (data) url = url.concat("&", new URLSearchParams(data));

    config.method = "GET";

    return await makeRequest(url, config);
  }

  /**
   * POST request
   * @public
   * @param {String} url
   * @param {FormData|Object} [data=null] data to send in body
   * @param {Object} [headers=null] http headers to be added to request
   * @return {Promise.Array} Promise resolved to an array [statusCode, response]
   * @memberof ajax
   */
  async function post(url, data = null, headers = null) {
    const config = Object.assign({}, options);
    config.method = "POST";

    if (headers) updateHeaders(config, headers);

    if (data) processparams(data, config);

    return await makeRequest(url, config);
  }

  /**
   * PUT request
   * @public
   * @param {String} url
   * @param {FormData|Object} [data=null] data to send in body
   * @param {Object} [headers=null] http headers to be added to request
   * @return {Promise.Array} Promise resolved to an array [statusCode, response]
   * @memberof ajax
   */
  async function put(url, data = null, headers = null) {
    const config = Object.assign({}, options);
    config.method = "PUT";

    if (headers) updateHeaders(config, headers);

    if (data) processparams(data, config);

    return await makeRequest(url, config);
  }

  /**
   * DELETE request
   * @public
   * @alias delete
   * @param {String} url
   * @param {FormData|Object} [data=null] data to send in body
   * @param {Object} [headers=null] http headers to be added to request
   * @return {Promise.Array} Promise resolved to an array [statusCode, response]
   * @memberof ajax
   */
  async function _delete(url, data = null, headers = null) {
    const config = Object.assign({}, options);
    config.method = "DELETE";

    if (headers) updateHeaders(config, headers);

    if (data) processparams(data, config);

    return await makeRequest(url, config);
  }

  /**
   * Upload a single file or multiple files.
   * If FormData is passed as file argument,
   * append file to the FormData before passing
   * @public
   * @param {String} url
   * @param {String} method
   * @param {FormData|File|FileList} file
   * @return {Promise.Array} Promise resolved to an array [statusCode, response]
   * @memberof ajax
   */
  async function uploadFile(url, method, file, headers = null) {
    const allowedMethods = ["POST", "PUT"];

    if (!allowedMethods.includes(method.toUpperCase())) {
      return Promise.reject(
        new Error(
          `Method must be one of ${allowedMethods.join(", ")}. Got ${method}`
        )
      );
    }

    const config = Object.assign({}, options);
    config.method = method;

    if (headers) updateHeaders(config, headers);

    return await makeRequest(url, processFiles(file, config));
  }

  /**
   * Add http headers to be sent with requests.
   * All subsequent requests will include these headers.
   * Existing headers will be overwritten with new value.
   * X-Requested-With header cannot be changed.
   * @public
   * @param {String} key header name
   * @param {String} value header value
   * @memberof ajax
   */
  function setHeader(key, value) {
    options.headers[key] = value;
  }

  /**
   * Remove headers to be sent with requests.
   * All subsequent requests will include these headers.
   * Accept header cannot be deleted.
   * @public
   * @param {String} key - header name
   * @memberof ajax
   */
  function removeHeader(key) {
    delete options.headers[key];
  }

  /**
   * Update headers on the config object
   * @private
   * @param {Object} config default request options
   * @param {Object} headers headers to update in config
   */
  function updateHeaders(config, headers) {
    for (const [key, value] of Object.entries(headers)) {
      config.headers[key] = value;
    }
  }

  /**
   * Add the files to a FormData object and attaches to config
   * @private
   * @param {FormData|File|FileList} params Request params
   * @param {Object} config request options
   * @return {Object} request options
   */
  function processFiles(params, config) {
    if (params instanceof FormData) {
      config.body = params;
      return config;
    }

    const fd = new FormData();

    if (params instanceof File) {
      fd.append(0, params);
    } else if (params instanceof FileList) {
      Array.from(params).forEach((file, idx) => fd.append(idx, file));
    } else {
      const name = params.constructor.name;
      throw new Error(`File or FileList object expected. Got ${name}`);
    }

    config.body = fd;
    return config;
  }

  /**
   * Adds necessary headers and encodes params
   * @private
   * @param {(FormData|Object)} params Request params
   * @param {Object} config request options
   */
  function processparams(params, config) {
    config.headers["Content-Type"] = "application/x-www-form-urlencoded";

    config.body = new URLSearchParams(params);
  }

  /**
   * Make the request
   * @private
   * @param {String} url
   * @param {Object} options options passed to fetch
   * @return {Promise.Array} Promise resolved to an array [statusCode, response]
   */
  async function makeRequest(url, options) {
    return await fetch(url, options)
      .then(async (res) => {
        const message = res.headers.get("content-type").includes("json")
          ? await res.json()
          : await res.text();

        return [res.status, message];
      })
      .catch((e) => [-1, `${e.name}:${e.message}`]);
  }

  return Object.freeze({
    get,
    post,
    put,
    delete: _delete,
    uploadFile,
    setHeader,
    removeHeader,
  });
})();

export default ajax;
