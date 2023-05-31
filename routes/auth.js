const { Router } = require('express');
const { check } = require('express-validator');

//Controllers
const { loginUser,loginAdmin, } = require('../controllers/auth');
// Middlewares
const { validarCampos } = require('../middlewares/validar-campos');


const router = Router();

//Manejo de rutas
router.post('/login', [
    check('correo', 'El correo no es valido').isEmail(),
    check('password', 'La password es obligatoria').not().isEmpty(),
    validarCampos,
] ,loginUser);

router.post('/loginAdmin', [
    check('correo', 'El correo no es valido').isEmail(),
    check('password', 'La password es obligatoria').not().isEmpty(),
    validarCampos,
] ,loginAdmin);






module.exports = router;