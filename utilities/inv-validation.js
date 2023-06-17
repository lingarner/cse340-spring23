const utilities = require(".")
const invModel = require("../models/inventory-model")

// body tool allows the validator to access the body object (access data)
// validationResult is an object that contains all errors detected by the validation process (retrieve errors)
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Registration Data Validation Rules -- SANATIZE
 * ********************************* */
validate.ClassRules = () => {
    return [
      // firstname is required and must be string
      body("classification_name")
        .trim() //removes whitespace on either side of incoming string
        .isLength({ min: 1 })
        .isAlpha()
        .custom(async (classification_name) => {
            const classOld = await invModel.checkExistingClass(classification_name)
            console.log(classOld)
            if (classOld){
              throw new Error("Class exists. Please enter a different class name")
            }
          }),
    ]}

/* ******************************
 * Check data and return errors or continue to registration -- VALIDATE
 * ***************************** */
validate.checkClassData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add New Classification",
            nav,
            classification_name
            
        })
        return
    }
    next()

}

/* ******************************
 * Check New Vehicle Data -- VALIDATE
 * ***************************** */

validate.newInvRules = () => {
  return [
        
    body("inv_make")
    .trim() //removes whitespace on either side of incoming string
    .isLength({ min: 3 })
    .withMessage("Please provide a valid Make name."), // on error this message is sent.

    body("inv_model")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a valid Model name."), // on error this message is sent.

    body("inv_description")
      .trim()
      .isLength({min:3})
      .withMessage("A valid description is required."),

    body("inv_price")
      .isNumeric()
      .withMessage("Please provide a valid price"),
    
    body("inv_year")
      .trim()
      .matches(/^\d{4}$/)
      .withMessage('Please enter a valid year'),
      
    body("inv_miles")
      .trim()
      .matches(/[0-9]+/)
      .withMessage('Please enter a valid mileage.'),
      

    body("inv_color")
      .trim()
      .matches(/[A-Za-z]{3,}/)
      .withMessage('Please enter a valid color.')
  ]
}

/* ******************************
 * Check New Vehicle Data -- VALIDATE
 * ***************************** */
validate.checkNewInv = async (req, res, next) => {
  const { 
    inv_make,
    inv_model,
    inv_description,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
  } = req.body

  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      const classificationTable = await invModel.getClassifications()
      let dropdown = await utilities.classDropdown(classificationTable.rows)
      res.render("inventory/add-vehicle", {
          errors,
          title: "Add New Vehicles",
          dropdown,
          nav,
          inv_make,
          inv_model,
          inv_description,
          inv_price,
          inv_year,
          inv_miles,
          inv_color 
      })
      return
  }
  next()

}


/* ******************************
 * Check updated Vehicle Data -- VALIDATE
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { 
    inv_make,
    inv_model,
    inv_description,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
  } = req.body

  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      const classificationTable = await invModel.getClassifications()
      let dropdown = await utilities.classDropdown(classificationTable.rows)

      const itemName = `${classificationTable[0].inv_make} ${classificationTable[0].inv_model}`
      res.render("inventory/edit-inventory", {
          errors,
          title: "Edit" + itemName,
          dropdown,
          nav,
          inv_make,
          inv_model,
          inv_description,
          inv_price,
          inv_year,
          inv_miles,
          inv_color,
          inv_id 
      })
      return
  }
  next()

}

module.exports = validate
