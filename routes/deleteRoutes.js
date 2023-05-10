const express = require('express');
const router = express.Router();
const State = require('../models/states.js');

router.delete('/states/:state/funfact', async (req, res) => {
  try {
    const state = req.params.state.toUpperCase();
    const index = req.body.index;
    if (!index) {
      return res.status(400).json({ error: 'Index parameter is missing.' });
    }
    const foundState = await State.findOne({ stateCode: state });
    if (!foundState) {
      return res.status(404).json({ error: 'State not found.' });
    }
    const funFacts = foundState.funFacts;
    const removedFact = funFacts.splice(index - 1, 1);
    await foundState.save();
    return res.json({ removedFact });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
