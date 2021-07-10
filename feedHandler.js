const EventEmitter = require('events');
const Parser = require('rss-parser');

function millisecondsTilNextHour() {
    const now = new Date();
    const then = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1);
    return then - now;
}

class FeedHandler extends EventEmitter {
    constructor(name, source, initialItem = {}, interval = 3600000) {
        super();
        if (!name) throw("Name Argument Required");
        this.name = name;
        if (!source) throw("Source Argument Required");
        this.source = source;

        this.interval = interval; // Default: hourly
        this.parser = new Parser();

        this.getLatestItem((item) => {
            this.latest = item.name == initialItem.name? item: initialItem;
            this.getNewItems(this.emitItems);
        });
        
        setTimeout(() => {
            this.getNewItems(this.emitItems);

            this.setInterval = setInterval(()=> { 
                this.getNewItems(this.emitItems)
            }, this.interval);
        }, millisecondsTilNextHour());
        
    }

    getLatestItem(callback) {
        this.parser.parseURL(this.source, (error, feed) => {
            if (error) return console.error(error);
            let items = feed.items[0].pubDate? this.sortItems(feed.items): feed.items;
            callback(items[0]);
        })
    }

    getNewItems(callback) {
        console.log(`Checking '${this.name}' for new items`)
        this.parser.parseURL(this.source, (error, feed) => {
            if (error) return console.error(this.name + " " + error);
            
            // Most feeds have the lastest on top... some don't
            // For some reason pubDate is an optional field per the Specification
            let items = feed.items[0].pubDate? this.sortItems(feed.items): feed.items;
            if (items[0].title == this.latest.title) return;
            let newItems = [];
            for (let item of items) {
                if (item.title == this.latest.title) break;
                newItems.push(item);
            }
            this.latest = items[0];
            
            callback(newItems.reverse());
        })
    }

    sortItems(items) {
        return items.sort((itemA, itemB) => {
            let publishDateA = new Date(itemA.pubDate);
            let publishDateB = new Date(itemB.pubDate);
            // Sort works by swapping based on the return
            // -1 for b,a order
            // 0+ for a,b order
            // Why they could just do a boolean like normal I have no idea
            return -1*(publishDateA > publishDateB)
        })
    }

    emitItems(items) {
        items.forEach((item) => {
            this.emit("newItem", item)
        })
    }
}

module.exports = FeedHandler;
