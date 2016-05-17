var express=require('express')
    ,router=express.Router()
    ,request = require('request')
    ,template=require('./../helpers/template')
    ,user=require('./../models/users.js')
    ,graph = require('fbgraph')
    // token='EAAJiekb5XukBAI6xUJozjqSN2M4ZBct5BU5zj4PLCkzdcMZCXbSFF9lreWdsa3ZBt0dzfwU9RLtlh7VH9lnlsI3R1ZAQg9x96KTXtUf6lSoC5obOg2AnAjQsmVbD19MrLIul80E7IwgTNA8CQZBizBUf8Fx7ZBRKF1jZAliYakf0QZDZD'
    ,token=process.env.PAGE_ACCESS_TOKEN.toString()


graph.setAccessToken(token);

// Facebook Webhook
router.get('/webhook', function (req, res) {
  console.warn('authentication called');
    if (req.query['hub.verify_token'] === 'testbot_verify_token') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});

router.post('/webhook', function (req, res)
{

    var events = req.body.entry[0].messaging;

    for (i = 0; i < events.length; i++)
    {
        var event = events[i];
        if (event.message && event.message.text)
        {
          user.check(event.sender.id.toString());
          switch(event.message.text.toLowerCase())
          {
            case 'hi':
              user.check(event.sender.id.toString());
              break;
            default:
              user.check(event.sender.id.toString());
              break;
          }

        }
    }
    res.sendStatus(200);
});


// generic function sending messages
function sendMessage(recipientId, text) {
  messageData = {
      text: text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: token},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: messageData.text,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};

//user exist in database
user.on('user-exist', function () {
    console.log('user exist fired');
      sendMessage(_id, template.welcome());
})

//user not exist in database
user.once('user-not-exist', function (_id) {
  console.log('user not found event fired');

  graph.get(_id, function(err, res){
      sendMessage(_id, template.welcome(res.first_name + ' ' +res.last_name));
  });
});

module.exports=router;
