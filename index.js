var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Server frontpage
app.get('/', function (req, res) {
    res.send('Thidds is TestBot Server');
});

app.get('/test', function (req, res) {
    res.send('Thidds is TestBot Server');
});

// Facebook Webhook
app.get('/webhook', function (req, res) {
  console.warn('authentication called');
    if (req.query['hub.verify_token'] === 'testbot_verify_token') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});

app.post('/webhook', function (req, res) {
    console.log(JSON.stringify(req.body));
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text)
        {
          console.log('sender id:' + event.sender.id + ' message: ' + event.message.text);
            sendMessage(event.sender.id, {text: "Echo: " + event.message.text});
        }
    }
    res.sendStatus(200);
});

var token='EAAYd3OAuhsMBACtZAxMssPrZCRqJFdgfLRefZCYM7FoYSvGVFWzxxRZCEOLrpxoMedcgpZAE6c0v8XeZBL7iX0x3ungZAwazDjf4uzdURPIdAyG3aeyFFkYdzVgcf6Cgi4vniZCsWZC0jbZCbjS6p07qfPLemGOmgruUJEX1UR4WxcTAZDZD';
// generic function sending messages
function sendMessage(recipientId, message) {

    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: token},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
