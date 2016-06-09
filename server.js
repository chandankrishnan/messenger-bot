'use strict';

const express = require('express'),
    router = express.Router(),
    bodyParser=require('body-parser'),
    http=require('http'),
    Func=require('./class/func'),
    session=require('./class/session');


const PORT= process.env.PORT;
const HOST=process.env.IP;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

router.use(require('./controllers'));


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
