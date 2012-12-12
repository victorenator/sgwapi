# Sendgrid Web API #

## License ##
MIT


## Install ##

npm install sgwapi


## Modules ##
- mail
- newsletter


## Usage ##

var sgwapi = require('sgwapi');

var sg = new sgwapi.Sendgrid('api_user', 'api_key');

sg.mail.send(args...);