const { WebhookClient } = require('discord.js');

function timestamp() {
    let now = new Date();
    let hour = now.getHours();
    let minute = now.getMinutes();
    let stringHour = hour > 9? hour: `0${hour}`;
    let stringMinute = minute > 9? minute: `0${minute}`;
    return `[${stringHour}:${stringMinute}]`;
}

module.exports = function(appName, webhookAuth){
    let webhook = webhookAuth? new WebhookClient(webhookAuth.id, webhookAuth.token): undefined;
    let builtins = {
        log: console.log,
        warn: console.warn,
        error: console.error
    }

    for (let printFunction in builtins) {
        console[printFunction] = function() {
            let prefix = timestamp() + (appName? `[${appName}]`: '') + `[${printFunction.toUpperCase()}]`;
            builtins[printFunction].apply(console, [prefix, ...arguments]);
            if (webhook) {
                let message = [...arguments].reduce((accumulator, current) => {
                    return accumulator + current.toString() + "      ";
                }, "").trim();

                webhook.send(`\`${prefix} ${message}\``);
            }
        }
    }
}
