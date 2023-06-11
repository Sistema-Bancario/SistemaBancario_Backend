const { Router } = require('express');
const { check } = require('express-validator');
const { getFavoritos, agregarContacto, eliminarContacto, eliminarListaContactos } = require('../controllers/favorite');
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


module.exports = router;