const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const todoRoutes = require('./routes/todo');

const data = require('./models/statesData.json');
console.log(data);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/todos', todoRoutes);

module.exports = app;
