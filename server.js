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
const invController = require("./controllers/invController")
const utilities = require("./utilities/")
const session = require("express-session")
const pool = require('./database/')
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")

/* ***********************
 * Middleware
 * ************************/

// creating a session table in our DB 
app.use(session({
  //store = where the session data will be stored
  // creating a new session table in our DB using a package
  store: new(require('connect-pg-simple')(session))({
    createTableIfMissing: true, //create the tabel if it does not exist
    pool,
  }),
  secret: process.env.SESSION_SECRET, //name value pair used to protect the session
  resave: true,
  saveUninitialized: true, //provides the browser with session cookie and saves it in its memory
  name: 'sessionId',
}))

// Express Messages Middleware
  //this is where we add .flash() to the request object used in baseController
app.use(require('connect-flash')())
app.use(function(req, res, next){
  // creates a local variable called messages in the res.locals object to 
  // store flash messages
  res.locals.messages = require('express-messages')(req, res)
  next() //allows messages to be passed to the next process and allows messages to be displayed in the view
})


app.use(bodyParser.json()) //use body parser when working with JSON
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded (info in url or form)
app.use(cookieParser())
app.use(utilities.checkJWTToken) //validate JWT 

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs") //requires js layouts
app.use(expressLayouts) //tells app to usse expresss-ejs-layout-package stored in an expressLayouts variable


app.set("layout", "./layouts/layout") // not at views root
//when express ejs looks for basic template view it will be found in th layouts folder

// Index route- builds nav
app.get("/", utilities.handleErrors(baseController.buildHome))


// Route to delete the cookie
app.get('/clear-cookie', (req, res) => {
  res.clearCookie('jwt');
  res.redirect('/');
});





/* ***********************
* Routes
*************************/
app.use(require("./routes/static"))

// Inventory routes- builds nav links
// any links with /inv will go to inventoryRoute.js to
// find the rest of the link
app.use(
  "/inv", 
  require("./routes/inventoryRoute")
)


//route to direct to accountRoute.js to 
//access login page information
app.use("/account", require("./routes/accountRoute"))

//route to direct to loginRoute.js to
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
  if(err.status == 404){
     message = err.message
    } else {
      message = 'Oh no! There was a crash. Maybe try a different route?'
    }
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
