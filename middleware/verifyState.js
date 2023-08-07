const statesJSONData = require('../model/statesData.json');

// Middleware to verify state parameter
const verifyState = () => {
    return (req, res, next) => {
        // No need to check if param exists because...
        // if URL param does not exist, catch all 404 is sent (see server.js)

        // Set param to uppercase
        const stateAbbr = req.params.state.toUpperCase() 

        // Get list of codes from JSON data
        const stateCodes = statesJSONData.map(st => st.code) 

        // Get code if exists in list
        const isState = stateCodes.find(code => code === stateAbbr) 

        if (!isState) return res.status(400).json({ 'message': 'Invalid state abbreviation parameter' })

        // Attach state code to request object and call next
        req.code = stateAbbr
        next()
    }
}

module.exports = verifyState