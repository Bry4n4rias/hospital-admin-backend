const { Schema, model } = require('mongoose');

const MedicoSchema = Schema(
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
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
    hospital: {
      type: Schema.Types.ObjectId,
      ref: 'Hospital',
      required: true,
    },
  },
  // asi se grabar en bd, se renombra
  { collection: 'medicos' }
);

// renombreamos el _id por uid y quitamos el password de la respuesta y el __v, quitampos el _id pq sera renombrado ahi abajito
MedicoSchema.method('toJSON', function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model('Medico', MedicoSchema);
