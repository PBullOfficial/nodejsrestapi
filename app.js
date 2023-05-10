const express = require('express');
const bodyParser = require('body-parser');
const statesRoutes = require('./routes/states');
const connectDB = require('./db');

const data = require('./models/statesData.json');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

connectDB();

app.use('/api/states', statesRoutes);

module.exports = { app, data };
