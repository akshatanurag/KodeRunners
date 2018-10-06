const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || "mongodb://x2799:krcms1@ds137600.mlab.com:37600/koderunners",()=>{
    console.log("connected to db");
});
mongoose.Promise = global.Promise;

module.exports={
    mongoose
}