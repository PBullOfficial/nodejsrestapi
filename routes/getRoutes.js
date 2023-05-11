const express = require('express');
const router = express.Router();
const State = require('../models/states');
const stateData = require('../models/statesData.json');

// Get all state data
router.get('/', async (req, res) => {
  try {
    const { contig } = req.query;

    let statesFromDB = await State.find({}, { funfacts: 0 });

    let states = statesFromDB.map(stateFromDB => {
      const stateDataItem = stateData.find(stateDataItem => stateDataItem.code === stateFromDB.stateCode);
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

module.exports = router;