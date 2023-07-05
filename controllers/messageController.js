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

  let names = await messageModel.getAllFirstnames()
  console.log(names)
  let dropdown = await utilities.buildMessageDrop(names)

  //indicated where to render the view
  res.render("message/send", {
    title: 'New Message',
    nav,
    errors: null,
    dropdown
  })
}

module.exports =  messCont 