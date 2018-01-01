var mongoose = require("mongoose");
var Schema = mongoose.Schema;

module.exports = mongoose.model("Application", new Schema({
    username : {
        type : String,
        required : [true, "Username field is required"]
    },
    jobId : {
        type : String,
        required : [true, "Job id is required"]
    }
}));