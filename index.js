require('dotenv').config();
const packageInfo = require('./package.json');
require('./logger')(packageinfo.name, { id: process.env.log_webhook_id, token: process.env.log_webhook_token});

const DatabaseHandler = require('./databaseHandler');
const Database = new DatabaseHandler("database.sqlite");
const FeedListener = require("./feedListener");

console.log(`Starting ${packageInfo} v${packageInfo.version}`);
FeedListener(Database, { id: process.env.feed_webhook_id, token: process.env.feed_webhook_token });
