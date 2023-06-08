//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const {  getUsers,putUser,deleteUser,postUser, getUsersById, obtenerCuentasUsuario } = require('../controllers/user');
const {  emailExiste, existeUsuarioPorId, nickUnico } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');

const { validarJWT} = require('../middlewares/validar-jwt');
const { validarjwtAdmin} = require('../middlewares/validar-jwtAdmin');
const { tieneRole, esAdminRole } = require('../middlewares/validar-role-admin');
const { validarJWT } = require('../middlewares/validar-jwtAdmin');
const { tieneRole } = require('../middlewares/validar-role-admin');


const router = Router();

router.get("/mostrarCuentasUsuario",[
  validarJWT
], obtenerCuentasUsuario)


//router.get('/mostrarById/:token', getUsersById);
router.get('/mostrarById/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
], getUsersById);

router.get('/mostrar', getUsers);

router.post(
  "/agregarUser",
  [
    validarjwtAdmin,
   esAdminRole,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    
    check("correo", "El correo no es valido").isEmail(),
    check("nickname","se requiere un nickname").not().isEmpty(),
    check("nickname").custom(nickUnico),
    check("password", "El password debe de ser más de 6 digitos").isLength({
      min: 6,
    }),
    check("DPI","se requiere un DPI").not().isEmpty(),
    check("direccion","se requiere una direccion").not().isEmpty(),
    check("celular","se requiere un numero de telefono").not().isEmpty(),
    check("trabajo","se requiere un lugar de trabajo").not().isEmpty(),
    check("ingresos","se requiere los ingresos mensuales").not().isEmpty(),
    check("correo").custom(emailExiste),
   
   // validarCampos
  ],
  postUser
);

//router.get('/mostrar/:token', getUsuarioPorToken);

/*router.put('/editar/:id', [
  validarCampos,
  tieneRole("ADMIN_USER"),
] ,putUser);; */


router.delete('/eliminarUser/:id', [
    validarjwtAdmin,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
] ,deleteUser);

router.put('/editarUser/:id',
    [
      validarjwtAdmin,
      esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    check("nickname","se requiere un nickname").not().isEmpty(),
    check("celular","se requiere un numero de telefono").not().isEmpty(),
    check('correo', 'El correo no es válido').isEmail(),
   
      validarCampos,
    ],
    putUser
  );
  

  
 // router.delete('/eliminarById/:token', eliminarUserByToken);

module.exports = router;


// ROUTES