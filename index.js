const express = require('express');
const { dbConection } = require('./database/config');
const cors = require('cors');
require('dotenv').config();

// crear server
const app = express();

// BD
dbConection();

// configurar cors
app.use(cors());

// Puerto
const port = process.env.PORT || 3000;

// rutas
app.get('/', (req, res) => {
  res.json({
    ok: true,
    msg: 'Hola mundo',
  });
});

app.listen(port, () => {
  console.log('servidor corriendo en puerto ' + port);
});
