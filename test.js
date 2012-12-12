if (process.argv.length < 4) {
    console.log('Usage:', process.argv[0], process.argv[1], '<api-user> <api-key>');
    process.exit(1);
}

var sgapi = require('./sendgrid');

var sendgrid = new sgapi.Sendgrid(process.argv[2], process.argv[3]);

sendgrid.newsletter.list(null, function(error, list) {
    console.log('newsletter.list', error, list);
});
