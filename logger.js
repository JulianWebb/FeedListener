const Discord = require('discord.js');

module.exports = function(){
    let webhook = new Discord.WebhookClient(process.env.log_webhook_id, process.env.log_webhook_token)
    let builtins = {
        log: console.log,
        warn: console.warn,
        error: console.error
    }

    console.log = function() {
        builtins.log.apply(console, arguments);
        if (process.env.log_webhook) {
            let message = [...arguments].reduce((accumulator, current) => {
                return accumulator + current.toString() + "      ";
            }, "");
            webhook.send(`LOG: ${message}`);
        }
    }

    console.warn = function() {
        builtins.warn.apply(console, arguments);
        if (process.env.log_webhook) {
            let message = [...arguments].reduce((accumulator, current) => {
                return accumulator + current.toString() + "      ";
            }, "");
            webhook.send(`WARN: ${message}`);
        }
    }

    console.error = function() {
        builtins.error.apply(console, arguments);
        if (process.env.log_webhook) {
            let message = [...arguments].reduce((accumulator, current) => {
                return accumulator + current.toString() + "      ";
            }, "");
            webhook.send(`ERROR: ${message}`);
        }
    }
}