const { Router } = require('express');
const { check } = require('express-validator');
const {  emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwtAdmin');
const { tieneRole } = require('../middlewares/validar-role-admin');
const { crearCuentaBancaria, editarSaldoCuenta, eliminarCuenta, mostrarCuentasActivas} = require('../controllers/account');

const router = Router();

router.get('/mostrar', mostrarCuentasActivas);

router.post('/crearcuenta', crearCuentaBancaria);

router.put('/editar/:id',editarSaldoCuenta);

router.delete('/eliminar/:id',eliminarCuenta)




module.exports = router;