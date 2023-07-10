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

// BUILD AND RENDER NEW MESSAGE FORM AS A REPLY
router.get("/reply/:message_id", utilities.handleErrors((messageController.buildReplyMessage)))

// BUILD REPLY VIEW
router.get('/view/:message_id', utilities.handleErrors((messageController.buildViewMessage)))

// DELETE MESSAGE ROUTE
router.get("/delete/:message_id", utilities.handleErrors(messageController.deleteMessage))

// MARK A MESSAGE AS READ
router.get("/read/:message_id", utilities.handleErrors(messageController.markRead))

// MARK A MESSAGE AS READ
router.get("/archive/:message_id", utilities.handleErrors(messageController.sendToArchive))

// BUILD AND RENDER ARCHIVE VIEW
router.get("/archive", utilities.handleErrors(messageController.buildArchive))

///////////////////////// POST ROUTES /////////////////////////////
// SEND NEW MESSAGE 
router.post("/send", 
    validate.messageRules(),
    validate.checkMessage,
    utilities.handleErrors((messageController.registerNewMessage))
)

module.exports = router;