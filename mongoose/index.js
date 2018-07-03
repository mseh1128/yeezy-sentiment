const mongoose = require('mongoose');
const uri = require('../lib/apiConfig')['uri'];
mongoose.connect(uri);
