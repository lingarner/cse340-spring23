// PURPOSE: hold functions that are "utility" in nature
//  meaning that we will reuse them over and over
// but they don't directly belong to the M-V-C structure
const jwt = require("jsonwebtoken")
require("dotenv").config()

const invModel = require("../models/inventory-model")
const mesageModel = require("../models/message-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = '<ul class="headLinks" >'
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}



/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the details view HTML
* ************************************ */
Util.buildInvDetails = async function(data){
  let detailsContainer
  detailsContainer = '<div id="gridDetails">'
  detailsContainer += `<img src = ${data[0].inv_image} alt="picture of a ${data[0].inv_model}">
  <div>
    <h2> ${data[0].inv_make}  ${data[0].inv_model} Details </h2>
    <p> Price: $${new Intl.NumberFormat('en-US').format(data[0].inv_price)} </p>
    <p> Description: ${data[0].inv_description} </p> 
    <p> Miles: ${new Intl.NumberFormat('en-US').format(data[0].inv_miles)}</p> 
    <p> Color: ${data[0].inv_color} </p> 
    
  </div>`
  detailsContainer += '</div>'
return detailsContainer
}

Util.classDropdown = async function(data, classification_id){
  let dpContainer = '<select name="classification_id" id="class-dropdown">'
  dpContainer += '<option value="">Select a Classification</option>'
  for (let i = 0; i < data.length; i++) {
    console.log(classification_id)
    dpContainer += `<option value="${data[i].classification_id}"
    ${classification_id === Number(data[i].classification_id)? 'selected': ''}
    > 
    ${data[i].classification_name}</option>`;
  }
  
  dpContainer += `</select>`
  return dpContainer

}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

/* ****************************************
 *  Middleware for checking the account type
 * ************************************ */
Util.checkAccountType = (req, res, next) => {
  const account_type = res.locals.accountData.account_type
  if(account_type === 'Employee' || account_type === 'Admin'){
    next()
  } else {
    req.flash('notice', `You do not have access to this page.`)
    res.redirect("/account/login")
  }
}


/* ****************************************
 *  Build messages recived table
 * ************************************ */
Util.buildMessagesList = async function(data){ 

  // Set up the table labels 
  let dataTable = '<thead>'; 
  dataTable += '<tr><th>Recieved</th><th>Subject</th><th>From</th><th>Read</th></tr>'; 
  dataTable += '</thead>';
  
  // Set up the table body 
  dataTable += '<tbody>'; 
  
  // Iterate over all vehicles in the array and put each in a row 
  for(i = 0; i < data.length; i++) { 
 
    // get the name of the message sender
    let senderId = data[i].message_from;
    let accountData = await mesageModel.getSenderInfo(senderId)

    dataTable += `<tr>
    <td>${data[i].message_created}</td>` +
    `<td><a href="/message/view/${data[i].message_id}">${data[i].message_subject}</a></td>` +
    `<td>${accountData[0].account_firstname} </td>` +
    `<td>${data[i].message_read}</td></tr>`; ; 
  }
  dataTable += '</tbody>'; 
  // Display the contents in the Inventory Management view 
  return dataTable; 
};


/* ****************************************
 *  Build firstname dropdown
 * ************************************ */
Util.buildMessageDrop = async function(data, account_id){
  let dpContainer = '<select name="account_id" id="class-dropdown" required>'
  dpContainer += '<option value="">Select a Recipient</option>'
  for (let i = 0; i < data.length; i++) {
    dpContainer += `<option value="${data[i].account_id}" 
    ${account_id === Number(data[i].account_id)? 'selected': ''}
    > 
    ${data[i].account_firstname} ${data[i].account_lastname}</option>`;
  }
  
  dpContainer += `</select>`
  return dpContainer

}

module.exports = Util