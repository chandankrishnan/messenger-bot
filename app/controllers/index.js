var express=require('express')
    ,app=express()
    ,router=express.Router()
    ,jwt=require('jsonwebtoken')

router.use('/webapp',require('./webapp'))
router.use('/users',require('./users'));


router.get('/webhooks',function(req,res){
  res.send('hello');
})
//home page
router.get('/',function(req,res) {
    res.send('This is main controller');
});


module.exports=router;
