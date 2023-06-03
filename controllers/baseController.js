// BaseController is only responsible for general requests
// no specific requests going to places like inventory or accounts

const utilities = require("../utilities/")
const baseController = {}


//buildHome will act like a method of baseController (if it was a class)
baseController.buildHome = async function(req, res){
    //getNav is a function imported from utilities index.js
    const nav = await utilities.getNav()

    //using ejs to display the flash message 
    //uses a flash package to assigne the message to the req object
    //uses 2 params "type (of message)", "message (must be a string)" 
    req.flash("notice", "This is a flash message.")

    //using ejs to render the new html from nav in the view
    res.render("index", {title: "Home", nav})
}

module.exports = baseController