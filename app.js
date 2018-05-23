const express = require('express');
const ejs = require('ejs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser =  require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const fileUpload = require('express-fileupload');

const passportLocalMongoose = require('passport-local-mongoose');

const {mongoose} = require('./db/mongoose');
const User = require('./models/user');
const {blog} = require('./models/blog');
const middleware = require('./middleware');

const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');
const profileRoutes = require('./routes/profile');
const adminRoutes = require('./routes/admin');

require('./config/passport')(passport);


var app = express();
app.use(require("express-session")({
    secret: "knsdckjsdnckjsdnckjsndcknwlkjacnwijanciwancsadkjcbsakjbcjka",
    resave: false,
    saveUninitialized: false
}));
app.use(cookieParser()); 
app.set("view engine","ejs");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
app.use(methodOverride("_method"));
app.use(fileUpload({ safeFileNames: true, preserveExtension: true, limits: { fileSize: 50 * 1024 * 1024 }}));


app.use(authRoutes);
app.use("/blog",blogRoutes);
app.use("/profile",profileRoutes);
app.use("/admin",adminRoutes);

app.get("/",(req,res)=>{
 
    res.render("index");
});


app.get("/dashboard",middleware.isLoggedIn,(req,res)=>{
    blog.find({
        creator_id: req.user._id
    }).then((m)=>{
        res.render("dashboard",{
            m
        });
    })
    
});




var port =  process.env.PORT || 3000;
app.listen(port,process.env.IP,()=>{
    console.log(`Server is up on ${port}`);
});