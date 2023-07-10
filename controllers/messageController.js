// Needed resources
const utilities = require("../utilities/")
const messageModel = require("../models/message-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const cookie = require("cookie-parser")
require("dotenv").config()

const messCont = {}
/* ****************************************
*  Deliver Message Center view
* *************************************** */
messCont.buildInbox = async function(req, res, next) {
    let nav = await utilities.getNav()
    // get message data to display in table
    let account_id = res.locals.accountData.account_id
    
    let messageData = await messageModel.getMessageData(account_id)
    // display table
    let messageTable = await utilities.buildMessagesList(messageData)

    //get the number of archived messages
    let archivedTotal = await utilities.getArchTotal(messageData)
    
    // get first and last name from jwt
    let firstname = res.locals.accountData.account_firstname;
    
    let lastname = res.locals.accountData.account_lastname;
    
    //indicated where to render the view
    res.render("message/message-center", {
      title: `${firstname} ${lastname} Inbox`,
      nav,
      errors: null,
      messageTable,
      archivedTotal
    })
  }

/* ****************************************
*  Deliver create a message view
* *************************************** */
messCont.buildSentMessage = async function(req, res, next){
  let nav = await utilities.getNav()
  

  // get account names
  let names = await messageModel.getAllFirstnames()

  // create recipient dropdown
  let dropdown = await utilities.buildMessageDrop(names)

  //indicated where to render the view
  res.render("message/send", {
    title: 'New Message',
    nav,
    errors: null,
    dropdown
  })
}

/* ****************************************
*  Deliver Reply to a message view
* *************************************** */
messCont.buildReplyMessage = async function(req, res, next){
  let nav = await utilities.getNav()
  const message_id = req.params.message_id
  
  // get message info
  let messageDetails = await messageModel.getMessageContent(message_id)
  console.log(messageDetails[0].message_from)
  // get account names
  let names = await messageModel.getAllFirstnames()
  // create recipient dropdown
  let dropdown = await utilities.buildMessageDrop(names, messageDetails[0].message_from )


  //indicated where to render the view
  res.render("message/send", {
    title: 'New Message',
    nav,
    errors: null,
    dropdown,
    message_subject: `RE: ${messageDetails[0].message_subject}`,
    message_body: `\n\n\n///////////// PREVIOUS MESSAGE /////////////\n ${messageDetails[0].message_body}`,
    account_id: messageDetails[0].message_from
  })
}


/* ****************************************
*  Add new message to thee database
* *************************************** */
messCont.registerNewMessage = async function(req, res){
  let nav = await utilities.getNav()

  // get account names
  let names = await messageModel.getAllFirstnames()

  // create recipient dropdown
  let dropdown = await utilities.buildMessageDrop(names)

  const { 
    message_subject, 
    message_body, 
  } = req.body
  let {account_id} = req.body
 
  let message_from = res.locals.accountData.account_id
  account_id = parseInt(account_id[0])

  const regResult = await messageModel.registerMessage(
    message_subject, 
    message_body,
    message_from,
    account_id 
  )

  console.log(regResult.rows)


  if (regResult) {
    req.flash(
      "success",
      ` Message Sent!`
    )
    res.status(201).render("message/send", {
      title: "New Message",
      nav,
      dropdown,
      errors: null
    })
  } else {
    req.flash("notice", "Message failed to send.")
    res.status(501).render("message/send", {
      title: "Register New Vehicle",
      nav,
      dropdown,
      errors: null,
    })
  }
}

/* ****************************************
*  Build View Message
* *************************************** */
messCont.buildViewMessage = async function(req, res, next) {
  let nav = await utilities.getNav()

  // get id of message user wants to view
  const message_id = req.params.message_id
  // get messages to person using message id
  let messageData = await messageModel.getMessageContent(message_id)

  // change message_from to a name
  let senderName = await messageModel.getSenderInfo(messageData[0].message_from)


  console.log(senderName[0])
  
  
  //indicated where to render the view
  res.render("message/view-message", {
    title: `${messageData[0].message_subject}`,
    nav,
    errors: null,
    subject: messageData[0].message_subject,
    from: `${senderName[0].account_firstname} ${senderName[0].account_lastname}`,
    message: messageData[0].message_body,
    message_id
  })
}

/* ****************************************
*  Change Messages to Read
* *************************************** */
messCont.markRead = async function(req, res, next) {
  let nav = await utilities.getNav()

  // get id of message user wants to view
  const message_id = req.params.message_id

  // get messages to person using message id
  let messageData = await messageModel.updateToRead(message_id)

  // change message_from to a name
  let senderName = await messageModel.getSenderInfo(messageData.rows[0].message_from)
  
  
  if (messageData) {
    req.flash(
      "success",
      `Message marked as read!`
    )
        // get message data to display in table
        let account_id = res.locals.accountData.account_id
    
        let messageData = await messageModel.getMessageData(account_id)
        // display table
        let messageTable = await utilities.buildMessagesList(messageData)
        //get the number of archived messages
        let archivedTotal = await utilities.getArchTotal(messageData)
        
        // get first and last name from jwt
        let firstname = res.locals.accountData.account_firstname;
        
        let lastname = res.locals.accountData.account_lastname;

    res.status(201).render("message/message-center", {
      title: `${firstname} ${lastname} Inbox`,
      nav,
      errors: null,
      messageTable,
      archivedTotal
    })
  } else {
    req.flash("notice", "Message failed to be marked as read.")
    res.status(501).render("message/view-message", {
      title: `${messageData[0].message_subject}`,
      nav,
      errors: null,
      subject: messageData[0].message_subject,
      from: `${senderName[0].account_firstname} ${senderName[0].account_lastname}`,
      message: messageData[0].message_body,
      message_id
    })
  }
}


/* ****************************************
*  DELETE MESSAGES
* *************************************** */
messCont.deleteMessage = async function(req, res, next) {
  let nav = await utilities.getNav()

  // get id of message user wants to view
  const message_id = req.params.message_id

  // get messages to person using message id
  let messageData = await messageModel.deleteMessage(message_id)

  
  if (messageData) {
    req.flash(
      "success",
      `Message deleted!`
    )
        // get message data to display in table
        let account_id = res.locals.accountData.account_id
    
        let messageData = await messageModel.getMessageData(account_id)
        // display table
        let messageTable = await utilities.buildMessagesList(messageData)

        let archivedTotal = await utilities.getArchTotal(messageData)
        
        // get first and last name from jwt
        let firstname = res.locals.accountData.account_firstname;
        
        let lastname = res.locals.accountData.account_lastname;

    res.status(201).render("message/message-center", {
      title: `${firstname} ${lastname} Inbox`,
      nav,
      errors: null,
      messageTable,
      archivedTotal
    })
  } else {
    req.flash("notice", "Message failed to delete.")

    // change message_from to a name
    let senderName = await messageModel.getSenderInfo(messageData.rows[0].message_from)

    res.status(501).render("message/view-message", {
      title: `${messageData[0].message_subject}`,
      nav,
      errors: null,
      subject: messageData[0].message_subject,
      from: `${senderName[0].account_firstname} ${senderName[0].account_lastname}`,
      message: messageData[0].message_body,
      message_id
    })
  }
}

/* ****************************************
*  Deliver archived messages view
* *************************************** */
messCont.buildArchive = async function(req, res, next) {
  let nav = await utilities.getNav()
  // get message data to display in table
  let account_id = res.locals.accountData.account_id
  
  let messageData = await messageModel.getMessageData(account_id)
  // display table
  let messageTable = await utilities.buildArchiveTable(messageData)
  
  // get first and last name from jwt
  let firstname = res.locals.accountData.account_firstname;
  
  let lastname = res.locals.accountData.account_lastname;
  
  //indicated where to render the view
  res.render("message/archive", {
    title: `${firstname} ${lastname} Archives`,
    nav,
    errors: null,
    messageTable,
  })
}

/* ****************************************
*  Send messages to Archive
* *************************************** */
messCont.sendToArchive = async function(req, res, next) {
  let nav = await utilities.getNav()

  // get id of message user wants to view
  const message_id = req.params.message_id

  // get messages to person using message id
  let messageData = await messageModel.sendToArchive(message_id)

  // change message_from to a name
  let senderName = await messageModel.getSenderInfo(messageData.rows[0].message_from)
  
  
  if (messageData) {
    req.flash(
      "success",
      `Message sent to Archive!`
    )
        // get message data to display in table
        let account_id = res.locals.accountData.account_id
    
        let messageData = await messageModel.getMessageData(account_id)
        // display table
        let messageTable = await utilities.buildMessagesList(messageData)

        let archivedTotal = await utilities.getArchTotal(messageData)
        
        // get first and last name from jwt
        let firstname = res.locals.accountData.account_firstname;
        
        let lastname = res.locals.accountData.account_lastname;

    res.status(201).render("message/message-center", {
      title: `${firstname} ${lastname} Inbox`,
      nav,
      errors: null,
      messageTable,
      archivedTotal
    })
  } else {
    req.flash("notice", "Message failed to be seent to archive.")
    res.status(501).render("message/view-message", {
      title: `${messageData[0].message_subject}`,
      nav,
      errors: null,
      subject: messageData[0].message_subject,
      from: `${senderName[0].account_firstname} ${senderName[0].account_lastname}`,
      message: messageData[0].message_body,
      message_id
    })
  }
}

module.exports =  messCont 