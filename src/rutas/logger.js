// Exportar una función middleware que se ejecutará en cada solicitud
const redis = require('redis');
const client = redis.createClient({
    socket:{
        port:6379,
        host:'redis01'
    }
});

// Exportar una función middleware que se ejecutará en cada solicitud
module.exports = (req, res, next) => {
    res.on('finish', async () => {
        await client.connect();
        const key = `${req.method}:${Date.now()}:${req.originalUrl}`;
        const valor = JSON.stringify({
            clave: key,
            time: new Date(),
            req: {
                method: req.method,
                url: req.originalUrl,
                headers: req.headers,
                body: req.body
            },
            res: {
                statusCode: res.statusCode,
                statusMessage: res.statusMessage,
                response: req.method === 'GET' ? res.data : null
            }
        });
        console.log(valor)
        await client.set(key, valor);
        await client.disconnect();
    });
    next();
};