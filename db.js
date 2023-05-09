const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/nodejsproject', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
