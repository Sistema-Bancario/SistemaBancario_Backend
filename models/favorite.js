const { Schema, model } = require('mongoose');

const FavoritoSchema = Schema({
    numeroCuenta: {
        type: Schema.Types.ObjectId,
        ref: 'Cuenta',
        required: true
    },
    tipoCuenta: {
        type: Schema.Types.ObjectId,
        ref: 'Cuenta',
        required: true
    },
    nickname: {
        type: String,
        required: [true, 'El nickname es obligatorio' ],
        unique: true
    }
});

module.exports = model('Favorito', FavoritoSchema);