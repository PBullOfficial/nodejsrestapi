const express = require('express');
const router = express.Router();
const State = require('../models/states.js');

router.get('/', async (req, res) => {
  const states = await State.find();
  res.json(states);
});

router.post('/', async (req, res) => {
  const state = new State({
    stateCode: req.body.stateCode,
    funfacts: req.body.funfacts
  });

  await state.save();
  res.json(state);
});

router.put('/:id', async (req, res) => {
  const state = await State.findById(req.params.id);

  state.stateCode = req.body.stateCode;
  state.funfacts = req.body.funfacts;

  await state.save();
  res.json(state);
});

router.delete('/:id', async (req, res) => {
  await State.findByIdAndRemove(req.params.id);
  res.json({ message: 'State deleted' });
});

module.exports = router;
