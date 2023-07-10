const utilities = require(".")
const messageModel = require("../models/message-model")

// body tool allows the validator to access the body object (access data)
// validationResult is an object that contains all errors detected by the validation process (retrieve errors)
const { body, validationResult } = require("express-validator")
const cookie = require("cookie-parser")
const validate = {}


/*  **********************************
 *  Rule for a new message
 * ********************************* */
validate.messageRules = () => {
    return [
        body("account_id")
        .notEmpty()
        .withMessage("Please select an option from the dropdown."),

        body("message_subject")
            .trim() //removes whitespace on either side of incoming string
            .isLength({ min: 1 })
            .withMessage("Please provide a message subject."), // on error this message is sent.
  
        body("message_body")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a message."), // on error this message is sent.
    ]
  }

/* ******************************
 * Check data and return errors or continue to registration -- VALIDATE
 * ***************************** */
validate.checkMessage = async (req, res, next) => {
    const { message_subject, message_body, account_id } = req.body
    let errors = []

  console.log(account_id)
    errors = validationResult(req)

    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()

      // dropdown menu 
      let names = await messageModel.getAllFirstnames()
      // create recipient dropdown
      let dropdown = await utilities.buildMessageDrop(names, account_id)
      
      res.render("message/send", {
        errors,
        title: "New Message",
        nav,
        dropdown,
        message_subject,
        message_body, 
      })
      return
    }
    next()
  }

module.exports = validate
