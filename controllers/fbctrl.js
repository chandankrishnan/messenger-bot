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
//user exist in database
user.on('user-exist', function () {
    console.log('user exist');
})

//user not exist in database
user.on('user-notexist', function () {
    console.log('User not exist');
});

//find user exist in database or not
router.post('/getuser',function(req,res){
  var events=req.body.entry[0].id
  console.log(events);
  user.getUser(events,function(err,data){
    if(err){
      res.send(err);
    }else{
      res.send(data);
    }
  })
});

router.post('/webhook', function (req, res)
{

    var events = req.body.entry[0].messaging;

    for (i = 0; i < events.length; i++)
    {
        var event = events[i];
        if (event.message && event.message.text)
        {
          switch(event.message.text.toLowerCase())
          {
            case 'hi':

            graph.get(event.sender.id.toString(), function(err, res){
              sendMessage(event.sender.id, {text: template.greeting(res.first_name + ' ' + res.last_name)});
            });

              break;
            default:
              sendMessage(event.sender.id, {text: 'this is default message'});
              break;
          }

        }
    }
    res.sendStatus(200);
});

router.get('/testhook',function(req,res){
  graph.get(process.env.sender_id, function(err, res){
    sendMessage(process.env.sender_id, {text: template.greeting(res.first_name + ' ' + res.last_name)});
  });
});

function newUser()
{

}

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


module.exports=router;
