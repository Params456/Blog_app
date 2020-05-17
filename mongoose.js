var mongoose = require('mongoose');

var Schema =    mongoose.Schema;

var signup = new Schema({
    email : String,
    username : String,
    surname : String,
    password : String
})



module.exports = mongoose.model("Book",signup);
