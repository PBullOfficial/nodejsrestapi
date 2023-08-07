const statesJSONData = require('../model/statesData.json');

const verifyState = () => {
    return (req, res, next) => {
        // No need to check if param exists because...
        // if URL param does not exist, catch all 404 is sent (see server.js)

        const stateAbbr = req.params.state.toUpperCase() // set param to uppercase

        const stateCodes = statesJSONData.map(st => st.code) // get list of codes from JSON data

        const isState = stateCodes.find(code => code === stateAbbr) // get code if exists in list

        if (!isState) return res.status(400).json({ 'message': 'Invalid state abbreviation parameter' })

        // attach state code to request object and call next
        req.code = stateAbbr
        next()
    }
}

module.exports = verifyState