require('dotenv').config();
require('./logger')("FeedListener", { id: process.env.log_webhook_id, token: process.env.log_webhook_token});

const DatabaseHandler = require('./databaseHandler');
const Database = new DatabaseHandler("database.sqlite");
const FeedListener = require("./feedListener");

console.log("Starting");
FeedListener(Database, { id: process.env.feed_webhook_id, token: process.env.feed_webhook_token });
