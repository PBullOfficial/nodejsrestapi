const mongoose = require('mongoose');

// Async function to connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI);
    } catch (err) {
        console.error(err);
    }
}

module.exports = connectDB