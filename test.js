'use strict';
const redis = require("redis"),
    bluebird=require('bluebird'),
    client = redis.createClient('redis://h:p2sd4j5e3448iu2tacphihpptrs@ec2-23-23-126-210.compute-1.amazonaws.com:28019');
  bluebird.promisifyAll(redis.RedisClient.prototype);
//   sessionId = new Date().toISOString();
  
  
//   client.hmset(['user:1000','fbid',10209313623095789, 'context','{}','sessionId',sessionId], function(err,response){
//             if(err ) console.error(err);
//             console.log('Redis response get: ' + JSON.stringify(response));
            
//         });

function session(fbid)
{
    const key="user:"+fbid;

    let findOrCreate=function()
    {
       return client.hgetAsync(key,"sessionId").then(function(res){
        if(!res || res=="")
        {     
            let sessionId = new Date().toISOString();
            client.hmset([key,'fbid',fbid, 'context','{}','sessionId',sessionId], function(err,response){
                if(err ) console.error(err);
                console.log('Redis response get: ' + JSON.stringify(response));
            });   
            return sessionId;     
        }
        else
        {
            console.log("using old session" + res);
            return res.toString();
        }
        });
    };

    let get=function(label){
        return client.hgetAsync(key,label).then(function(res){
            return res.toString();
        });
    }
    let update=function(label,value){
        value= (typeof value== 'object') ? dfdfdd.stringify(value) : value; 
        client.hmset([key,label,value], function(err,response){
                if(err ) console.error(err);
                console.log('Updating Value of : ' + JSON.stringify(response));
            }); 
    };

    let del=function(){
        
    } ;
    return{
        'findOrCreate':findOrCreate,
        'update':update,
        'get':get,
        'del':del
    };

}