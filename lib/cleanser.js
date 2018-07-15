module.exports = {
	cleanDate: function(date) {
		// requires a moment
	  return date.format().split('T')[0];
	}
}