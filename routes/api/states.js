const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');
const verifyState = require('../../middleware/verifyState');

router.route('/')
    // Returns html (if accepted) or text response with directions
    .get(statesController.getAllStates) 

    // Retrieve all info about specified state 
router.route('/:state')
    .get(verifyState(), statesController.getOneState)

router.route('/:state/funfact')
    // Returns 1 random fun fact about the specified state 
    .get(verifyState(), statesController.getRandomFact) 
    // Post one or more new state facts 
    .post(verifyState(), statesController.addNewStateFacts) 
    // Update existing fun fact at index
    .patch(verifyState(), statesController.updateStateFact) 
    // Delete fun fact at index 
    .delete(verifyState(), statesController.deleteStateFact) 

router.route('/:state/capital')
    // Returns the state and capital 
    .get(verifyState(), statesController.getCapital) 

router.route('/:state/nickname')
    // Returns the state and nickname 
    .get(verifyState(), statesController.getNickName) 

router.route('/:state/population')
    // Returns the state and population 
    .get(verifyState(), statesController.getPop) 

router.route('/:state/admission')
    // Returns the state and the date the state was admitted 
    .get(verifyState(), statesController.getAdmission) 

module.exports = router;