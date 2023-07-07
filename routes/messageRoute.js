// Needed Resources 
const express = require("express")
const utilities = require("../utilities")
const validate = require('../utilities/message-validation')

//CREATES A NEW ROUTER OBJECT
const router = new express.Router() 
 
//BRING CONTROLLER INTO SCOPE
const messageController = require("../controllers/messageController")

//BUILD AND RENDER THE MESSAGE CENTER
router.get("/", utilities.handleErrors((messageController.buildInbox)))

// BUILD AND RENDER NEW MESSAGE FORM
router.get("/new-message", utilities.handleErrors((messageController.buildSentMessage)))

// BUILD REPLY VIEW
router.get('/view/:message_id', utilities.handleErrors((messageController.buildViewMessage)))

// BUILD AND RENDER ARCHIVE VIEW
router.get("/archive", utilities.handleErrors(messageController.buildArchive))


// POST ROUTES
// SEND NEW MESSAGE 
router.post("/send", 
    validate.messageRules(),
    validate.checkMessage,
    utilities.handleErrors((messageController.registerNewMessage))
)

module.exports = router;