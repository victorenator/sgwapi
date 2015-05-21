/* global process */

if (process.argv.length < 4) {
    console.log('Usage: DEBUG=sgwapi %s %s <api-user> <api-key>', process.argv[0], process.argv[1]);
    process.exit(1);
}

var sgapi = require('./sendgrid');

var sendgrid = new sgapi.Sendgrid(process.argv[2], process.argv[3]);

//sendgrid.newsletter.list(null, function(error, list) {
//    console.log('newsletter.list', error, list);
//});

//sendgrid.newsletter.lists.get('Auto Static 2', function(error, list) {
//    console.log('newsletter.lists.get', error, list);
//});
//
//sendgrid.newsletter.lists.email.get('Auto Static 2', null, function(error, list) {
//    console.log('newsletter.lists.email.get', error, list);
//});

//sendgrid.invalidemails.get({}, function(error, emails) {
//    console.log('invalidemails.get', error, emails);
//});

//sendgrid.bounces.get({}, function(error, emails) {
//    console.log('bounces.get', error, emails);
//});

sendgrid.mail.sendMsg({
    to: {
        email: 'vic@itteco.com',
        name: 'Vic'
    },
    cc: {
        email: 'vic+cc@itteco.com',
        name: 'Vic CC'
    },
    from: {
        email: 'vic@loftery.com',
        name: 'Vic'
    },
    subject: 'Test Message',
    text: 'TestMessage\n',
    html: '<p>TestMessage<p>\n',
    replyto: 'no-reply@loftery.com',
    date: new Date(),
    attachments: [
        {
            filename: 'abc.txt',
            content: 'abc\n',
            contentType: 'text/plain'
                    
        }
    ],
    headers: {
        'X-Order-ID': '432432'
    }
}, function(error, data) {
    console.log(error, data);
});


