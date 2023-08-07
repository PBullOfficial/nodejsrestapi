const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');
const verifyState = require('../../middleware/verifyState');

router.route('/')
    .get(statesController.getAllStates) // returns html (if accepted) or text response with directions

router.route('/:state')
    .get(verifyState(), statesController.getOneState) // retrieve all info about specified state 

router.route('/:state/funfact')
    .get(verifyState(), statesController.getRandomFact) // returns 1 random fun fact about the specified state 
    .post(verifyState(), statesController.addNewStateFacts) // post 1 or more new state facts 
    .patch(verifyState(), statesController.updateStateFact) // update existing fun fact at index
    .delete(verifyState(), statesController.deleteStateFact) // delete fun fact at index 

router.route('/:state/capital')
    .get(verifyState(), statesController.getCapital) // returns the state and capital 

router.route('/:state/nickname')
    .get(verifyState(), statesController.getNickName) // returns the state and nickname 

router.route('/:state/population')
    .get(verifyState(), statesController.getPop) // returns the state and population 

router.route('/:state/admission')
    .get(verifyState(), statesController.getAdmission) // returns the state and the date the state was admitted 

module.exports = router;