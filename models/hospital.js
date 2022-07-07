const { Schema, model } = require('mongoose');

const HospitalSchema = Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    // esto es para indicar q el hospital hace referencia a un usuario, q es el q crea el hospital en BD
    usuario: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
    },
  },
  // asi se grabar en bd, se renombra
  { collection: 'hospitales' }
);

// renombreamos el _id por uid y quitamos el password de la respuesta y el __v, quitampos el _id pq sera renombrado ahi abajito
HospitalSchema.method('toJSON', function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model('Hospital', HospitalSchema);
