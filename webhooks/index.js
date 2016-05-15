var express=require('express')
    ,app=express()
    ,router=express.Router()

router.use('/fb',require('./fb'))

//home page
router.get('/',function(req,res) {
    res.send('This is main controller');
});


module.exports=router;
