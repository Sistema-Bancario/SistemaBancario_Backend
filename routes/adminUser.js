//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const { getUserAdmins,
    putUserAdmin,
    deleteUserAdmin,
    postAdmin,
    getUserAdminsById,
     } = require('../controllers/adminUser');
const {  emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const {  validarjwtAdmin } = require('../middlewares/validar-jwtAdmin');
const { tieneRole } = require('../middlewares/validar-role-admin');


const router = Router();

//router.get('/mostrarById/:token', getUsuariosById);

router.get('/mostrarAdmins', getUserAdmins);

router.get('/mostrarAdmin/:id',[
    tieneRole('ADMIN_USER'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId )], 
    getUserAdminsById);


router.post(
  "/agregarAdmin",
  [
    validarjwtAdmin,
    tieneRole("ADMIN_USER"),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("password", "El password debe de ser más de 5 digitos").isLength({
      min: 5,
    }),
    check("correo", "El correo no es valido").isEmail(),
    check("correo").custom(emailExiste),
    check("rol").default("ADMIN_USER"),
    validarCampos,
  ],
  postAdmin
);

//router.get('/mostrar/:token', getUsuarioPorToken);

router.put('/editarAdmin/:id', [
  validarCampos
] ,putUserAdmin);;


router.delete('/eliminarAdmin/:id', [
    validarjwtAdmin,
   tieneRole('ADMIN_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
   // validarCampos
] ,deleteUserAdmin);
  
 // router.delete('/eliminarById/:token', eliminarUserByToken);

module.exports = router;


// ROUTES