const { request, response } = require('express');
const { Types } = require('mongoose');

const validarEdicionSaldo = (req, res, next) => {
    const { saldo, ...resto } = req.body;

    // Verificar si hay otros campos además de saldo en el body
    const camposRestantes = Object.keys(resto);
    if (camposRestantes.length > 0) {
        return res.status(400).json({
            message: 'Solo se permite editar el campo de saldo'
        });
    }

    next();
};

module.exports = {
    validarEdicionSaldo
};