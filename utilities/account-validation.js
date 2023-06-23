const utilities = require(".")
const accountModel = require("../models/account-model")

// body tool allows the validator to access the body object (access data)
// validationResult is an object that contains all errors detected by the validation process (retrieve errors)
const { body, validationResult } = require("express-validator")
const validate = {}


/*  **********************************
 *  Registration Data Validation Rules -- SANATIZE
 * ********************************* */
validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim() //removes whitespace on either side of incoming string
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required.")
        .custom(async (account_email) => {
          const emailExists = await accountModel.checkExistingEmail(account_email)
          if (emailExists){
            throw new Error("Email exists. Please log in or use different email")
          }
        }),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }

/* ******************************
 * Check data and return errors or continue to registration -- VALIDATE
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    console.log("validate, checkregdata")
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
  }


  /* ******************************
 * Check data and return errors or continue to Login
 * ***************************** */
  validate.loginRules = () => {
    return [
      // valid email is required and cannot already exist in the DB
      body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required."),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }

  /* ******************************
 * Check data and return errors or continue to registration -- VALIDATE
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email
    })
    return
  }
  next()
}

/*  **********************************
 *  Update account info fname, lname, email
 * ********************************* */
validate.updateAccRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim() //removes whitespace on either side of incoming string
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the DB
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email, {req}) => {
        const account_id = req.body.account_id
        const accountData = await accountModel.getAccountsByAccountId(account_id)

        if (account_email != accountData[0].account_email){
          const emailExists = await accountModel.checkExistingEmail(account_email)
          if(emailExists){
            throw new Error("Email exists. Please login or use different email")
          }
        }
      }),
      
  ]
}

/* ******************************
 * Check data and return errors or continues to update info -- VALIDATE
 * ***************************** */
validate.checkAccData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email, account_id } = req.body

  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/editAccount", {
      errors,
      title: "Edit Account",
      nav,
      account_firstname,
      account_lastname,
      account_email,
      account_id
    })
    return
  }
  next()

}


module.exports = validate