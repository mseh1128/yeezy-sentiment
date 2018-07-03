var fs = require('fs');

function createImageFolders(dates) {
  dates.forEach(function(date) {
    const  dir = `../public/assets/imgs/${date}`;
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
  });
}

dates = ['2018-04-06', '2018-04-18'];
createImageFolders(dates);
