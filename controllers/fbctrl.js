var express = require('express')
    , router = express.Router(),
    request = require('request'),
    template = require('./../helpers/template'),
    graph = require('fbgraph'),
    token = process.env.PAGE_ACCESS_TOKEN.toString(),
    //token='EAAJiekb5XukBAFDZA01x8HkufiGQIiF5vZAdMi8QuwXIhaw3JuwTA6IoeMIKvZAZBvSlEeb66UBrtBd9sKTsIBfxGllEOVGPB3N3eiY0OC4Xnnvw4W1z5z6Hx3I4OcVvBu6ZB8bFZBHcr5TZBCfDZCzggmCPV56n6knEBBEuSfdl4wZDZD',
    userList = require('./../models/users'),
    user = new userList(),
    wit=require('./../api/wit')


graph.setAccessToken(token);

// handle postback request form messenger
function postback(data,_sender_id,cb) {


    var response = data.postback.payload.toString().trim().toLowerCase(),
        sender_id=_sender_id.toString();

    console.log('inside postback ' + response);
    switch (response) {
        case 'accept-friend-request':
            sendMessage(sender_id, 'Thanks for accepting frined request.',true,function(data,error){
                if(typeof cb=='function') cb();
            });
            break;
        case 'decline-friend-request':
            sendMessage(sender_id,'See you soon !',true);
            break;
    }
}

//handle message received event.
function messageReceive(data,sender_id,cb) {
    cb="a";
    console.log('inside message received')
    var text = data.message.text.toLowerCase();

    switch (text) {
        case 'hi':
            sendMessage(sender_id, template.welcome(),true,function(data,error){
                if(typeof cb=='function') cb();
            });
            break;
        case 'testpostback':
            sendMessage(sender_id, "your answer rddecived");
            break;

        default:
            console.log('calling wit');
            witCtrl(text,sender_id);
            break;

    }
}

//handle delivery report event.
function deliveryReport(data,sender_id) {

}

function witCtrl(text,sender_id)
{
    wit.message(text,function(data,err) {
        var msg="";
        console.log(data);
        if(typeof data.reminder != 'undefined') msg  = msg + " TASK IS :" + data.reminder[0].value;
        if(typeof data.duration != 'undefined') msg  = msg + " DURATION IS :" + data.duration[0].normalized.value + data.duration[0].unit ;
        if(typeof data.location != 'undefined') msg  = msg + " LOCATION IS :" + data.location[0].value ;
        if(typeof data.datetime != 'undefined') msg  = msg + " TIME IS :" + data.datetime[0].value ;
        console.log(msg);
        sendMessage(sender_id,msg,true,function(){
            console.log('message sent with WIT.AI ' + msg);
        })
    });
}

//check weather request is postback request or not
function isPostback(event) {
    return event.postback && event.postback.payload != "" && !event.message;
}
//check weather request is message recived or not
function isMessageReceive(event) {
    return event.message && event.message.text && !event.postback;
}
//check weather request is  delivery report
function isDeliveryReport(event) {
    return event.delivery ? true : false;
}

// generic function to send message
function sendMessage(recipientId, data,isText,cb) {
    var payload = {};
    payload = data;

    if(isText) {
        payload = {
            text: data
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: token},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: payload,
        }
    }, function (error, response, body) {
        if(typeof cb=='function') cb(response);
        if (error) {
            console.log('Error sending message: ', error);

        } else if (response.body.error) {
            console.log('Error: ', response.body);
        }
    });
};

// Facebook Webhook
router.get('/webhook', function (req, res) {
    console.warn('authentication called');
    if (req.query['hub.verify_token'] === 'testbot_verify_token') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});


// middleware to receive fb hooks
router.post('/webhook', function (req, res) {

    var events = req.body.entry[0].messaging;

    for (i = 0; i < events.length; i++) {
        var event = events[i];
        console.log(event);
        if (isDeliveryReport(event)) {
            deliveryReport(event, event.sender.id.toString());
        }
        else if (isPostback(event)) {
            postback(event, event.sender.id.toString());
        }
        else if (isMessageReceive(event)) {
            messageReceive(event, event.sender.id.toString());

        }
    }
    res.sendStatus(200);
});


//user exist in database
user.once('user-exist', function () {
    console.log('user exist fired');
    sendMessage(_id, template.welcome());
});

//user not exist in database
user.once('user-not-exist', function (_id) {
    console.log('user not found event fired');

    graph.get(_id, function (err, res) {
        sendMessage(_id, template.welcome(res.first_name + ' ' + res.last_name));
    });
});

module.exports = router;
