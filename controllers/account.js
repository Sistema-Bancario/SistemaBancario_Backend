const { response, request } = require('express');
const bcrypt = require('bcryptjs');
const Cuenta = require('../models/account');
const { v4: uuidv4 } = require('uuid');
const Usuario = require('../models/user');
const Favorito = require('../models/favorite');

const mostrarCuentasActivas = async (req = request, res = response) => {
  try {
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

const mostrarCuentasSaldoId = async (req = request, res = response) => {
  const {id} = req.params;
  try {
    const cuentaId = await Cuenta.findById(id);
    const saldo = cuentaId.saldo;

    res.json({
      message: 'Cuenta con saldo:',
      saldo
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al obtener las cuentas bancarias activas'
    });
  }
};

const misCuentas = async (req = request, res = response) => {
  const id = req.usuario.id;
  try {
    const cuentasActivas = await Cuenta.find({ propietario: id });
    const saldo= cuentasActivas.saldo;
    res.json({
      cuentas: cuentasActivas,
      saldo
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al obtener las cuentas bancarias activas'
    });
  }
};

const obtenerCuentasConMasTransferencias = async (req = request, res = response) => {
  try {
    const orden = req.query.odren || 'asc';
    const cuentas = await Cuenta.find()
      .sort({ cantidadTransferencias: orden === 'desc' ? -1 : 1 })
      .populate('propietario', 'nombre correo')
      .exec();

    res.json({
      cuentas
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al obtener las cuentas bancarias activas'
    });
  }
};

const crearCuentaBancaria = async (req = request, res = response) => {
  try {
    const { propietario, tipoCuenta, saldo } = req.body;
    const numeroCuenta = uuidv4();

    if (!numeroCuenta) {
      throw new Error('No se pudo generar el número de cuenta');
    }

    const propietarioExistente = await Usuario.findById(propietario);

    if (!propietarioExistente) {
      return res.status(404).json({
        message: 'El propietario de la cuenta no existe'
      });
    }

    const cuentaExistente = await Cuenta.findOne({ numeroCuenta });

    if (cuentaExistente) {
      return res.status(400).json({
        message: 'La cuenta de origen ya existe'
      });
    }

    const nuevaCuenta = new Cuenta({
      propietario,
      numeroCuenta,
      tipoCuenta,
      saldo
    });

    await nuevaCuenta.save();
    const nuevoFavorito = new Favorito({ numeroCuenta: numeroCuenta, tipoCuenta: tipoCuenta });
    await nuevoFavorito.save();
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

const editarSaldoCuenta = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const { saldo } = req.body;

    if (typeof saldo !== 'number' || isNaN(saldo)) {
      return res.status(400).json({
        message: 'El saldo proporcionado no es válido'
      });
    }

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

const eliminarCuenta = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const cuenta = await Cuenta.findById(id);

    if (!cuenta) {
      return res.status(404).json({
        message: 'No se encontró la cuenta bancaria'
      });
    }

    cuenta.estado = false;
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
  mostrarCuentasActivas,
  misCuentas,
  obtenerCuentasConMasTransferencias,
  crearCuentaBancaria,
  editarSaldoCuenta,
  eliminarCuenta,
  mostrarCuentasSaldoId
};
