// User Model
var mongo = require('mongoose')
    , db = require('./db')
    , util = require("util")
    , EventEmitter = require("events").EventEmitter

var userSchema = mongo.Schema({
    _id:{type:String,required:true,unique:true}
    ,first: {type: String, lowercase: true, trim: true, required: true}
    , last: {type: String, lowercase: true, trim: true, required: true}
    , avtar: String
    , gender: {type: String, required: true}
    , age: {type: Number, required: false}
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

UserList.prototype.getUser=function(_id,cb){
  var self=this
    return User.find({_id:_id},function(err,data){
      if(err){
        return cb(err,null);
      }else if(data){
        self.emit('user-exist',_id);
        return cb(data,null)
      }else{
        self.emit('user-notexist',_id);
        return cb('data not exist',null)
      }
    })
}
module.exports = new UserList;
