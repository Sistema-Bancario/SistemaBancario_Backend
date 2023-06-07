const { response, request } = require('express');
const Favorito = require('../models/favorite');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');


const mostrarCuentasFavoritas = async (req, res) => {
    try {
        const cuentasFavoritas = await Favorito.find()

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
                message: 'La cuenta ya existe en favoritos'
            });
        }

        const token = req.header('x-token');

        if (!token) {
            return res.status(401).json({
                message: 'No se proporcionó un token JWT'
            });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY_FOR_TOKEN);

        const propietarioId = decoded.uid;

        const usuario = await User.findById(propietarioId);

        if (!usuario) {
            return res.status(400).json({
                message: 'El usuario no existe'
            });
        }

        usuario.favoritos.push(numeroCuenta); 

        await usuario.save();

        const crearFavorito = new Favorito({
            numeroCuenta,
            tipoCuenta,
            nickname,
            fecha: new Date()
        });

        await crearFavorito.save();

        res.json({
            message: 'Cuenta favorita guardada',
            cuenta: crearFavorito
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al guardar el favorito'
        });
    }
};






module.exports = {
    mostrarCuentasFavoritas,
    postCuentaFavorita
}