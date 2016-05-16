var express=require('express')
    ,app=express()
    ,router=express.Router()

router.use('/hooks/fb',require('./fbctrl'))

//home page
router.get('/',function(req,res) {
    res.send('This is main controller');
});


module.exports=router;
