const Favorito = require('../models/favorite');
const Cuenta = require('../models/account');
const Usuario = require('../models/user');


const getFavoritos = async (req, res) => {
    const { id } = req.params
    //id = id cuenta, por lo tanto se debe buscar en la cuenta y si existe setear el nocuenta en el find
    const buscaCuenta = await Cuenta.findOne({numeroCuenta: id});
    if (buscaCuenta) {
        try {
            const favoritos = await Favorito.findOne({ numeroCuenta: buscaCuenta.numeroCuenta });
            res.json({favoritos});
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los favoritos' });
        }
    } else {
        res.json({ error: 'Error al obtener los favoritos' });
    }
};

const agregarContacto = async (req, res) => {
    const { id } = req.params; // ID del favorito
    const { noCuentaUsuario, nickname } = req.body;
    const cuentaUsuario = await Cuenta.findOne({ numeroCuenta: noCuentaUsuario});
    const usuario = await Usuario.findById({_id: cuentaUsuario.propietario})
    try {
      // Verificar si el favorito existe
      const favorito = await Favorito.findById(id);
  
      if (!favorito) {
        return res.status(404).json({ error: 'No se encontró el favorito' });
      }
  
      // Verificar si la cuenta del usuario existe
      const cuentaEncontrada = await Cuenta.findOne({ numeroCuenta: noCuentaUsuario });
      if (!cuentaEncontrada) {
        return res.status(404).json({ error: 'No se encontró la cuenta del usuario' });
      }
  
      // Agregar el contacto al favorito
      favorito.contactos.usuarios.push({ cuentas: noCuentaUsuario, nickname: nickname, img: usuario.img });
  
      // Guardar el favorito actualizado en la base de datos
      const favoritoActualizado = await favorito.save();
  
      res.json(favoritoActualizado);
    } catch (error) {
      res.status(500).json({ error: 'Error al agregar el contacto', error });
    }
  };
  
  module.exports = {
    agregarContacto
  };

  const eliminarContacto = async (req, res) => {
    const { id } = req.params;
    const { idUsuario } = req.body;
  
    try {
      const favorito = await Favorito.findById(id);
  
      if (!favorito) {
        return res.status(404).json({ error: "Favorito no encontrado" });
      }
  
      const usuarioIndex = favorito.contactos.usuarios.pull(idUsuario);
      if (usuarioIndex === -1) {
        return res.status(404).json({ error: "Contacto no encontrado" });
      }
  
      favorito.contactos.usuarios.splice(usuarioIndex, 1);
  
      await favorito.save();
      res.json(favorito);
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar el contacto" });
    }
  };

const eliminarListaContactos = async (req, res) => {
    const { id } = req.params
    //id favoritos
    try {
        const favorito = await Favorito.findById(id);

        if (!favorito) {
            return res.status(404).json({ error: 'Favorito no encontrado' });
        }

        favorito.contactos.usuarios = [];

        await favorito.save();
        res.json(favorito);
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la lista de contactos' });
    }
};

module.exports = {
    getFavoritos,
    agregarContacto,
    eliminarContacto,
    eliminarListaContactos
};
=======
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
