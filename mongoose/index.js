const mongoose = require('mongoose');
const uri = require('../config').newsApi.uri;
mongoose.connect(uri);
