var express=require('express')
    ,app=express()
    ,router=express.Router()


router.use('/fb/v1',require('./fbCtrl'));
router.use('/',function(req,res,next){
  next();
})

//home page
router.get('/a',function(req,res) {
    res.send('This is main controller');
});


module.exports=router;
