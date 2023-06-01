const Transferencia = require('../models/transaction');
const Cuenta = require('../models/account');
const Usuario = require('../models/user');

// Método para realizar una transferencia de dinero
exports.realizarTransferencia = async (req, res) => {
  const id = req.usuario.id
  try {
    //Se pide solo cuentadestino y monto, ya que se obtiene por el token la cuenta del origen
    const { cuentaDestino, monto } = req.body;


    // Verificar que las Cuentas existan
   const cuentaOrigen = await Cuenta.findOne({propietario: id});
   const cuentaDestinoExiste = await Cuenta.findOne({numeroCuenta: cuentaDestino});

    if (!cuentaOrigen || !cuentaDestinoExiste) {
      return res.status(404).json({ mensaje: 'Una o ambas Cuentas no existen.' });
    }

    // Verificar que el saldo de la Cuenta de origen sea suficiente
    if (cuentaOrigen.saldo < monto) {
      return res.status(400).json({ mensaje: 'Saldo insuficiente en la Cuenta de origen.' });
    }else{
      const limiteTransferencia = 10000;
      if (monto > limiteTransferencia) {
        return res.status(400).json({ mensaje: 'El monto de la transferencia excede el límite permitido.' });
      }else{
        const nuevaTransferencia = new Transferencia({
          cuentaOrigen: cuentaOrigen._id,
          cuentaDestino: cuentaDestino,
          monto: monto,
          fecha: new Date()
        });
        await nuevaTransferencia.save();
        //Aumentar y disminuir saldo
        // $inc sirve para incrementar el valor de un campo, en este caso se pone - para disminuir y + para aumentar
        const aumentarSaldo = await Cuenta.findByIdAndUpdate(cuentaDestinoExiste._id, {$inc:{saldo: + monto}})
        const disminuirSaldo = await Cuenta.findByIdAndUpdate(cuentaOrigen._id, {$inc:{saldo: - monto}})
        res.status(200).json({ mensaje: 'Transferencia realizada con éxito.' });
      }
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al realizar la transferencia.' });
  }
};