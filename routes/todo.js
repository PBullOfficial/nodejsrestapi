const express = require('express');
const router = express.Router();
const Todo = require('../models/todo');

router.get('/', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

router.post('/', async (req, res) => {
  const todo = new Todo({
    title: req.body.title,
    description: req.body.description,
  });

  await todo.save();
  res.json(todo);
});

router.put('/:id', async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  todo.title = req.body.title;
  todo.description = req.body.description;

  await todo.save();
  res.json(todo);
});

router.delete('/:id', async (req, res) => {
  await Todo.findByIdAndRemove(req.params.id);
  res.json({ message: 'Todo deleted' });
});

module.exports = router;
