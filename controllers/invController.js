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
};

// rendering the add new classification form
invCont.buildNewClassification = async function(req, res, next){
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null
  })
}

// add a new vehicle
invCont.addNewVehicle = async function(req, res, next){
  let nav = await utilities.getNav()
  res.render("./inventory/add-vehicle", {
    title: "Add New Vehicle",
    nav,
    errors: null
  })
}


invCont.registerClass = async function(req, res){
  
  // whatever information in recieved from the req body
  // will be put into this const variable 
  const {classification_name}  = req.body
  // console.log(classification_name)
  
  const regResult = await invModel.registerClass(classification_name)

  
  if (regResult) {
    let nav = await utilities.getNav()
    let successMsg = req.flash(
      "success",
      `Congratulations, ${classification_name} has been added`
    )
    res.status(201).render("inventory/management", {
      title: "Login",
      successMsg,
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the add progess failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add New Classificatioin",
      nav,
      errors,
    })
  }
  
}

module.exports = invCont