const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
var bcrypt   = require('bcrypt-nodejs');
const validator = require('validator');

var userSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
       email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: (vaule)=>{
                return validator.isEmail(vaule);
            },
            message: '{value} is not a email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    education:{
        type: String
    },
    phone: {
        type: Number
    },
    website:{
        type: String
    },
    location: {
        type: String
    },
    area: [{
        type: String
    }],
    bio: {
        type: String
    },
    role:{
        type: Number,
        default: 0
    },
    dp:{
        type: String
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    lastLogin: {
        type: String,
        default:null
    }
});
mongoose.Promise=global.Promise;
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports  = mongoose.model("user",userSchema);