'use strict';

class Session
{
    constructor(id)
    {
        this.sessions={};
        this.sessionId='';
        this.findOrCreate(id);
    }
    get sessionId()
    {
        return this.sessionId;
    }

    get sessions(){
        return this.sessions;
    }
    findOrCreate(id)
    {
        let sessionId=this.sessionId;

        Object.keys(sessions).forEach(k => {
            if (sessions[k].fbid === id) {
                // Yep, got it!
                sessionId = k;
            }
        });
        if (!sessionId) {
            // No session found for user fbid, let's create a new one
            sessionId = new Date().toISOString();
            this.sessions[sessionId] = {fbid: sessionId, context: {}};
            console.log("new session created :" + JSON.stringify(this.sessions));
        }
    }
}

exports.module=Session;