const _ = require('lodash'),
    debug = require('debug')('virtual-assistant:statistics-service'),
    Database = require('./database-service');

const defaultEvents = {
    FEATURE_LAUNCH: 'FEATURE_LAUNCH'
};

class StatisticsService {

    static register() {
        debug('register', arguments)
        _.forEach(arguments, (e) => {
            var eventName = e;
            if(!_.isArray(e)) {
                eventName = [e];
            }
            eventName.forEach((ev) => {
                let toAdd = {};
                toAdd[ev] = ev;
                this.events = _.merge(this.events, toAdd);
            })
        });
    }

    static get events() {
        return this._events || defaultEvents;
    }
    static set events(ev) {
        this._events = ev;
    }

    static event(eventName, event) {
        if(!this.events[eventName]) {
            debug('Error: No event found for name [%s], you have to register it first calling register function', eventName);
            return;
        }
        let toSave = {eventName: eventName.toLowerCase(), date: new Date(), event: event};
        Database.collection('statistics').create(toSave);
    }

}

module.exports = StatisticsService;