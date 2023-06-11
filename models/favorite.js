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
    fecha: {
        type: Date,
        default: Date.now
    },
    contactos: {
        usuarios: [{
            cuentas: {
                type: String,
                default: ''
            },
            nickname: {
                type: String,
                default: ''
            },
            img:{
                type: String,
                default: ''
            }
        }],
    }
}, { timestamps: true });

module.exports = model('Favorito', FavoritoSchema);
