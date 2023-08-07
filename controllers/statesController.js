const State = require('../model/State');
const statesJSONData = require('../model/statesData.json');

const getAllStates = async (req, res) => {
    const { contig } = req?.query // default is false 

    let statesList = [...statesJSONData]; // all states

    // filter if contig query parameter is true
    if (contig === 'true') {
        statesList = statesList.filter(state => state.code !== 'AK' && state.code !== 'HI')
    }

    // filter if contig query parameter is false
    if (contig === 'false') {
        statesList = statesList.filter(state => state.code === 'AK' || state.code === 'HI')
    }

    const mongoStates = await State.find(); // all states in MongoDB

    statesList.forEach(state => {
        const stateExists = mongoStates.find(st => st.stateCode === state.code);
        if (stateExists) state.funfacts = [...stateExists.funfacts]
    })

    res.json(statesList);
}

const getOneState = async (req, res) => {
    const code = req.code // sent from middleware verifyState

    // find specific state in JSON data 
    const state = statesJSONData.find(state => state.code === code)

    // find state in MongoDB collection
    const savedState = await State.findOne({ stateCode: code }).exec();

    if (savedState) { // add fun facts if they exist
        state.funfacts = [...savedState.funfacts]
    }

    return res.json(state)
}

const getRandomFact = async (req, res) => {
    const code = req.code // sent from middleware verifyState

    // find specific state in JSON data 
    const state = statesJSONData.find(state => state.code === code)

    // find state in MongoDB collection
    const savedState = await State.findOne({ stateCode: code }).exec();

    // Checking if the savedState exists and if it does,  
    // using Optional Chaining (?.) to confirm the savedState 
    // has a funfacts array and the array is not empty
    if (!savedState?.funfacts?.length) return res.status(404).json({ 'message': `No Fun Facts found for ${state.state}` })

    // Get random element from funfacts array
    const randomFact = savedState.funfacts[Math.floor(Math.random() * savedState.funfacts.length)];

    return res.json({ 'funfact': randomFact })

}

const addNewStateFacts = async (req, res) => {
    const code = req.code;
    const { funfacts } = req?.body; // destructure body data 

    if (!funfacts) return res.status(400).json({ 'message': 'State fun facts value required' })

    if (!Array.isArray(funfacts)) return res.status(400).json({ 'message': 'State fun facts value must be an array' })

    // find state in MongoDB collection
    const savedState = await State.findOne({ stateCode: code }).exec();

    let result;
    if (savedState) { //update existing 
        savedState.funfacts = [...savedState.funfacts, ...funfacts]
        result = await savedState.save();
        return res.json(result)
    } else { //create new
        try {
            result = await State.create({
                stateCode: code,
                funfacts
            })
            return res.status(201).json(result)
        } catch (err) {
            console.error(err)
        }
    }
}

const updateStateFact = async (req, res) => {
    const code = req.code;
    let { index, funfact } = req?.body; // destructure body data 

    if (!index) return res.status(400).json({ 'message': 'State fun fact index value required' })

    // adjust for 0 index of array
    index = index - 1;

    if (!funfact) return res.status(400).json({ 'message': 'State fun fact value required' })

    // find specific state in JSON data 
    const state = statesJSONData.find(state => state.code === code)

    // find state in MongoDB collection
    const savedState = await State.findOne({ stateCode: code }).exec();

    // Checking if the savedState exists and if it does,  
    // using Optional Chaining (?.) to confirm the savedState 
    // has a funfacts array and the array is not empty
    if (!savedState?.funfacts?.length) return res.status(404).json({ 'message': `No Fun Facts found for ${state.state}` })

    if (!savedState.funfacts[index]) return res.status(404).json({ 'message': `No Fun Fact found at that index for ${state.state}` })

    // Update funfact at specified index
    savedState.funfacts[index] = funfact;
    // Save state in MongoDB
    const result = await savedState.save();
    // Send response
    res.json(result)
}

const deleteStateFact = async (req, res) => {
    const code = req.code;
    let { index } = req?.body; // destructure body data 

    if (!index) return res.status(400).json({ 'message': 'State fun fact index value required' })

    // adjust for 0 index of array
    index = index - 1;

    // find specific state in JSON data 
    const state = statesJSONData.find(state => state.code === code)

    // find state in MongoDB collection
    const savedState = await State.findOne({ stateCode: code }).exec();

    // Checking if the savedState exists and if it does,  
    // using Optional Chaining (?.) to confirm the savedState 
    // has a funfacts array and the array is not empty
    if (!savedState?.funfacts?.length) return res.status(404).json({ 'message': `No Fun Facts found for ${state.state}` })

    if (!savedState.funfacts[index]) return res.status(404).json({ 'message': `No Fun Fact found at that index for ${state.state}` })

    // create new array by filtering out record to delete
    const newFactsArray = savedState.funfacts.filter((ff, i) => i !== index)
    // set funfacts to new array
    savedState.funfacts = newFactsArray;
    // save state to MongoDB
    const result = await savedState.save();
    // send response
    res.json(result)
}

const getCapital = (req, res) => {
    const code = req.code // sent from middleware verifyState

    // find specific state in JSON data 
    const state = statesJSONData.find(state => state.code === code)

    res.json({ 'state': state.state, 'capital': state.capital_city })
}

const getNickName = (req, res) => {
    const code = req.code // sent from middleware verifyState

    // find specific state in JSON data 
    const state = statesJSONData.find(state => state.code === code)

    res.json({ 'state': state.state, 'nickname': state.nickname })
}

const getPop = (req, res) => {
    const code = req.code // sent from middleware verifyState

    // find specific state in JSON data 
    const state = statesJSONData.find(state => state.code === code)

    res.json({ 'state': state.state, 'population': state.population.toLocaleString('en-US') })
}

const getAdmission = (req, res) => {
    const code = req.code // sent from middleware verifyState

    // find specific state in JSON data 
    const state = statesJSONData.find(state => state.code === code)

    res.json({ 'state': state.state, 'admitted': state.admission_date })
}

module.exports = {
    getAllStates,
    getOneState,
    getRandomFact,
    addNewStateFacts,
    updateStateFact,
    deleteStateFact,
    getCapital,
    getNickName,
    getPop,
    getAdmission
}