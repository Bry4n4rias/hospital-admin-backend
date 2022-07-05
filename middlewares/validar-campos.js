const { response } = require('express');
const { validationResult } = require('express-validator');

// si todos los middlewares o validadores pasan llama al next
const validarCampos = (req, res = response, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      ok: false,
      errors: errores.mapped(),
    });
  }
  // si no hay errores llamo el next, osea q siga con el codigo
  next();
};

module.exports = {
  validarCampos,
};
