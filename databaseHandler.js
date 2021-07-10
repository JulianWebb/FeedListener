const SQLite3 = require('better-sqlite3');

class DatabaseHandler {
    constructor(path, options = {}) {
        this.database = new SQLite3(path, options);
        if (!this.tableExists("feeds")) {
            console.log("Creating Feeds Table in Database");
            this.database.prepare(`CREATE TABLE "feeds" (
                "id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
                "name"	TEXT NOT NULL,
                "source"	TEXT NOT NULL,
                "enabled"	INTEGER DEFAULT 0,
                "nsfw"	INTEGER DEFAULT 0,
                "type"	TEXT DEFAULT 'rss',
                "latest"	TEXT
            );`).run();
        }

        if (!this.tableExists("config")) {
            console.log("Creating Config Table in Database");
            this.database.prepare(`CREATE TABLE "config" (
                "index"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
                "key"	TEXT NOT NULL,
                "value"	TEXT DEFAULT ""
            );`).run();
        }
    }

    addFeed(name = "", source = "", options = {}) {
        if (name == "") throw { message: "Feed name not specified" };
        if (source == "") throw { mesasge: "Feed source not specified" };
        if (this.getFeedByName(name)) throw { message: "Feed name already in use" };

        options = {
            enabled: options.enabled || true,
            nsfw: options.nsfw || false,
            type: options.type || 'rss'
        }

        try {
            this.database.prepare(`INSERT INTO feeds (name, source, enabled, nsfw, type) 
                VALUES ('${name}', '${source}', '${options.enabled}', '${options.nsfw}', '${options.type}')`).run();
            return true;
        } catch( exception ) {
            if (exception instanceof SQLite3.SqliteError) {
                console.error(exception);
                throw { message: "Unexpected SQLite Error, see Error Logs"}
            } else {
                throw exception;
            }
        }
    }


    getFeedByName(name) {
        return this.database.prepare(`SELECT * FROM feeds WHERE name='${name}';`).get();
    }

    getFeedBySource(source) {
        return this.database.prepare(`SELECT * FROM feeds WHERE source='${source}';`).get();
    }

    getFeeds() {
        return this.database.prepare(`SELECT * FROM feeds;`).iterate();
    }

    getConfig(key) {}

    tableExists(table) {
        return this.database.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name='${table}';`).get()? true: false;
    }

    setLatest(feed, latest) {
        return this.database.prepare(`UPDATE feeds SET latest='${latest}' WHERE name='${feed}';`).run()? true: false;
    }

    getLatest(feed) {
        let statement = this.database.prepare(`SELECT latest FROM feeds WHERE name='${feed}'`);
        let result = statement.get();
        return result.latest;
    }
}

module.exports = DatabaseHandler;