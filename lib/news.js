
const mongoose = require("mongoose");
const Article = require("../models/article");
const Week = require("../models/week");
const moment = require("moment");
const newsConfig = require("./apiConfig");
const fs = require('fs');
// const download = require('image-downloader');
// Script for data collection from news w/ sentiment

const NewsAPI = require("newsapi");
const newsapi = new NewsAPI("e91fd886e11143148166979a931b8644");
const request = require("request");
const extractor = require("unfluff");
const Sentiment = require("sentiment");
const sentiment = new Sentiment();

const currentDate = new Date();

// Example config file
//
// const newsConfig = {
//   searchTerm: "Kanye West",
//   numOfResults: 5, // newsAPI has max of 100, default of 20
//   numOfWeeks: 10,
//   uri: "mongodb://localhost/yeezy"
// }


mongoose.connect(newsConfig.uri).then(function() {
  Week.find({}, function (err, queries) {
    let weeks = [];
    queries.forEach(function(week) {
      weeks.push(week.name);
    });
    const allDates = lastNWeeks(currentDate, newsConfig.numOfWeeks); // starting from last friday
    // gets rid of weeks whose data we already have
    const allOriginalDates = allDates.filter(date => weeks.indexOf(date) == -1);
    if (allOriginalDates.length !== 0) {
      createDateModels(allOriginalDates, function() { // don't pass in the first one
        createImageFolders(allOriginalDates);
        saveAllNews(allOriginalDates, newsConfig);
      });
    } else {
      console.log('No original dates');
    }
    });
}).catch(err => console.log(err));


function findWeeks(query) {
  let weeks = [];
  query.forEach(function(week) {
    weeks.push(week.name);
  })
};

function createDateModels(dates, cb) {
    let datesProcessed = 0;
    dates.forEach(function(date){
      createDateModel(date, function() {
          datesProcessed++;
          if(datesProcessed === dates.length) {
            cb();
          }
      });
    });
}

function createDateModel(startDate, cb) {
  // if we cannot find it
    Week.create({name: startDate}, function(err, week) {
          if(err) {
            console.log(err);
          } else {
            cb();
          }
        });
}


function createImageFolders(dates) {
  dates.forEach(function(date) {
    const dir = `../public/assets/imgs/${date}`;
    if (!fs.existsSync(dir)){
      // fs.rmdir
      fs.mkdirSync(dir);
    }
  });
}

function lastNWeeks(startDate, numOfWeeks) {
  const dates = [getPreviousFriday(startDate)];
  for(let i = 0; i < numOfWeeks; i++) {
      startDate.setDate(startDate.getDate()-7);
      dates.push(getPreviousFriday(startDate));
  }
  return dates;
}

function getPreviousFriday(date) {
  // gets last friday (including current date if it is friday-sunday) and formats it
  const momentDate = moment(date);
  const lastFriday = momentDate.day(momentDate.day() >= 5 ? 5 : -2);
  return lastFriday.format().split('T')[0];
}

function saveAllNews(dates, searchOptions) {
    for(let i = dates.length-1; i > 0; i--) {
        saveWeeklyNews(dates[i], dates[i-1], searchOptions);
    }
}

function saveWeeklyNews(start, end, config) {
    yeezyNews = newsapi.v2.everything({
    q: config.searchTerm,
    from: start,
    to: end,
    language: "en",
    sortBy: "popularity",
    pageSize: config.numOfResults,
    page: 1
    }).then(response => {
      console.log(`Start: ${start}, End: ${end}`)
        response.articles.forEach(function(article) {
            // ensures no duplicate articles
            Article.count({url: article.url}, function(err, count) {
              if(count === 0) {
                saveNewsArticle(article, end);
              }
            });
        });
    })
 }


 function saveNewsArticle(article, startDate) {
  request(article.url, function (error, response, body) {
    if(!error && response.statusCode == 200) {
        // get object for assigning to model
        const articleSentiments = getArticleSentiment(body, article.description);
        delete article.description;
        article.title = cleanArticleTitle(article);
        const completeArticle = Object.assign(articleSentiments, article);
        Week.findOne({name: startDate}, function(err, week) {
          if(!err) {
            Article.create(completeArticle, function(err, article) {
              if(!err) {
                console.log(article);
                week.articles.push(article);
                week.save();
              } else {
                console.log(err);
              }
            })
          } else {
            console.log(err);
          }
        })
    }
  });
 }

 function getArticleSentiment(articleBody, articleDescription) {
                  const webData = extractor(articleBody, "en");
                  const mainData = webData.text;
                  const [cleanedBody, cleanedDesc] = cleanData(mainData, articleDescription);
                  allBodyContent = [articleBody, mainData, cleanedBody];
                  descriptionInBody = allBodyContent.some(function(content) {
                        return content.indexOf(cleanedDesc) !== -1;
                  });
                  const bodySentiment = sentiment.analyze(cleanedBody)
                  const finalComparativeSentiment = bodySentiment.comparative;
                  // if description is not in body, then count in for sentiment score
                  const finalScoreSentiment = descriptionInBody ? bodySentiment.score : bodySentiment.score+sentiment.analyze(cleanedDesc).score;
                  return {
                    sentimentScore: finalScoreSentiment,
                    sentimentComparative: finalComparativeSentiment.toFixed(3), // only 3 decimal places
                  };
 }

function cleanData(articleBody, articleDescription) {
  // removes whitespace which would be counter as tokens in sentiment analysis
  const cleanedBody = articleBody.trim().replace(/[\r\n]+/g, " ");
  // removes ellipsis, Read more, and horizontal ellipsis for descriptionInBody
  const cleanedDesc = articleDescription.replace(/(Read more)?([.]{3})|\s?(…)$/, "");
  return [cleanedBody, cleanedDesc];
}

function cleanArticleTitle(article) {
  let title = article.title;
  const lastCharacter = title.slice(-1);
  // if ( [ 'a', 'b', 'c' ].indexOf( mystring ) > -1 ) { ... }
  // may use above (or ES7 includes equivalent) if more equality comparisons needed
  if(lastCharacter === "?" || lastCharacter === "!") {
    return title;
  } else if(lastCharacter === "'" || lastCharacter === '"') {
    title = `${title.slice(0, -1)}.${lastCharacter}`;
    return title;
  }
  return `${title}.`;
}


// function saveArticleImage(article, id, endDate) {
//   const image = article.urlToImage;
//   const relativeImageLocation = `/assets/imgs/${endDate}/${id}`;
//   const imageLocation = `../public${relativeImageLocation}`;

//   const options = {
//     url: image,
//     dest: imageLocation                  // Save to /path/to/dest/image.jpg
//   }

//   download.image(options).then(({filename, image}) => {
//     console.log('File saved to', filename);
//     // return relativeImageLocation;
//   }).catch((err) => {
//     console.log(err);
//   })
//   //
// }
