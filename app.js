const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./db');

const app = express();

// Set up CORS
const whitelist = ['https://dazzling-snickerdoodle-777101.netlify.app', 'https://lapis-skillful-walkover.glitch.me'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};
app.use(cors(corsOptions));

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

// Catch-all 404 handler
app.use((req, res, next) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(__dirname + '/public/404.html');
  } else if (req.accepts('json')) {
    res.json({ error: '404 Not found' });
  } else {
    res.type('txt').send('404 Not found');
  }
});

module.exports = app;
