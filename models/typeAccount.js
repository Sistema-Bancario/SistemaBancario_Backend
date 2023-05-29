const { Schema, model } = require('mongoose');

const TypeAccountSchema = Schema({

    tipo:{
        type: String,
        required: [true , 'El Tipo de cuenta es obligatorio']
    }


});

module.exports = model('TypeAccount', TypeAccountSchema);