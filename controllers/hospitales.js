const { response } = require('express');
const hospital = require('../models/hospital');
const Hospital = require('../models/hospital');

const getHospitales = async (req, res = response) => {
  const desde = Number(req.query.desde) || 0;
  // con el populate miramos quien creo el hospital y demas datos
  const hospitales = await Hospital.find().populate(
    'usuario',
    'nombre email img'
  );

  const total = await Hospital.count();

  res.status(200).json({
    ok: true,
    hospitales: hospitales,
    totalHospitales: total,
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

const actualizarHospitales = async (req, res = response) => {
  const id = req.params.id;
  const uid = req.uid;

  try {
    const hospitalDB = await Hospital.findById(id);

    if (!hospitalDB) {
      return res.status(404).json({
        ok: false,
        msg: 'Hospital por id no encontrado',
      });
    }

    const cambiosHospital = {
      ...req.body,
      usuario: uid,
    };

    const hospitalActualizado = await Hospital.findByIdAndUpdate(
      id,
      cambiosHospital,
      { new: true }
    );

    res.json({
      ok: true,
      hospitalActualizado,
    });
  } catch (error) {
    req.status(500).json({
      ok: falase,
      msg: 'Erro',
    });
  }
};

const borrarHospitales = async (req, res = response) => {
  const id = req.params.id;

  try {
    const hospitalDB = await Hospital.findById(id);

    if (!hospitalDB) {
      return res.status(404).json({
        ok: false,
        msg: 'Hospital por id no encontrado',
      });
    }

    const hospitalBorrado = await Hospital.findByIdAndDelete(id);

    res.json({
      ok: true,
      hospitalBorrado,
    });
  } catch (error) {
    req.status(500).json({
      ok: falase,
      msg: 'Error',
    });
  }
};

module.exports = {
  getHospitales,
  crearHospitales,
  actualizarHospitales,
  borrarHospitales,
};
