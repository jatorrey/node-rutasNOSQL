//rutasEmpleados
const express = require('express');
const neo4j = require("neo4j-driver");
var router = express.Router();
const cache = require('./cache');

let driver = neo4j.driver(
    'neo4j://neo4j_Ges:7687',
    neo4j.auth.basic('neo4j', 'neo4j')
);

// Q2. Encontrar los gerentes que gestionan más de 3 proyectos simultáneamente.
router.route('empleado/q2').all(cache).get(async (req, res) => {
    const session = driver.session();
    await session.run('MATCH (e:Empleado {tipo: "gerente"})-[:gestionadoPor]->(p:Proyecto) WITH e, COUNT(p) AS numProyectos WHERE numProyectos > 3 RETURN e')
        .then(result => {
            empleado = result.records.map(record => {
                return record.get('e').properties;
            })
            res.data = empleado;
            res.json({ Empleado: empleado });
        })
        .catch(error => {
            console.log(error);
        })
        .then(() => session.close())
});

// Q3.  Obtener la lista de desarrolladores con especialización en back-end que están trabajando en más de 2 proyectos.
router.route('/empleado/q3').all(cache).get(async (req, res) => {
    const session = driver.session();
    await session.run('MATCH (e:Empleado {especializacion: "back-end"})-[:trabajaEn]->(p:Proyecto) WITH e, COUNT(p) AS numProyectos WHERE numProyectos > 2 RETURN e')
        .then(result => {
            empleado = result.records.map(record => {
                return record.get('e').properties;
            })
            res.data = empleado;
            res.json({ Empleado: empleado });
        })
        .catch(error => {
            console.log(error);
        })
        .then(() => session.close())
});

// Q5. Listar los empleados de soporte técnico de todas las sucursales
router.route('/empleado/q5').all(cache).get(async (req, res) => {
    const session  = driver.session();
    await session.run('MATCH (e:Empleado {tipo: "soporte"})-[:trabajaEn]->(s:Sucursal) RETURN e')
        .then(result => {
            empleado = result.records.map(record => {
                return record.get('e').properties;
            })
            res.data = empleado;
            res.json({ Empleado: empleado });
        })
        .catch(error => {    
            console.log(error);
        })
        .then(() => session.close())
});

// Q8. Encontrar a los desarrolladores que han trabajado en proyectos con un presupuesto total mayor a $500,000.
router.route('/empleado/q8').all(cache).get(async (req, res) => {
    const session = driver.session();
    await session.run('MATCH (e:Empleado {tipo: "desarrollador"})-[:trabajaEn]->(s:Sucursal)-[:asignadoA]->(p:Proyecto) WITH e, SUM(p.presupuesto) AS presupuestoTotal WHERE presupuestoTotal > 500000 RETURN e')
        .then(result => {
            empleado = result.records.map(record => {
                return record.get('e').properties;
            })
            res.data = empleado;
            res.json({ Empleado: empleado });
        })
        .catch(error => {
            console.log(error);
        })
        .then(() => session.close())
});



module.exports = router;