'use strict';

const express = require('express')
    , router = express.Router()
    ,bodyParser=require('body-parser'),
    http=require('http');
    
    
const PORT= process.env.PORT;
const HOST=process.env.IP;
const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

//middelware to load controllers
//app.use(require('./controllers'))

router.get('/fb/webhook', function (req, res) {
    console.warn('authentication called');
    if (req.query['hub.verify_token'] === 'testbot_verify_token') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});


router.post('/fb/webhook',function(req,res,next){
   console.log('recived request');
    res.sendStatus(200);
});

router.get('/',function(req,res){
    res.send('c=main');
});
console.log("app staring");
app.use('/',router);
app.set('port', PORT);

http.createServer(app).listen(PORT);

