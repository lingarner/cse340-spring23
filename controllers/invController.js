const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  let grid = await utilities.buildClassificationGrid(data)

  let nav = await utilities.getNav()
  const className = data[0].classification_name
  console.log(className)
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
};

invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getInventoryByInvId(inv_id)
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
  const classificationTable = await invModel.getClassifications()
  const dropdown = await utilities.classDropdown(classificationTable.rows)

  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    dropdown,
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
invCont.renderNewVehicle = async function(req, res, next){
  let nav = await utilities.getNav()

  const classificationTable = await invModel.getClassifications()
  
  let dropdown = await utilities.classDropdown(classificationTable.rows)
    

  res.render("./inventory/add-vehicle", {
    title: "Add New Vehicle",
    nav,
    dropdown,
    errors: null
  })
}


invCont.registerClass = async function(req, res){
  
  // whatever information in recieved from the req body
  // will be put into this const variable 
  const {classification_name}  = req.body
  
  const regResult = await invModel.registerClass(classification_name)
  
  if (regResult) {
    let nav = await utilities.getNav()
    let successMsg = req.flash(
      "success",
      `Congratulations, ${classification_name} has been added`
    )
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
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

//insert new inventory
invCont.registerNewVehicle = async function(req, res){
  let nav = await utilities.getNav()

  
  const classificationTable = await invModel.getClassifications()
  
  let dropdown = await utilities.classDropdown(classificationTable.rows)
  const {
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  }  = req.body

  console.log(classification_id)

  const regResult = await invModel.registerVehicle(
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  console.log(regResult)

  if (regResult) {
    req.flash(
      "success",
      `Congratulations, you\'ve registered ${inv_make} ${inv_model}!`
    )
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      dropdown,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("/inventory/add-vehicle", {
      title: "Register New Vehicle",
      nav,
      dropdown,
      errors: null,
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

// edit inventory view
invCont.modifyInventory = async function(req, res){
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.params.inv_id) 
  
  const invData = await invModel.getInventoryByInvId(inv_id)

  const classificationTable = await invModel.getClassifications()
  let classificationSelect = await utilities.classDropdown(classificationTable.rows, invData[0].classification_id)

  const itemName = `${invData[0].inv_make} ${invData[0].inv_model}`
  
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: invData[0].inv_id,
    inv_make: invData[0].inv_make,
    inv_model: invData[0].inv_model,
    inv_year: invData[0].inv_year,
    inv_description: invData[0].inv_description,
    inv_image: invData[0].inv_image,
    inv_thumbnail: invData[0].inv_thumbnail,
    inv_price: invData[0].inv_price,
    inv_miles: invData[0].inv_miles,
    inv_color: invData[0].inv_color,
    classification_id: invData.classification_id
  })
}

//update inventory
invCont.updateInventory = async function(req, res){
  let nav = await utilities.getNav()

  const invData = await invModel.getInventoryByInvId(inv_id)

  const classificationTable = await invModel.getClassifications()
  let classificationSelect = await utilities.classDropdown(classificationTable.rows, invData[0].classification_id)

  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
    
  }  = req.body


  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id, 
  )


  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("success", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

// actually delete info and give confirmation
invCont.deleteInventoryCheck = async function(req, res){
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.params.inv_id)

  const invData = await invModel.getInventoryByInvId(inv_id)

  const itemName = `${invData[0].inv_make} ${invData[0].inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: invData[0].inv_id,
    inv_make: invData[0].inv_make,
    inv_model: invData[0].inv_model,
    inv_year: invData[0].inv_year,
    inv_price: invData[0].inv_price,
  })
}

// deliver delete confirmation 
invCont.deleteInventoryForReal = async function(req, res){
  let nav = await utilities.getNav()

  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
    
  }  = req.body


  const dataResult = await invModel.deleteInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id, 
  )

  console.log(dataResult)

  if (dataResult) {
    const itemName = inv_make + " " + inv_model
    req.flash("success", `The ${itemName} was deleted.`)
    res.redirect("/inv/")
  } else {
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the deletion failed.")
    res.status(501).render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

module.exports = invCont