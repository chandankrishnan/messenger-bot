/**
 * define require module
 */
let mongoose = require('mongoose');
const Schema=mongoose.Schema;

let userSchema = mongoose.Schema({
    'first_name':{type:String},
    'last_name':{type:String},
    'full_name':{type:String},
    'email':{type:'String'},
    'reminders':[{type:Schema.ObjectId,ref:'Reminders'}],
    'facebook': {
        'id': { type: String },
        'lastSeen': { type: Date, default: Date.now() }
    }
});

let userModel = mongoose.model('Users', userSchema);
exports ={
    userModel:userModel
}