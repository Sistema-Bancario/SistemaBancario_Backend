const { Router } = require('express');
const { validarCampos } = require('../middlewares/validar-campos');
const { mostrarCuentasActivas, misCuentas, obtenerCuentasConMasTransferencias, crearCuentaBancaria, editarSaldoCuenta, eliminarCuenta, mostrarCuentasId, mostrarCuentasSaldoId, historial, buscarCuentaPorNumero } = require('../controllers/account');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarjwtAdmin } = require('../middlewares/validar-jwtAdmin');
const { check } = require('express-validator');
const { tieneRole } = require('../middlewares/validar-role-admin');
const { validarIdPropietarioValido, validarPropietarioExistente } = require('../helpers/db-validatorsAccount');
const { validarEdicionSaldo } = require('../middlewares/validar-account');

const router = Router();

router.get('/mostrar', mostrarCuentasActivas);

router.get('/misCuentas', [
  validarJWT,
  validarCampos], misCuentas);

router.get('/mostrarCuentasConMasTransferencias/:id', [
  validarjwtAdmin
], obtenerCuentasConMasTransferencias);

router.get('/historial/:id', [
  validarJWT,
  validarCampos], historial);

  router.get('/buscarporNum/:id', [
    validarJWT,
    validarCampos
  ], buscarCuentaPorNumero);

router.post('/crearcuenta', [
  validarjwtAdmin,
  tieneRole('ADMIN_USER'),
  check('propietario', 'El propietario es obligatorio').not().isEmpty(),
  check('tipoCuenta', 'El tipo de cuenta es obligatorio').not().isEmpty(),
  check('saldo', 'El saldo es obligatorio').not().isEmpty(),
  validarIdPropietarioValido,
  validarPropietarioExistente
], crearCuentaBancaria);

router.put('/editar/:id', [
  validarjwtAdmin,
  tieneRole('ADMIN_USER'),
  check('saldo', 'El saldo es obligatorio').not().isEmpty(),
  validarEdicionSaldo
], editarSaldoCuenta);

router.get('/cuentaSaldoId/:id', [
  validarjwtAdmin,
], mostrarCuentasSaldoId);

router.delete('/eliminar/:id', [
  validarjwtAdmin,
  tieneRole('ADMIN_USER')
], eliminarCuenta);

module.exports = router;
