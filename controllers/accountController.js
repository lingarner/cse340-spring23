// Needed resources
const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const cookie = require("cookie-parser")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    
    //indicated where to render the view
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  }

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegistration(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  console.log('inital register')
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "success",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
*  Processed Login
* *************************************** */
async function registerLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body

  const regResult = await accountModel.registerAccount(
    account_email,
    account_password
  )

  if (regResult) {
    req.flash(
      "success",
      `Congratulations, ${account_email} you\'re logged in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the login failed.")
    res.status(501).render("account/register", {
      title: "Login",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)

  // check if the old and new password match 
   if (!accountData || !bcrypt.compareSync(account_password, accountData.account_password)) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
   res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }

async function buildBaseLogin(req, res, next){
  let nav = await utilities.getNav()

  const account_type = res.locals.accountData.account_type

  const firstname = res.locals.accountData.account_firstname
    
  if(account_type === 'Employee' || account_type === 'Admin'){
    res.render("account/elevated", {
      title: "Account Management",
      nav,
      errors: null,
      firstname
    })
  } else {
    res.render("account/base", {
      title: "Account Management",
      nav,
      errors: null,
      firstname
    })
  }
}

// Renders the view for user to update account information
async function renderUpdateAccount(req, res){
  let nav = await utilities.getNav()

  const account_id = parseInt(req.params.account_id) 
  const accountData = await accountModel.getAccountsByAccountId(account_id);

  res.render("account/editAccount", {
    title: "Edit Account",
    nav,
    account_firstname: accountData[0].account_firstname,
    account_lastname: accountData[0].account_lastname,
    account_email: accountData[0].account_email,
    account_id: accountData[0].account_id,
    errors: null,
  })
}

// Renders the view for user to update account information
async function updateAccount(req, res){
  let nav = await utilities.getNav()
 
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_id
  }  = req.body


  const dataResult = await accountModel.updateAccountInfo(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  )

  if (dataResult) {
    req.flash("success", `${account_firstname}'s Account was updated.`)
    res.redirect("/account")
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/editAccount", {
    title: "Edit Account ",
    nav,
    errors: null,
    account_firstname,
    account_lastname,
    account_email,
    account_id
    })
  }
}

// update password
async function updatePassword(req, res){
  let nav = await utilities.getNav()
  const {account_password, account_id } = req.body

  let accountData = await accountModel.getAccountsByAccountId(account_id)

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the new password.')
    res.status(500).render("account/editAccount", {
      title: "Edit Account",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.updatePassword(
    hashedPassword,
    account_id
  )

  if (regResult) {
    req.flash(
      "success",
      `Password Updated`
    )
    res.redirect("/account")
  } else {
    req.flash("notice", "Sorry, the password update failed.")
    res.status(501).render("account/editAccount", {
      title: "Edit Account",
      nav,
      errors: null,
      account_firstname: accountData[0].account_firstname,
      account_lastname: accountData[0].account_lastname,
      account_email: accountData[0].account_email
    })
  }
}

module.exports = { buildLogin, buildRegistration, registerAccount, registerLogin, accountLogin, buildBaseLogin, renderUpdateAccount, updateAccount, updatePassword }