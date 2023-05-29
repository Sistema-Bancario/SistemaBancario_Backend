const { Schema, model } = require('mongoose');

const CuentaSchema = Schema({
    propietario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    accountNumber: {
        type: Number,
        unique: true,
        required: true
    },
    typeOfaccount:{
        type: String,
        required: true  
    }


})

module.exports = model('Cuenta', CuentaSchema);