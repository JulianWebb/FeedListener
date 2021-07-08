const FeedHandler = require('./feedHandler');
const Discord = require('discord.js');

async function FeedListener(database, webhookAuth) {
    let webhook = new Discord.WebhookClient(webhookAuth.id, webhookAuth.token);
    
    let feeds = [];
    for (feedData of database.getFeeds()) {
        console.log(`Adding Feed '${feedData.name}' from Source: ${feedData.source}`);
        let feed = new FeedHandler(feedData.name, feedData.source);

        feed.on("newItem", function(latest) {
            webhook.send(`New Item from **${this.name}** named __${latest.title}__: <${latest.link}>`);
        });
        
        feeds.push(feed);
    }
}

module.exports = FeedListener;