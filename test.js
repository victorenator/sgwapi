if (process.argv.length < 4) {
    console.log('Usage:', process.argv[0], process.argv[1], '<api-user> <api-key>');
    process.exit(1);
}

var sgapi = require('./sendgrid');

var sendgrid = new sgapi.Sendgrid(process.argv[2], process.argv[3], {debug: true});

//sendgrid.newsletter.list(null, function(error, list) {
//    console.log('newsletter.list', error, list);
//});

sendgrid.newsletter.lists.get('Auto Static 2', function(error, list) {
    console.log('newsletter.lists.get', error, list);
});

sendgrid.newsletter.lists.email.get('Auto Static 2', null, function(error, list) {
    console.log('newsletter.lists.email.get', error, list);
});


sendgrid.newsletter.recipients.add('Auto Newsletter 1', 'Auto Static 2', function(error, list) {
    console.log('newsletter.recipients.add', error, list);
    sendgrid.newsletter.recipients.get('Auto Newsletter 1', function(error, list) {
        console.log('newsletter.recipients.get', error, list);
    });
});
