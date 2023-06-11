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