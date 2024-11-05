//cache.js
const redis = require('redis');
const client = redis.createClient({
    socket: {
        host: '172.17.0.2',
        port: 6379,
        timeout: 30000
    }
});
const cache = async function (req, res, next) {
    let fecha = new Date();
    await client.connect();
    await client.set(fecha.toLocaleDateString() + ":" + fecha.getHours() + "-" + fecha.getMinutes() + "-" + fecha.getSeconds(), " - " + req.method + " " + req.route.path);
    await client.disconnect();
    next()
}
module.exports = cache;

//"start": "node src/server.js",