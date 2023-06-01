const express = require('express');
const router = express.Router();

// Importar el controlador o la función que maneja la solicitud
const { mostrarCambioDivisas } = require('../controllers/divisa');

// Ruta para mostrar el cambio de divisas
router.get('/mostrarDivisas', mostrarCambioDivisas);

module.exports = router;
