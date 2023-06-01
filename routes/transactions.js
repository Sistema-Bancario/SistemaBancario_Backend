const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const { realizarTransferencia } = require('../controllers/transaction');

const router = Router();

router.post('/hacerTransaccion', [
  validarJWT,
  check('monto', 'Monto obligatorio').not().isEmpty(),
  check('cuentaDestino', 'Destino obligatorio').not().isEmpty(),
  validarCampos
], realizarTransferencia);

module.exports = router;