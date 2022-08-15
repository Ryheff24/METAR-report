const redis = require('./redis')
async function run(){
    const express = require('express');
    const app = express();
    const port = 6969;
    const redis = require('./redis');
    
    app.get('/', async (req, res) => {
        if(!req.query.airport){
            res.send('No Airport Code Provided');
            return;
        }
        const airport = req.query.airport
        const metar = await redis.getMetar(airport.toUpperCase());
        if(metar === null || metar === ""){
            res.send('Airport Not Found');
            return;
        }
        res.send(metar);
    });
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

module.exports = { run }
