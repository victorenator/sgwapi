import assert from 'assert';
import {DELETE, GET, Client} from './client';

/**
 * This endpoint allows you to retrieve and delete entries in the Blocks list.
 */
class Blocks {

    /**
     * @constructor
     * @param {Client} client client
     */
    constructor(client) {
        this.client = client;
    }

    /**
     * List all blocks.
     * @param {Date} [options.start] The start of the date range.
     * @param {Date} [options.end] The end of the date range.
     * @param {Number} [options.limit] Optional field to limit the number of results returned.
     * @param {Number} [options.offset] Optional beginning point in the list to retrieve from.
     * @returns {Promise} result
     */
    list({start, end, limit, offset} = {}) {
        const params = new URLSearchParams();
        if (start) {
            params.append('start_time', start.getTime());
        }
        if (end) {
            params.append('end_time', end.getTime());
        }
        if (limit) {
            params.append('limit', limit);
        }
        if (offset) {
            params.append('offset', offset);
        }
        return this.client.call(GET, 'suppression/blocks', {params});
    }

    /**
     * Delete blocks.
     * @param {Array} [emails] Optional emails to remove.
     * @returns {Promise} result
     */
    delete(emails) {
        const body = {};
        if (emails) {
            body.emails = emails;
            
        } else {
            body.delete_all = true;
        }
        return this.client.call(DELETE, 'suppression/blocks', {body});
    }

    /**
     * Get a specific block
     * @param {String} email Email address of blocked email entry.
     * @returns {Promise} result
     */
    get(email) {
        assert.ok(email, 'email is required');
        return this.client.call(GET, `suppression/blocks/${email}`);
    }

    /**
     * Delete a specific block
     * @param {String} email Email address of blocked email entry.
     * @returns {Promise} result
     */
    deleteOne(email) {
        assert.ok(email, 'email is required');
        return this.client.call(DELETE, `suppression/blocks/${email}`);
    }
}

/**
 * This endpoint allows you to retrieve and delete entries in the Bounces list.
 */
class Bounces {

    /**
     * @constructor
     * @param {Sendgrid} sg parent
     */
    constructor(sg) {
        this.sg = sg;
    }

    /**
     * Retrieve a list of bounces with addresses and response codes, optionally with dates.
     * @param {Date} [options.start] The start of the date range for which to retrieve bounces.
     * @param {Date} [options.end] The end of the date range for which to retrieve bounces.
     * @param {Number} [options.limit] Optional field to limit the number of results returned.
     * @param {Number} [options.offset] Optional beginning point in the list to retrieve from.
     * @returns {Promise} result
     */
    list({start, end, limit, offset} = {}) {
        const params = new URLSearchParams();
        if (start) {
            params.append('start_time', start.getTime());
        }
        if (end) {
            params.append('end_time', end.getTime());
        }
        if (limit) {
            params.append('limit', limit);
        }
        if (offset) {
            params.append('offset', offset);
        }
        return this.sg.call(GET, 'suppression/bounces', {params});
    }

    /**
     * Delete an address from the Bounce list. Please note that if no parameters are specified the ENTIRE list will be deleted.
     * @param {Array} [emails] Optional emails to remove.
     * @returns {Promise} result
     */
    delete(emails) {
        const body = {};
        if (emails) {
            body.emails = emails;
            
        } else {
            body.delete_all = true;
        }
        return this.sg.call(DELETE, 'suppression/bounces', {body});
    }

    /**
     * Get a bounce
     * @param {String} email Email address of bounce entry to retrieve.
     * @returns {Promise<Object>} result
     */
    get(email) {
        assert.ok(email, 'email is required');
        return this.sg.call(GET, `suppression/bounces/${email}`);
    }

    /**
     * Delete a bounce
     * @param {String} email Email address of bounce entry to delete.
     * @returns {Promise} result
     */
    deleteOne(email) {
        assert.ok(email, 'email is required');
        return this.sg.call(DELETE, `suppression/bounces/${email}`);
    }
}

/**
 * This endpoint allows you to retrieve and delete entries in the Invalid Emails list.
 */
class InvalidEmails {

    /**
     * @constructor
     * @param {Sendgrid} client client
     */
    constructor(client) {
        this.client = client;
    }

    /**
     * Retrieve a list of invalid emails with addresses and response codes, optionally with dates.
     * @param {Date} [options.start] The start of the date range for which to retrieve invalid emails.
     * @param {Date} [options.end] The end of the date range for which to retrieve invalid emails.
     * @param {Number} [options.limit] Optional field to limit the number of results returned.
     * @param {Number} [options.offset] Optional beginning point in the list to retrieve from.
     * @returns {Promise} result
     */
    list({start, end, limit, offset} = {}) {
        const params = new URLSearchParams();
        if (start) {
            params.append('start_time', start.getTime());
        }
        if (end) {
            params.append('end_time', end.getTime());
        }
        if (limit) {
            params.append('limit', limit);
        }
        if (offset) {
            params.append('offset', offset);
        }
        return this.client.call(GET, 'suppression/invalid_emails', {params});
    }

    /**
     * Delete an address from the Invalid Email list.
     * @param {Array} [emails] Optional emails to remove.
     * @returns {Promise} result
     */
    delete({emails} = {}) {
        const body = {};
        if (emails) {
            body.emails = emails;
            
        } else {
            body.delete_all = true;
        }
        return this.client.call(DELETE, 'suppression/invalid_emails', {body});
    }

    /**
     * Get a specific invalid email
     * @param {String} email Email address of invalid email entry.
     * @returns {Promise} result
     */
    get(email) {
        assert.ok(email, 'email is required');
        return this.client.call(GET, `suppression/invalid_emails/${email}`);
    }

    /**
     * Delete a specific invalid email
     * @param {String} email Email address of invalid email entry.
     * @returns {Promise} result
     */
    deleteOne(email) {
        assert.ok(email, 'email is required');
        return this.client.call(DELETE, `suppression/invalid_emails/${email}`);
    }
}

export class Suppressions {

    constructor(key) {
        this.client = new Client(key);
    }
    
    /**
     * Gets Blocks API
     * @returns {Blocks} api
     */
    get blocks() {
        return this._blocks? this._blocks: this._blocks = new Blocks(this.client);
    }
    
    /**
     * Gets Bounces API
     * @returns {Bounces} api
     */
    get bounces() {
        return this._bounces? this._bounces: this._bounces = new Bounces(this.client);
    }
    
    /**
     * Gets Invalid Emails API
     * @returns {InvalidEmails} api
     */
    get invalidEmails() {
        return this._invalidEmails? this._invalidEmails: this._invalidEmails = new InvalidEmails(this.client);
    }
}
