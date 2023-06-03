// Needed resources
const utilities = require("../utilities/")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    
    //indicated where to render the view
    res.render("account/login", {
      title: "Login",
      nav,
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
  })
}

module.exports = { buildLogin, buildRegistration }