var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request')

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.set('port', (5000));

app.use(express.static(__dirname + '/public'));

test();

function test()
{
    console.log('test called');
    request({
        url: 'https://api.wit.ai/message',
        qs: {q: "meet rohit at 2pm for 2 hour  new powai" , v:"20160520"},
        method: 'GET',
        headers:
        {
            Authorization: "Bearer JWT2GIFMQ5FBC6Q2F6V2IZ5NHBYFZYJY"
        }
    }, function (error, response, body) {
        console.log('message body' + body);
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body);
        }
    });
}