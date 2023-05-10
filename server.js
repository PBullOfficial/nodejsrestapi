require('dotenv').config();
const { app, data } = require('./app');
const connectDB = require('./db');

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });