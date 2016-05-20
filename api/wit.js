var request=require('request'),
    URL="https://api.wit.ai/message",
    VERSION="20160520",
    SERVER_TOKEN=process.env.WIT_SERVER_TOKEN || "JWT2GIFMQ5FBC6Q2F6V2IZ5NHBYFZYJY";


module.exports.message=function(query,cb)
{
    request({
        url: URL,
        qs: {q: query, v:VERSION},
        method: 'GET',
        headers:
        {
            Authorization: "Bearer " + SERVER_TOKEN
        }
    }, function (error, response, body) {
        if(typeof response != 'undefined') res=JSON.parse(response.body.entities);

        if(typeof cb == 'function') {
            cb(res,null);
        }

        if (err) {
            if(typeof error == 'function') error(null,err);
        } else if (response.body.error) {
            if(typeof error == 'function') error(null,err);
        }
    });
}