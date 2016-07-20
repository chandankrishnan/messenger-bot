const redis = require("redis"),
    bluebird=require('bluebird'),
    client = redis.createClient('redis://h:p2sd4j5e3448iu2tacphihpptrs@ec2-23-23-126-210.compute-1.amazonaws.com:28019');
  bluebird.promisifyAll(redis.RedisClient.prototype);
  sessionId = new Date().toISOString();
  
  const key="user:1000";
  
//   client.hmset(['user:1000','fbid',10209313623095789, 'context','{}','sessionId',sessionId], function(err,response){
//             if(err ) console.error(err);
//             console.log('Redis response get: ' + JSON.stringify(response));
            
//         });


client.hgetAsync(key,'fbid').then(function(res){
    console.log(typeof res);
    console.log(res);
    client.quit();
});