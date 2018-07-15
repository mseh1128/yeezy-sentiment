let config = {};

config.newsApi = {
  searchTerm: "Kanye West",
  numOfResults: 100, // newsAPI has max of 100, default of 20
  numOfWeeks: 10, // upper limit
  uri: "mongodb://localhost/yeezy"
}

config.smtp = {
    GMAIL_USER: process.env.GMAIL_USER || 'username',
    GMAIL_PASS: process.env.GMAIL_PASS || 'password'
}


module.exports = config;
