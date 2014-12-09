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

sendgrid.mail.send(['abc@example.com'], ['First Last'], {unique_args: {message_id: '143432432'}}, 'def@example.com', 'A GA', 'Test Att', 'Test Attachment', '<p>Test Attachment</p>', null, null, {'Message-ID': '<143432432@example.com>'}, null, function(error, data) {
    console.log(error, data);
});


