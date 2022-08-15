const { createClient } = require('redis');

const client = createClient();

client.on('error', (err) => console.log('Redis Client Error', err));

client.connect();

async function pushToRedis(key, value){  
    await client.set(key, value);
}
async function getMetar(key){
    return await client.get(key);
}

module.exports = { pushToRedis, getMetar };