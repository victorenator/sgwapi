#!/usr/bin/env -S node

import {Suppressions} from './suppressions.js';
import {Mail} from './mail.js';

if (process.argv.length < 3) {
    console.log('Usage: DEBUG=sgwapi %s %s <key>', process.argv[0], process.argv[1]);
    process.exit(1);
}

const key = process.argv[2];
const suppressions = new Suppressions(key);
const mail = new Mail(key);

async function main() {
    console.log('list blocks');
    console.table(await suppressions.blocks.list());

    console.log('list bounces');
    console.table(await suppressions.bounces.list());

    console.log('get bounces');
    console.log(await suppressions.bounces.get('test@mail.com'));

    console.log('list invalid emails');
    console.table(await suppressions.invalidEmails.list());

    await mail.send({
        from: {email: 'from@example.com', name: 'From'},
        to: [
            {email: 'to@example.com', name: 'To'}
        ],
        cc: [
            {email: 'cc@example.com', name: 'Cc'}
        ],
        subject: 'Test Message',
        text: 'TestMessage\n',
        html: '<p>TestMessage<p>\n',
        replyTo: {email: 'no-reply@example.com'},
        attachments: [
            {filename: 'abc.txt', content: 'abc\n', type: 'text/plain'}
        ],
        headers: {
            'X-Order-ID': '432432'
        }
    });
}

main().catch(console.error);
