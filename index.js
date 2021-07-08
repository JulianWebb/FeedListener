require('dotenv').config();
require('./logger')();

const DatabaseHandler = require('./databaseHandler');
const Database = new DatabaseHandler("database.sqlite");
const FeedListener = require("./feedListener");

console.log("Starting Feed Listener");
FeedListener(Database, { id: process.env.feed_webhook_id, token: process.env.feed_webhook_token });
