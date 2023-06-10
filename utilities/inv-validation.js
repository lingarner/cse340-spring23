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


module.exports = validate
