import assert from 'assert';
import fetch from 'node-fetch';
import dbg from 'debug';

const debug = dbg('sgwapi');

const keyProp = Symbol();
const SGAPI = 'https://api.sendgrid.com/v3';
export const GET = 'GET';
export const POST = 'POST';
export const DELETE = 'DELETE';

export class SendgridError extends Error {
    
    constructor(code, errors) {
        super(String(code));
        this.errors = errors;
    }
}

/**
 * @public
 * Sendgrid API
 */
export class Client {

    /**
     * @public
     * @constructor
     * @param {String} key API key
     */
    constructor(key) {
        assert.ok(key, 'API key is required');

        this[keyProp] = key;
    }
    
    async call(method, path, options = {}) {
        debug('request %s %s; options: %j', method, path, options);

        assert.ok(method, 'method is required');
        assert.ok(path, 'path is required');
        
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
        
        const res = await fetch(`${SGAPI}/${path}${params}`, req);
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
