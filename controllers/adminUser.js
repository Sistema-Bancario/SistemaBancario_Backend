const { response, request } = require('express');
const bcrypt = require('bcryptjs');
//Importación del modelo
const userAdmin = require('../models/adminUser');
const jwt = require('jsonwebtoken');


const postAdmin = async (req = request, res = response) => {
    //Desestructuración
    const { nombre, correo, password } = req.body;
    const adminGuardadoDB = new userAdmin({ nombre, correo, password });

    //Encriptar password
    const salt = bcrypt.genSaltSync();
    adminGuardadoDB.password = bcrypt.hashSync(password, salt);

    //Guardar en BD
    await adminGuardadoDB.save();

    res.json({
        msg: 'Post Api - Post Cliente',
        adminGuardadoDB
    });
}

const defaultAdmin = async (req, res) => {
    try {
        let user = new userAdmin();
        user.nombre = "ADMINB";
        user.password = "ADMINB";
        user.correo = "admin@gmail.com";
        user.rol = "ADMIN_USER";
        const userEncontrado = await userAdmin.findOne({ correo: user.correo });
        if (userEncontrado) return console.log("El administrador está listo");
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync());
        user = await user.save();
        if (!user) return console.log("El administrador no está listo!");
        return console.log("El administrador está listo!");
    } catch (err) {
        throw new Error(err);
    }


};

const getUserAdmins = async (req = request, res = response) => {

    //condiciones del get
    const query = { estado: true };

    const listauserAdmins = await Promise.all([
        userAdmin.countDocuments(query),
        userAdmin.find(query)
    ]);

    res.json({
        msg: 'get Api - Controlador userAdmin',
        listauserAdmins
    });


}
const getUserAdminsById = async (req = request, res = response) => {

    //condiciones del get
    const { token } = req.params;
    const { uid } = jwt.verify(token, process.env.SECRET_KEY_FOR_TOKEN);
    try {

        const userAdminId = await userAdmin.findById(uid);
        if (!userAdminId) {
            return res.status(401).json({
                msg: 'Token no valido - userAdmin no existe en DB '
            })
        }
        res.status(201).json(userAdminId);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error en el servidor'
        });
    }
};
const putUserAdmin = async (req = request, res = response) => {

         //Req.params sirve para traer parametros de las rutas
         const { id } = req.params;
        const { _id, img, estado, google, ...resto } = req.body;
    
        //const usuarioActual = req.usuario; // usuario que hace la petición
    const usuarioDB = await userAdmin.findById(id); // usuario que se desea modificar
    
         /*if (usuarioActual.rol === 'ADMIN_ROLE' && usuarioDB.rol === 'ADMIN_ROLE') {
             return res.status(400).json({
                 msg: 'No está autorizado para editar a un usuario con rol ADMIN_ROLE'
             });
        } */
    
         //Si la password existe o viene en el req.body, la encripta
         if (resto.password) {
             //Encriptar password
             const salt = bcrypt.genSaltSync();
             resto.password = bcrypt.hashSync(resto.password, salt);
        }
    
         //Editar al usuario por el id
         const usuarioEditado = await userAdmin.findByIdAndUpdate(id, resto);
    
         res.json({
             msg: 'PUT editar user',
             usuarioEditado
         });
     }

const deleteUserAdmin = async (req = request, res = response) => {
    const { id } = req.params;

    const userAdminActual = req.userAdmin; 
    const userAdminDB = await userAdmin.findById(id);

   /* if (userAdminActual.rol === 'ADMIN_USER' && userAdminDB.rol === 'ADMIN_USER') {
        return res.status(400).json({
            msg: 'No está autorizado para eliminar a un usuario con rol ADMIN_USER'
        });
    } */
    const userAdminEliminado = await userAdmin.findByIdAndDelete(id);

    res.json({
        msg: 'DELETE eliminar user',
        userAdminEliminado
    });
}

/*const eliminarUserByToken = async (req = request, res = response) => {
    const { token } = req.params;
    const { uid } = jwt.verify(token, process.env.SECRET_KEY_FOR_TOKEN);
    try {

        const userAdminId = await userAdmin.findByIdAndDelete(uid);
        if (!userAdminId) {
            return res.status(401).json({
                msg: 'Token no valido - userAdmin no existe en DB fisicamente'
            })
        }
        res.status(201).json({ msg: "userAdmin_Eliminado" });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error en el servidor'
        });
    }
}; */

/*const getuserAdminPorToken = async (req = request, res = response) => {

    const { token } = req.params;

    const { uid } = jwt.verify(token, process.env.SECRET_KEY_FOR_TOKEN);

    const listauserAdmins = await userAdmin.findById(uid);
    console.log(listauserAdmins)
    res.status(201).json(listauserAdmins);

} */

module.exports = {
    getUserAdmins,
    putUserAdmin,
    deleteUserAdmin,
    postAdmin,
    getUserAdminsById,
    defaultAdmin
    // eliminarUserByToken,
    //getuserAdminPorToken,
}

