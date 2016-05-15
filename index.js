var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request'),
    db=require('./app/models/db'),
    logger=require('./app/helpers/logger')

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


//middelware to load api backend
// app.use('/api',require('./app'))
app.use('/hooks',require('./webhooks'))

// Server frontpage
app.get('/', function (req, res) {
    res.send('Thidds is TestBot Server');
});

app.get('/test', function (req, res) {
    res.send('Thidds is TestBot Server');
});

db.connect(function () {
    //callback when connect success
    app.listen(app.get('port'), function() {
      console.log('Node app is running on port', app.get('port'));
    });
});

db.get().connection.on('connected', function () {
    logger.info('Mongoose connected' + app.port);

});
