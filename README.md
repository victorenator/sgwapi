# Sendgrid Web API #

## License ##
MIT


## Install ##
```bash
npm install sgwapi
```


## Modules ##
- Suppressions
- Mail
- Marketing


## Usage ##
```js
import {Mail} from 'sgwapi/mail';

const mail = new Mail('api_key');

await mail.send(args...);
```
