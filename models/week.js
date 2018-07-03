const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const weekSchema = new Schema({
    name: String,
    articles: [
        {
             type: mongoose.Schema.Types.ObjectId,
             ref: "Article"
        }
    ]
});

module.exports = mongoose.model("week", weekSchema);
