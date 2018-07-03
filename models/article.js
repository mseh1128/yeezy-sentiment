const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const articleSchema = new Schema({
   author: String,
   source: {
      id: String,
      name: String
   },
   title: String,
   url: String,
   urlToImage: String,
   publishedAt: Date,
   viewCount: {
      type: Number,
      default: 0
   },
   sentimentScore: Number,
   sentimentComparative: Number
   });

module.exports = mongoose.model("Article", articleSchema);
