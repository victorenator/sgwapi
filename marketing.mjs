import assert from 'assert';
import {Client} from './client';

/**
 * Newsletter Category API
 */
class NewsletterCategory {

    /**
     * Newsletter Category API
     * @constructor
     * @param {Sendgrid} sg parent
     */
    constructor(sg) {
        this.sg = sg;
    }

    /**
     * Assign a Category to an existing Newsletter
     * @param {String} category The Category that will be added to the newsletter
     * @param {String} name The Newsletter to which the categories will be added
     * @returns {Promise} result
     */
    add(category, name) {
        assert.ok(category, 'category is required');
        assert.ok(name, 'name is required');

        return this.client.call('add', 'newsletter/category', {form: {category, name}});
    }

    /**
     * Create a new Category
     * @param {String} category The name that will be used for the Category being created
     * @returns {Promise} result
     */
    create(category) {
        assert.ok(category, 'category is required');

        return this.client.call('create', 'newsletter/category', {form: {category}});
    }

    /**
     * List all categories
     * @param {String} [category] Search to see if a specific Category exists rather than a list of all Categories
     * @returns {Promise} result
     */
    list({category} = {}) {
        return this.client.call('list', 'newsletter/category', {form: {category}});
    }

    /**
     * Remove specific categories, or all categories from a Newsletter
     * @param {String} name The Newsletter that will have Category(ies) deleted from it
     * @param {String} [category] Remove the Category with this name. If the category is not specified. all categories will be deleted from the Newsletter
     * @returns {Promise} result
     */
    remove(name, {category} = {}) {
        assert.ok(name, 'name is required');

        const form = {name};
        if (category) {
            form.category = category;
        }
        return this.client.call('remove', 'newsletter/category', {form});
    }
}

/**
 * @private
 * Newsletter Lists Email API
 */
class NewsletterListsEmail {

    /**
     * @private
     * Newsletter Lists Email API
     * @constructor
     * @param {Sendgrid} sg parent
     */
    constructor(sg) {
        this.sg = sg;
    }

    /**
     * Add one or more emails to a list
     * @param {String} list The list to which email addresses will be added
     * @param {Array} data Entries. Limited to 1000 entries per request. {"email":"address@domain.com","name":"contactName"}
     * @returns {Promise} result
     */
    add(list, data) {
        assert.ok(list, 'list is required');
        assert.ok(data, 'data is required');

        return this.client.call('add', 'newsletter/lists/email', {form: {
            list,
            data: data.map(JSON.stringify)
        }});
    }

    /**
     * Remove one or more emails from a list
     * @param {String} list The name of the list from which emails will be removed
     * @param {String} email The email addresses or addresses to be removed
     * @returns {Promise} result
     */
    delete(list, email) {
        assert.ok(list, 'list is required');

        return this.client.call('delete', 'newsletter/lists/email', {form: {list, email}});
    }

    /**
     * Retrieve the email addresses and associated fields for a particular list
     * @param {String} list The list to retrieve
     * @param {String} [email] Optional email address or list of addresses to search for
     * @returns {Promise} result
     */
    get(list, {email}) {
        assert.ok(list, 'list is required');

        const form = {list};
        if (email) {
            form.email = email;
        }

        return this.client.call('get', 'newsletter/lists/email', {form});
    }
}

/**
 * @private
 * Newsletter Lists API
 */
class NewsletterLists {

    /**
     * @constructor
     * @param {Sendgrid} sg parent
     */
    constructor(sg) {
        this.sg = sg;
    }

    /**
     * Gets Newsletter Lists Email API
     * @returns {NewsletterListsEmail} email api
     */
    get email() {
        return this._email? this._email: this._email = new NewsletterListsEmail(this.sg);
    }
    
    /**
     * Create a Recipient List
     * @param {String} list The name of the list to create
     * @param {String} [name] Specify the column name for the 'name' associated with email addresses
     * @param {Object} [columns] Specify additional column names
     * @returns {Promise} result
     */
    add(list, {name, columns} = {}) {
        assert.ok(list, 'list is required');

        return this.client.call('add', 'newsletter/lists', {form: {list, name, ...columns}});
    }

    /**
     * Delete a list
     * @param {String} list The name of the list to remove.
     * @returns {Promise} result
     */
    delete(list) {
        assert.ok(list, 'list is required');

        return this.client.call('delete', 'newsletter/lists', {form: {list}});
    }

    /**
     * Rename a List
     * @param {String} list Current name of the list to rename
     * @param {String} newlist The new name for the list
     * @returns {Promise} result
     */
    edit(list, newlist) {
        assert.ok(list, 'list is required');
        assert.ok(newlist, 'newlist is required');

        return this.client.call('edit', 'newsletter/lists', {form: {list, newlist}});
    }

    /**
     * Retrieve all recipients lists or check if a particular list exists
     * @param {String} [list] Optional list to retrieve. If not specified, all lists will be returned.
     * @returns {Promise} result
     */
    get(list) {
        return this.client.call('get', 'newsletter/lists', {form: list? {list}: {}});
    }

}

/**
 * @private
 * Newsletter Identity API
 */
class NewsletterIdentity {

    /**
     * @constructor
     * @param {Sendgrid} sg parent
     */
    constructor(sg) {
        this.sg = sg;
    }

    /**
     * Create a new Identity
     * @param {String} identity The title of the identity
     * @param {String} name The address name to be used for this identity
     * @param {String} email The email address for this identity
     * @param {String} address The street address for this identity
     * @param {String} city The city for this identity
     * @param {String} state The state for this identity
     * @param {String} zip The postal code for this identity
     * @param {String} country The country for this identity
     * @returns {Promise} result
     */
    add(identity, name, email, address, city, state, zip, country) {
        assert.ok(identity, 'identity is required');
        assert.ok(name, 'name is required');
        assert.ok(email, 'email is required');
        assert.ok(address, 'address is required');
        assert.ok(city, 'city is required');
        assert.ok(state, 'state is required');
        assert.ok(zip, 'zip is required');
        assert.ok(country, 'country is required');

        return this.client.call('add', 'newsletter/identity', {form: {
            identity,
            name,
            email,
            address,
            city,
            state,
            zip,
            country
        }});
    }

    /**
     * Delete an identity
     * @param {String} identity The identity to be removed
     * @returns {Promise} result
     */
    delete(identity) {
        assert.ok(identity, 'identity is required');

        return this.client.call('delete', 'newsletter/identity', {form: {
            identity
        }});
    }

    /**
     * Edit an Identity
     * @param {String} identity The title of the identity you wish to edit
     * @param {String} [newidentity] The new title for the identity you are editing
     * @param {String} [name] The address name to be used for this identity
     * @param {String} [email] The email address for this identity
     * @param {String} [address] The street address for this identity
     * @param {String} [city] The city for this identity
     * @param {String} [state] The state for this identity
     * @param {String} [zip] The postal code for this identity
     * @param {String} [country] The country for this identity
     * @returns {Promise} result
     */
    edit(identity, {newidentity, name, email, address, city, state, zip, country} = {}) {
        assert.ok(identity, 'identity is required');

        const form = {identity};
        if (newidentity) {
            form.newidentity = newidentity;
        }
        if (name) {
            form.name = name;
        }
        if (email) {
            form.email = email;
        }
        if (address) {
            form.address = address;
        }
        if (city) {
            form.city = city;
        }
        if (state) {
            form.state = state;
        }
        if (zip) {
            form.zip = zip;
        }
        if (country) {
            form.country = country;
        }
        return this.client.call('edit', 'newsletter/identity', {form});
    }

    /**
     * Retrieve a particular identity
     * @param {String} identity The identity to retrieve
     * @returns {Promise} result
     */
    get(identity) {
        assert.ok(identity, 'identity is required');

        return this.client.call('get', 'newsletter/identity', {form: {identity}});
    }

    /**
     * Retrieve a list of all identities or check if an identity exists
     * @param {String} [identity] Optional identity to search for
     * @returns {Promise} result
     */
    list({identity} = {}) {
        return this.client.call('list', 'newsletter/identity', {form: identity? {identity}: {}});
    }
}

/**
 * @private
 * Newsletter Recipients API
 */
class NewsletterRecipients {

    /**
     * @constructor
     * @param {Sendgrid} sg parent
     */
    constructor(sg) {
        this.sg = sg;
    }

    /**
     * Add one or more emails to a list
     * @param {String} name The newsletter to which list will be added
     * @param {String} list The name of the list to add to the newsletter
     * @returns {Promise} result
     */
    add(name, list) {
        assert.ok(name, 'name is required');
        assert.ok(list, 'list is required');

        return this.client.call('add', 'newsletter/recipients', {form: {name, list}});
    }

    /**
     * Remove one or more emails from a list
     * @param {String} name The newsletter to which list will be added
     * @param {String} list The name of the list to add to the newsletter
     * @returns {Promise} result
     */
    delete(name, list) {
        assert.ok(name, 'name is required');
        assert.ok(list, 'list is required');

        return this.client.call('delete', 'newsletter/recipients', {form: {name, list}});
    }

    /**
     * Retrieve the lists assigned to a particular newsletter.
     * @param {String} name The newsletter for which to retrieve lists
     * @returns {Promise} result
     */
    get(name) {
        assert.ok(name, 'name is required');

        return this.client.call('get', 'newsletter/recipients', {form: {name}});
    }
}

/**
 * @private
 * Newsletter Schedule API
 */
class NewsletterSchedule {

    /**
     * @constructor
     * @param {Sendgrid} sg parent
     */
    constructor(sg) {
        this.sg = sg;
    }

    /**
     * Schedule a delivery time for an existing Newsletter.
     * @param {String} name The newsletter to schedule
     * @param {Date} [at] Date/Time to deliver the newsletter. Must be provided in ISO 8601 format (YYYY-MM-DD HH:MM:SS +-HH:MM)
     * @param {Number} [after] Number of minutes in the future to schedule delivery, e.g. a value of 30 will schedule delivery 30 minutes after the request is received
     * @returns {Promise} result
     */
    add(name, {at, after} = {}) {
        assert.ok(name, 'name is required');

        const form = {name};
        if (at) {
            form.at = at.toJSON();
        }
        if (after) {
            form.after = after;
        }
        return this.client.call('add', 'newsletter/schedule', {form});
    }

    /**
     * Cancel a scheduled send for a Newsletter.
     * @param {String} name Remove the scheduled delivery time from an existing Newsletter.
     * @returns {Promise} result
     */
    delete(name) {
        assert.ok(name, 'name is required');

        return this.client.call('delete', 'newsletter/schedule', {form: {name}});
    }
    
    /**
     * Retrieve the scheduled delivery time for an existing Newsletter.
     * @param {String} name The newsletter for which to retrieve the schedule
     * @returns {Promise} result
     */
    get(name) {
        assert.ok(name, 'name is required');

        return this.client.call('get', 'newsletter/schedule', {form: {name}});
    }
}

/**
 * @private
 * Sendgrid Newsletter API
 */
export class Markering {

    /**
     * @constructor
     * @param {String} key auth
     */
    constructor(key) {
        this.client = new Client(key);
    }

    /**
     * Gets Newsletter Category API
     * @returns {NewsletterCategory} api
     */
    get category() {
        return this._category? this._category: this._category = new NewsletterCategory(this.client);
    }

    /**
     * Gets Newsletter Identity API
     * @returns {NewsletterIdentity} api
     */
    get identity() {
        return this._identity? this._identity: this._identity = new NewsletterIdentity(this.client);
    }

    /**
     * Gets Newsletter Lists API
     * @returns {NewsletterLists} api
     */
    get lists() {
        return this._lists? this._lists: this._lists = new NewsletterLists(this.client);
    }
    
    /**
     * Gets Newsletter Recipients API
     * @returns {NewsletterRecipients} api
     */
    get recipients() {
        return this._recipients? this._recipients: this._recipients = new NewsletterRecipients(this.client);
    }
    
    /**
     * Gets Newsletter Schedule API
     * @returns {NewsletterSchedule} api
     */
    get schedule() {
        return this._schedule? this._schedule: this._schedule = new NewsletterSchedule(this.client);
    }
    
    /**
     * Create a Newsletter
     * @param {String} identity The identity that will be assigned to the newsletter
     * @param {String} name Name of the newsletter
     * @param {String} subject Subject line for the newsletter
     * @param {String} text The text body of the newsletter
     * @param {String} html The HTML body of the newsletter
     * @returns {Promise} result
     */
    add(identity, name, subject, text, html) {
        assert.ok(identity, 'identity is required');
        assert.ok(name, 'name is required');
        assert.ok(subject, 'subject is required');
        assert.ok(text, 'text is required');
        assert.ok(html, 'html is required');

        return this.client.call('add', 'newsletter', {form: {
            identity,
            name,
            subject,
            text,
            html
        }});
    }

    /**
     * Edit a Newsletter
     * @param {String} identity The identity that will be assigned to the newsletter
     * @param {String} name Current name of the newsletter
     * @param {String} newname New name of the newsletter
     * @param {String} subject Subject line for the newsletter
     * @param {String} text The text body of the newsletter
     * @param {String} html The HTML body of the newsletter
     * @returns {Promise} result
     */
    edit(identity, name, newname, subject, text, html) {
        assert.ok(identity, 'identity is required');
        assert.ok(name, 'name is required');
        assert.ok(subject, 'subject is required');
        assert.ok(text, 'text is required');
        assert.ok(html, 'html is required');

        return this.client.call('edit', 'newsletter', {form: {
            identity,
            name,
            newname,
            subject,
            text,
            html
        }});
    }

    /**
     * Delete a newsletters
     * @param {String} name The newsletter to be removed
     * @returns {Promise} result
     */
    delete(name) {
        assert.ok(name, 'name is required');

        return this.client.call('delete', 'newsletter', {form: {name}});
    }

    /**
     * Get the contents of an existing newsletter
     * @param {String} name The name of the newsletter to retrieve
     * @returns {Promise} result
     */
    get(name) {
        assert.ok(name, 'name is required');

        return this.client.call('get', 'newsletter', {form: {name}});
    }

    /**
     * Retrieve a list of all newsletters
     * @param {String} [name] Optional newsletter name to search for
     * @returns {Promise} result
     */
    list({name} = {}) {
        return this.client.call('list', 'newsletter', {form: name? {name}: {}});
    }
}
