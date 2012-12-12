(function() {

var _ = require('underscore');
var request = require('request');

var SGAPI = 'https://sendgrid.com/api';

/**
 * @public
 * Sendgrid API
 * @param {String} user API user
 * @param {String} key API key
 * @returns {Sendgrid}
 */
function Sendgrid(user, key) {
    this.creds = {
        api_user: user,
        api_key: key
    };
}

Sendgrid.prototype = {
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

Sendgrid.prototype.request = function(action, path, form, cb) {
    request(SGAPI + '/' + path + '/' + action + '.json', {
        method: 'POST',
        jar: false,
        qs: this.creds,
        form: form
    }, function(err, res, body) {
        if (err) cb(err);
        else if (body.message === 'error' || body.error) cb(body);
        else cb(err, body);
    })._json = true;
    
};

/**
 * @private
 * Sendgrid Mail API
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
    if (files) form.files = files;
    this.sg.request('send', 'mail', form, cb);
};

/**
 * @private
 * Sendgrid Newsletter API
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
    this.sg.request('add', 'newsletter', {
        identity: identity,
        name: name,
        subject: subject,
        text: text,
        html: html
    }, cb);
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
    this.sg.request('edit', 'newsletter', {
        identity: identity,
        name: name,
        newname: newname,
        subject: subject,
        text: text,
        html: html
    }, cb);
};

/**
 * Delete a newsletters
 * @param {String} name The newsletter to be removed
 * @param {Function} cb
 */
Newsletter.prototype.delete = function(name, cb) {
    this.sg.request('delete', 'newsletter', {
        name: name
    }, cb);
};

/**
 * Get the contents of an existing newsletter
 * @param {String} name The name of the newsletter to retrieve
 * @param {Function} cb
 */
Newsletter.prototype.get = function(name, cb) {
    this.sg.request('get', 'newsletter', {
        name: name
    }, cb);
};

/**
 * Retrieve a list of all newsletters
 * @param {String} [name] Optional newsletter name to search for
 * @param {Function} cb
 */
Newsletter.prototype.list = function(name, cb) {
    this.sg.request('list', 'newsletter', name? {name: name}: {}, cb);
};

/**
 * Newsletter Category API
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
    this.sg.request('add', 'newsletter/category', {
        category: category,
        name: name
    }, cb);
};

/**
 * Create a new Category
 * @param {String} category The name that will be used for the Category being created
 * @param {Function} cb
 */
NewsletterCategory.prototype.create = function(category, cb) {
    this.sg.request('create', 'newsletter/category', {
        category: category
    }, cb);
};

/**
 * List all categories
 * @param {String} category Search to see if a specific Category exists rather than a list of all Categories
 * @param {Function} cb 
 */
NewsletterCategory.prototype.list = function(category, cb) {
    this.sg.request('list', 'newsletter/category', {
        category: category
    }, cb);
};

/**
 * Remove specific categories, or all categories from a Newsletter
 * @param {String} name The Newsletter that will have Category(ies) deleted from it
 * @param {String} [category] Remove the Category with this name. If the category is not specified. all categories will be deleted from the Newsletter
 * @param {Function} cb
 */
NewsletterCategory.prototype.remove = function(name, category, cb) {
    var form = {name: name};
    if (category) form.category = category;
    this.sg.request('remove', 'newsletter/category', form, cb);
};

/**
 * @private
 * Newsletter Lists API
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
    this.sg.request('add', 'newsletter/lists', _.defaults({
        list: list,
        name: name
    }, columns), cb);
};

/**
 * Delete a list
 * @param {String} list The name of the list to remove.
 * @param {Function} cb
 */
NewsletterLists.prototype.delete = function(list, cb) {
    this.sg.request('delete', 'newsletter/lists', {
        list: list
    }, cb);
};

/**
 * Rename a List
 * @param {String} list Current name of the list to rename
 * @param {String} newlist The new name for the list
 * @param {Function} cb
 */
NewsletterLists.prototype.edit = function(list, newlist, cb) {
    this.sg.request('edit', 'newsletter/lists', {
        list: list,
        newlist: newlist
    }, cb);
};

/**
 * Retrieve all recipients lists or check if a particular list exists
 * @param {String} [list] Optional list to retrieve. If not specified, all lists will be returned.
 * @param {Function} cb
 */
NewsletterLists.prototype.get = function(list, cb) {
    this.sg.request('get', 'newsletter/lists', list? {list: list}: {}, cb);
};

/**
 * @private
 * Newsletter Lists Email API
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
    this.sg.request('add', 'newsletter/lists/email', {
        list: list,
        data: JSON.strigify(data)
    }, cb);
};

/**
 * Remove one or more emails from a list
 * @param {String} list The name of the list from which emails will be removed
 * @param {String} email The email addresses or addresses to be removed
 * @param {Function} cb
 */
NewsletterListsEmail.prototype.delete = function(list, email, cb) {
    this.sg.request('delete', 'newsletter/lists/email', {
        list: list, 
        email: email
    }, cb);
};

/**
 * Retrieve the email addresses and associated fields for a particular list
 * @param {String} list The list to retrieve
 * @param {String} [email] Optional email address or list of addresses to search for
 * @param {Function} cb
 */
NewsletterListsEmail.prototype.get = function(list, email, cb) {
    this.sg.request('get', 'newsletter/lists/email', email? {list: list, email: email}: {list: list}, cb);
};

/**
 * @private
 * Newsletter Identity API
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
    this.sg.request('add', 'newsletter/identity', {
        identity: identity,
        name: name,
        email: email,
        address: address,
        city: city,
        state: state,
        zip: zip,
        country: country
    }, cb);
};

/**
 * Delete an identity
 * @param {String} identity The identity to be removed
 * @param {Function} cb
 */
NewsletterIdentity.prototype.delete = function(identity, cb) {
    this.sg.request('delete', 'newsletter/identity', {
        identity: identity
    }, cb);
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
    var form = {identity: identity};
    if (newidentity) form.newidentity = newidentity;
    if (name) form.name = name;
    if (email) form.email = email;
    if (address) form.address = address;
    if (city) form.city = city;
    if (state) form.state = state;
    if (zip) form.zip = zip;
    if (country) form.country = country;
    this.sg.request('edit', 'newsletter/identity', form, cb);
};

/**
 * Retrieve a particular identity
 * @param {String} identity The identity to retrieve
 * @param {Function} cb
 */
NewsletterIdentity.prototype.get = function(identity, cb) {
    this.sg.request('get', 'newsletter/identity', {
        identity: identity
    }, cb);
};

/**
 * Retrieve a list of all identities or check if an identity exists
 * @param {String} [identity] Optional identity to search for
 * @param {Function} cb
 */
NewsletterIdentity.prototype.list = function(identity, cb) {
    this.sg.request('list', 'newsletter/identity', identity? {identity: identity}: {}, cb);
};

/**
 * @private
 * Newsletter Recipients API
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
    this.sg.request('add', 'newsletter/recipients', {
        name: name,
        list: list
    }, cb);
};

/**
 * Remove one or more emails from a list
 * @param {String} name The newsletter to which list will be added
 * @param {String} list The name of the list to add to the newsletter
 * @param {Function} cb
 */
NewsletterRecipients.prototype.delete = function(name, list, cb) {
    this.sg.request('delete', 'newsletter/recipients', {
        name: name,
        list: list
    }, cb);
};

/**
 * Retrieve the lists assigned to a particular newsletter.
 * @param {String} name The newsletter for which to retrieve lists
 * @param {Function} cb
 */
NewsletterRecipients.prototype.get = function(name, cb) {
    this.sg.request('get', 'newsletter/recipients', {
        name: name
    }, cb);
};

/**
 * @private
 * Newsletter Schedule API
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
    var form = {name: name};
    if (at) form.at = at;
    if (after) form.after = after;
    this.sg.request('add', 'newsletter/schedule', form, cb);
};

/**
 * Cancel a scheduled send for a Newsletter.
 * @param {String} name Remove the scheduled delivery time from an existing Newsletter.
 * @param {Function} cb
 */
NewsletterSchedule.prototype.delete = function(name, cb) {
    this.sg.request('delete', 'newsletter/schedule', {
        name: name
    }, cb);
};

/**
 * Retrieve the scheduled delivery time for an existing Newsletter.
 * @param {String} name The newsletter for which to retrieve the schedule
 * @param {Function} cb
 */
NewsletterSchedule.prototype.get = function(name, cb) {
    this.sg.request('get', 'newsletter/schedule', {
        name: name
    }, cb);
};

exports.Sendgrid = Sendgrid;

})();
