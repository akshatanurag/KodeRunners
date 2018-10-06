const mongoose = require('mongoose');
var uri ="mongodb://x2799:krcms1@ds137600.mlab.com:37600/koderunners";
mongoose.connect(uri,()=>{
    console.log("connected to db");
});
mongoose.Promise = global.Promise;

module.exports={
    mongoose
}