'use strict';
// var session         =     require('express-session');
// var redisStore      =     require('connect-redis')(session);
// var session         =     require('express-session');
// var cookieParser    =     require('cookie-parser');
// var redis           =     require("redis");

// app.use(session({
//     secret: 'ssshhhhh',
//     store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl :  260}),
//     saveUninitialized: false,
//     resave: false
// }));
// app.use(cookieParser("secretSign#143_!223"));

'use strict';
router.post('/webhook', (req, res) => {
    console.log("reached webhook");
    const data = req.body;

    if (data.object === 'page') {
        data.entry.forEach(entry => {
            entry.messaging.forEach(event => {
                if (event.message) {
                    const sender = event.sender.id;  //get sender id
                    // const sessionId = findOrCreateSession(sender);  //get user current session
                    const {text, attachments} = event.message;
                    if(text)
                    {
                        console.log('text message ' + text);
                        // create session and user if does not exist
                        findOrCreateSession(sender).then(function(sessionId){
                            runWitAction(sessionId,text);
                        });
                    }
                    else if(attachments)
                    {

                    }
                } else {
                    console.log('received event', JSON.stringify(event));
                }
            });
        });
    }
    res.sendStatus(200);
});