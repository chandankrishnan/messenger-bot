'use strict';
const wit=require('node-wit').Wit;

const client = new wit({accessToken: 'OZLBH427SKNI7RC6Y6SUWBLDLHVCMUGG'});

var Wit=function(message,cb1)
{
    console.log('reached inside Wit Controller ' + message);
    const messageObject={};
    messageObject.entities=function(entities) {
        return entities;
    };

    client.message(message, {})
      .then((res) => { 
          console.log('wit callback recived ' + res);           
            return cb1(messageObject.entities(res.entities));  
     });
}



exports.Wit=Wit;