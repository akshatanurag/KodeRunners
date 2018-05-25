const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/kodeRunners",()=>{
    console.log("connected to db");
});
mongoose.Promise = global.Promise;

module.exports={
    mongoose
}