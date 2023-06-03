const Transferencia = require('../models/transaction');
const Cuenta = require('../models/account');

const transferir = async (req, res) => {
  try {
    const { cuentaOrigen, cuentaDestino, monto, descripcion, tipoCuenta } = req.body;

    const cuentaOrigenDB = await Cuenta.findOne({ numeroCuenta: cuentaOrigen });
    const cuentaDestinoDB = await Cuenta.findOne({ numeroCuenta: cuentaDestino });

    if (!cuentaOrigenDB) {
      return res.status(404).json({
        message: 'La cuenta de origen no existe'
      });
    }

    if (!cuentaDestinoDB) {
      return res.status(404).json({
        message: 'La cuenta de destino no existe'
      });
    }

    if (monto <= 0) {
      return res.status(400).json({
        message: 'El monto debe ser mayor a cero'
      });
    }

    if (cuentaOrigenDB.saldo < monto) {
      return res.status(400).json({
        message: 'Saldo insuficiente en la cuenta de origen'
      });
    }

    if (cuentaOrigenDB.tipoCuenta !== tipoCuenta) {
      return res.status(400).json({
        message: 'El tipo de cuenta de origen no coincide'
      });
    }

    if (cuentaDestinoDB.tipoCuenta !== tipoCuenta) {
      return res.status(400).json({
        message: 'El tipo de cuenta de destino no coincide'
      });
    }

    cuentaOrigenDB.saldo -= monto;
    cuentaDestinoDB.saldo += monto;

    // Guardar los cambios en las cuentas
    await cuentaOrigenDB.save();
    await cuentaDestinoDB.save();

    const transferenciaOrigen = new Transferencia({
      cuentaOrigen,
      cuentaDestino,
      monto,
      descripcion,
      tipoCuenta
    });

    const transferenciaDestino = new Transferencia({
      cuentaOrigen,
      cuentaDestino,
      monto,
      descripcion,
      tipoCuenta
    });

    await transferenciaOrigen.save();
    await transferenciaDestino.save();

    // Agregar el ID de la transferencia a las cuentas correspondientes
    cuentaOrigenDB.transferencias.push(transferenciaOrigen._id);
    cuentaDestinoDB.transferencias.push(transferenciaDestino._id);

    // Guardar los cambios en las cuentas nuevamente
    await cuentaOrigenDB.save();
    await cuentaDestinoDB.save();

    res.json({
      message: 'Transferencia realizada exitosamente',
      cuentaOrigen: {
        numeroCuenta: cuentaOrigenDB.numeroCuenta,
        saldo: cuentaOrigenDB.saldo
      },
      cuentaDestino: {
        numeroCuenta: cuentaDestinoDB.numeroCuenta,
        saldo: cuentaDestinoDB.saldo
      },
      transferenciaOrigen,
      transferenciaDestino
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al realizar la transferencia de fondos'
    });
  }
};


const mostrarTransaccionesPorNumeroCuenta = async (req, res) => {
  try {
    const numeroCuenta = req.params.numeroCuenta;

  
    const transacciones = await Transferencia.find({
      $or: [{ cuentaOrigen: numeroCuenta }, { cuentaDestino: numeroCuenta }]
    });

    res.json({
      message: 'Transacciones hechas por esta cuenta',
      transacciones
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al obtener las transacciones'
    });
  }
};

module.exports = {
  transferir, 
  mostrarTransaccionesPorNumeroCuenta
}