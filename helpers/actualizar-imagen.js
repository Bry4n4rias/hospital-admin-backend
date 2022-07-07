const fs = require('fs');

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

let pathViejo = '';

const borraImagen = (pathViejo) => {
  if (fs.existsSync(pathViejo)) {
    // eliminamos la vieja
    fs.unlinkSync(pathViejo);
  }
};

const actualizarImagen = async (tipo, id, nombreArchivo) => {
  switch (tipo) {
    case 'medicos':
      const medico = await Medico.findById(id);
      if (!medico) {
        console.log('medico no encontrado');
        return false;
      }
      // verificamos si ya hay una imagen para borrarla y gardar la nueva
      pathViejo = `./uploads/medicos/${medico.img}`;
      // borraImagen(pathViejo);
      borraImagen(pathViejo);

      // lo asignamos el nombre del archivo a la variable del schema, medico,img
      medico.img = nombreArchivo;
      await medico.save();
      return true;

      break;

    case 'usuarios':
      const usuario = await Usuario.findById(id);
      console.log(id);

      if (!usuario) {
        console.log('usuario no encontrado');
        return false;
      }
      // verificamos si ya hay una imagen para borrarla y gardar la nueva
      pathViejo = `./uploads/usuarios/${usuario.img}`;
      // borraImagen(pathViejo);
      borraImagen(pathViejo);

      // lo asignamos el nombre del archivo a la variable del schema, medico,img
      usuario.img = nombreArchivo;
      await usuario.save();
      return true;

    case 'hospitales':
      const hospital = await Hospital.findById(id);
      if (!hospital) {
        return false;
      }
      // verificamos si ya hay una imagen para borrarla y gardar la nueva
      pathViejo = `./uploads/hospitales/${hospital.img}`;
      // borraImagen(pathViejo);
      borraImagen(pathViejo);

      // lo asignamos el nombre del archivo a la variable del schema, medico,img
      hospital.img = nombreArchivo;
      await hospital.save();
      return true;
      break;

    default:
      break;
  }
};
module.exports = {
  actualizarImagen,
};
