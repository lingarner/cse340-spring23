// Needed resources
const utilities = require("../utilities/")
// const accountModel = require("../models/account-model")
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

    let firstname = res.locals.accountData.account_firstname;
    let lastname = res.locals.accountData.account_lastname;
    
    //indicated where to render the view
    res.render("message/message-center", {
      title: `${firstname} ${lastname} Inbox`,
      nav,
      errors: null,
    })
  }

module.exports =  messCont 