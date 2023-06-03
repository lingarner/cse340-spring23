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
  
  module.exports = { buildLogin }