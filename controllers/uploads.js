const path = require('path');
const fs = require('fs');
const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizar-imagen');

const fileUpload = (req, res = response) => {
  const tipo = req.params.tipo;
  const id = req.params.id;

  const tiposValidos = ['hospitales', 'medicos', 'usuarios'];
  if (!tiposValidos.includes(tipo)) {
    return res.status(400).json({
      ok: false,
      msg: 'No es medico usuario y hospital',
    });
  }

  // esto viene del parquete de archivos npm para validar q venga archivo
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      of: false,
      msg: 'No hay ningun archivo',
    });
  }

  // procesar la imagen
  const file = req.files.imagen;

  const nombreCortado = file.name.split('.');

  // extraemos la extension desps de separar el nombre por los puntos
  const extensionArchivo = nombreCortado[nombreCortado.length - 1];

  // validar extension
  const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];

  if (!extensionesValidas.includes(extensionArchivo)) {
    return res.status(400).json({
      of: false,
      msg: 'Extension no permitida',
    });
  }

  // generar nombre de archivo
  const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

  // path para guardar imagen
  const path = `./uploads/${tipo}/${nombreArchivo}`;

  // guardar imagen
  file.mv(path, (err) => {
    if (err)
      return res.status(500).json({
        ok: false,
        msg: 'Sucedio un error',
      });

    // actualizar BD
    actualizarImagen(tipo, id, nombreArchivo);

    res.json({
      ok: true,
      msg: nombreArchivo,
    });
  });
};

const retornaImagen = (req, res = response) => {
  const tipo = req.params.tipo;
  const foto = req.params.foto;

  const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);

  // imagen por defecto
  if (fs.existsSync(pathImg)) {
    res.sendFile(pathImg);
  } else {
    const pathImg = path.join(__dirname, `../uploads/no-img.jpg`);
    res.sendFile(pathImg);
  }
};

module.exports = {
  fileUpload,
  retornaImagen,
};
