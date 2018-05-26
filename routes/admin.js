var express = require('express');
// const http = require('http');
// const socketIO = require('socket.io');
var middleware = require('../middleware');

const {blog} = require('../models/blog');
const User = require('../models/user');

// var app = express();
// var server = http.createServer(app);
var router = express.Router();

router.get("/blog",middleware.isLoggedIn,middleware.isAdmin,(req,res)=>{
    blog.find().then((Blog)=>{
        res.render("admin_blog",{
            Blog
        })
    },(e)=>{
        console.log(e);
        req.flash("error","Opps! Something went wrong");
        res.send("back");
    })
    // var io = socketIO(server);
    io.on('connection',(socket)=>{
        socket.on("approve",(s,callback)=>{
            blog.findByIdAndUpdate(s.id,{
                status: s.status
            }).then(()=>{
                req.flash("success","Blog was approved");
            },(e)=>{
                req.flash("error","Something went wrong");
            })
            callback();
        })
    })
   
});
router.get("/blog/approved",middleware.isLoggedIn,middleware.isAdmin,(req,res)=>{
    blog.find({
        status: 1
    }).then((Blog)=>{
        res.render("approved_blogs",{
            Blog
        });
    },(e)=>{
        req.flash("error","Oops!Something went wrong");
        console.log(e);
        res.redirect("back");
    });
    io.on('connection',(socket)=>{
        socket.on("approved",(s,callback)=>{
            blog.findByIdAndUpdate(s.id,{
                status: s.status
            }).then(()=>{
                req.flash("success","Blog was approved");
            },(e)=>{
                req.flash("error","Something went wrong");
            })
            callback();
        })
    })
});
router.get("/blog/unapproved",middleware.isLoggedIn,middleware.isAdmin,(req,res)=>{
    blog.find({
        status: 0,
        
    }).then((Blog)=>{
        res.render("unapproved_blogs",{
            Blog
        });
    },(e)=>{
        req.flash("error","Oops!Something went wrong");
        console.log(e);
        res.redirect("back");
    });
    io.on('connection',(socket)=>{
        socket.on("unapproved",(s,callback)=>{
            blog.findByIdAndUpdate(s.id,{
                status: s.status
            }).then(()=>{
                req.flash("success","Blog was approved");
            },(e)=>{
                req.flash("error","Something went wrong");
            })
            callback();
        })
    })
});

// ALL USERS

router.get("/users",middleware.isLoggedIn,middleware.isAdmin,(req,res)=>{
    User.find().then((m)=>{
        res.render("alluser",{
            m
        });
    },(e)=>{
        console.log(e);
        req.flash("error","Opps! Something went wrong");
        res.redirect("back");
    }).catch((e)=>{
        console.log(e);
        req.flash("error","Opps! Something went wrong");
        res,redirect("back");
    })
})

router.get("/admins",middleware.isLoggedIn,middleware.isAdmin,(req,res)=>{
    User.find({
        role: 1
    }).then((m)=>{
        res.render("admins",{
            m
        });

    },(e)=>{
        console.log(e);
        req.flash("error","Opps! Something went wrong");
        res.redirect("back");
    }).catch((e)=>{
        console.log(e);
        req.flash("error","Opps! Something went wrong");
        res,redirect("back");
    })
})


module.exports = router;