// npm install and npm start from command line

// Dependencies:
//  scraper: x-ray - https://www.npmjs.com/package/x-ray
//  csv parser: json2csv - https://www.npmjs.com/package/json2csv
//  prettify date: moment - https://www.npmjs.com/package/moment

const fs = require('fs');
const Xray = require('x-ray');
const parser = require('json2csv');
const moment = require('moment');
var x = new Xray();
const url = 'http://shirts4mike.com/shirts.php';

// Create data folder if it doesn't exist.
if (!fs.existsSync('./data/')){
    console.log('Creating data folder.')
    fs.mkdir('.//data', function (error) {
        if (error) {
            // log error messages to scraper-error.log
            let errorLog = moment().format + ' - ' + error;
            console.log(errorLog);
            fs.appendFileSync('scraper-error.log', errorLog + '\n');
        };
    })
}

//The scraper gets the price, title, url and image url from the product page and save this information into a CSV file.

x(url, '.products li',  [{
    title : x('a@href', 'title'),
    price : x('a@href', '.price'),
    imgUrl : 'img@src',
    url : 'a@href'
}])
    ((error, object) => {
        if(error) {
            // log error messages to scraper-error.log
            let errorLog = moment().format() + ' - ' + error;
            console.log(errorLog);
            fs.appendFileSync('scraper-error.log', errorLog + '\n');
            if (error.errno === 'ENOTFOUND') {
                prettyError = '404';
                console.log(`There\'s been a ${prettyError} error. Cannot connect to ${url}`);
            } else {
                console.log(`There\'s been a ${error.errno} error. Cannot connect to ${url}`);
            }
        }
        else {
            // append time
            let now = moment().format('YYYY-MM-DD');
            console.log(typeof now)
            for (key in object){
                object[key].time = now;
            }
            console.log(object);

            // save csv
            let fields = ['title', 'price', 'imgUrl', 'url', 'time'];
            let csv = parser({ data: object, fields: fields});
            console.log(csv);
            fs.writeFileSync('./data/file.csv', csv);
        }
    })