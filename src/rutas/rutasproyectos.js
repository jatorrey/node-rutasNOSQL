//rutasProyectos
const express = require('express');
const neo4j = require("neo4j-driver");
var router = express.Router();
const cache = require('./cache');

let driver = neo4j.driver(
    'neo4j://neo4j01:7687',
    neo4j.auth.basic('neo4j', 'neo4j')
);

// Q4. Obtener la lista de proyectos que tienen un presupuesto mayor a $1,000,000.
router.route('/proyecto/q4').all(cache).get(async (req, res) => {
    const session = driver.session();
    await session.run('MATCH (p:Proyecto) WHERE p.presupuesto > 1000000 RETURN p')
        .then(result => {
            proyecto = result.records.map(record => {
                return record.get('p').properties;
            })
            res.data = proyecto;
            res.json({ Proyecto: proyecto });
        })
        .catch(error => {
            console.log(error);
        })
        .then(() => session.close())
});

// Q6. Encontrar los proyectos que corresponden a un cliente en específico.
router.route('/proyecto/q6').all(cache).get(async (req, res) => {
    const session = driver.session();
    await session.run('MATCH (c:Cliente {nombre: $nombre})-[:contrataP]->(p:Proyecto) RETURN p',{
        nombre: req.params.nombre
    })
        .then(result => {
            proyecto = result.records.map(record => {
                return record.get('p').properties;
            })
            res.data = proyecto;
            res.json({ Proyecto: proyecto });
        })
        .catch(error => {
            console.log(error);
        })
        .then(() => session.close())
});

module.exports = router;