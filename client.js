"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Client = exports.SendgridError = exports.DELETE = exports.POST = exports.GET = void 0;

var _assert = _interopRequireDefault(require("assert"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _debug = _interopRequireDefault(require("debug"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = (0, _debug.default)('sgwapi');
const keyProp = Symbol();
const SGAPI = 'https://api.sendgrid.com/v3';
const GET = 'GET';
exports.GET = GET;
const POST = 'POST';
exports.POST = POST;
const DELETE = 'DELETE';
exports.DELETE = DELETE;

class SendgridError extends Error {
  constructor(code, errors) {
    super(String(code));
    this.errors = errors;
  }

}
/**
 * @public
 * Sendgrid API
 */


exports.SendgridError = SendgridError;

class Client {
  /**
   * @public
   * @constructor
   * @param {String} key API key
   */
  constructor(key) {
    _assert.default.ok(key, 'API key is required');

    this[keyProp] = key;
  }

  async call(method, path, options = {}) {
    debug('request %s %s; options: %j', method, path, options);

    _assert.default.ok(method, 'method is required');

    _assert.default.ok(path, 'path is required');

    const req = {
      method,
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${this[keyProp]}`
      }
    };
    let params = '';

    if (options.params) {
      params = `?${options.params.toString()}`;
    }

    if (options.body) {
      req.body = JSON.stringify(options.body);
      req.headers['Content-Type'] = 'application/json';
    }

    const res = await (0, _nodeFetch.default)(`${SGAPI}/${path}${params}`, req);

    if (res.status === 202) {
      return null;
    }

    const data = await res.json();

    if (data.errors) {
      throw new SendgridError(res.status, data.errors);
    }

    return data;
  }

}

exports.Client = Client;