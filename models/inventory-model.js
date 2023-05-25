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

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.inventory AS i " + 
      "JOIN public.classification AS c " +
      "ON i.classification_id = c.classification_id " +
      "WHERE i.classification_id = $1",
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

//allows the function to be used elsewhere in the code
module.exports = {getClassifications, getInventoryByClassificationId};




