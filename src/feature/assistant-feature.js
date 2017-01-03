const _ = require('lodash'),
    SlackService = require('../interface/slack-service');


class AssistantFeature {

    /**
    *   Override if needed
    */
	static getId(interfaceType, channelOrImId) {
        // string, The ID of this type of FSM.
        // You can concat the cannelOrImId to be able to run multiple FSM on differents channels or IMs.
        return this.prototype.constructor.name + '-' + interfaceType + '-' + channelOrImId;
	}

    /**
    *   Override to add your own trigger keywords
    */
	static getTriggerKeywords() {
        // Array of string that will trigger the FSM to start
		throw new TypeError("Not implemented, please implement this function in sub class");
	}

    /**
    *   Override to add the description of the feature this class provide
    */
    static getDescription() {
        // Array of string that will trigger the FSM to start
        throw new TypeError("Not implemented, please implement this function in sub class");
    }

    /**
    *   Override if needed
    */
	static getTTL() {
		// In seconds
        return 0;
	}
    
    static canHandle(message) {
        return _.some(this.getTriggerKeywords(), function(keyword) {
            return new RegExp(keyword, 'i').test(message);
        });
    }

    static getCache() {
        if(!this.cache) {
            this.cache = require('memory-cache');
        }
        return this.cache;
    }



    constructor(interfac, context, id) {
	    // context is : 
	    // { 
	    //  userId: xxx, // the user who launched the fsm
        //  channelId: xxx, // the channel where the fsm was launched
        //  interfaceType: im|channel // The interface type where the feature was initialy launched
	    //  model: {
	    //    currentPlayer: -1|1
	    //    game: [[],[],[]]
	    //  }
	    // }
        this.initAssistantFeature(interfac, context, id);
    }

    initAssistantFeature(interfac, context, id) {
        this.interface = interfac;
        this.id = id;
        this.context = context;

        this.resetTtl();
    }

    canTriggerEvent(name) {
        return (this.transitions().indexOf(name) !== -1 || name === 'end') && this.can(name);
    }

    onenterstate(event, from, to) {
        // generic function for every states
        console.log('enter state event=' + event + ', from=' + from + ', to=' + to);
    }

    onbeforeevent(event, from, to) {
        // generic function for every events
        console.log('event event=' + event + ', from=' + from + ', to=' + to);
    }


    send(message, channelId) {
        var toSend = '';
        if(_.isArray(message)) {
            toSend = message.join('\n');
        }
        else {
            toSend = message;
        }
        this.interface.send(channelId || this.context.channelId, toSend);
    }

    clearCache() {
        this.constructor.getCache().del(this.id);
    }

    resetTtl() {
        if(this.constructor.getTTL() > 0) {
            this.constructor.getCache().del(this.id);
            this.constructor.getCache().put(this.id, this, this.constructor.getTTL() * 1000, () => {
                // In case of timeout this function is called
                if(this.canTriggerEvent('end')) {
                    this.end();
                }
            });
        }
    }

    handle(message, context) {
        this.resetTtl();

/*
        // TODO lister les transitions possibles
        console.log(this.transitions());
        this.send("Je n'ai pas compris votre réponse");
        if(this.transitions().indexOf('yes') != -1 
            && this.transitions().indexOf('no') != -1) {
            this.send('Vous devez répondre par oui ou par non');
        }
        return false;*/
    }

	
}

module.exports = AssistantFeature;
