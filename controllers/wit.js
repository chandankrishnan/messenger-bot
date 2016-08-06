'use strict';
const wit=require('node-wit').Wit;

const client = new wit({accessToken: 'OZLBH427SKNI7RC6Y6SUWBLDLHVCMUGG'});

var Wit=function(message,cb1)
{
    const messageObject={};
    var cb=cb1;
    messageObject.entities=function(entities) {
        return entities;
    };

    client.message('what is the weather in London?', {})
      .then((res) => {            
            return cb1(messageObject.entities(res.entities));
            
        });
}



exports.Wit=Wit;