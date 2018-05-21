const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/kodeRunners",()=>{
    console.log("connected to db");
});
mongoose.Promise = global.Promise;

module.exports={
    mongoose
}