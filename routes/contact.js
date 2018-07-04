const express = require("express");
const router  = express.Router();

// Increase count
router.get("/", function(req, res){
    res.render('contact', {page_name: 'contact', success: req.flash("success")});
});

router.post("/", function(req, res) {
    // res.render('contact', {page_name: 'contact'});
    req.flash("success", "Your message has been submitted!");
    res.redirect('/contact');
});


module.exports = router;
