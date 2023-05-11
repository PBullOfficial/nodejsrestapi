const express = require('express');
const router = express.Router();
const State = require('../models/States');
const stateData = require('../models/statesData.json');
const fs = require('fs');
const path = require('path');

// Read the states data from JSON file
const statesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../models/statesData.json')));

// Get all state data
router.get('/', async (req, res) => {
  try {
    const { contig } = req.query;

    let statesFromDB = await State.find({}, { funfacts: 0 });

    let states = statesFromDB.map(stateFromDB => {
      const stateDataItem = statesData.find(stateDataItem => stateDataItem.code === stateFromDB.stateCode);
      return {
        ...stateDataItem,
        funfacts: stateFromDB.funfacts,
      };
    });

    if (contig === 'true') {
      states = states.filter(state => state.code !== 'AK' && state.code !== 'HI');
    } else if (contig === 'false') {
      states = states.filter(state => state.code === 'AK' || state.code === 'HI');
    }

    res.json(states);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// Get state data for a specific state
router.get('/:state', async (req, res) => {
  try {
    const stateData = await State.findOne({ stateCode: req.params.state }).lean();

    if (!stateData) {
      return res.status(404).json({ msg: 'State not found' });
    }

    const state = stateList.find(state => state.code === req.params.state);

    if (!state) {
      return res.status(404).json({ msg: 'State not found' });
    }

    const { capital_city, nickname, population, admission_date } = stateData;
    const { name } = state;

    res.json({ 
      state: name,
      capital: capital_city,
      nickname: nickname,
      population: population,
      admitted: admission_date,
      funfacts: stateData.funfacts
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// Get the capital city for a specific state
router.get('/:state/capital', async (req, res) => {
  try {
    const state = stateData.find(state => state.slug === req.params.state);

    if (!state) {
      return res.status(404).json({ msg: 'State not found' });
    }

    const { capital_city } = state;
    res.json({ state: state.state, capital: capital_city });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get the nickname for a specific state
router.get('/:state/nickname', async (req, res) => {
  try {
    const state = stateData.find(state => state.slug === req.params.state);

    if (!state) {
      return res.status(404).json({ msg: 'State not found' });
    }

    const { nickname } = state;
    res.json({ state: state.state, nickname });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get the population for a specific state
router.get('/:state/population', async (req, res) => {
  try {
    const state = stateData.find(state => state.slug === req.params.state);

    if (!state) {
      return res.status(404).json({ msg: 'State not found' });
    }

    const { population } = state;
    res.json({ state: state.state, population });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get the admission date for a specific state
router.get('/:state/admission', async (req, res) => {
  try {
    const state = stateData.find(state => state.slug === req.params.state);

    if (!state) {
      return res.status(404).json({ msg: 'State not found' });
    }

    const { admission_date } = state;
    res.json({ state: state.state, admitted: admission_date });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

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