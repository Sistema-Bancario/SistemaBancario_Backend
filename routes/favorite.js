const { Router } = require('express');
const { check } = require('express-validator');
const { mostrarCuentasFavoritas, postCuentaFavorita } = require('../controllers/favorite');

const router = Router();

router.get('/mostrar',
mostrarCuentasFavoritas);

router.post('/crearFavorito', [
    check("numeroCuenta", "El numero es obligatorio").not().isEmpty(),
    check("tipoCuenta", "El tipo es obligatorio").not().isEmpty(),
    check("nickname", "El apodo es obligatorio").not().isEmpty()
], postCuentaFavorita);

module.exports = router;