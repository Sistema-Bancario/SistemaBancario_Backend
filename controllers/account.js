const { response, request } = require('express');
const bcrypt = require('bcryptjs');
const Cuenta = require('../models/account')
const { v4: uuidv4 } = require('uuid');
const Usuario = require('../models/user');


const mostrarCuentasActivas = async (req, res) => {
  try {
    // Buscar todas las cuentas con estado activo
    const cuentasActivas = await Cuenta.find({ estado: true });

    res.json({
      message: 'Cuentas bancarias activas',
      cuentas: cuentasActivas
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al obtener las cuentas bancarias activas'
    });
  }
};

const crearCuentaBancaria = async (req, res) => {
  try {
    const { propietario, tipoCuenta, saldo } = req.body;

    // Generar número de cuenta aleatorio
    const numeroCuenta = uuidv4();

    if (!numeroCuenta) {
      throw new Error('No se pudo generar el número de cuenta');
    }

    // Verificar si el propietario existe
    const propietarioExistente = await Usuario.findById(propietario);

    if (!propietarioExistente) {
      return res.status(404).json({
        message: 'El propietario de la cuenta no existe'
      });
    }

    // Verificar si la cuenta de origen ya existe
    const cuentaExistente = await Cuenta.findOne({ numeroCuenta });

    if (cuentaExistente) {
      return res.status(400).json({
        message: 'La cuenta de origen ya existe'
      });
    }

    // Crear la cuenta bancaria
    const nuevaCuenta = new Cuenta({
      propietario,
      numeroCuenta,
      tipoCuenta,
      saldo
    });

    // Guardar la cuenta en la base de datos
    await nuevaCuenta.save();

    // Agregar el id de la cuenta al nuevo propietario
    propietarioExistente.cuentas.push(nuevaCuenta._id);
    await propietarioExistente.save();

    res.json({
      message: 'Cuenta bancaria creada exitosamente',
      cuenta: nuevaCuenta
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al crear la cuenta bancaria'
    });
  }
};


const editarSaldoCuenta = async (req, res) => {
  try {
    const { id } = req.params;
    const { saldo } = req.body;

    // Validar que el saldo sea un número válido
    if (typeof saldo !== 'number' || isNaN(saldo)) {
      return res.status(400).json({
        message: 'El saldo proporcionado no es válido'
      });
    }

    // Editar el saldo de la cuenta por el ID
    const cuentaEditada = await Cuenta.findByIdAndUpdate(id, { saldo }, { new: true });

    if (!cuentaEditada) {
      return res.status(404).json({
        message: 'No se encontró la cuenta bancaria'
      });
    }

    res.json({
      message: 'Saldo de la cuenta actualizado exitosamente',
      cuentaEditada
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al editar el saldo de la cuenta'
    });
  }
};

const eliminarCuenta = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar la cuenta por su ID
    const cuenta = await Cuenta.findById(id);

    if (!cuenta) {
      return res.status(404).json({
        message: 'No se encontró la cuenta bancaria'
      });
    }

    // Establecer el estado de la cuenta en falso
    cuenta.estado = false;

    // Guardar los cambios en la base de datos
    await cuenta.save();

    res.json({
      message: 'Cuenta bancaria eliminada exitosamente',
      cuenta
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al eliminar la cuenta bancaria'
    });
  }
};







module.exports = {
  crearCuentaBancaria,
  editarSaldoCuenta,
  eliminarCuenta,
  mostrarCuentasActivas,
  
};


