 //connecting to the database/index.js
 //because the name 'index.js' is default and therefore automatically selected
const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
    //the getClassification() function uses a pool connection to send this query to the database 
    //as well as recieve information from the database
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}


//allows the function to be used elsewhere in the code
module.exports = {getClassifications}