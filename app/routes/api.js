// Dependencies
var express = require('express');
var router = express.Router();

// Routes
router.get('/jobs', function(req, res) {
   res.send('I would give you list of all jobs');
});

// Return router
module.exports = router;