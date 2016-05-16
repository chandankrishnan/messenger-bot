var mongoose = require('mongoose');

var state = {
        db: null,
    }
    , url = process.env.MONGODB_URI.toString();

exports.connect = function (cb) {
    if (state.db) {
        cb();
    }
    else {
        state.db = mongoose.connect(url,function(){
          cb();
        });

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
