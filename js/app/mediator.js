define(function(require) {

    var _ = require('underscore');

    var instance = null;
    function Mediator () {
        // if (instance !== null) {
        //     console.error("can't instantiate more than one Mediator, use Mediator.getInstance()");
        // }
    }

    Mediator.prototype = {
        channels: [],

        subscribe: function(channel, fn, inFile) {
            if(!this.channels[channel]) {
                this.channels[channel] = [];
            }
            this.channels[channel].push({
                context: this,
                callback: fn
            });
            if(inFile)
                console.info(channel + " subscription in " + inFile);
        },

        publish: function(channel, args, inFile) {
            if (!this.channels[channel]) {
                console.warn("Mediator warning! Channel has no subscribers: ", "'"+channel+"'", "in file: ", inFile);
                return false;
            }
            var args = Array.prototype.slice.call(arguments, 1);
            _.each(this.channels[channel], function(value, key, list){
                var subscription = this.channels[channel][key];
                subscription.callback.apply(subscription.context, args);
            }, this);

            if(inFile)
                console.info(channel + " publish in " + inFile);
        }
    }

    Mediator.getInstance = function() {
        // gets the instance of the Meditator, singleton
        if (instance === null) {
            instance = new Mediator();
        }
        return instance;
    }

    return Mediator.getInstance();

});
