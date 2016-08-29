'use strict';
// const redis=require('./../redisDB');
// const client=redis.client;
//
// //totalReminder (string ) // store total reminder count
// //user:fbid:reminders ( set) // stores all reminders id for that fbid
// //reminder:id ( hash) // store reminder information for every id
//
//
// //constructor
// function Reminder()
// {
//
// }
//
// // Save reminder in Redis
// // @param fbid (mixed) - Facbook ID treated as ID
// // @param data (array) - data[title] is title for reminder
// //                      data[date] is the date of reminder
// //                      data[duration] is the duration of reminder
// //@parma cb (callback) - callback
// //@return cb() - The callback
//
// Reminder.prototype.create=function(fbid,data,cb)
// {
//     let Reminderkey="user:" + fbid + ":reminders";
//     let multi =client.multi();
//     console.log("creating reminder");
//     client.incrAsync("totalReminders").then(function(totalCount){
//             //user uncompleted reminder list
//             multi.sadd("reminders:uncompleted:"+fbid,totalCount);
//
//             // keep all the reminder in one sorted set for alaram
//             multi.zadd("reminders",data['score'],totalCount,client.print);
//
//             // add reminder in sorted list with date diff as secodary index
//             multi.zadd("reminder:"+totalCount,data['score'],data['title'],client.print);
//
//             // multi.hmset(["reminder:"+totalCount,'title',data['title'], 'date',data['date'],'duration',data['duration']],client.print);
//             multi.exec(function (err, replies) {
//                 console.log("Reply :" + replies);
//                 if(!err) cb(null,replies);
//                 else cb(err,null);
//              });
//     },function(err){
//         console.log("err " + err);
//         cb(err,null);
//     });
// };
//
// Reminder.prototype.getAll=function(fbid,count)
// {
//     let uncompletedIds=[];
//     let completedIds=[];
//     // get uncompleted reminders of user
//     client.smembers("reminders:uncompleted:"+fbid,function(ids){
//         // append like reminder:1,rmeinder:2
//         uncompletedIds=ids.map(ele=>'reminder:'+ele);
//         //get completed reminders
//         client.smembers("reminders:completed:"+fbid,function(ids){
//             completedIds=ids.map(ele=>'reminder:'+ele);
//         });
//     });
//
//     client.zunionstore("reminder:all:"+fbid,count,uncompletedIds+completedIds,function(res){
//         console.log(res);
//     });
// };
// Reminder.prototype.getUncompleted=function(fbid,count)
// {
//     let uncompletedIds=[];
//     client.smembers("reminders:uncompleted:200",function(err,ids){
//         console.log(ids);
//          uncompletedIds=ids.map(ele=>'reminder:'+ele);
//          count=(!count) ? uncompletedIds.length : count;
//          console.log(count + '<--this is count');
//          client.zunionstore("reminder:all:"+fbid,count,'reminder:1','reminder:2',function(err,res){
//             console.log(res);
//         });
//     });
// }
// exports.Reminder=new Reminder();
//
// /**
//  * define require module
//  */
const mongoose = require('mongoose');
const UserModel=require('./UserModel').userModel;
const Schema = mongoose.Schema;

let reminderSchema = mongoose.Schema({
    'title':{type: String},
    'user_id':{type:Schema.ObjectId,ref:'Users'},
    'type':{type:String},
    'date':{type:Date}
});

let ReminderModel = mongoose.model('Reminders', reminderSchema);
exports.reminderModel = ReminderModel;

