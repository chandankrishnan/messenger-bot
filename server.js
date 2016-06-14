'use strict';

const express = require('express'),
    router = express.Router(),
    bodyParser=require('body-parser'),
    http=require('http'),
    Func=require('./class/func'),
    session=require('./class/session'),
FBMessenger = require('fb-messenger')
const FB_PAGE_ID=process.env.FB_PAGE_ID,
    FB_PAGE_TOKEN=process.env.FB_PAGE_TOKEN,
    WIT_TOKEN=process.env.WIT_TOKEN;

const weather_dict=['weather','temp','temperature','rain'];
const messenger = new FBMessenger(FB_PAGE_TOKEN);

const PORT= process.env.PORT;
const HOST=process.env.IP;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

router.use(require('./controllers'));
messenger.sendTextMessage('10209313623095789', 'Hello');

//Func.movieTheater("Chembur,Mumbai",function(data) {
//    //console.log(data);
//    messenger.sendTextMessage('10209313623095789', 'Hello', 'NO_PUSH');
//    messenger.sendHScrollMessage('10209313623095789',data,function(err,body){
//        if(err ) console.log(err);
//        else console.log(body);
//    });
// });


app.use('/',router);
app.set('port', PORT);
http.createServer(app).listen(PORT);
