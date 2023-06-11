// PURPOSE: hold functions that are "utility" in nature
//  meaning that we will reuse them over and over
// but they don't directly belong to the M-V-C structure


const invModel = require("../models/inventory-model")
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

Util.classDropdown = async function(data){
  let dpContainer = '<select name="classification_id" id="class-dropdown">'
  // let ejsLocal = '<%= locals.classification_name %>'
  for (let i = 0; i < data.length; i++) {
    dpContainer += `<option value="${data[i].classification_id}">${data[i].classification_name}</option>`;
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

module.exports = Util