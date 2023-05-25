/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const baseController = require("./controllers/baseController")
const utilities = require("./utilities/")


/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs") //requires js layouts
app.use(expressLayouts) //tells app to usse expresss-ejs-layout-package stored in an expressLayouts variable


app.set("layout", "./layouts/layout") // not at views root
//when express ejs looks for basic template view it will be found in th layouts folder

// Index route- builds nav
app.get("/", utilities.handleErrors(baseController.buildHome))


/* ***********************
 * Routes
 *************************/
app.use(require("./routes/static"))

// Inventory routes- builds nav links
// any links with /inv will go to inventoryRoute.js to
// find the rest of the link
app.use("/inv", require("./routes/inventoryRoute"))

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})


/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/

app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

/* ***********************
 * Local Server Informationw
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
