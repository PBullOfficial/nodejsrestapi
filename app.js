const express = require('express');
const bodyParser = require('body-parser');
const todoRoutes = require('./routes/todo');
const connectDB = require('./db');

const data = require('./models/statesData.json');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

connectDB();

app.use('/api/todos', todoRoutes);

module.exports = { app, data };
