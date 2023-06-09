// Needed Resources 
const express = require("express")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')


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

//registeration information path to database/model
accRouter.post('/registerUser', 
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)


// Process the login attempt
accRouter.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    // utilities.handleErrors(accountController.registerLogin),
    utilities.handleErrors(accountController.accountLogin),
)

accRouter.get(
    "/", 
    utilities.checkLogin,
    utilities.handleErrors((accountController.buildBaseLogin)) 
)

// path to render the view where users can update their account information
accRouter.get("/updateAccountInfo/:account_id", 
utilities.handleErrors((accountController.renderUpdateAccount)))


// path to render the view where users can update their account information
accRouter.post("/processUpdateReq/", 
    regValidate.updateAccRules(),
    regValidate.checkAccData,
    utilities.handleErrors((accountController.updateAccount)))

// path to update password in db
accRouter.post("/passwordChange",
    regValidate.newPasswordRules(),
    regValidate.checkNewPassword,
    utilities.handleErrors((accountController.updatePassword)))

module.exports = accRouter;