if (process.argv.length < 4) {
    console.log('Usage:', process.argv[0], process.argv[1], '<api-user> <api-key>');
    process.exit(1);
}

var sgapi = require('./sendgrid');

var sendgrid = new sgapi.Sendgrid(process.argv[2], process.argv[3], {debug: true});

sendgrid.newsletter.list(null, function(error, list) {
    console.log('newsletter.list', error, list);
});

//sendgrid.newsletter.lists.get('Auto Static 2', function(error, list) {
//    console.log('newsletter.lists.get', error, list);
//});
//
//sendgrid.newsletter.lists.email.get('Auto Static 2', null, function(error, list) {
//    console.log('newsletter.lists.email.get', error, list);
//});

sendgrid.invalidemails.get({}, function(error, emails) {
    console.log('invalidemails.get', error, emails);
});

sendgrid.bounces.get({}, function(error, emails) {
    console.log('bounces.get', error, emails);
});


