const { Schema, model } = require('mongoose');

const TransactionSchema = Schema({
    cuentaOrigen: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    monto: {
        type: Number,
        required: [true, 'Monto obligatorio']
    },
    cuentaDestino: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        required: [true, 'Fecha de transaccion obligatoria']
    },
    estado: {
        type: Boolean,
        default: true
    }
});


module.exports = model('Transaccione', TransactionSchema);