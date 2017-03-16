
//Create a scraper.js file that will contain your command line application. - DONE
// Your project should also include a package.json file that includes your project’s dependencies. - DONE
// The npm install command should install your dependencies. - DONE

//Choose and use two third-party npm packages. One package should be used to scrape content from the site. -DONE
// The other package should create the CSV file. Be sure to research the best package to use -DONE
// Both packages should meet the following requirements: At least 1,000 downloads; Has been updated in the last six months - DONE

//Program your scraper to check for a folder called ‘data’.
// If the folder doesn’t exist, the scraper should create one.
// If the folder does exist, the scraper should do nothing.

const fs = require('fs');
const Xray = require('x-ray');
const parser = require('json2csv');
const moment = require('moment');
var x = new Xray();
const url = 'http://shirts4mike.com/shirts.php';

//Program your scraper to check for a folder called ‘data’. Create if it doesn't exist.
if (!fs.existsSync('./data/')){
    console.log('Creating data folder.')
    fs.mkdir('./data', function (err) {
        if (err) throw error;
    })
} else {
    console.log('Data folder already exists.')
}

//The scraper should get the price, title, url and image url from the product page
// and save this information into a CSV file.

x(url, '.products li',  [{
    title : x('a@href', 'title'),
    price : x('a@href', '.price'),
    imgUrl : 'img@src',
    url : 'a@href'
}])
    ((error, object) => {
        if(error) {
            let errorLog = moment() + ' ' + error;
            console.log(errorLog);
            fs.appendFileSync('scraper-error.log', error)
            console.log(error);
        }
        else {
            let now = moment().format('YYYY-MM-DD');
            console.log(typeof now)
            for (key in object){
                object[key].time = now;
            }
            console.log(object);
            let fields = ['title', 'price', 'imgUrl', 'url', 'time'];
            let csv = parser({ data: object, fields: fields});
            console.log(csv);
            fs.writeFileSync('./data/file.csv', csv);
        }
    })


