const mongoose = require('mongoose');

const dbConection = async () => {
  try {
    await mongoose.connect(process.env.DB_CNN);
    console.log('Db online');
  } catch (error) {
    console.log(error);
    throw new Error('Error en la bd');
  }
};

module.exports = {
  dbConection,
};
