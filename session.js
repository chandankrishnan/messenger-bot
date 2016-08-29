// 'use strict';
// const redis=require('./redisDB');
// const client=redis.client;

// var fbid='';
// var key='';
// //session handler using redis
// function Session()
// {
//     if (!(this instanceof Session))
//      {
//         return new Session();
//     }
    
// };

// Session.prototype.findOrCreate=function(id,k)
// {   let key="session:"+id;
//     return new Promise(function(resolve,reject){
//       client.hmget(key,k,function(err,res){
//           if(!res[0])
//           {
//             client.hmset([key,'context','{}','sessionId',id],function(err,response){
//                 if(err ) console.error(err);
//                 console.log('New Session created: ' + JSON.stringify(response));
//                 resolve([{},id]);
//             });  
//             }
//           else{
//               console.log("no result from session");
//               resolve(res);
//           }
//       })
//     }); //end Promise
// }

// Session.prototype.set=function(key,data)
// {
//     console.log("session get method called");
//     client.hmset("session:"+key,data, function(err,response){
//                 if(err ) console.error(err);
//                 console.log('Redis response get: ' + JSON.stringify(response));
//             }); 
// }

// Session.prototype.get=function(key,data)
// {
//      return client.hmgetAsync("session:"+key,data).then(function(res){
//             return res;
//         });
// }

// //TODO: update with multiple key and value;
// Session.prototype.update=function(key,data)
// {
//     //  data= (typeof data== 'object') ? JSON.stringify(data) : data; 
//         client.hmset("session:"+key,data, function(err,response){
//                 if(err ) console.error(err);
//                 console.log('Updating Value of : ' + JSON.stringify(response));
//             }); 
// }

// Session.prototype.del=function(key)
// {
//     client.del("session:"+key,function(err,response){
//         if(err) console.error(err);
//         console.log("deleting session" + response);
//     });
// }


// // const sessions = {};

// // function Session()
// // {
// //     if (!(this instanceof Session))
// //      {
// //         return new Session();
// //     }
    
// // };

// // Session.prototype.findOrCreate=function(fbid)
// //     {   let sessionId;
// //       // Let's see if we already have a session for the user fbid
// //       Object.keys(sessions).forEach(k => {
// //         if (sessions[k].fbid === fbid) {
// //           // Yep, got it!
// //           sessionId = k;
// //         }
// //       });
// //       if (!sessionId) {
// //         // No session found for user fbid, let's create a new one
// //         sessionId = new Date().toISOString();
// //         sessions[sessionId] = {fbid: fbid, context: {},sessionId:sessionId};
// //       }
// //     return sessions[sessionId];
// // }

// // Session.prototype.get=function(fbid)
// // {
// //     let sessionId='';
// //     Object.keys(sessions).forEach(k => {
// //         if (sessions[k].fbid === fbid) {
// //           // Yep, got it!
// //           sessionId=k;
// //         }
// //       });
      
// //       if(sessionId) return sessions[sessionId];
// // }

// // Session.prototype.del=function(fbid)
// // {
// //     let sessionId='';
// //     Object.keys(sessions).forEach(k => {
// //         if (sessions[k].fbid === fbid) {
// //           // Yep, got it!
// //           sessionId=k;
// //         }
// //       });
// //     if(sessionId) delete sessions[sessionId];
// // }

// // Session.prototype.update=function(fbid,key,val)
// // {
// //     let sessionId='';
// //     Object.keys(sessions).forEach(k => {
// //         if (sessions[k].fbid === fbid) {
// //           // Yep, got it!
// //           sessionId=k;
// //         }
// //       });
// //     if(sessionId)
// //     {
// //         sessions[key]=val;
// //     }
// // }

// // Session.prototype.getById=function(id)
// // {
// //     if(sessions[id]) return sessions[id];
// // }
// module.exports=exports=new Session;