// Needed Resources
const pool = require("../database/");


/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type)" + 
      "VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
      return error.message
    }
  } 

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    console.log(email.rowCount)
    return email.rowCount
  } catch (error) {
    return error.message
  }
}


/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
* Return account data using account_id
* ***************************** */
async function getAccountsByAccountId(account_id) {
  try{
    const data = await pool.query(
      "SELECT * FROM public.account " +
      "WHERE account_id = $1",
      [account_id]
      )
      return data.rows
  } catch (error) {
    console.error("getAccountsByAccountId error " + error)
  }
};


// * **********************
//  *  Update Account Info in Db
//  * ********************* */
async function updateAccountInfo(
  account_firstname,
  account_lastname,
  account_email,
  account_id
) 
{
  try {
    console.log(account_firstname, account_id)
    const sql =
      "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *"
    const data = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

module.exports = {registerAccount, checkExistingEmail, getAccountByEmail, getAccountsByAccountId, updateAccountInfo };