const express = require("express");
const router  = express.Router();
const Article = require("../models/article");



// Increase count
router.get("/:id", function(req, res){
    // Article.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
    //     if(err){
    //         console.log(err);
    //     } else {
    //         console.log(foundCampground)
    //         //render show template with that campground
    //         res.render("campgrounds/show", {campground: foundCampground});
    //     }
    // }); //{$inc : {'post.likes' : 1}
    Article.findByIdAndUpdate(req.params.id,{$inc : {viewCount: 1}}, function (err, article) {
        if(err) {
            console.log(err);
        } else {
            res.redirect(article.url);
        }
    });
    // console.log(req.body);
});


module.exports = router;
