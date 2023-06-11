const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
<<<<<<< Updated upstream
const { validarJWT } = require('../middlewares/validar-jwtAdmin');
const { crearCuentaBancaria, editarSaldoCuenta, eliminarCuenta, mostrarCuentasActivas} = require('../controllers/account');
const { validarUsuarioExistente, validarIdPropietarioValido, validarPropietarioExistente, validarNumeroCuentaUnico } = require('../helpers/db-validatorsAccount');
const { validarEdicionSaldo } = require('../middlewares/validar-account');

=======
const { validarjwtAdmin } = require('../middlewares/validar-jwtAdmin');
const { crearCuentaBancaria, editarSaldoCuenta, eliminarCuenta, mostrarCuentasActivas, obtenerCuentasConMasTransferencias, misCuentas} = require('../controllers/account');
const { validarUsuarioExistente, validarIdPropietarioValido, validarPropietarioExistente, validarNumeroCuentaUnico } = require('../helpers/db-validatorsAccount');
const { validarEdicionSaldo } = require('../middlewares/validar-account');
const { tieneRole } = require('../middlewares/validar-role-admin');
const { validarJWT } = require('../middlewares/validar-jwt');
>>>>>>> Stashed changes
const router = Router();

router.get('/mostrar',
mostrarCuentasActivas);

<<<<<<< Updated upstream
=======
router.get('/misCuentas',[validarJWT, validarCampos],
misCuentas);

router.get('/mostrarCuentasConMasTransferencias',
obtenerCuentasConMasTransferencias);

>>>>>>> Stashed changes
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