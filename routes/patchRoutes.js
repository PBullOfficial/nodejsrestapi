const express = require('express');
const router = express.Router();
const State = require('../models/states');

router.patch('/:state/funfact', async (req, res) => {
  try {
    const { state } = req.params;
    const { index, funfact } = req.body;
    
    if (!index || !funfact) {
      return res.status(400).json({ message: 'Invalid request body.' });
    }
    
    const foundState = await State.findOne({ stateCode: state });
    if (!foundState) {
      return res.status(404).json({ message: 'State not found.' });
    }
    
    const funFacts = foundState.funFacts;
    const adjustedIndex = index - 1;
    
    if (adjustedIndex < 0 || adjustedIndex >= funFacts.length) {
      return res.status(400).json({ message: 'Invalid index.' });
    }
    
    funFacts[adjustedIndex] = funfact;
    foundState.funFacts = funFacts;
    await foundState.save();
    
    res.json(foundState);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
