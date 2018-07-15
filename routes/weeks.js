const express = require("express");
const router  = express.Router();
const Article = require("../models/article");
const Week    = require("../models/week");



router.use(function (req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next()
}); // prevents incorrect viewCount display when going back, not working w/ chrome cache

router.get("/:name", function(req, res){
    var week_name = req.params.name;
    // Get all articles from DB
    // mongoose error checking
    Week.find({name: week_name}).populate("articles").exec(function(err, result) {
        if(err) {
            res.send("something went")
        } else {
            res.render("landing", {articles: result[0].articles, page_name: 'landing', 
                                    week_name: week_name});
        }
    });
});

module.exports = router;
