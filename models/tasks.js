// User Model
var mongo = require('mongoose')
    , db = require('./db')
    , util = require("util")
    , EventEmitter = require("events").EventEmitter


var Task = mongo.model('Task', taskSchema,'taskSchema');

//constructor
function TaskList() {
    EventEmitter.call(this);
}

util.inherits(TaskList, EventEmitter);


TaskList.prototype.create=function(taskData,cb)
{
    var self = this
        , task = new Task(taskData);

    task.save(function (error, data) {
        if (error) {
            return cb(error, null)
        }
        self.emit('task-create', taskData);
        return cb(null, data);
    })
}

//Get all users
TaskList.prototype.all = function (cb) {
    return Task.find({}, function (err, data) {
        return cb(data);
    });
};


module.exports = new TaskList;
