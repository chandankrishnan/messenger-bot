/**
 * define require module
 */
let mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    'uid': { type: Number },
    'name':{
      'first':{type:'String'},
      'last':{type:'String'},
      'full':{type:'String'}
    },
    email:{type:'String'},
    'facebook': [{
        'id': { type: String },
        'lastSeen': { type: Date, default: Date.now() }
    }]
});

let userModel = mongoose.model('userModel', userSchema, 'userModel');
exports.userModel = userModel;