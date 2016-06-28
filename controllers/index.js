var express=require('express')
    ,app=express()
    ,router=express.Router()


router.use('/fb',require('./fbCtrl'));
router.use('/',function(req,res,next){
    res.send("this is main controller index");
  next();
})

//home page
router.get('/a',function(req,res) {
    res.send('This is main controller');
});


module.exports=router;


adminForm.prototype.userdataChecker2=function(a,cb) {
   var user = a[0];
   console.log('user:'+user);
   var startDate2=a[1];
   var date2 = new Date(startDate2).getTime();
   date2 += (1 * 1 * 1 * 1);
   var startDate=new Date(date2).toUTCString();
   var endDate2=a[2];
   var date3 = new Date(endDate2).getTime();
   date3 += (24 * 60 * 60 * 999);    //console.log(new Date(date3).toUTCString());
   var endDate=new Date(date3).toUTCString();
  
   FormName.findOne({ type:'excelupload', username:user    },function(err,data) {
       //var client=_id;        // var user = data.username;
       var _id = data._id;
       console.log(_id);
       console.log(startDate);
       console.log(endDate);
       if(data && !err)
       {
            ClientName.find({ /** put condition here */},function(err,data){
                if(data && !err){
                        cb(data,null);
                }
                else
                {
                 cb(null,data);
                }
            })
       }
    });
};
       