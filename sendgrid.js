(function() {

var _ = require('underscore');
var assert = require('assert');
var moment = require('moment');
var request = require('request');

var SGAPI = 'https://sendgrid.com/api';

/**
 * @public
 * Sendgrid API
 * @constructor
 * @param {String} user API user
 * @param {String} key API key
 * @param {Object} options Options
 * @returns {Sendgrid}
 */
function Sendgrid(user, key, options) {
    assert.ok(user, "API user is required");
    assert.ok(key, "API key is required");
    
    this.creds = {
        api_user: user,
        api_key: key
    };

    this.debug = options && options.debug;
}

Sendgrid.prototype = {
    
    /**
     * Gets Bounces API
     * @returns {Bounces}
     */
    get bounces() {
        if (!this._bounces) this._bounces = new Bounces(this);
        return this._bounces;
    },
    
    /**
     * Gets Invalid Emails API
     * @returns {InvalidEmails}
     */
    get invalidemails() {
        if (!this._invalidemails) this._invalidemails = new InvalidEmails(this);
        return this._invalidemails;
    },
    
    /**
     * Gets Mail API
     * @returns {Mail}
     */
    get mail() {
        if (!this._mail) this._mail = new Mail(this);
        return this._mail;
    },
    
    /**
     * Gets Newsletter API
     * @returns {Newsletter}
     */
    get newsletter() {
        if (!this._newsletter) this._newsletter = new Newsletter(this);
        return this._newsletter;
    }
};

Sendgrid.prototype.request = function(action, path, options, cb) {
    this.debug && console.log('sendgrid api', action, path, options);
    
    assert.ok(action, 'Action is required');
    assert.ok(path, 'Path is required');
    assert.ok(cb, 'Callback is required');
    assert.equal(typeof cb, 'function', 'Callback must be function');
    
    var req = request(SGAPI + '/' + path + '/' + action + '.json', {
        method: 'POST',
        jar: false,
        qs: this.creds,
        headers: options.headers,
        form: options.form
    }, function(err, res, body) {
        if (err) cb(err);
        else if (body.message === 'error' || body.error) cb(body);
        else cb(err, body);
    });
    
    req._json = true;
    
    if (options.formData) {
        var reqForm = req.form();
        
        for (var field in options.formData) {
            var value = options.formData[value];
            if (value.filename) reqForm.appent(field, value.content, {filename: value.filename, contentType: value.contentType});
            else reqForm.appent(field, value);
        }
    }
};

/**
 * This endpoint allows you to retrieve and delete entries in the Bounces list.
 * @constructor
 * @param {Sendgrid} sg
 * @returns {Bounces}
 */
function Bounces(sg) {
    this.sg = sg;
}

/**
 * Retrieve a list of bounces with addresses and response codes, optionally with dates.
 * @param {Object} options
 * @param {Boolean} [options.date] Retrieve the timestamp of the bounce records.
 * @param {Number} [options.days] Number of days in the past for which to retrieve bounces (includes today).
 * @param {Date} [options.start_date] The start of the date range for which to retrieve bounces.
 * @param {Date} [options.end_date] The end of the date range for which to retrieve bounces.
 * @param {Number} [options.limit] Optional field to limit the number of results returned.
 * @param {Number} [options.offset] Optional beginning point in the list to retrieve from.
 * @param {String} [options.type] Choose the type of bounce to search for (hard or soft).
 * @param {String} [options.email] Optional email addresses to search for.
 * @param {Function} cb
 * @returns {undefined}
 */
Bounces.prototype.get = function(options, cb) {
    options = _.extend({}, options);
    if (options.date) options.date = 1;
    if (options.start_date) options.start_date = moment(options.start_date).format('YYYY-MM-DD');
    if (options.end_date) options.end_date = moment(options.end_date).format('YYYY-MM-DD');
    this.sg.request('get', 'bounces', {form: options}, cb);
};

/**
 * Delete an address from the Bounce list. Please note that if no parameters are specified the ENTIRE list will be deleted.
 * @param {Object} [options]
 * @param {Date} [options.start_date] Optional date to start deleting from.
 * @param {Date} [options.end_date] Optional date to end deleting from.
 * @param {String} [options.type] Choose the type of bounce to be removed (hard or soft).
 * @param {String} [options.email] Email bounce address to remove.
 * @param {Function} cb
 * @returns {undefined}
 */
Bounces.prototype.delete = function(options, cb) {
    options = _.extend({}, options);
    if (options.start_date) options.start_date = moment(options.start_date).format('YYYY-MM-DD');
    if (options.end_date) options.end_date = moment(options.end_date).format('YYYY-MM-DD');
    this.sg.request('delete', 'bounces', {form: options}, cb);
};

/**
 * 
 * @param {Object} [options]
 * @param {Date} [options.start_date] Optional date to start counting from.
 * @param {Date} [options.end_date] Optional date to end counting from.
 * @param {String} [options.type] Choose the type of bounce to be removed (hard or soft).
 * @param {type} cb
 * @returns {undefined}
 */
Bounces.prototype.count = function(options, cb) {
    options = _.extend({}, options);
    if (options.start_date) options.start_date = moment(options.start_date).format('YYYY-MM-DD');
    if (options.end_date) options.end_date = moment(options.end_date).format('YYYY-MM-DD');
    this.sg.request('count', 'bounces', {form: options}, cb);
};

/**
 * This endpoint allows you to retrieve and delete entries in the Invalid Emails list.
 * @constructor
 * @param {Sendgrid} sg 
 * @returns {InvalidEmails}
 */
function InvalidEmails(sg) {
    this.sg = sg;
}

/**
 * Retrieve a list of invalid emails with addresses and response codes, optionally with dates.
 * @param {Object} options
 * @param {Boolean} [options.date] Retrieve the timestamp of the invalid email records.
 * @param {Number} [options.days] Number of days in the past for which to retrieve invalid emails (includes today).
 * @param {Date} [options.start_date] The start of the date range for which to retrieve invalid emails.
 * @param {Date} [options.end_date] The end of the date range for which to retrieve invalid emails.
 * @param {Number} [options.limit] Optional field to limit the number of results returned.
 * @param {Number} [options.offset] Optional beginning point in the list to retrieve from.
 * @param {String} [options.email] Optional email addresses to search for.
 * @param {Function} cb
 * @returns {undefined}
 */
InvalidEmails.prototype.get = function(options, cb) {
    options = _.extend({}, options);
    if (options.date) options.date = 1;
    if (options.start_date) options.start_date = moment(options.start_date).format('YYYY-MM-DD');
    if (options.end_date) options.end_date = moment(options.end_date).format('YYYY-MM-DD');
    this.sg.request('get', 'invalidemails', {form: options}, cb);
};

/**
 * Delete an address from the Invalid Email list.
 * @param {String} email Email Invalid Email address to remove
 * @param {Function} cb
 * @returns {undefined}
 */
InvalidEmails.prototype.delete = function(email, cb) {
    assert.ok(email, 'email is required');
    this.sg.request('delete', 'invalidemails', {form: {email: email}}, cb);
};

/**
 * @private
 * Sendgrid Mail API
 * @constructor
 * @param {Sendgrid} sg 
 * @returns {Mail}
 */
function Mail(sg) {
    this.sg = sg;
}

/**
 * Sends a message to one recipient
 * @param {String} to Valid email address of receipient
 * @param {String} [toname] Given name of the recipient
 * @param {Object} [xsmtpapi] 'X-SMTPAPI' header
 * @param {String} from Valid email address of sender
 * @param {String} [fromname] Given name of the sender
 * @param {String} subject Subject of the email
 * @param {String} text Body of the email
 * @param {String} [html] HTML Body of the email. At least one of the text or html parameters must be specified.
 * @param {String|Array} [bcc] Valid email address to be BCC'd. This can also be passed in as an array of email addresses for multiple recipients
 * @param {String} [date] Specify the date header of your email. Must be a valid RFC 2822 formatted date
 * @param {Object} [headers] A collection of key/value pairs. Each key represents a header name and the value the header value. Ex: {“X-Accept-Language”: “en”, “X-Mailer”: “MyApp”}
 * @param {String} [files] Add attachment. Ex: files[file1.doc]=example.doc&files[file2.pdf]=example.pdf. Must be less than 7MB
 * @param {Function} cb
 */
Mail.prototype.send = function(to, toname, xsmtpapi, from, fromname, subject, text, html, bcc, date, headers, files, cb) {
    var form = {
        to: to,
        from: from,
        subject: subject,
        text: text
    };
    if (toname) form.toname = toname;
    if (xsmtpapi) form['x-smtpapi'] = JSON.strigify(xsmtpapi);
    if (fromname) form.fromname = fromname;
    if (html) form.html = html;
    if (bcc) form.bcc = bcc;
    if (date) form.date = date;
    if (headers) form.headers = JSON.strigify(headers);
    if (files) {
        for (var filename in files)
            var file = file[filename];
            form['files[' + filename + ']'] = {
                filename: filename,
                content: file.content,
                contentType: file.contentType
            };
    }
    
    var options = {};
    if (files) options.formData = form;
    else options.form = form;
    
    this.sg.request('send', 'mail', {form: form}, cb);
};

/**
 * @private
 * Sendgrid Newsletter API
 * @constructor
 * @param {Sendgrid} sg
 * @returns {Newsletter}
 */
function Newsletter(sg) {
    this.sg = sg;
}

Newsletter.prototype = {
    /**
     * Gets Newsletter Category API
     * @returns {NewsletterCategory}
     */
    get category() {
        if (!this._category) this._category = new NewsletterCategory(this.sg);
        return this._category;
    },

    /**
     * Gets Newsletter Identity API
     * @returns {NewsletterIdentity}
     */
    get identity() {
        if (!this._identity) this._identity = new NewsletterIdentity(this.sg);
        return this._identity;
    },

    /**
     * Gets Newsletter Lists API
     * @returns {NewsletterLists}
     */
    get lists() {
        if (!this._lists) this._lists = new NewsletterLists(this.sg);
        return this._lists;
    },
    
    /**
     * Gets Newsletter Recipients API
     * @returns {NewsletterRecipients}
     */
    get recipients() {
        if (!this._recipients) this._recipients = new NewsletterRecipients(this.sg);
        return this._recipients;
    },
    
    /**
     * Gets Newsletter Schedule API
     * @returns {NewsletterSchedule}
     */
    get schedule() {
        if (!this._schedule) this._schedule = new NewsletterSchedule(this.sg);
        return this._schedule;
    }
};

/**
 * Create a Newsletter
 * @param {String} identity The identity that will be assigned to the newsletter
 * @param {String} name Name of the newsletter
 * @param {String} subject Subject line for the newsletter
 * @param {String} text The text body of the newsletter
 * @param {String} html The HTML body of the newsletter
 * @param {Function} cb
 */
Newsletter.prototype.add = function(identity, name, subject, text, html, cb) {
    assert.ok(identity);
    assert.ok(name);
    assert.ok(subject);
    assert.ok(text);
    assert.ok(html);
    
    this.sg.request('add', 'newsletter', {form: {
        identity: identity,
        name: name,
        subject: subject,
        text: text,
        html: html
    }}, cb);
};

/**
 * Edit a Newsletter
 * @param {String} identity The identity that will be assigned to the newsletter
 * @param {String} name Current name of the newsletter
 * @param {String} newname New name of the newsletter
 * @param {String} subject Subject line for the newsletter
 * @param {String} text The text body of the newsletter
 * @param {String} html The HTML body of the newsletter
 * @param {Function} cb
 */
Newsletter.prototype.edit = function(identity, name, newname, subject, text, html, cb) {
    assert.ok(identity);
    assert.ok(name);
    assert.ok(subject);
    assert.ok(text);
    assert.ok(html);
    
    this.sg.request('edit', 'newsletter', {form: {
        identity: identity,
        name: name,
        newname: newname,
        subject: subject,
        text: text,
        html: html
    }}, cb);
};

/**
 * Delete a newsletters
 * @param {String} name The newsletter to be removed
 * @param {Function} cb
 */
Newsletter.prototype.delete = function(name, cb) {
    assert.ok(name);
    
    this.sg.request('delete', 'newsletter', {form: {
        name: name
    }}, cb);
};

/**
 * Get the contents of an existing newsletter
 * @param {String} name The name of the newsletter to retrieve
 * @param {Function} cb
 */
Newsletter.prototype.get = function(name, cb) {
    assert.ok(name);
    
    this.sg.request('get', 'newsletter', {form: {
        name: name
    }}, cb);
};

/**
 * Retrieve a list of all newsletters
 * @param {String} [name] Optional newsletter name to search for
 * @param {Function} cb
 */
Newsletter.prototype.list = function(name, cb) {
    this.sg.request('list', 'newsletter', {form: name? {name: name}: {}}, cb);
};

/**
 * Newsletter Category API
 * @constructor
 * @param {Sendgrid} sg
 * @returns {NewsletterCategory}
 */
function NewsletterCategory(sg) {
    this.sg = sg;
}

/**
 * Assign a Category to an existing Newsletter
 * @param {type} category The Category that will be added to the newsletter
 * @param {type} name The Newsletter to which the categories will be added
 * @param {type} cb
 */
NewsletterCategory.prototype.add = function(category, name, cb) {
    assert.ok(category);
    assert.ok(name);
    
    this.sg.request('add', 'newsletter/category', {form: {
        category: category,
        name: name
    }}, cb);
};

/**
 * Create a new Category
 * @param {String} category The name that will be used for the Category being created
 * @param {Function} cb
 */
NewsletterCategory.prototype.create = function(category, cb) {
    assert.ok(category);
    
    this.sg.request('create', 'newsletter/category', {form: {
        category: category
    }}, cb);
};

/**
 * List all categories
 * @param {String} [category] Search to see if a specific Category exists rather than a list of all Categories
 * @param {Function} cb 
 */
NewsletterCategory.prototype.list = function(category, cb) {
    this.sg.request('list', 'newsletter/category', {form: {
        category: category
    }}, cb);
};

/**
 * Remove specific categories, or all categories from a Newsletter
 * @param {String} name The Newsletter that will have Category(ies) deleted from it
 * @param {String} [category] Remove the Category with this name. If the category is not specified. all categories will be deleted from the Newsletter
 * @param {Function} cb
 */
NewsletterCategory.prototype.remove = function(name, category, cb) {
    assert.ok(name);
    
    var form = {name: name};
    if (category) form.category = category;
    this.sg.request('remove', 'newsletter/category', {form: form}, cb);
};

/**
 * @private
 * Newsletter Lists API
 * @constructor
 * @param {Sendgrid} sg
 * @returns {NewsletterLists}
 */
function NewsletterLists(sg) {
    this.sg = sg;
}

NewsletterLists.prototype = {
    /**
     * Gets Newsletter Lists Email API
     * @returns {NewsletterListsEmail}
     */
    get email() {
        if (!this._email) this._email = new NewsletterListsEmail(this.sg);
        return this._email;
    }
};

/**
 * Create a Recipient List
 * @param {String} list The name of the list to create
 * @param {String} [name] Specify the column name for the 'name' associated with email addresses
 * @param {Object} [columns] Specify additional column names
 * @param {Function} cb
 */
NewsletterLists.prototype.add = function(list, name, columns, cb) {
    assert.ok(list);
    
    this.sg.request('add', 'newsletter/lists', {form: _.defaults({
        list: list,
        name: name
    }, columns)}, cb);
};

/**
 * Delete a list
 * @param {String} list The name of the list to remove.
 * @param {Function} cb
 */
NewsletterLists.prototype.delete = function(list, cb) {
    assert.ok(list);

    this.sg.request('delete', 'newsletter/lists', {form: {
        list: list
    }}, cb);
};

/**
 * Rename a List
 * @param {String} list Current name of the list to rename
 * @param {String} newlist The new name for the list
 * @param {Function} cb
 */
NewsletterLists.prototype.edit = function(list, newlist, cb) {
    assert.ok(list);
    assert.ok(newlist);

    this.sg.request('edit', 'newsletter/lists', {form: {
        list: list,
        newlist: newlist
    }}, cb);
};

/**
 * Retrieve all recipients lists or check if a particular list exists
 * @param {String} [list] Optional list to retrieve. If not specified, all lists will be returned.
 * @param {Function} cb
 */
NewsletterLists.prototype.get = function(list, cb) {
    this.sg.request('get', 'newsletter/lists', {form: list? {list: list}: {}}, cb);
};

/**
 * @private
 * Newsletter Lists Email API
 * @constructor
 * @param {Sendgrid} sg
 * @returns {NewsletterListsEmail}
 */
function NewsletterListsEmail(sg) {
    this.sg = sg;
}

/**
 * Add one or more emails to a list
 * @param {String} list The list to which email addresses will be added
 * @param {Array} data Entries. Limited to 1000 entries per request. {"email":"address@domain.com","name":"contactName"}
 * @param {Function} cb
 */
NewsletterListsEmail.prototype.add = function(list, data, cb) {
    assert.ok(list);
    assert.ok(data);
    
    this.sg.request('add', 'newsletter/lists/email', {form: {
        list: list,
        data: data.map(JSON.stringify)
    }}, cb);
};

/**
 * Remove one or more emails from a list
 * @param {String} list The name of the list from which emails will be removed
 * @param {String} email The email addresses or addresses to be removed
 * @param {Function} cb
 */
NewsletterListsEmail.prototype.delete = function(list, email, cb) {
    assert.ok(list);
    
    this.sg.request('delete', 'newsletter/lists/email', {form: {
        list: list, 
        email: email
    }}, cb);
};

/**
 * Retrieve the email addresses and associated fields for a particular list
 * @param {String} list The list to retrieve
 * @param {String} [email] Optional email address or list of addresses to search for
 * @param {Function} cb
 */
NewsletterListsEmail.prototype.get = function(list, email, cb) {
    assert.ok(list);
    
    var form = {
        list: list
    };

    if (email) form.email = email;
    
    this.sg.request('get', 'newsletter/lists/email', {form: form}, cb);
};

/**
 * @private
 * Newsletter Identity API
 * @constructor
 * @param {Sendgrid} sg
 * @returns {NewsletterIdentity}
 */
function NewsletterIdentity(sg) {
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
 * @param {Function} cb
 */
NewsletterIdentity.prototype.add = function(identity, name, email, address, city, state, zip, country, cb) {
    assert.ok(identity);
    assert.ok(name);
    assert.ok(email);
    assert.ok(address);
    assert.ok(city);
    assert.ok(state);
    assert.ok(zip);
    assert.ok(country);
    
    this.sg.request('add', 'newsletter/identity', {form: {
        identity: identity,
        name: name,
        email: email,
        address: address,
        city: city,
        state: state,
        zip: zip,
        country: country
    }}, cb);
};

/**
 * Delete an identity
 * @param {String} identity The identity to be removed
 * @param {Function} cb
 */
NewsletterIdentity.prototype.delete = function(identity, cb) {
    assert.ok(identity);
    
    this.sg.request('delete', 'newsletter/identity', {form: {
        identity: identity
    }}, cb);
};

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
 * @param {Function} cb
 */
NewsletterIdentity.prototype.edit = function(identity, newidentity, name, email, address, city, state, zip, country, cb) {
    assert.ok(identity);
    
    var form = {identity: identity};
    if (newidentity) form.newidentity = newidentity;
    if (name) form.name = name;
    if (email) form.email = email;
    if (address) form.address = address;
    if (city) form.city = city;
    if (state) form.state = state;
    if (zip) form.zip = zip;
    if (country) form.country = country;
    this.sg.request('edit', 'newsletter/identity', {form: form}, cb);
};

/**
 * Retrieve a particular identity
 * @param {String} identity The identity to retrieve
 * @param {Function} cb
 */
NewsletterIdentity.prototype.get = function(identity, cb) {
    assert.ok(identity);
    
    this.sg.request('get', 'newsletter/identity', {form: {
        identity: identity
    }}, cb);
};

/**
 * Retrieve a list of all identities or check if an identity exists
 * @param {String} [identity] Optional identity to search for
 * @param {Function} cb
 */
NewsletterIdentity.prototype.list = function(identity, cb) {
    this.sg.request('list', 'newsletter/identity', {form: identity? {identity: identity}: {}}, cb);
};

/**
 * @private
 * Newsletter Recipients API
 * @constructor
 * @param {Sendgrid} sg
 * @returns {NewsletterRecipients}
 */
function NewsletterRecipients(sg) {
    this.sg = sg;
}

/**
 * Add one or more emails to a list
 * @param {String} name The newsletter to which list will be added
 * @param {String} list The name of the list to add to the newsletter
 * @param {Function} cb
 */
NewsletterRecipients.prototype.add = function(name, list, cb) {
    assert.ok(name);
    assert.ok(list);
    
    this.sg.request('add', 'newsletter/recipients', {form: {
        name: name,
        list: list
    }}, cb);
};

/**
 * Remove one or more emails from a list
 * @param {String} name The newsletter to which list will be added
 * @param {String} list The name of the list to add to the newsletter
 * @param {Function} cb
 */
NewsletterRecipients.prototype.delete = function(name, list, cb) {
    assert.ok(name);
    assert.ok(list);
    
    this.sg.request('delete', 'newsletter/recipients', {form: {
        name: name,
        list: list
    }}, cb);
};

/**
 * Retrieve the lists assigned to a particular newsletter.
 * @param {String} name The newsletter for which to retrieve lists
 * @param {Function} cb
 */
NewsletterRecipients.prototype.get = function(name, cb) {
    assert.ok(name);
    
    this.sg.request('get', 'newsletter/recipients', {form: {
        name: name
    }}, cb);
};

/**
 * @private
 * Newsletter Schedule API
 * @constructor
 * @param {Sendgrid} sg
 * @returns {NewsletterSchedule}
 */
function NewsletterSchedule(sg) {
    this.sg = sg;
}

/**
 * Schedule a delivery time for an existing Newsletter.
 * @param {String} name The newsletter to schedule
 * @param {String} [at] Date/Time to deliver the newsletter. Must be provided in ISO 8601 format (YYYY-MM-DD HH:MM:SS +-HH:MM)
 * @param {Number} [after] Number of minutes in the future to schedule delivery, e.g. a value of 30 will schedule delivery 30 minutes after the request is received
 * @param {Function} cb
 */
NewsletterSchedule.prototype.add = function(name, at, after, cb) {
    assert.ok(name);
    
    var form = {name: name};
    if (at) form.at = at;
    if (after) form.after = after;
    this.sg.request('add', 'newsletter/schedule', {form: form}, cb);
};

/**
 * Cancel a scheduled send for a Newsletter.
 * @param {String} name Remove the scheduled delivery time from an existing Newsletter.
 * @param {Function} cb
 */
NewsletterSchedule.prototype.delete = function(name, cb) {
    assert.ok(name);
    
    this.sg.request('delete', 'newsletter/schedule', {form: {
        name: name
    }}, cb);
};

/**
 * Retrieve the scheduled delivery time for an existing Newsletter.
 * @param {String} name The newsletter for which to retrieve the schedule
 * @param {Function} cb
 */
NewsletterSchedule.prototype.get = function(name, cb) {
    assert.ok(name);
    
    this.sg.request('get', 'newsletter/schedule', {form: {
        name: name
    }}, cb);
};

exports.Sendgrid = Sendgrid;

})();
