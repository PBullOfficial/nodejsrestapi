const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  stateCode: {
    type: String,
    required: true,
    unique: true,
  },
  funfacts: {
    type: [String],
  },
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
