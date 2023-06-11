const { response, request } = require('express');
const bcrypt = require('bcryptjs');
//Importación del modelo
const User = require('../models/user');
const jwt = require('jsonwebtoken');



const postUser = async (req = request, res = response) => {
    //Desestructuración

    const { nombre, correo, nickname, password, DPI, direccion, celular, trabajo, ingresos } = req.body;
    const userGuardadoDB = new User({ nombre, correo, nickname, password, DPI, direccion, celular, trabajo, ingresos});
    const cuentas = [];
    const { nombre, correo, nickname, password,  DPI, direccion, celular,img, trabajo, ingresos } = req.body;
    const cuentas = [];
    const { nombre, correo, nickname, password,  DPI, direccion, celular, trabajo, ingresos } = req.body;
    
    const data = {
        nombre,
        correo,
        nickname,
        password,
        cuentas: [...cuentas],
        DPI,
        img,
        direccion,
        celular,
        trabajo,
        ingresos
    }
    const userGuardadoDB = new User(data);
    //Encriptar password
    const salt = bcrypt.genSaltSync();
    userGuardadoDB.password = bcrypt.hashSync(password, salt);

    //Guardar en BD
    await userGuardadoDB.save();

    res.json({
        msg: 'Post Api - Post Cliente',
        userGuardadoDB
    });
}

const defaultUser = async (req, res) => {
    try {
        let user = new User();
        user.nombre = "Jorge";
        user.nickname = "George";
        user.DPI = "1234567890101";
        user.ingresos = "4500";
        user.trabajo = "Cajero en La Torre";
        user.password = "123456";
        user.direccion = "4ta calle 10-83 zona 3";
        user.correo = "jorge@gmail.com";
        user.rol = "USER_ROLE";
        const userEncontrado = await User.findOne({ correo: user.correo });
        if (userEncontrado) return console.log("El administrador está listo");
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync());
        user = await user.save();
        if (!user) return console.log("El administrador no está listo!");
        return console.log("El administrador está listo!");
    } catch (err) {
        throw new Error(err);
    }


};

const getUsers = async (req = request, res = response) => {

    //condiciones del get
    const query = { estado: true };

    const listaUsers = await Promise.all([
        User.countDocuments(query),
        User.find(query)
    ]);

    res.json({
        msg: 'get Api - Controlador User',
        listaUsers
    });


}
const getUsersById = async (req = request, res = response) => {

    //condiciones del get
    // const { token } = req.params;
    //const { uid } = jwt.verify(token, process.env.SECRET_KEY_FOR_TOKEN);
    const { id } = req.params;
    try {

        const UserId = await User.findById(id);
        if (!UserId) {
            return res.status(401).json({
                msg: ' User no existe en DB '
            })
        }
        res.status(201).json(UserId);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error en el servidor'
        });
    }
};
const putUser = async (req = request, res = response) => {

    //Req.params sirve para traer parametros de las rutas
    const { id } = req.params;
    const { _id, img, estado, password,DPI, ingresos,trabajo,nombre, direccion,cuentas, ...resto } = req.body;

    //const usuarioActual = req.usuario; // usuario que hace la petición
    const usuarioDB = await User.findById(id); // usuario que se desea modificar

    /*if (usuarioActual.rol === 'ADMIN_ROLE' && usuarioDB.rol === 'ADMIN_ROLE') {
        return res.status(400).json({
            msg: 'No está autorizado para editar a un usuario con rol ADMIN_ROLE'
        });
   } */

    //Si la password existe o viene en el req.body, la encripta
   /* if (resto.password) {
        //Encriptar password
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(resto.password, salt);
    }*/
    //Editar al usuario por el id
    const usuarioEditado = await User.findByIdAndUpdate(id, resto);

    res.json({
        msg: 'PUT editar user',
        usuarioEditado
    });
}

const putMiUser = async (req = request, res = response) => {
    //Req.params sirve para traer parametros de las rutas
    const id = req.usuario.id;
    const {
      correo,
      password,
      img,
      celular,
    } = req.body;
    const usuarioDB = await User.findById(id); // usuario que se desea modificar
    if(usuarioDB){
        const salt = bcrypt.genSaltSync();
        const passwordCript = bcrypt.hashSync(password, salt);
    const usuarioEditado = await User.findByIdAndUpdate(id, {correo: correo,
        password: passwordCript,
        img: img,
        celular: celular,});
        
    res.json({
        msg: 'PUT editar user',
        usuarioEditado
    });
}else{
    res.json({error: 'No se encontro el usuario'});
}
}


const deleteUser = async (req = request, res = response) => {
    const { id } = req.params;

    const UserActual = req.User;
    const UserDB = await User.findById(id);
    if (!UserDB) {
        return res.status(400).json({
            msg: 'NO existe el usuario que desea eliminar'
        });
    }

    /* if (UserActual.rol === 'ADMIN_USER' && UserDB.rol === 'ADMIN_USER') {
         return res.status(400).json({
             msg: 'No está autorizado para eliminar a un usuario con rol ADMIN_USER'
         });
     } */
    const UserEliminado = await User.findByIdAndDelete(id);

    res.json({
        msg: 'DELETE eliminar user',
        UserEliminado
    });
}

/*const eliminarUserByToken = async (req = request, res = response) => {
    const { token } = req.params;
    const { uid } = jwt.verify(token, process.env.SECRET_KEY_FOR_TOKEN);
    try {

        const UserId = await User.findByIdAndDelete(uid);
        if (!UserId) {
            return res.status(401).json({
                msg: 'Token no valido - User no existe en DB fisicamente'
            })
        }
        res.status(201).json({ msg: "User_Eliminado" });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error en el servidor'
        });
    }
}; */

/*const getUserPorToken = async (req = request, res = response) => {

    const { token } = req.params;

    const { uid } = jwt.verify(token, process.env.SECRET_KEY_FOR_TOKEN);

    const listaUsers = await User.findById(uid);
    console.log(listaUsers)
    res.status(201).json(listaUsers);

} */

const obtenerCuentasUsuario = async (req, res) => {
    try {
      const token = req.header('x-token');
      const { uid } = jwt.verify(token, process.env.SECRET_KEY_FOR_TOKEN);
      const usuario = await User.findById(uid).populate('cuentas');
  
      if (!usuario) {
        return res.status(404).json({
          message: 'Usuario no encontrado'
        });
      }
  
     //Obtener la ingo
      const cuentas = usuario.cuentas.map((cuenta) => ({
        numeroCuenta: cuenta.numeroCuenta,
        saldo: cuenta.saldo,
        tipoCuenta: cuenta.tipoCuenta
      }));
  
      res.json({
        usuarioIUD: usuario._id,
        nickname: usuario.nickname,
        cuentas
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Error al obtener las cuentas del usuario'
      });
    }
  };
  
  const getMiUser = async (req = request, res = response) => {
    //Req.params sirve para traer parametros de las rutas
    const id = req.usuario.id;
    const usuarioDB = await User.findById(id); // usuario que se desea modificar
    if(usuarioDB){
        res.json({
            usuarioDB
        });
    }else{
        res.json({error: 'No se encontro el usuario'});
    }
}
    const deleteMiPerfil = async (req = request, res = response) => {
        //Req.params sirve para traer parametros de las rutas
        const id = req.usuario.id;
        const usuarioEliminado = await User.findByIdAndDelete(id); // usuario que se desea modificar
        if(usuarioEliminado){
            res.json({
                usuarioEliminado
            });
        }else{
            res.json({error: 'No se encontro el usuario'});
        }
}


module.exports = {
    getUsers,
    putUser,
    deleteUser,
    postUser,
    getUsersById,
    defaultUser,
    putMiUser,
    obtenerCuentasUsuario,
    getMiUser,
    deleteMiPerfil
    // eliminarUserByToken,
    //getUserPorToken,
}

