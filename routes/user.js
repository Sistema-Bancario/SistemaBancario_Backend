const { Router } = require('express');
const { check } = require('express-validator');

const {  getUsers,putUser,deleteUser,postUser, getUsersById, obtenerCuentasUsuario, putMiUser, getMiUser, deleteMiPerfil } = require('../controllers/user');
const {  emailExiste, existeUsuarioPorId, nickUnico } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');

const { validarJWT} = require('../middlewares/validar-jwt');
const { validarjwtAdmin} = require('../middlewares/validar-jwtAdmin');
const { esAdminRole } = require('../middlewares/validar-role-admin');
const { tieneRole } = require('../middlewares/validar-role-admin');

const router = Router();

router.get("/mostrarCuentasUsuario", [validarJWT], obtenerCuentasUsuario);

router.get('/mostrarById/:id', [
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(existeUsuarioPorId),
], getUsersById);

router.get('/mostrar', getUsers);

router.post('/agregarUser', [
  validarjwtAdmin,
  esAdminRole,
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('correo', 'El correo no es válido').isEmail(),
  check('nickname', 'Se requiere un nickname').not().isEmpty(),
  check('nickname').custom(nickUnico),
  check('password', 'El password debe ser de al menos 6 caracteres').isLength({ min: 6 }),
  check('DPI', 'Se requiere un DPI').not().isEmpty(),
  check('direccion', 'Se requiere una dirección').not().isEmpty(),
  check('celular', 'Se requiere un número de teléfono').not().isEmpty(),
  check('trabajo', 'Se requiere un lugar de trabajo').not().isEmpty(),
  check('ingresos', 'Se requieren los ingresos mensuales').not().isEmpty(),
  check('correo').custom(emailExiste),
], postUser);

router.delete('/eliminarUser/:id', [
  validarjwtAdmin,
  esAdminRole,
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(existeUsuarioPorId),
  validarCampos
], deleteUser);

router.put('/editarUser/:id', [
  validarjwtAdmin,
  esAdminRole,
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(existeUsuarioPorId),
  check('nickname', 'Se requiere un nickname').not().isEmpty(),
  check('celular', 'Se requiere un número de teléfono').not().isEmpty(),
  check('correo', 'El correo no es válido').isEmail(),
  validarCampos,
], putUser);

router.put('/editarMiPerfil', [
  validarJWT,
  validarCampos,
], putMiUser);

router.delete('/eliminarMiPerfil', [
  validarJWT,
  validarCampos,
], deleteMiPerfil);

router.get('/miPerfil', [
  validarJWT,
  validarCampos,
], getMiUser);

module.exports = router;
