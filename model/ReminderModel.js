'use strict';
const redis=require('./../redisDB');
const client=redis.client;

//totalReminder (string ) // store total reminder count
//user:fbid:reminders ( set) // stores all reminders id for that fbid
//reminder:id ( hash) // store reminder information for every id


//constructor 
function Reminder()
{
    
}

// Save reminder in Redis
// @param fbid (mixed) - Facbook ID treated as ID
// @param data (array) - data[title] is title for reminder
//                      data[date] is the date of reminder
//                      data[duration] is the duration of reminder
//@parma cb (callback) - callback
//@return cb() - The callback

Reminder.prototype.create=function(fbid,data,cb)
{
    let Reminderkey="user:" + fbid + ":reminders";
    let multi =client.multi();
    console.log("creating reminder");
    client.incrAsync("totalReminders").then(function(totalCount){
            //user uncompleted reminder list
            multi.sadd("reminders:uncompleted:"+fbid,totalCount);

            // keep all the reminder in one sorted set for alaram
            multi.zadd("reminders",data['score'],totalCount,client.print);

            // add reminder in sorted list with date diff as secodary index
            multi.zadd("reminder:"+totalCount,data['score'],data['title'],client.print);

            // ADD REMINDER INFORMATION IN SEPERATE REMINDER LIST FOR EACH REMINDER
            // multi.hmset(["reminder:"+totalCount,'title',data['title'], 'date',data['date'],'duration',data['duration']],client.print);
            multi.exec(function (err, replies) {
                console.log("Reply :" + replies);
                if(!err) cb(null,replies);
                else cb(err,null);
             });
    },function(err){
        console.log("err " + err);
        cb(err,null);
    });
};

Reminder.prototype.get=function(fbid,reminder)
{
    client.smembers("user:reminders:"+fbid,function(ids){
        client.s
    });
};

exports.Reminder=new Reminder();