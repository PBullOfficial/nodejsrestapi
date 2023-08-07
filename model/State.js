const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
  stateCode: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 2,
    // Regular expression to validate state code
    validate: {
      validator: function(v) {
        return /^[A-Z]+$/.test(v);
      },
      message: props => `${props.value} is not a valid state code.`
    }
  },
  funfacts: {
    type: [String],
    required: true
  }
});

// Create model from schema
const State = mongoose.model('State', stateSchema);

// Get all states from database
const getStateData = async () => {
  try {
    const states = await State.find();
    return states;
  } catch (err) {
    console.error(err.message);
    throw new Error('Failed to get state data.');
  }
};

// Export model and function
module.exports = {
  State,
  getStateData
};
