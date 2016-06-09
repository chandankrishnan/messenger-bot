'use strict';

const express = require('express'),
    router = express.Router(),
    bodyParser=require('body-parser'),
    http=require('http'),
    Func=require('./class/func'),
    request = require('request');

//const Wit=require('node-wit').Wit;

const PORT= process.env.PORT;
const HOST=process.env.IP;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//const wit = new Wit('OZLBH427SKNI7RC6Y6SUWBLDLHVCMUGG', actions);


app.use('/',router);
app.set('port', PORT);
http.createServer(app).listen(PORT);
