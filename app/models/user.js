var mongoose = require("mongoose");
var Schema = mongoose.Schema;

module.exports = mongoose.model("User", new Schema({
    username : {
        type : String,
        required : [true, "Username field is required"]
    },
    password : {
        type : String,
        required : [true, "Password field is required"]
    },
    phoneNo : {
        type : Number,
        required : [true, "Phone number of User is required"]
    }
}));