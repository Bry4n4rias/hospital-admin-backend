/*
Ruta: /api/usuarios
*/

const { Router } = require('express');
const {
  getUsuarios,
  crearUsuario,
  actualizarUsuario,
  borrarUsuario,
} = require('../controllers/usuarios');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getUsuarios);
router.post(
  '/',
  [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'Contraseña obligatoria').not().isEmpty(),
    check('email', 'Email obligatorio').isEmail(),
    // el middleware personalizado hay q ponerlo al final de los cheks
    validarCampos,
  ],
  crearUsuario
);
router.put(
  '/:id',
  [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'Email obligatorio').isEmail(),
    check('role', 'El rol es oligatorio ').not().isEmpty(),
    validarCampos,
  ],
  actualizarUsuario
);

router.delete('/:id', validarJWT, borrarUsuario);

module.exports = router;
