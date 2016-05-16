var bunyan = require('bunyan'),

// add some default options here...
    defaults = {name: 'myapp'},

// singleton
    logger,
    
    createLogger = function createLogger(options) {
        var opts;

        if (logger) {
            return logger;
        }
        logger = bunyan.createLogger(defaults);
        return logger;
    }
    , log = createLogger;

module.exports = new log();
