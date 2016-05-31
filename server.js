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
app.use(require('./controllers'))

app.set('port', PORT);

http.createServer(app).listen(PORT);

