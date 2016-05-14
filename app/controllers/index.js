var express=require('express')
    ,app=express()
    ,router=express.Router()
    ,jwt=require('jsonwebtoken')

// router.use('/webapp',require('./webapp'))
// router.use('/users',require('./users'));


// Server frontpage
router.get('/', function (req, res) {
    res.send('Thidds is TestBot Server');
});

router.get('/test', function (req, res) {
    res.send('Thidds is TestBot Server');
});

// Facebook Webhook
router.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'testbot_verify_token') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});




module.exports=router;
