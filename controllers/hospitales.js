const { response } = require('express');
const Hospital = require('../models/hospital');

const getHospitales = async (req, res = response) => {
  // con el populate miramos quien creo el hospital y demas datos
  const hospitales = await Hospital.find().populate(
    'usuario',
    'nombre email img'
  );

  res.status(200).json({
    ok: true,
    hospitales: hospitales,
  });
};

const crearHospitales = async (req, res = response) => {
  // recuperamos el uid desde la request del token, es el payload del jwt
  const uid = req.uid;
  //extraemos todo el vody de la request y le asignamos un nuevo valor q el el usuario q lo creo, q es el uid q va en el token
  const hospital = new Hospital({
    usuario: uid,
    ...req.body,
  });

  try {
    const hospitalDB = await hospital.save();
    res.json({
      ok: true,
      hospital: hospitalDB,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Hable con el admin',
    });
  }
};

const actualizarHospitales = (req, res = response) => {
  res.json({
    ok: true,
    msg: 'actualizarHospitales',
  });
};

const borrarHospitales = (req, res = response) => {
  res.json({
    ok: true,
    msg: 'borrarHospitales',
  });
};

module.exports = {
  getHospitales,
  crearHospitales,
  actualizarHospitales,
  borrarHospitales,
};
