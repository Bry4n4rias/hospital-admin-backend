const { response } = require('express');
const Medico = require('../models/medico');

const getMedicos = async (req, res = response) => {
  const medicos = await Medico.find()
    .populate('usuario', 'nombre  img')
    .populate('hospital', 'nombre img');

  res.json({
    ok: true,
    medicos: medicos,
  });
};

const crearMedicos = async (req, res = response) => {
  const uid = req.uid;

  const medico = new Medico({
    usuario: uid,
    ...req.body,
  });

  try {
    const medicoDB = await medico.save();

    res.json({
      ok: true,
      medico: medicoDB,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Hable con el admin',
    });
  }
};

const actualizarMedicos = async (req, res = response) => {
  const id = req.params.id;
  const uid = req.uid;

  try {
    const medicoDB = await Medico.findById(id);

    if (!medicoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'Medico por id no encontrado',
      });
    }

    const cambiosMedico = {
      ...req.body,
      usuario: uid,
    };

    const medicoActualizado = await Medico.findByIdAndUpdate(
      id,
      cambiosMedico,
      { new: true }
    );

    res.json({
      ok: true,
      medicoActualizado,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error',
    });
  }
};

const borrarMedicos = async (req, res = response) => {
  const id = req.params.id;

  try {
    const medicoDB = await Medico.findById(id);

    if (!medicoDB) {
      return res.status(404).json({
        ok: false,
        msg: 'Medico por id no encontrado',
      });
    }

    const medicoBorrado = await Medico.findByIdAndDelete(id);

    res.json({
      ok: true,
      medicoBorrado,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error',
    });
  }
};

const getMedicoById = async (req, res = response) => {
  const id = req.params.id;

  try {
    const medico = await Medico.findById(id)
      .populate('usuario', 'nombre  img')
      .populate('hospital', 'nombre img');

    res.json({
      ok: true,
      medico,
    });
  } catch (error) {
    res.json({
      ok: false,
      msg: 'Hable con el admin',
    });
  }
};

module.exports = {
  getMedicos,
  crearMedicos,
  actualizarMedicos,
  borrarMedicos,
  getMedicoById,
};
