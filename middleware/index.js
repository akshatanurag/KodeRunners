module.exports = {
    isLoggedIn : function(req, res, next) {
        if (req.isAuthenticated()){
            
            return next();
        }
        // req.flash("error","You've to be logged infirst");
        res.redirect('/login');
    },
}