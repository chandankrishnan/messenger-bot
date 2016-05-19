var express = require('express')
    , router = express.Router(),
    request = require('request'),
    template = require('./../helpers/template'),
    graph = require('fbgraph'),
    //token = process.env.PAGE_ACCESS_TOKEN.toString(),
    token='EAAJiekb5XukBAFDZA01x8HkufiGQIiF5vZAdMi8QuwXIhaw3JuwTA6IoeMIKvZAZBvSlEeb66UBrtBd9sKTsIBfxGllEOVGPB3N3eiY0OC4Xnnvw4W1z5z6Hx3I4OcVvBu6ZB8bFZBHcr5TZBCfDZCzggmCPV56n6knEBBEuSfdl4wZDZD',
    userList = require('./../models/users'),
    user = new userList();


graph.setAccessToken(token);

// handle postback request form messenger
function postback(data,_sender_id) {


    var response = data.postback.payload.toString().trim().toLowerCase(),
        sender_id=_sender_id.toString();

    console.log('inside postback ' + response);
    switch (response) {
        case 'accept-friend-request':
            console.log('accept-friend-request payload fired  ' + sender_id);
            sendMessage(sender_id, 'Thanks for accepting frined request.',true);
            break;
        case 'decline-friend-request':
            console.log('decline friend request');
            sendMessage(sender_id,'See you soon !',true);
            break;
    }
}

//handle message received event.
function messageReceive(data,sender_id) {
    console.log('inside message received')
    var text = data.message.text.toLowerCase();

    switch (text) {
        case 'hi':
            sendMessage(sender_id, template.welcome());
            break;
        case 'testpostback':
            sendMessage(sender_id, "your answer rddecived");
            break;

    }
}

//handle delivery report event.
function deliveryReport(data,sender_id) {
    console.log('ibside delivery report');
    console.log('delivery report recived');
    console.log(data);
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
function sendMessage(recipientId, data,isText) {
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
        console.log('message body' + JSON.stringify(body));
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
            console.log('delivery detected');
            deliveryReport(event, event.sender.id.toString());
        }
        else if (isPostback(event)) {
            console.log('postback detected');
            sendMessage(event.sender.id.toString(), 'get well soon!');
            postback(event, event.sender.id.toString());
        }
        else if (isMessageReceive(event)) {
            console.log('message recived detected');
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
