const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarjwtAdmin } = require('../middlewares/validar-jwtAdmin');
const { crearCuentaBancaria, editarSaldoCuenta, eliminarCuenta, mostrarCuentasActivas, obtenerCuentasConMasTransferencias} = require('../controllers/account');
const { validarUsuarioExistente, validarIdPropietarioValido, validarPropietarioExistente, validarNumeroCuentaUnico } = require('../helpers/db-validatorsAccount');
const { validarEdicionSaldo } = require('../middlewares/validar-account');
const { tieneRole } = require('../middlewares/validar-role-admin');
const router = Router();

router.get('/mostrar',
mostrarCuentasActivas);

router.get('/mostrarCuentasConMasTransferencias',
obtenerCuentasConMasTransferencias);

router.post('/crearcuenta',[
    validarjwtAdmin,
    tieneRole("ADMIN_USER"),
    check("propietario", "El propietario es obligatorio").not().isEmpty(),
    check("tipoCuenta","El tipo de cuenta es obligatorio").not().isEmpty(),
    check("saldo", "El saldo es obligatorio").not().isEmpty(),
    validarIdPropietarioValido,
    validarPropietarioExistente,
], crearCuentaBancaria);

router.put('/editar/:id',[
    validarjwtAdmin,
    tieneRole("ADMIN_USER"),
    check("saldo", "El saldo es obligatorio").not().isEmpty(),
    validarEdicionSaldo
],editarSaldoCuenta);

router.delete('/eliminar/:id',[
    validarjwtAdmin,
    tieneRole("ADMIN_USER")
    
],eliminarCuenta)




module.exports = router;