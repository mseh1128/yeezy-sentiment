const newsApiConfig = {
  searchTerm: "Kanye West",
  numOfResults: 100, // newsAPI has max of 100, default of 20
  numOfWeeks: 10,
  uri: "mongodb://localhost/yeezy"
}

module.exports = newsApiConfig;
