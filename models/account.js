const { Schema, model } = require('mongoose');

const CuentaSchema = Schema({
    propietario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    numeroCuenta: {
        type: String,
        unique: true,
        required: true
    },
    tipoCuenta: {
        type: String,
        enum: ['monetaria', 'ahorro'],
        required: true
    },
    saldo: {
        type: Number,
        default: 0
    },
    estado: {
        type: Boolean,
        default: true
    },
    transferencias: [{
        type: Schema.Types.ObjectId,
        ref: 'Transferencia'
      }],
    cantidadTransferencias: {
        type: Number,
        default: 0
    },
    favoritos: [{ 
        type: String, 
        ref: 'Favorito' 
    }],
});

module.exports = model('Cuenta', CuentaSchema);
