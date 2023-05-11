const express = require('express');
const router = express.Router();
const State = require('../models/states');

// Add fun facts for a specific state
router.post('/:state/funfact', async (req, res) => {
  try {
    const state = await State.findOne({ stateCode: req.params.state });

    if (!state) {
      return res.status(404).json({ msg: 'State not found' });
    }

    const { funfacts } = req.body;

    if (!funfacts || !Array.isArray(funfacts)) {
      return res.status(400).json({ msg: 'Invalid request body' });
    }

    // Add new fun facts to existing ones, if any
    const updatedFunFacts = [...state.funfacts, ...funfacts];
    const updatedState = await State.findOneAndUpdate(
      { stateCode: req.params.state },
      { funfacts: updatedFunFacts },
      { new: true } // Return updated document
    );

    res.json(updatedState);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
