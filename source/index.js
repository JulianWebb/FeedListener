require('dotenv').config();
const packageInfo = require('../package.json');
require('./logger')(packageInfo.name, { id: process.env.log_webhook_id, token: process.env.log_webhook_token});

const DatabaseHandler = require('./databaseHandler');
const Database = new DatabaseHandler("database.sqlite");
const FeedListener = require("./feedListener");

console.log(`Starting ${packageInfo.name} v${packageInfo.version}`);
try {
    FeedListener(Database, { id: process.env.feed_webhook_id, token: process.env.feed_webhook_token });
} catch (exception) {
    console.error(`<@${process.env.notify_id}> ${exception}`);
}

