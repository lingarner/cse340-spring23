// Needed Resources 
const express = require("express")
const utilities = require("../utilities/")

//creates a new Router object 
const accRouter = new express.Router() 

//provid access to the account controller file (bring into scope)
const accountController = require("../controllers/accountController");


// Route to build inventory by classification view
// this route must match the routes in the links for the nav bar 
// /inv accounted for in server.js route to here
accRouter.get("/login", utilities.handleErrors((accountController.buildLogin)))

// registration route
accRouter.get("/register", utilities.handleErrors((accountController.buildRegistration)))

module.exports = accRouter;