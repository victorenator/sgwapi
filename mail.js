"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Mail = void 0;

var _assert = _interopRequireDefault(require("assert"));

var _client = require("./client");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @private
 * Sendgrid Mail API
 */
class Mail {
  /**
   * @constructor
   * @param {String} key authorization
   */
  constructor(key) {
    this.client = new _client.Client(key);
  }
  /**
   * Sends a message
   * @param {Object} message.from Sender object
   * @param {String} message.from.email Valid email address of sender
   * @param {Array} message.to An array of recipients
   * @param {String} message.to.email The email of the recipient
   * @param {String} [message.to.name] The name of the recipient
   * @param {String} [message.from.name] Given name of the sender
   * @param {String} message.subject The subject of your email
   * @param {Array} [message.cc] An array of recipients who will receive a copy of your email
   * @param {String} message.cc.email The email of the recipient
   * @param {String} [message.cc.name] The name of the recipient
   * @param {Array} [message.bcc] An array of recipients who will receive a blind carbon copy of your email
   * @param {String} message.bcc.email The email of the recipient
   * @param {String} [message.bcc.name] The name of the recipient
   * @param {Object} [message.replyTo] Append a reply-to field to your email message
   * @param {String} message.replyTo.email The email of the recipient
   * @param {String} [message.replyTo.name] The name of the recipient
   * @param {String} message.text The plain text content of your email message
   * @param {String} message.html The HTML content of your email message
   * @param {Array} [message.attachments] Attachments
   * @param {String} message.attachments.content Attachment content
   * @param {String} message.attachments.filename The filename of the attachment
   * @param {String} [message.attachments.type] The mime type of the content
   * @param {String} [message.attachments.disposition] The content-disposition of the attachment
   * @param {String} [message.attachments.contentID] The content id for the attachment
   * @param {String} [message.templateID] The id of a template that you would like to use
   * @param {Object} [message.sections] An object of key/value pairs that define block sections of code to be used as substitutions
   * @param {Object} [message.headers] description Key-value map of headers
   * @param {Array} [message.categories] An array of category names for this message
   * @param {String} [message.customAgrs] Values that are specific to the entire send that will be carried along with the email and its activity data
   * @param {Date} [message.sendAt] Specify when you want your email to be delivere
   * @param {String} [message.batchID] This ID represents a batch of emails to be sent at the same time
   * @param {Object} [message.asm] An object allowing you to specify how to handle unsubscribes.
   * @param {String} [message.ipPoolName] The IP Pool that you would like to send this email from
   * @param {Object} [mainSettings] A collection of different mail settings that you can use to specify how you would like this email to be handled
   * @param {Object} [trackingSettings] Settings to determine how you would like to track the metrics of how your recipients interact with your email
   * @returns {Promise} result
   */


  send({
    to,
    cc,
    bcc,
    replyTo,
    from,
    subject,
    text,
    html,
    attachments,
    templateID,
    sections,
    headers,
    categories,
    customAgrs,
    sendAt,
    batchID,
    asm,
    ipPoolName,
    mainSettings,
    trackingSettings
  }) {
    _assert.default.ok(to, 'recipients is required');

    _assert.default.ok(Array.isArray(to), 'recipients must be array');

    _assert.default.ok(from, 'sender email is required');

    _assert.default.ok(subject, 'subject is required');

    _assert.default.ok(text || html, 'body is required');

    if (cc) {
      _assert.default.ok(Array.isArray(cc), 'CC recipients must be array');
    }

    if (bcc) {
      _assert.default.ok(Array.isArray(bcc), 'BCC recipients must be array');
    }

    const body = {
      personalizations: [{
        to,
        cc,
        bcc
      }],
      subject,
      from,
      reply_to: replyTo,
      content: [],
      template_id: templateID,
      sections,
      headers,
      categories,
      custom_args: customAgrs,
      send_at: sendAt ? sendAt.getTime() : undefined,
      batch_id: batchID,
      asm,
      ip_pool_name: ipPoolName,
      mail_settings: mainSettings,
      tracking_settings: trackingSettings
    };

    if (text) {
      body.content.push({
        type: 'text/plain',
        value: text
      });
    }

    if (html) {
      body.content.push({
        type: 'text/html',
        value: html
      });
    }

    if (attachments) {
      body.attachments = attachments.map(({
        content,
        type,
        filename,
        disposition,
        contentID
      }) => {
        return {
          content: Buffer.from(content).toString('base64'),
          type,
          filename,
          disposition,
          content_id: contentID
        };
      });
    }

    return this.client.call(_client.POST, 'mail/send', {
      body
    });
  }

}

exports.Mail = Mail;