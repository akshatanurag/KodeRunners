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
    User.findByIdAndUpdate(req.user._id,{
        education: req.body.education,
        phone: req.body.phone,
        website: req.body.website,
        location: req.body.location,
        area: req.body.area,
        bio: req.body.bio
    }).then(()=>{
        req.flash("success","Profile edited successfully");
        res.redirect("back");
    },(e)=>{
        req.flash("error","Opps! Something went wrong");
    })
})

module.exports = router;