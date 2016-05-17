var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request'),
    db=require('./models/db'),
    logger=require('./helpers/logger'),
    user=require('./models/users.js');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
// app.set('views', __dirname + '/views');
// app.set('view engine', 'ejs');


//middelware to load
app.use(require('./controllers'))
// app.use('/hooks',require('./webhooks'))

db.connect(function () {
    //callback when connect success
    app.listen(app.get('port'), function()
    {

      var a=user.check('234234',function(){});
      console.log(a);
});
})

db.get().connection.on('connected', function () {
    logger.info('Mongoose connected' + app.port);

});
