const mongoose = require("mongoose");

var blogSchema = new mongoose.Schema({
    title:{
    
        type: String
    },
    content:{

        type: String,
        minlength: 20
    },
    creator_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
    },
    creator_name: {
        type: String
    },
    // comment: [{
    //     id: mongoose.Schema.Types.ObjectId,
    //     ref: "comment"
    // }],
    createdAt: {
        type: Number,
        default: Date.now
    },
    updatedAt: {
        type: Number
    },
    status:{
        type: Number,
        default: 0
    }
});

var blog = mongoose.model("blog",blogSchema);

module.exports = {
    blog
}