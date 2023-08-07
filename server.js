require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB();

// Custom middleware logger
app.use(logger);

// Cross Origin Resource Sharing
// Open to all as Public API***
app.use(cors());

// Built-in middleware for json 
app.use(express.json());

// Serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// Routes 
app.use('/', require('./routes/root'));
app.use('/states', require('./routes/api/states'));

// Error handling middleware
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);

// Start server
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});