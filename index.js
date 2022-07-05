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

// Lectura y parseo del body
app.use(express.json());

// Puerto
const port = process.env.PORT || 3000;

// Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));

app.listen(port, () => {
  console.log('servidor corriendo en puerto ' + port);
});
