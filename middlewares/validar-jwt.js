const { response } = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = (req, res = response, next) => {
  // leer token
  const token = req.header('x-token');

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: 'No hay token',
    });
  }

  // verificar token
  try {
    // recuperamos el uid. q es el payload del jwt, asi fue q lo guardamos
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);

    // le ponemos manualmente un nuevo valor a la request
    req.uid = uid;
    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: 'Token no valido',
    });
  }
};

module.exports = {
  validarJWT,
};
