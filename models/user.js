const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
var bcrypt   = require('bcrypt-nodejs');
const validator = require('validator');

var userSchema = new mongoose.Schema({
        name: {
            type: String
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
});
mongoose.Promise=global.Promise;
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports  = mongoose.model("user",userSchema);