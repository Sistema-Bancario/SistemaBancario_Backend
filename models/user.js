const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio' ],
        unique: true
    },
    nickname: {
        type: String,
        required: [true, 'El nickname es obligatorio' ],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio' ]
        
    },
    cuentas: [{                                // Agregué el campo 'cuentas' como un arreglo
        type: Schema.Types.ObjectId,
        ref: 'Cuenta',
        default: []
    }],
    DPI: {
        type: Number,
        required: [true, 'El DPI es obligatorio' ]
    },
    direccion: {
        type: String,
        required: [true, 'su direccion es obligatoria' ]
    },
    celular: {
        type: Number,
        required: [true, 'El telefono es obligatorio' ]
    },
    trabajo: {
        type: String,
        required: [true, 'El trabajo es obligatorio' ]
    },
    ingresos: {
        type: Number,
        required: [true, 'sus ingresos son obligatorios' ]
    },
    favoritos: [{ 
        type: String, 
        ref: 'Cuenta' 
    }],
    img: {
        type: String,
        default: null
    },
    rol: {
        type: String,
        default:  'USER_ROLE'  
      },
    estado: {
        type: Boolean,
        default: true
    },
  
    
});


module.exports = model('Usuario', UsuarioSchema);