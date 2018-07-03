const express             = require('express'),
      app                 = express(),
      db                  = require('./mongoose'),
      bodyParser          = require('body-parser'),
      Article             = require('./models/article'),
      Week                = require('./models/week'),
      sentimentSymbols    = require('./lib/sentiment/sentiment')


// requiring routes
const articleRoutes    = require('./routes/articles'),
      weekRoutes       = require('./routes/weeks')
      indexRoutes      = require('./routes/index'),
      faqRoutes        = require('./routes/faq');

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.locals.symbols = sentimentSymbols;
setLocalRange(); // gg async method

// add error handling middleware

app.use('/', indexRoutes);
app.use('/faq', faqRoutes);
app.use('/weeks', weekRoutes);
app.use('/articles', articleRoutes);


app.listen(3000, function(){
   console.log('Kanye server has started!');
});

function setLocalRange() {
    let range = []
    Week.find({}, function(err, weeks) {
        weeks.forEach(function(week) {
            range.push(week.name);
        })
    }).then(function() {
        app.locals.range = range;
    })
}

