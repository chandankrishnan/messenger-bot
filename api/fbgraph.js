graph = require('fbgraph')

graph.setAccessToken(process.env.PAGE_ACCESS_TOKEN.toString());

module.exports.userInfo=function()
{
  return graph.get(event.sender.id.toString(), function(err, res)
  {
    return res;
  });
}
