const { Schema, model } = require('mongoose');

const UsuarioAdminSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio' ],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio' ]
    },
    img: {
        type: String
    },
    rol: {
        type: String,
        default: 'ADMIN_USER'
    },
    estado: {
        type: Boolean,
        default: true
    }
    
});


module.exports = model('UsuarioAdmin', UsuarioAdminSchema);