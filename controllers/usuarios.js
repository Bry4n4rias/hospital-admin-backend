const { response } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req, res) => {
  const desde = Number(req.query.desde) || 0;

  // const usuarios = await  Usuario.find({}, 'nombre email role google')
  //   .skip(desde)
  //   .limit(5);

  // const total = await Usuario.count();

  // como teniamos 2 await y habia q esperar q cada una se resolviera para pasar al res,json
  // lo hicimos asi para esperar q todas se resulevan y seguir,
  // desestrcturamos las respuestas ya q vienen 2 arreglos
  const [usuarios, total] = await Promise.all([
    Usuario.find({}, 'nombre email role google img').skip(desde).limit(5),

    Usuario.countDocuments(),
  ]);

  res.json({
    ok: true,
    usuarios: usuarios,
    // este el uid del usuario q hace la solicitud,
    uid: req.uid,
    totalUsuarios: total,
  });
};

const crearUsuario = async (req, res = response) => {
  const { email, password, nombre } = req.body;

  try {
    const existeEmail = await Usuario.findOne({ email: email });
    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: 'Correo ya registrado',
      });
    }

    const usuario = new Usuario(req.body);

    // antes de grabar en base de datos hasheamos la passwaord
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    // guardar usuario
    await usuario.save();

    // genrarmos el jwt
    const token = await generarJWT(usuario.id);

    res.json({
      ok: true,
      usuario: usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    });
  }
};

const actualizarUsuario = async (req, res = response) => {
  const uid = req.params.id;

  try {
    const usuarioDB = await Usuario.findById(uid);

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No existe el usuario por el id',
      });
    }

    // actualizar usuario

    // verificamos q no exista en base de datos ese email nuevo
    // asi extraemos todos los campos sin la contrasena ni el google
    const { password, google, email, ...campos } = req.body;
    if (usuarioDB.email !== email) {
      const existeEmail = await Usuario.findOne({ email });
      if (existeEmail) {
        return res.status(400).json({
          ok: false,
          msg: 'Ya existe un usuario con ese email',
        });
      }
    }

    // como arriba lo desectruturamos para saar el email y por ende se elimino de ...campos, aca le vuelvo a asignar el valor
    campos.email = email;

    const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {
      new: true,
    });

    res.json({
      ok: true,
      usuario: usuarioActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado actualizando',
    });
  }
};

const borrarUsuario = async (req, res = response) => {
  const uid = req.params.id;
  // console.log(uid);
  try {
    const usuarioDB = await Usuario.findById(uid);

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No existe el usuario por el id',
      });
    }
    await Usuario.findOneAndDelete(uid);

    res.status(200).json({
      ok: true,
      msg: 'Usuario eliminado',
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Hable con el admin',
    });
  }
};

module.exports = {
  getUsuarios,
  crearUsuario,
  actualizarUsuario,
  borrarUsuario,
};
