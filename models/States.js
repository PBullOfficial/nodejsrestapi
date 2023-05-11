const mongoose = require('mongoose');
const stateData = require('./statesData.json');

const stateSchema = new mongoose.Schema({
  stateCode: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 2,
    validate: {
      validator: function(v) {
        return /^[A-Z]+$/.test(v);
      },
      message: props => `${props.value} is not a valid state code.`
    }
  },
  funFacts: {
    type: [String],
    required: true
  }
});

const State = mongoose.model('State', stateSchema);

const getStateData = async () => {
  try {
    // Get all states from MongoDB
    const states = await State.find();
    
    // Merge stateData.json with state facts from MongoDB
    const mergedStates = stateData.map(state => {
      const foundState = states.find(s => s.stateCode === state.code);
      if (foundState) {
        return {
          ...state,
          funFacts: foundState.funFacts
        };
      }
      return state;
    });
    
    return mergedStates;
  } catch (err) {
    console.error(err.message);
    throw new Error('Failed to get state data.');
  }
};

module.exports = {
  State,
  getStateData
};
