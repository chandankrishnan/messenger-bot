'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const http = require('http');
const Func = require('./class/func');
const db = require('./db');
const Users=require('./model/UserModel').userModel;
const Reminder=require('./model/ReminderModel').reminderModel;
const PORT = process.env.PORT || 8080;
const HOST = process.env.IP;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

router.use(require('./controllers'));

app.use('/', router);
app.set('port', PORT);

// http.createServer(app).listen(PORT);
// console.log(Users);
db.connect(() => {
    http.createServer(app).listen(PORT,function(){
        console.log("Listing server %s on %d ",process.env.IP,PORT);
    });
});