const EventEmitter = require('events');
const Parser = require('rss-parser');


class FeedHandler extends EventEmitter {
    constructor(name, source, interval = 43200000) {
        super();
        this.name = name;
        this.source = source;
        this.interval = interval; // Default: 12 hours
        this.parser = new Parser();
        this.latest = {};

        this.parseFeed();
        this.setInterval = setInterval(this.parseFeed, this.interval);
    }

    parseFeed() {
        console.log(`Checking '${this.name}' for new items`)
        this.parser.parseURL(this.source, (error, feed) => {
            if (error) return console.error(this.name + " " + error);
            if (feed.items[0].title == this.latest.title) return;
            this.latest = feed.items[0];
            this.emit("newItem", this.latest);
        })
    }
}

module.exports = FeedHandler;
