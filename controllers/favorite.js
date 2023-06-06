const { response, request } = require('express');
const Favorito = require('../models/favorite');

const mostrarCuentasFavoritas = async (req, res) => {
    try {
        const cuentasFavoritas = await Favorito.find({ estado: true })

        res.json({
            message: 'Cuentas favoritas',
            cuentas: cuentasFavoritas
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al obtener las cuentas favoritas'
        });
    }
};

const postCuentaFavorita = async (req, res) => {
    try {
        const { numeroCuenta, tipoCuenta, nickname } = req.body;

        const cuentaExistente = await Favorito.findOne({ numeroCuenta });

        if (cuentaExistente) {
            return res.status(400).json({
                message: 'La cuenta ya existe'
            });
        }

        const crearFavorito = new Favorito({
            numeroCuenta,
            tipoCuenta,
            nickname
        });

        await crearFavorito.save();

        res.json({
            message: 'Cuenta favorita guardada',
            cuenta: crearFavorito
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al crear guardar favorito'
        });
    }
};

module.exports = {
    mostrarCuentasFavoritas,
    postCuentaFavorita
}