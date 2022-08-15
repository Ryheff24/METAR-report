var axios = require('axios');
const path = require("path");
const fs = require("fs");
const cacheFile = path.resolve(__dirname, "redis.json");
let cache = JSON.parse(fs.readFileSync(cacheFile, "utf-8"));
const redis = require('./redis')
const api = require('./api')
api.run();


var config = {
  method: 'get',
  url: 'https://www.aviationweather.gov/adds/dataserver_current/current/metars.cache.csv',
  headers: { }
};
setTimeout(() => {
    axios(config)
    .then(function (response) {
        const raw = response.data;
        const lineSplit = raw.split("\n");;
        for(var i = 0; i < 5; i++){
            lineSplit.splice(0, 1);
        }
        const array = []
        var metars = lineSplit.join('\n');
        const json = csvJSON(metars);
        const map = json.map(e => e.raw_text)
        for(var i = 0; i < map.length; i++){
            let identifier = map[i].slice(0, 4)
            const metarReport = map[i]//.substring(5)
            const key = {
                [identifier] : metarReport,
            }
            redis.pushToRedis(identifier, metarReport)

        }
    })
    .catch(function (error) {
    console.log(error);
});
}, 600000);
function csvJSON(csv){

    var lines=csv.split("\n");
  
    var result = [];
  
    // NOTE: If your columns contain commas in their values, you'll need
    // to deal with those before doing the next step 
    // (you might convert them to &&& or something, then covert them back later)
    // jsfiddle showing the issue https://jsfiddle.net/
    var headers=lines[0].split(",");
  
    for(var i=1;i<lines.length;i++){
  
        var obj = {};
        var currentline=lines[i].split(",");
  
        for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        }
  
        result.push(obj);
  
    }
  
    //return result; //JavaScript object
    return result
}