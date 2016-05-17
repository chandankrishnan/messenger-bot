var template={};

module.exports.greeting=function(name)
{
  var msg= 'I didnt find you in my contact,Will you be my frined ? Say yes so that i can assist you.' ;

  return {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "Hi " + name,
            "subtitle":msg,
            "image_url": "https://scontent-sin1-1.xx.fbcdn.net/v/t1.0-9/13254203_1620195691639070_1642249843527728635_n.png?oh=54033446313d56417bd76a055184922c&oe=57E2EC7D",
            "buttons": [{
              "type": "postback",
              "payload": "accept-friend-request",
              "title": "Friends"
            }, {
              "type": "web_url",
              "url":"www.google.com",
              "title": "T&C",
            }],
          }]
        }
      }
    };
}
