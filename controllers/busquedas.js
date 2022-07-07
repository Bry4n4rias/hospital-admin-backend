const { response } = require('express');
const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const getTodo = async (req, res = response) => {
  const busqueda = req.params.busqueda;
  // creamos la regex para q no sea insensible osea q sea con minusculas o solo un pedazo de la busqueda
  const regex = new RegExp(busqueda, 'i');

  // aca decimos q encuentre por el parametro nombre que conicida con la ariable busqeuda
  // esperamos q se cumplan todas las promesas para seguir
  const [usuarios, medicos, hospitales] = await Promise.all([
    Usuario.find({ nombre: regex }),
    Medico.find({ nombre: regex }),
    Hospital.find({ nombre: regex }),
  ]);

  res.json({
    ok: true,
    usuarios,
    medicos,
    hospitales,
  });
};

const getDocumentosColeccion = async (req, res = response) => {
  const tabla = req.params.tabla;
  const busqueda = req.params.busqueda;
  // creamos la regex para q no sea insensible osea q sea con minusculas o solo un pedazo de la busqueda
  const regex = new RegExp(busqueda, 'i');

  let data = [];

  switch (tabla) {
    case 'medicos':
      data = await Medico.find({ nombre: regex })
        .populate('usuario', 'nombre img')
        .populate('hospital', 'nombre img');

      break;

    case 'hospitales':
      data = await Hospital.find({ nombre: regex }).populate(
        'usuario',
        'nombre img'
      );

      break;
    case 'usuario':
      data = await Usuario.find({ nombre: regex });
      break;

    default:
      return res.status(400).json({
        ok: false,
        msg: 'La tabla debe ser usuarios, medicos y hospitales',
      });
  }

  // cuando se resuelva alguno de los switch es como si le estariamos conatenando este res.json
  res.json({
    ok: true,
    resultados: data,
  });
};
module.exports = {
  getTodo,
  getDocumentosColeccion,
};
