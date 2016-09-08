'use strict';
/**
 * define require module
 * @module  mongoose
 */
let mongoose = require('mongoose'),
    state = {
        db: null,
    },
    url = process.env.MONGO || 'mongodb://aalooapp-admin:aalooappproduction@ds013946.mlab.com:13946/heroku_dxbqjh24';
/**
 * @exports {connect,close}
 */
module.exports = {
    connect: (cb) => {
        if (state.db) {
            cb();
        } else {
            state.db = mongoose.connect(url);
            cb();
        }
    },
    close: (done) => {
        if (state.db) {
            state.db.close((err, result) => {
                state.db = null
                state.mode = null
                done(err)
            });
        }
    }
}