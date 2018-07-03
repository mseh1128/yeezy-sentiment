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
    console.log(week_name);
    // Get all articles from DB
    // mongoose error checking
    Week.find({name: week_name}).populate("articles").exec(function(err, result) {
        if(err) {
            res.send("something went")
        } else {
            console.log(result);
            result[0].articles.forEach(function(article) {
                    // console.log(article.sentimentScoreValue);
                    // // returns value corresponding to icon to be displayed in the view
                    // article['sentimentScoreValue'] = sentimentSymbols.sentimentScore(article.sentimentScore);
                    // article['entimentComparativeValue'] = sentimentSymbols.sentimentComparative(article.sentimentComparative);

                //
            });
        // Get by URL
        //
        // console.log(result[0].articles[0].urlToImage);

            res.render("landing", {articles: result[0].articles });
        }
    });
});

module.exports = router;
