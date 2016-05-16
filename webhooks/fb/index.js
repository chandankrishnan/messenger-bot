var express=require('express')
    ,router=express.Router(),
    request = require('request'),
    template=require('./template'),
    graph = require('fbgraph')

var token='EAAJiekb5XukBAB68NX591UdYJzTBS0NU6rpOCiYKjyKdaD7jmvObBIZBwduUgOyEzfLf3sCWF2E3qbGZA1skWRQh0z00BtoTbsjiQkpi5QzTHI8ppLdgEprZBZB7sUU1tExzQlTCZBwUM3xEMxA97WMJZB8pa5zbnG78ytbhYbrwZDZD';

graph.setAccessToken(process.env.PAGE_ACCESS_TOKEN);
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
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text)
        {
          switch(event.message.text.toLowerCase())
          {
            case 'hi':
              sendMessage(event.sender.id, {text: template.greeting('Dear')});
              break;
            default:
              sendMessage(event.sender.id, {text: 'this is default message'});
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

function getName(_id){
  graph.get(_id, function(err, res)
  {
    console.log('name fetched ' + JSON.stringify(res))
    return res;
  });
}
module.exports=router;
