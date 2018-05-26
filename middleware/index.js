const {
    blog
} = require('../models/blog');

module.exports = {
    isLoggedIn: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash("error", "You need to login first");
        res.redirect('/login');
    },
    checkBlogOwner: function (req, res, next) {
        if (req.isAuthenticated()) {
            blog.findById(req.params.id).then((m) => {
                if (m.creator_id.equals(req.user._id)) {
                    console.log("true");
                    next();
                } else {
                    req.flash("error", "Not permitted");
                    res.redirect("/dashboard")
                }
            }, (e) => {
                console.log(e);
                req.flash("error", "Not permitted");
                res.redirect("/dashboard");
            }).catch((e) => {
                console.log(e);
                req.flash("error", "Not permitted");
                res.redirect("/dashboard");
            })
        }
    },
    isApproved: function (req, res, next) {
        blog.findById(req.params.id).then((Blog) => {

            if (Blog.status === 1) {

                return next();
            }
            req.flash("error", "Blog Not Approved yet");
            res.redirect("back");
        })

    },
    isAdmin: function (req, res, next) {
        
        if(req.user.role == 1 || req.user.role == 2)
        {
            return next();
        }
        req.flash("error","Not Permitted");
        res.redirect("/dashboard");
    },
    isSuperAdmin :  function(req,res,next) {
        if(req.user.role == 2){
            return next()
        }
        req.flash("error","Not Permitted");
        res.redirect("/dashboard");
    }
}