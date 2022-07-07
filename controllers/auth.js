const { response } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res = response) => {
  // verificar email
  const { email, password } = req.body;
  try {
    const usuarioDB = await Usuario.findOne({ email });
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: 'Email no encontrado',
      });
    }

    // veriificar password
    const validPassword = bcrypt.compareSync(password, usuarioDB.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'Contrasena invalida',
      });
    }

    // generar token
    const token = await generarJWT(usuarioDB.id);

    res.status(200).json({
      ok: true,
      token,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Hable con el admin',
    });
  }
};

// const googleSigIn = async (req, res = response) => {
//   const googleToken = req.body.token;

//   try {
//     googleVerify(googleToken);
//     console.log(googleToken);

//     res.json({
//       ok: true,
//       msg: 'Ser',
//     });
//   } catch (error) {
//     res.status(401).json({
//       ok: false,
//       msg: 'Token incorrecto',
//     });
//   }
// };

const renewToken = async (req, res = response) => {
  const uid = req.uid;

  // generar token
  const token = await generarJWT(uid);

  res.json({
    ok: true,
    token,
  });
};

module.exports = {
  login,
  renewToken,
  // googleSigIn,
};
