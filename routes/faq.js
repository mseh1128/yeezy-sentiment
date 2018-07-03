const express = require("express");
const router  = express.Router();

// Increase count
router.get("/", function(req, res){
    res.render('faq');
});


module.exports = router;
