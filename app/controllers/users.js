var express = require('express')
    , router = express.Router()
    , UserList = require('../model/users')
    , user = new UserList()
    , Event = require('events').EventEmitter;


// return all users
router.get('/', function (req, res, next) {
    user.all(function (data) {
        res.send(data);
    });
});

//save user
router.post('/save', function (req, res) {
    var userData = {
        name: {
            first: req.body.first,
            middle: req.body.middle || null,
            last: req.body.last,
            full: [req.body.first, req.body.middle, req.body.last].join(" ")
        },
        avtar: req.body.avtar || null,
        age: req.body.age || 0,
        isActive: false
    }
    var resw = user.save(userData, function (error, data) {
        if (error) res.send(error)
        else res.send(data)
    });

});

//event listner for user save
user.on('user-saved', function () {
    console.log('User Saved');
})


module.exports = router;
