/**
 * define require module
 */
const mongoose = require('mongoose');
const UserModel=require('./UserModel');

let reminderSchema = mongoose.Schema({
    'id': { type: Number },
    'title':{type: String},
    'user_id':{type:UserModel.ObjectId,ref:UserModel.userModel},
    'name':{
      'first':{type:String},
      'last':{type:String},
      'full':{type:String}
    },
    'facebook': [{
        'id': { type: String },
        'lastSeen': { type: Date, default: Date.now() }
    }]
});

let userModel = mongoose.model('userModel', userSchema, 'userModel');
exports.userModel = userModel;