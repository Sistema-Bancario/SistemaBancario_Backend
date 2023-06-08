
const { Schema, model } = require('mongoose');

const FavoritoSchema = Schema({
    numeroCuenta: {
        type: String,
        required: true,
        unique: true
    },
    tipoCuenta: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: [true, 'El nickname es obligatorio'],
        unique: true
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('Favorito', FavoritoSchema);
