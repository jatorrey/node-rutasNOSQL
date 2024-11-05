//rutasSucursales
const express = require('express');
const neo4j = require("neo4j-driver");
var router = express.Router();
const cache = require('./cache');

let driver = neo4j.driver(
    'neo4j://neo4j_Ges:7687',
    neo4j.auth.basic('neo4j', 'neo4j')
);

// Q1. Obtener la lista de sucursales que tienen más de 5 empleados.
router.route('/sucursal/q1').all(cache).get(async (req, res) => {
    const session = driver.session();
    await session.run('MATCH (s:Sucursal)-[:trabajaEn]->(e:Empleado) WITH s, COUNT(e) AS numEmpleados WHERE numEmpleados > 5 RETURN s')
        .then(result => {
            sucursal = result.records.map(record => {
                return record.get('s').properties;
            })
            res.data = sucursal;
            res.json({ Sucursal: sucursal });
        })
        .catch(error => {
            console.log(error);
        })
        .then(() => session.close())
});

// Q7. Obtener la lista de sucursales que han recibido visitas de más de 5 clientes diferentes.
router.route('/sucursal/q7').all(cache).get(async (req, res) => {
    const session = driver.session();
    await session.run('MATCH (s:Sucursal)<-[:enSucursal]-(v:Visita)-[:visitaDe]->(c:Cliente) WITH s, COUNT(DISTINCT c) AS numClientesDiferentes WHERE numClientesDiferentes > 5 RETURN s')
        .then(result => {
            sucursal = result.records.map(record => {
                return record.get('s').properties;
            })
            res.data = sucursal;
            res.json({ Sucursal: sucursal });
        })
        .catch(error => {
            console.log(error);
        })
        .then(() => session.close())
});

// Q10. Encontrar las sucursales que tienen más de 5 desarrolladores especializados en full-stack.
router.route('/sucursal/q10').all(cache).get(async (req, res) => {
    const session = driver.session();
    await session.run('MATCH (s:Sucursal)<-[:trabajaEn]-(e:Empleado {especializacion: "full-stack", tipo: "desarrollador"}) WITH s, COUNT(e) AS numDesarrolladores WHERE numDesarrolladores > 5 RETURN s ')
        .then(result => {
            sucursal = result.records.map(record => {
                return record.get('s').properties;
            })
            res.data = sucursal;
            res.json({ Sucursal: sucursal });
        })
        .catch(error => {
            console.log(error);
        })
        .then(() => session.close())
})

// Q11. Transferir todos los empleados de soporte técnico de una sucursal en específico hacia otra sucursal.
router.route('/sucursal/q11/:origen').all(cache).patch(async (req, res) => {
    const idSucursalOrigen = req.params.origen;
    const idSucursalDestino = req.body.idSucursalDestino;

    const session = driver.session();
    await session.run(`
        MATCH (s1:Sucursal {id: $idSucursalOrigen}), (s2:Sucursal {id: $idSucursalDestino})
        MATCH (e:Empleado {tipo: "soporte"})-[:trabajaEn]->(s1)
        CREATE (e)-[:trabajaEn]->(s2)
        DELETE (e)-[:trabajaEn]->(s1)
        `, { idSucursalOrigen, idSucursalDestino })
        .then(result => {
            sucursal = result.records.map(record => {
                return record.get('s2').properties;
            })
            res.data = sucursal;
            res.json({ Sucursal: sucursal });
        })
        .catch(error => {
            console.log(error);
        })
        .then(() => session.close())
})

module.exports = router;