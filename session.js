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

//TODO: try redis session implementation
Session.prototype.findOrCreate=function(id,k)
{   let key="session:"+id;
    console.log("session findOrCreate method called");
    return client.hgetAsync(key,k || 'sessionId').then(function(res){
        if(!res || res=="")
        {  
            client.hmset([key,'context','{}','sessionId',id], function(err,response){
                if(err ) console.error(err);
                console.log('Redis response get: ' + JSON.stringify(response));
            });   
            return id;     
        }
        else
        {
            console.log("using old session" + res);
            return res.toString();
        }
        });
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