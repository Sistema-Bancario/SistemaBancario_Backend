const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const { transferir, mostrarTransaccionesPorNumeroCuenta } = require('../controllers/transaction');

const router = Router();

router.post('/hacerTransaccion', [
  //validarJWT,
  check('monto', 'Monto obligatorio').not().isEmpty(),
  check('cuentaDestino', 'Destino obligatorio').not().isEmpty(),
  validarCampos
], transferir);

router.get('/vertransacciones/:numeroCuenta',[
],mostrarTransaccionesPorNumeroCuenta)

module.exports = router;