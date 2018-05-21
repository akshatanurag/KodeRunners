var express = require('express');

var router = express.Router();


const {blog} = require('../models/blog');
const middleware = require('../middleware');

router.get("/new",middleware.isLoggedIn,(req,res)=>{
    res.render("addblog");
});

router.post("/new",middleware.isLoggedIn,(req,res)=>{
    // req.body.content = req.sanitize(req.body.content);
    // console.log(req.body.content);
    console.log(req.body.title);
    var Blog = new blog({
        title: req.body.title,
        content: req.body.content,
        createdAt: new Date().toDateString()

    });
    Blog.creator_id= req.user._id;
    Blog.creator_name= req.user.name;
    Blog.save().then((Blog)=>{
        req.flash("success","Blog added");
        console.log(Blog);
        res.redirect("/dashboard");
    },(e)=>{
        req.flash("error","Opps! Something went wrong");
        console.log(e);
    }).catch((e)=>{
        console.log(e);
    })
});

router.get("/view_all",middleware.isLoggedIn,(req,res)=>{
    blog.find({
        creator_id: req.user._id
    }).then((m)=>{
        console.log(m);
        res.render("view_all",{
            m
        })
    },(e)=>{
        console.log(e);
    })
});


module.exports = router;