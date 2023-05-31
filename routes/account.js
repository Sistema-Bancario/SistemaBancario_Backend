const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwtAdmin');
const { crearCuentaBancaria, editarSaldoCuenta, eliminarCuenta, mostrarCuentasActivas} = require('../controllers/account');
const { validarUsuarioExistente, validarIdPropietarioValido, validarPropietarioExistente, validarNumeroCuentaUnico } = require('../helpers/db-validatorsAccount');
const { validarEdicionSaldo } = require('../middlewares/validar-account');

const router = Router();

router.get('/mostrar',
mostrarCuentasActivas);

router.post('/crearcuenta',[
    validarJWT,
    check("propietario", "El propietario es obligatorio").not().isEmpty(),
    check("tipoCuenta","El tipo de cuenta es obligatorio").not().isEmpty(),
    check("saldo", "El saldo es obligatorio").not().isEmpty(),
    validarIdPropietarioValido,
    validarPropietarioExistente,
], crearCuentaBancaria);

router.put('/editar/:id',[
    validarJWT,
    check("saldo", "El saldo es obligatorio").not().isEmpty(),
    validarEdicionSaldo
],editarSaldoCuenta);

router.delete('/eliminar/:id',[
    validarJWT,
    
],eliminarCuenta)




module.exports = router;