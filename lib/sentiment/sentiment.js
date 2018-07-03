const sentimentCodes = require('./constants');

module.exports = {
    sentimentScore: function(score) {
        if(score > 20) {
            return sentimentCodes.SENTIMENT_SCORE['HAPPY'];
        } else if(score < 20 && score > -20) {
            return sentimentCodes.SENTIMENT_SCORE['INDIFFERENT'];
        } else {
            return sentimentCodes.SENTIMENT_SCORE['SAD'];
        }
    },
    sentimentComparative: function(comparative) {
        if(comparative > 0.05) {
            return sentimentCodes.SENTIMENT_COMPARATIVE['POSITIVE'];
        } else if(comparative < 0.05 && comparative > -0.02 ) {
            return sentimentCodes.SENTIMENT_COMPARATIVE['AMBIVALENT'];
        } else {
            return sentimentCodes.SENTIMENT_COMPARATIVE['NEGATIVE'];
        }
    }
};
