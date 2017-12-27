// Dependencies
var express = require('express');
var router = express.Router();

// Get models
var User = require("../models/user");
var Job = require("../models/job");
var Application = require("../models/application");

// Routes

// Get Jobs based on different parameters
// All jobs, by id, by empoyer or by location
router.get('/jobs', function(req, res) {
    if(req.query.id) {
        // List a job details by id
        // /jobs?id=someId
        jId = req.params.id;
        Job.find({_id : jId}, function(error, job) {
            if (error) throw error;
            if (!job) {
                // Wrong job id
                return res.json({"success": false, "message": "JobId is invalid"});
            } else {
                Application.find({jobId: jId}, function(error, applications) {
                    if (error) throw error;

                    // Send the response combining event details and applications
                    return res.json({"job" : job, "applications" : applications});
                });
            }
        });
    } else if (req.query.employer) {
        // List jobs by employer username
        // /jobs?employer=some-username
        username = req.query.employer;
        Job.find({employer : username}, function(error, jobs) {
            if (error) throw error;

            return res.json(jobs);
        });
    } else if (req.query.location) {
        // List all jobs by location
        // /jobs?location=some-city
        city = req.query.location;
        Job.find({location : city}, function(error, jobs) {
            if (error) throw error;

            return res.json(jobs);
        });
    } else {
        // Else send all jobs
        Job.find({}, function(error, jobs) {
            if (error) throw error;
            return res.json(jobs);
        });
    }
});

// Register a User
router.post("/signup", function(req, res) {
    // Check if both username
    if (req.body.username && req.body.password && req.body.phoneNo) {
        User.findOne({username: req.body.username}, function(error, user) {
            if (error) throw error;
            if (user) {
                // Username is already registered
                return res.json({ "success": false, "message": "This username is already registered" });
            } else {
                // Create the user in db
                User.create(req.body, function(error, user) {
                    if (error) throw error;
                    if (!user) return res.json({ "success": false, "message": "Sign Up failed" });
                    return res.json({ "success": true, "message": "Sign up successfully"});
                });
            }
        });
    } else {
        return res.json({ "success": false, "message": "Some field is missing" });
    }
});

// Authentication middleware
var auth = function(req, res, next) {
    if (req.session.authenticated == true)
        return next();
    else
        return res.json({"success" : false, "message" : "You are not authenticated"});
}

// Login Route
router.post("/login", function(req, res) {
    if (!req.body.username && !req.body.password) {
        return res.json({ "success" : false, "message" : "Either username or password is missing"})
    } else {
        User.findOne({username : req.body.username, password : req.body.password}, function(error, user) {
            if (error) throw error;
            if (!user) return res.json({"success" : false, "message" : "Either username or password is wrong"});
            // Set username in session
            req.session.username = req.body.username;
            req.session.authenticated = true;
            return res.json({"success" : true, "message" : "Successfully logged in"});
        });
    }
});

// Logout
router.get("/logout", function(req, res) {
    req.session.destroy();
    return res.json({"success" : true, "message" : "Successfully logged out"});
});

// Post a job
router.post("/job", auth, function(req, res) {
    if (req.body.employer != req.session.username)
        return res.json({"success" : false, "message" : "You are not authorized"});
    Job.create(req.body, function(error, jobPosted) {
        if (error) throw error;
        if (!jobPosted) return res.json({"success" : false, "message" : "Failed to post job"});
        return res.json({"success" : true, job : jobPosted});
    });
});

// Update a job
router.put("/job/:id", auth, function(req, res) {
    Job.findOne({_id : req.params.id}, function(error, job) {
        if (error) throw error;
        if (!job) return res.json({"success" : false, "message" : "Cannot update the specified job"});
        if (job.employer != req.session.username)
            return res.json({"success" : false, "message" : "You are not authorized"});
        else {
            if (req.body.username && req.session.username != req.body.username)
                return res.json({"success" : false, "message" : "You are not allow to change username"})
            Job.update({_id : req.params.id}, req.body, function(error) {
                if (error) throw error;
                else return res.json({"success" : true, "message" : "Successfully Updated"});
            });
        }
    });
});

// Delete a job
router.delete("/job/:id", auth, function(req, res) {
    Job.findOne({_id : req.params.id}, function(error, job) {
        if (error) throw error;
        if (!job) return res.json({"success" : false, "message" : "Cannot update the specified job"});
        if (job.employer != req.session.username)
            return res.json({"success" : false, "message" : "You are not authorized"});
        else
            Job.remove({_id : req.params.id}, function(error) {
                if (error) throw error;
                else return res.json({"success" : true, "message" : "Successfully deleted"});
            });
    });
});

// Return router
module.exports = router;