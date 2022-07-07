const { Router } = require('express');
const { login, googleSigIn, renewToken } = require('../controllers/auth');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post(
  '/',
  [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos,
  ],
  login
);
router.get('/renew', validarJWT, renewToken);

// router.post(
//   '/google',
//   [
//     check('token', 'El token de google es obligatorio').not().isEmpty(),
//     validarCampos,
//   ],
//   googleSigIn
// );

module.exports = router;
