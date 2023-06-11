// Needed Resources 
const express = require("express")
const utilities = require("../utilities/")
const regValidateInv = require('../utilities/inv-validation')

//creates a new Router object 
//we also have routes in the server.js file
//having more than one router file keeps server.js
// smaller and more manageable 
const router = new express.Router() 

const invController = require("../controllers/invController");


// Route to build inventory by classification view
// this route must match the routes in the links for the nav bar 
// /inv accounted for in server.js route to here
router.get("/type/:classificationId", utilities.handleErrors((invController.buildByClassificationId)));


// Route to build car details view
router.get("/detail/:invId", utilities.handleErrors((invController.buildByInvId)));

// Route to build new classification form
router.get("/newClass", utilities.handleErrors((invController.buildNewClassification)));

// Route to add new vehicle
router.get("/newInv", utilities.handleErrors((invController.renderNewVehicle)));

// render home management view
router.get("/", utilities.handleErrors((invController.buildInvNav)));

// Route for error Message
router.get("/broken", utilities.handleErrors(invController.throwError));


/* ******************************
* POST methods
* ***************************** */

// send user entered classification to the database
router.post("/newClass", 
    regValidateInv.ClassRules(),
    regValidateInv.checkClassData,
    utilities.handleErrors((invController.registerClass))
);

// send new vehicle to the database
router.post("/newInv", 
regValidateInv.newInvRules(),
regValidateInv.checkNewInv,
utilities.handleErrors((invController.registerNewVehicle)))


module.exports = router;