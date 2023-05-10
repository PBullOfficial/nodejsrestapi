const express = require('express');
const router = express.Router();
const State = require('../models/states.js');

router.get('/', async (req, res) => {
  try {
    const states = await State.find();
    res.json(states);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/', async (req, res) => {
  try {
    const state = new State({
      stateCode: req.body.stateCode,
      funfacts: req.body.funfacts
    });
    await state.save();
    res.json(state);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.put('/:id', async (req, res) => {
  try {
    const state = await State.findById(req.params.id);
    if (!state) {
      return res.status(404).json({ msg: 'State not found' });
    }
    state.stateCode = req.body.stateCode;
    state.funfacts = req.body.funfacts;
    await state.save();
    res.json(state);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const state = await State.findById(req.params.id);
    if (!state) {
      return res.status(404).json({ msg: 'State not found' });
    }
    await State.findByIdAndRemove(req.params.id);
    res.json({ message: 'State deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
