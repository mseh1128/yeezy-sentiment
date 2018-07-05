const express             = require('express'),
      app                 = express(),
      db                  = require('./mongoose'),
      bodyParser          = require('body-parser'),
      flash               = require('connect-flash'),
      Article             = require('./models/article'),
      Week                = require('./models/week'),
      sentimentSymbols    = require('./lib/sentiment/sentiment'),
      cookieParser        = require('cookie-parser'),
      session             = require('express-session');


// requiring routes
const articleRoutes    = require('./routes/articles'),
      weekRoutes       = require('./routes/weeks')
      indexRoutes      = require('./routes/index'),
      faqRoute         = require('./routes/faq'),
      contactRoute     = require('./routes/contact');

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.use(cookieParser('secret'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

app.use(function(req, res, next) {
  res.locals.danger = req.flash("danger");
  res.locals.success = req.flash("success");
  next();
});

app.locals.symbols = sentimentSymbols;
setLocalRange(); // gg async method

// add error handling middleware

app.use('/', indexRoutes);
app.use('/faq', faqRoute);
app.use('/contact', contactRoute);
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

