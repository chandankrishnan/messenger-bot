var express = require('express')
    , router = express.Router()

router.get('/', function (req, res) {
    res.send('This is home page');
});


module.exports = router;
