const { Schema, model } = require('mongoose');

const TransferenciaSchema = Schema({
  cuentaOrigen: {
    type: String,
    required: true
  },
  cuentaDestino: {
    type: String,
    required: true
  },
  monto: {
    type: Number,
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  descripcion: {
    type: String,
    required: null
  },
  tipoCuenta: {
    type: String,
    enum: ['monetaria', 'ahorro'],
    required: true
  },
  tipoTransaccion: {
    type: String,
    enum: ['debito', 'credito'],
    default: null
  }
});

module.exports = model('Transferencia', TransferenciaSchema);
