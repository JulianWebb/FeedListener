const FeedHandler = require('./feedHandler');
const { WebhookClient } = require('discord.js');

async function FeedListener(database, webhookAuth) {
    let webhook = new WebhookClient(webhookAuth.id, webhookAuth.token);
    
    let feeds = [];
    for (feedData of database.getFeeds()) {
        console.log(`Adding Feed '${feedData.name}' from Source: ${feedData.source}`);
        try {
            let feed = new FeedHandler(feedData.name, feedData.source);

            feed.on("newItem", function(latest) {
                webhook.send(`New Item from **${this.name}** named __${latest.title}__: <${latest.link}>`);
            });

            feeds.push(feed);
        } catch (exception) {
            console.error(exception);
        }
    }
}

module.exports = FeedListener;