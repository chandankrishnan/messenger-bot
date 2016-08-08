'use strict';
const redis=require('./redisDB');
const client=redis.client;

var fbid='';
var key='';
//session handler using redis
function Session()
{
    if (!(this instanceof Session))
     {
        return new Session();
    }
    
};

Session.prototype.findOrCreate=function(id,k)
{   let key="session:"+id;
    console.log("session findOrCreate method called");
    return new Promise(function(resolve,reject){
       client.hmgetAsync(key,k).then(function(res){
           console.log('hmget result : ' + res);
           if(!res || res==""){
            client.hmset([key,'context','{}','sessionId',id], function(err,response){
                if(err ) console.error(err);
                console.log('New Session created: ' + JSON.stringify(response));
                resolve([{},id]);
            });  
            }
           else{
               resolve(res);
           }
       })
    }); //end Promise
}

Session.prototype.set=function(key,data)
{
    console.log("session get method called");
    client.hmset("session:"+key,data, function(err,response){
                if(err ) console.error(err);
                console.log('Redis response get: ' + JSON.stringify(response));
            }); 
}

Session.prototype.get=function(key,data)
{
     return client.hmgetAsync("session:"+key,data).then(function(res){
            return res;
        });
}

//TODO: update with multiple key and value;
Session.prototype.update=function(key,data)
{
    //  data= (typeof data== 'object') ? JSON.stringify(data) : data; 
        client.hmset("session:"+key,data, function(err,response){
                if(err ) console.error(err);
                console.log('Updating Value of : ' + JSON.stringify(response));
            }); 
}

Session.prototype.del=function(key)
{
    clinet.del("session:"+key,function(err,response){
        if(err) console.error(err);
        console.log("deleting session" + response);
    });
}

module.exports=exports=new Session();