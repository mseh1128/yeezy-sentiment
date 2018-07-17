const express = require("express");
const router  = express.Router();
const Article = require("../models/article");
const Week    = require("../models/week");



router.use(function (req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next()
}); // prevents incorrect viewCount display when going back, not working w/ chrome cache


router.get(`/:name/:filter/:filterBy`, function(req, res) {
    const week_name = req.params.name;
    const filter = req.params.filter;
    const filterBy = req.params.filterBy;
    Week.find({name: week_name}).populate("articles").exec(function(err, result) {
        if(err) {
            res.send("something went")
        } else {
            const cleanedFilter = cleanFilter(filter);
            const sortedArticles = filterOptions(cleanedFilter, filterBy, result[0].articles);
            res.render("landing", {articles: sortedArticles, page_name: 'landing', 
                               activeWeek: week_name});
        }       
        })
    });

router.get("/:name/view", function(req, res) {
    const week_name = req.params.name;
    Week.find({name: week_name}).populate("articles").exec(function(err, result) {
        if(err) {
            res.send("something went")
        } else {
            const sortedArticles = filterOptions('viewCount', 'descending', result[0].articles)
            res.render("landing", {articles: sortedArticles, page_name: 'landing', 
                                    activeWeek: week_name});
        }
    });
});


function cleanFilter(filter) {
    if(filter === 'score') {
        return 'sentimentScore';
    } else { // filter is comparative
        return 'sentimentComparative';
    }
}

function filterOptions(filter, by, articles) {
    // filter, week, what to sort by
    if(by === "ascending") {
        return articles.sort((a, b) => a[filter] - b[filter]);
    } else { //descending
        return articles.sort((a, b) => b[filter] - a[filter]);
    }
} 



router.get("/:name", function(req, res){
    const week_name = req.params.name;
    // Get all articles from DB
    // mongoose error checking
    Week.find({name: week_name}).populate("articles").exec(function(err, result) {
        if(err) {
            res.send("something went")
        } else {
            res.render("landing", {articles: result[0].articles, page_name: 'landing', 
                                    activeWeek: week_name});
        }
    });
});

module.exports = router;
