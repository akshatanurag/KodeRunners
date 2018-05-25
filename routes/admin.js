var express = require('express');
// const http = require('http');
// const socketIO = require('socket.io');
var middleware = require('../middleware');

const {blog} = require('../models/blog');


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
router.post("/blog",(req,res)=>{
    console.log(req.body.switch);
})

module.exports = router;