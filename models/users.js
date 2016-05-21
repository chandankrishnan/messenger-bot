// User Model
var mongo = require('mongoose')
    , db = require('./db')
    , util = require("util")
    , EventEmitter = require("events").EventEmitter

var Tasks = new Schema({
    title      : String
    , datetime : Date
    , location : String
    ,
});


var userSchema = mongo.Schema({
    _id:{type:String,required:true,unique:true}
    ,first: {type: String, lowercase: true, trim: true, required: true}
    , last: {type: String, lowercase: true, trim: true, required: true}
    , avtar: String
    , gender: {type: String, required: true}
    , age: {type: Number, required: false}
    , tasks :[Tasks]
    , isActive: {type: Boolean, default: 0}
});

var User = mongo.model('User', userSchema,'userSchema');

//constructor
function UserList() {
    EventEmitter.call(this);
}

util.inherits(UserList, EventEmitter);


//Get all users
UserList.prototype.all = function (cb) {
    return User.find({}, function (err, data) {
        return cb(data);
    });
};

UserList.prototype.save = function (userData, cb) {
    var self = this
        , user = new User(userData);

    user.save(function (error, data) {
        if (error) {
            return cb(error, null)
        }
        self.emit('user-saved', userData);
        return cb(null, data);
    })
}

UserList.prototype.check=function(_id,cb){
  console.log('checking user ' + _id);
  var self=this
    return User.count({_id:_id},function(err,data){
      if(data){
        console.log('user exist form db ' + data);
        self.emit('user-exist',_id);
        return cb(data,null)
      }else{
        console.log('user doest not exist');
        self.emit('user-not-exist',_id);
        return cb('user does not exist',null)
      }
    })
}
module.exports = UserList;
