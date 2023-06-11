const { Router } = require('express');
const { check } = require('express-validator');
const { getFavoritos, agregarContacto, eliminarContacto, eliminarListaContactos } = require('../controllers/favorite');
const { mostrarCuentasFavoritas, postCuentaFavorita } = require('../controllers/favorite');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/mostrar/:id',
getFavoritos);

router.post('/agregarContacto/:id',
agregarContacto);

router.delete('/eliminarContacto/:id',
eliminarContacto);

router.delete('/eliminarLista/:id',
eliminarListaContactos);

router.get('/mostrar',
mostrarCuentasFavoritas);

router.post('/crearFavorito', [
    validarJWT,
    check("numeroCuenta", "El numero es obligatorio").not().isEmpty(),
    check("tipoCuenta", "El tipo es obligatorio").not().isEmpty(),
    check("nickname", "El apodo es obligatorio").not().isEmpty()
], postCuentaFavorita);

module.exports = router;