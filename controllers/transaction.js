const Transferencia = require('../models/transaction');
const Cuenta = require('../models/account');

const transferir = async (req, res) => {  
  try {
    const { cuentaOrigen, cuentaDestino, monto, descripcion } = req.body;

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

    if (monto > 10000) {
      return res.status(400).json({
        message: 'El monto no debe ser mayor a 10000'
      });
    }

    if (monto <= 0) {
      return res.status(400).json({
        message: 'El monto debe ser mayor a cero'
      });
    }

    if (cuentaOrigenDB.saldo < monto) {
      return res.status(400).json({
        error: true,
        message: 'Saldo insuficiente en la cuenta de origen'
      });
    }
    

    cuentaOrigenDB.saldo -= monto;
    cuentaDestinoDB.saldo += monto;

    cuentaOrigenDB.cantidadTransferencias++;
    cuentaDestinoDB.cantidadTransferencias++;

    // Guardar los cambios en las cuentas
    await cuentaOrigenDB.save();
    await cuentaDestinoDB.save();

    const transferenciaOrigen = new Transferencia({
      cuentaOrigen,
      cuentaDestino,
      monto,
      descripcion,
      tipoCuenta: cuentaOrigenDB.tipoCuenta,
      tipoTransaccion: 'debito' 
    });

    const transferenciaDestino = new Transferencia({
      cuentaOrigen,
      cuentaDestino,
      monto,
      descripcion,
      tipoCuenta: cuentaDestinoDB.tipoCuenta,
      tipoTransaccion: 'credito' 
    });

    await transferenciaOrigen.save();
    await transferenciaDestino.save();

    cuentaOrigenDB.transferencias.push(transferenciaOrigen._id);
    cuentaDestinoDB.transferencias.push(transferenciaDestino._id);

    await cuentaOrigenDB.save();
    await cuentaDestinoDB.save();

    res.json({
      message: 'Transferencia realizada exitosamente',
      cuentaOrigen: {
        numeroCuenta: cuentaOrigenDB.numeroCuenta,
        saldo: cuentaOrigenDB.saldo,
        tipoCuenta: cuentaOrigenDB.tipoCuenta
      },
      cuentaDestino: {
        numeroCuenta: cuentaDestinoDB.numeroCuenta,
        saldo: cuentaDestinoDB.saldo,
        tipoCuenta: cuentaDestinoDB.tipoCuenta 
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

const transferirCuentaDestino = async (req, res) => {
  try {
    const { cuentaOrigen, monto, descripcion } = req.body;
    const cuentaDestino = req.params.cuentaDestino; // Obtener la cuenta de destino de la URL

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

    if (monto > 10000) {
      return res.status(400).json({
        message: 'El monto no debe ser mayor a 10000'
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
    if (!cuentaOrigenDB || !cuentaDestinoDB) {
      return res.status(404).json({
        message: 'La cuenta de origen o la cuenta de destino no existe'
      });
    }

    cuentaOrigenDB.saldo -= monto;
    cuentaDestinoDB.saldo += monto;

    cuentaOrigenDB.cantidadTransferencias++;
    cuentaDestinoDB.cantidadTransferencias++;

    // Guardar los cambios en las cuentas
    await cuentaOrigenDB.save();
    await cuentaDestinoDB.save();

    const transferenciaOrigen = new Transferencia({
      cuentaOrigen,
      cuentaDestino,
      monto,
      descripcion,
      tipoCuenta: cuentaOrigenDB.tipoCuenta,
      tipoTransaccion: 'debito' 
    });

    const transferenciaDestino = new Transferencia({
      cuentaOrigen,
      cuentaDestino,
      monto,
      descripcion,
      tipoCuenta: cuentaDestinoDB.tipoCuenta,
      tipoTransaccion: 'credito' 
    });

    await transferenciaOrigen.save();
    await transferenciaDestino.save();

    cuentaOrigenDB.transferencias.push(transferenciaOrigen._id);
    cuentaDestinoDB.transferencias.push(transferenciaDestino._id);

    await cuentaOrigenDB.save();
    await cuentaDestinoDB.save();

    res.json({
      message: 'Transferencia realizada exitosamente',
      cuentaOrigen: {
        numeroCuenta: cuentaOrigenDB.numeroCuenta,
        saldo: cuentaOrigenDB.saldo,
        tipoCuenta: cuentaOrigenDB.tipoCuenta
      },
      cuentaDestino: {
        numeroCuenta: cuentaDestinoDB.numeroCuenta,
        saldo: cuentaDestinoDB.saldo,
        tipoCuenta: cuentaDestinoDB.tipoCuenta 
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
  transferirCuentaDestino,
  mostrarTransaccionesPorNumeroCuenta
}