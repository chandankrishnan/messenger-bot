'use strict';
let map =  new WeakMap();
var sessions=[];
var sessionId='';
class Session {

    constructor(id) {
        this.findOrCreate(id);
        console.log(id);
    }

    get()
    {
        return sessions;
    }

    findOrCreate(id)
    {
        Object.keys(sessions).forEach(k => {
            if (sessions[k].fbid === id) {
                // Yep, got it!
                sessionId = k;
            }
        });
        if (!sessionId) {
            // No session found for user fbid, let's create a new one
            let sessionId = new Date().toISOString();
            sessions[sessionId] = {fbid: sessionId, context: {}};
            console.log("new session created :" + JSON.stringify(sessions));
        }
    }
}

module.exports=Session;