var express=require('express')
    ,app=express()
    ,router=express.Router()


router.use('/fb',require('./fbCtrl'));
router.use('/',function(req,res,next){
    res.send("this is main controller index");
  next();
});

//home page
router.get('/',function(req,res) {
    res.send('This is main controller');
});


module.exports=router;



       