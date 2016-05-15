var mongoose = require('mongoose');

var state = {
        db: null,
    }
    , url = 'mongodb://locuraadmin:locuraadmin@ds013991.mlab.com:13991/locuranodetest';

exports.connect = function (cb) {
    if (state.db) {
        cb();
    }
    else {
        state.db = mongoose.connect(url);
        cb();
    }
}
exports.lib = function () {
    return mongoose;
}
exports.get = function () {
    return state.db
}

exports.close = function (done) {
    if (state.db) {
        state.db.close(function (err, result) {
            state.db = null
            state.mode = null
            done(err)
        })
    }
}
