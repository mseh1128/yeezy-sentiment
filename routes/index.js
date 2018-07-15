const express = require("express");
const router  = express.Router();
const Article = require("../models/article");
const Week    = require("../models/week");
const dateCleanser = require("../lib/cleanser.js").cleanDate;
const moment = require("moment")

router.use(function (req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next()
}); // prevents incorrect viewCount display when going back, not working w/ chrome cache

router.get("/", function(req, res){
    // console.log(app.locals)
    // Get all articles from DB
    // mongoose error checking
   Week.find({}, function (err, queries) {
    let date = new Date(Math.max.apply(null, queries.map(function(e) {
      return new Date(e.name);
    })));
    let cleanedDate = dateCleanser(moment(date));
    res.redirect(`weeks/${cleanedDate}`)




   });
});

module.exports = router;
