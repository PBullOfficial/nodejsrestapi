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
const states = require('./routes/states');
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

// Catch-all route handler for 404 errors
app.use((req, res, next) => {
    // Set status to 404
    res.status(404);
  
    // Respond with HTML page if client accepts "text/html"
    if (req.accepts('html')) {
      res.sendFile(__dirname + '/public/404.html');
      return;
    }
  
    // Respond with JSON object if client accepts "application/json"
    if (req.accepts('json')) {
      res.json({ error: '404 Not Found' });
      return;
    }
  
    // Default to plain-text response
    res.type('txt').send('404 Not Found');
  });

module.exports = app;
