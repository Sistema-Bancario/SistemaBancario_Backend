
const Usuario = require("../models/user");


//Este archivo maneja validaciones personalizadas

const emailExiste = async (correo = "") => {
  //Verificamos si el correo ya existe en la DB
  const existeEmail = await Usuario.findOne({ correo });

  //Si existe (es true) lanzamos excepción
  if (existeEmail) {
    throw new Error(
      `El correo: ${correo} ya existe y esta registrado en la DB`
    );
  }
};

const existeUsuarioPorId = async (id) => {
  //Verificar si el ID existe
  const existeUser = await Usuario.findById(id);

  if (!existeUser) {
    throw new Error(`El id ${id} no existe en la DB`);
  }
};

const nickUnico = async (nickname = "") => {
//Verificar si el ID existe
const existeNick = await Usuario.findOne({nickname});

if (existeNick) {
  throw new Error(`El nickname ${nickname} ya existe, solo ponete otro :b`);
}
}



module.exports = {
  
  emailExiste,
  existeUsuarioPorId,
  nickUnico
  
};
