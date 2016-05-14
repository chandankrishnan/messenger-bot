var express=require('express')
    ,app=express()
    ,router=express.Router()
    ,jwt=require('jsonwebtoken')

router.use('/home',require('./home'))


//home page
router.get('/',function(req,res) {
    res.send('This is main controller for webapp');
});


module.exports=router;
