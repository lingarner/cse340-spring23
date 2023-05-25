// Needed Resources 
const express = require("express")

//creates a new Router object 
//we also have routes in the server.js file
//having more than one router file keeps server.js
// smaller and more manageable 
const router = new express.Router() 

const invController = require("../controllers/invController")


// Route to build inventory by classification view
//this route must match the routes in the links for the nav bar 
// /inv accounted for in server.js route to here
router.get("/type/:classificationId", invController.buildByClassificationId);

module.exports = router;