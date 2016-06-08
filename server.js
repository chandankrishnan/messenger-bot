'use strict';

const express = require('express'),
    router = express.Router(),
    bodyParser=require('body-parser'),
    http=require('http'),
    Func=require('./class/func');


const PORT= process.env.PORT;
const HOST=process.env.IP;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//middelware to load controllers
app.use(require('./controllers'))

// Func.movieTheater("Chembur,Mumbai",function(data){
// data.forEach(function(data,index){
//   console.log(data['name']);
// });

app.use('/',router);
app.set('port', PORT);
http.createServer(app).listen(PORT);
