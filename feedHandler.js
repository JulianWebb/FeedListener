const EventEmitter = require('events');
const Parser = require('rss-parser');


class FeedHandler extends EventEmitter {
    constructor(name, source, interval = 360000) {
        super();
        if (!name) throw("Name Argument Required");
        this.name = name;
        if (!source) throw("Source Argument Required");
        this.source = source;

        this.interval = interval; // Default: hourly
        this.parser = new Parser();
        this.getLatestItem((item) => {
            this.latest = item;
        });
        
        this.setInterval = setInterval(()=> { 
            this.getNewItems(items => {
                items.forEach((item) => {
                    this.emit("newItem", item)
                })
            })
        }, this.interval);
    }

    getLatestItem(callback) {
        this.parser.parseURL(this.source, (error, feed) => {
            if (error) return console.error(error);
            callback(feed.items[0]);
        })
    }

    getNewItems(callback) {
        console.log(`Checking '${this.name}' for new items`)
        this.parser.parseURL(this.source, (error, feed) => {
            if (error) return console.error(this.name + " " + error);
            if (feed.items[0].title == this.latest.title) return;
            let newItems = [];
            for (let item of feed.items) {
                if (item.title == this.latest.title) break;
                newItems.push(item);
            }
            this.latest = feed.items[0];
            
            callback(newItems.reverse());
        })
    }
}

module.exports = FeedHandler;
