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
    
    // get first and last name from jwt
    let firstname = res.locals.accountData.account_firstname;
    
    let lastname = res.locals.accountData.account_lastname;
    
    //indicated where to render the view
    res.render("message/message-center", {
      title: `${firstname} ${lastname} Inbox`,
      nav,
      errors: null,
      messageTable,
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
  console.log(message_from)
  account_id = parseInt(account_id[0])
  console.log(account_id)

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

module.exports =  messCont 