const express = require('express');
const User = require('../models/user');
const middleware = require('../middleware');

const router = express.Router();

router.get("/users",middleware.isLoggedIn,middleware.isSuperAdmin,(req,res)=>{
    User.find().then((allUser)=>{
        res.render("superadmin",{
            allUser
        });
        io.on('connection',(socket)=>{
            socket.on("makeAdmin",(s,callback)=>{
                User.findByIdAndUpdate(s.id,{
                    role: s.role
                }).then(()=>{
                    req.flash("success",`User <b>${s.name}<b> was made admin`);
                },(e)=>{
                    req.flash("error","Something went wrong");
                })
                callback();
            })
        })
    }).catch((e)=>{
        console.log(e);
        req.flash("error","Opps! something went wrong");
        res.redirect("back");
    })
})

module.exports = router;