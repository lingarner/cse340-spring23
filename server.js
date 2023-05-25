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


/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs") //requires js layouts
app.use(expressLayouts) //tells app to usse expresss-ejs-layout-package stored in an expressLayouts variable


app.set("layout", "./layouts/layout") // not at views root
//when express ejs looks for basic template view it will be found in th layouts folder

// Index route
app.get("/", baseController.buildHome)


/* ***********************
 * Routes
 *************************/
app.use(require("./routes/static"))

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
