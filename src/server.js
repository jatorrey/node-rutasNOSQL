const express = require('express');
const app = express();
const neo4j = require("neo4j-driver");
const bodyParser = require('body-parser');
const PORT = 3000;


const rutaPruebaMateria = require('./rutas/rutasmaterias.js');
const rutaPruebaAlumno = require('./rutas/rutasalumnos.js');
const rutaPruebaSucursal = require('./rutas/rutassucursales.js');
const rutaPruebaProyecto = require('./rutas/rutasproyectos.js');
const rutaPruebaEmpleado = require('./rutas/rutasempleados.js');
const rutaPruebaCliente = require('./rutas/rutasclientes.js');
const logger = require('./rutas/logger.js');

//middlewares
app.use(logger);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', rutaPruebaMateria, rutaPruebaAlumno, rutaPruebaSucursal, rutaPruebaEmpleado, rutaPruebaProyecto, rutaPruebaCliente);
app.listen(PORT, () => { console.log('Server en http://localhost:' + PORT) });