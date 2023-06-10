const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
};

invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getInventoryByInvId(inv_id)
  console.log(data)
  const grid = await utilities.buildInvDetails(data)
  let nav = await utilities.getNav()
  const carMake = data[0].inv_make
  const carYear = data[0].inv_year
  res.render("./inventory/details", {
    title: carYear + ' ' + carMake + " Details",
    nav,
    grid
  })
};

invCont.throwError =  function(req, res, next){
  try{
    throw new Error("500 Error")
  } catch(error){
    next(error)
  }
};

invCont.buildInvNav = async function(req, res, next){
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null
  })
}

module.exports = invCont