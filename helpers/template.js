var template={};

module.exports.welcome=function(name)
{
  var msg='Hi there,' + name + 'I did not find you in my contact,Will you be my frined ? Say yes so that i can assist you.' ;

  return {
    "attachment":{
    "type":"template",
    "payload":{
      "template_type":"button",
      "text":msg,
      "buttons":[
        {
          "type":"postback",
          "payload":"accept-request",
          "title":"Accept"
        },
        {
          "type":"postback",
          "title":"Maybe, Later",
          "payload":"decline-request"
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
