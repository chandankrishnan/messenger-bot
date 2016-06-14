'use strict';
var data={sessions:[],sessionId:''};

class Session {

    constructor(id) {
        data.sessionId=this.findOrCreate(id);
        console.log(data.sessions);
    }

    get()
    {
        return data.sessions;
    }

    sessionID()
    {
        return data.sessionId;
    }
    findOrCreate(id)
    {
        Object.keys(data.sessions).forEach(k => {
            if (data.sessions[k].fbid === id) {
                // Yep, got it!
                sessionId = k;
            }
        });
        if (!data.sessionId) {
            // No session found for user fbid, let's create a new one
            var sessionId = new Date().toISOString();
            data.sessions[sessionId] = {fbid: id, context: {}};
            console.log("new session created :" + JSON.stringify(data.sessions));
        }

        return sessionId;
    }
}

module.exports=Session;