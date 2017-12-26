var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model("Job", new Schema({
    // Username for employer
    employer : {
        type : String,
        required : [true, "Employer field is required"]
    },
    description : {
        type : String,
        required : [true, "Description of job is required"]
    },
    time : {
        type : Date,
        required : [true, "Time of the job is required"]
    },
    duratoin : {
        type : Number,
        required : [true, "Time duration for the job is needed"]
    },
    // Taking location for now to be a String as in name of city. In
    // future update, will update it to use location in longitude and latitude
    location : {
        type : String,
        required : [true, "Location of job is required"]
    }
}));