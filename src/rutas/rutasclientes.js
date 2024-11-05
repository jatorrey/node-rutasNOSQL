// rutasClientes
const express = require('express');
var router = express.Router();
const neo4j = require('neo4j-driver');
const cache = require('./cache');  

let driver = neo4j.driver(
    'neo4j://neo4j01:7687',
    neo4j.auth.basic('neo4j', 'neo4j')
);

// Q9. Obtener la lista de clientes que han contratado más de 3 proyectos en diferentes sucursales.
router.route('/cliente/q9').all(cache).get(async (req, res) => {
   const session = driver.session();
   await session.run('MATCH (c:Cliente)-[:contrataP]->(p:Proyecto)-[:asignadoA]->(s:Sucursal) WITH c, COUNT(DISTINCT s) AS sucursales WHERE sucursales > 3 RETURN c.nombre AS nombre_cliente')
       .then(result => {
           cliente = result.records.map(record => {
               return record.get('nombre_cliente');
           })
           res.data = cliente;
           res.json({ Cliente: cliente });
       })
       .catch(error => {
           console.log(error);
       })
       .then(() => session.close()) 
});

module.exports = router;