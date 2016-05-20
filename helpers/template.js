var template={};

module.exports.welcome=function()
{
  var msg='Hi there, I did not find you in my contact,Will you be my frined ? Say yes so that i can assist you.' ;

  return {
    "attachment":{
    "type":"template",
    "payload":{
      "template_type":"button",
      "text":msg,
      "buttons":[
        {
          "type":"postback",
          "payload":"accept-friend-request",
          "title":"Accept"
        },
        {
          "type":"postback",
          "title":"Maybe, Later",
          "payload":"decline-friend-request"
        }
      ]
    }
  }
  }
}

module.exports.greeting=function()
{
  return 'Hi... I am your personal assistant';
}

module.exports.defaultMessage=function()
{
  return ' I did not get you ! ';
}

module.exports.accept_friend_request=function()
{
    return 'I can assist you on 1.Weather .for help say help ?';
}

module.exports.decline_friend_request=function()
{
    return 'Come back soon !';
}
