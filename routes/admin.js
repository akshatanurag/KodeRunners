var express = require('express');
var middleware = require('../middleware');

const {blog} = require('../models/blog');

var router = express.Router();

router.get("/blog",middleware.isLoggedIn,(req,res)=>{
    blog.find().then((Blog)=>{
        res.render("admin_blog",{
            Blog
        })
    },(e)=>{
        console.log(e);
        req.flash("error","Opps! Something went wrong");
        res.send("back");
    })
   
});
router.post("/blog",(req,res)=>{
    console.log(req.body.switch);
})

module.exports = router;