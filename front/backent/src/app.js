const express = require('express');
const app = express();
const cors = require('cors');

//setting
app.set('port',process.env.PORT || 4000);

//midellweres
app.use(cors());
app.use(express.json());

//router
app.use('/api/misas', require('./routers/misas'))
app.use('/api/delete', require('./routers/delet'))

module.exports = app;