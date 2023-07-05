// Needed Resources 
const express = require("express")
const utilities = require("../utilities")
// const validate = require('../utilities/account-validation')

//CREATES A NEW ROUTER OBJECT
const router = new express.Router() 

//BRING CONTROLLER INTO SCOPE
const messageController = require("../controllers/messageController")

//BUILD AND RENDER THE MESSAGE CENTER
router.get("/", utilities.handleErrors((messageController.buildInbox)))

// BUILD AND RENDER NEW MESSAGE FORM
router.get("/new-message", utilities.handleErrors((messageController.buildSentMessage)))

// BUILD AND RENDER ARCHIVE VIEW
router.get("/archive", utilities.handleErrors(messageController.buildArchive))

module.exports = router;