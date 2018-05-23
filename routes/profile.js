var express = require('express');
var User = require('../models/user');
var middleware = require('../middleware');

var router = express.Router();

router.get("/",middleware.isLoggedIn,(req,res)=>{
    User.findById(req.user._id).then((foundUser)=>{
        res.render("profile",{
            foundUser
        })
    },(e)=>{
        req.flash("error","Opps! Something went wrong");
    })
});
router.put("/",middleware.isLoggedIn,(req,res)=>{

    if (!req.files)
    return res.status(400).send('No files were uploaded.');
 
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;
 console.log(sampleFile.mimetype)
  // Use the mv() method to place the file somewhere on your server
  var dp=true;
  if(sampleFile.mimetype === "image/jpeg"){
  sampleFile.mv(`./public/images/uploads/profile/${req.user._id}.jpg`, function(err) {
    if (err){
        dp= false;
        req.flash("error","Profile pic not updated.");
    }
    User.findByIdAndUpdate(req.user._id,{
        education: req.body.education,
        phone: req.body.phone,
        website: req.body.website,
        location: req.body.location,
        area: req.body.area,
        bio: req.body.bio,
        dp: dp
    }).then(()=>{
        req.flash("success","Profile edited successfully");
        res.redirect("back");
    },(e)=>{
        req.flash("error","Opps! Something went wrong");
    })
})
}
    else{
    req.flash("error","You can only upload <b>.jpg<b> files");
    res.redirect("back");
    }
});

// router.post("/upload",middleware.isLoggedIn,(req,res)=>{

   
//     req.flash("success","Profile Pic Uploaded!");
//     res.redirect('back');
//   });

// })

module.exports = router;