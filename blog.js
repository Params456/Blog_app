var mongoose = require("mongoose");

var Blog = mongoose.Schema({
    author : String,
    Blog : String
})

module.exports = (mongoose.model("Blog",Blog))