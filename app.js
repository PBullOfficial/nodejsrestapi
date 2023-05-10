const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./db');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to database
connectDB();

// Routes
const statesRoutes = require('./routes/states');
const getRoutes = require('./routes/getRoutes');
const patchRoutes = require('./routes/patchRoutes');
const deleteRoutes = require('./routes/deleteRoutes');
const postRoutes = require('./routes/postRoutes');

// Mount routes
app.use('/api/states', states);
app.use('/api/get', getRoutes);
app.use('/api/patch', patchRoutes);
app.use('/api/delete', deleteRoutes);
app.use('/api/post', postRoutes);

module.exports = app;
