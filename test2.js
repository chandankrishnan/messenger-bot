'use strict';

const reminder = require('./model/ReminderModel').Reminder;
// const moment =require("moment");
// const WitCtrl=require('./controllers/witCtrl');
// const wit = WitCtrl.init();
const Session = require('./session');
// wit.interactive();


const createQuickReply = function (quickreply) {
    let result = [];
    quickreply.forEach(function (value, index) {

        let temp = {"content_type": "text"};
        result.push(temp);
    });
    return result;
}

const quickreply=['yes','no'];

var b=quickreply.map(function(x){
    return {
        "content_type": "text",
        "title": "Delete",
        "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
    }

});

console.log(b);


// console.log(a.length);