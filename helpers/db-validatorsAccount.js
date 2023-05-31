const Cuenta = require('../models/account'); // Ajusta la ruta hacia tu modelo de cuenta
const Usuario = require("../models/user");
const { Types } = require('mongoose');

const validarNumeroCuentaUnico = async (numeroCuenta) => {
  const cuentaExistente = await Cuenta.findOne({ numeroCuenta });

  if (cuentaExistente) {
    throw new Error('El número de cuenta ya está en uso');
  }
};

const validarIdPropietarioValido = (req, res, next) => {
  const { propietario } = req.body;

  // Verificar si el ID del propietario es válido
  if (!Types.ObjectId.isValid(propietario)) {
    return res.status(400).json({
      message: 'El ID del propietario de la cuenta no es válido, revisa ome'
    });
  }

  next();
};

const validarPropietarioExistente = async (req, res, next) => {
  const { propietario } = req.body;

  try {
    // Verificar si el propietario existe
    const propietarioExistente = await Usuario.findById(propietario);

    if (!propietarioExistente) {
      return res.status(404).json({
        message: 'El propietario de la cuenta no existe mala suerte jajajja'
      });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al verificar el propietario de la cuenta'
    });
  }
};

module.exports = {
  validarIdPropietarioValido,
  validarPropietarioExistente,
  validarNumeroCuentaUnico
};

