var express=require('express')
    ,router=express.Router(),
    request = require('request'),
    template=require('./../helpers/template'),
    graph = require('fbgraph'),
    token=process.env.PAGE_ACCESS_TOKEN.toString(),
    userList=require('./../models/users'),
    user=new userList();


graph.setAccessToken(token);

function postback(data,sender_id)
{

    var response=data.postback.payload.toString().trim().toLowerCase();
    console.log('inside postback ' + response);
  switch(response)
  {
    case 'accept-friend-request':
          console.log('accept-friend-request payload fired ');
          sendMessage(sender_id,template.accept_friend_request());
          break;
    case 'decline-friend-request':
        console.log('decline friend request');
          sendMessage(sender_id,template.decline_friend_request())
          break;
  }
}

function message(data,sender_id)
{
    var text=data.message.text.toLowerCase();

    switch(text)
    {
        case 'hi':
            sendMessage(sender_id,template.welcome());
            break;
        case 'testpostback':
            sendMessage(sender_id,'your answer recived');
            break;

    }
}

function defaultMessage(_id)
{
  sendMessage(_id, template.defaultMessage());
}

function isPostback(event)
{
//skip user registration check on accepting and rejecting friend request
    if(event.postback && event.postback.payload != ""){
        console.log('this is postback request');
       return true;
    }
    return false;
}

function isMessage(event)
{
    if( event.message && event.message.text){
console.log('message detected');
        return true;
    }
    return false;

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
        console.log( event);
        if(isPostback(event))
        {
            postback(event,event.sender.id);
        }
        else if(isMessage(event))
        {
            message(event,event.sender.id);
        }
    }
    res.sendStatus(200);
});



//user exist in database
user.once('user-exist', function () {
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
