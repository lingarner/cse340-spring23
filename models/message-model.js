 //connecting to the database/index.js
 //because the name 'index.js' is default and therefore automatically selected
 const pool = require("../database/")

/* *****************************
* Return message data coming TO user using account_id
* ***************************** */
async function getMessageData (account_id) {
    try {
      const result = await pool.query(
        'SELECT message_id, message_subject, message_body, message_created, message_to, message_from, message_read, message_archived, account_firstname FROM public.message JOIN public.account ON message_to = account_id WHERE account_id = $1',
        [account_id])
      return result.rows
    } catch (error) {
      return new Error(error)
    }
  }

/* *****************************
* Returns message senders first and last name based on message_from number
* ***************************** */
async function getSenderInfo(message_from) {
  try {
    const result = await pool.query(
      'SELECT account_firstname, account_lastname FROM public.account JOIN public.message ON account.account_id = message.message_from WHERE message.message_from = $1;',
      [message_from])
    return result.rows
  } catch (error) {
    return new Error(error)
  }
}

/* *****************************
* Returns message information using message_id
* ***************************** */
async function getMessageContent(message_id) {
  try {
    const result = await pool.query(
      'SELECT * FROM public.message WHERE message_id = $1;',
      [message_id])
    return result.rows
  } catch (error) {
    return new Error(error)
  }
}


/* *****************************
* Get all Users for the dropdown menu
* ***************************** */
async function getAllFirstnames() {
  try {
    const result = await pool.query('SELECT * FROM public.account ORDER BY account_firstname')
    return result.rows
  } catch (error) {
    return new Error(error)
  }
}


/* *****************************
* Send a new message to the database
* ***************************** */
async function registerMessage( message_subject, message_body, message_from, message_to ){
  try {
    const sql = "INSERT INTO public.message (message_subject, message_body, message_from, message_to)" + 
    "VALUES ($1, $2, $3, $4 ) RETURNING *"
    return await pool.query(sql, [message_subject, message_body, message_from, message_to])
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Send a new message to the database
* ***************************** */
async function updateToRead( message_id ){
  try {
    const sql = "UPDATE public.message SET message_read = true WHERE message_id = $1 RETURNING *"
    return await pool.query(sql, [message_id])
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Deletee message from the database
* ***************************** */
async function deleteMessage( message_id ){
  try {
    const sql = "DELETE FROM public.message WHERE message_id = $1 RETURNING *"
    return await pool.query(sql, [message_id])
  } catch (error) {
    return error.message
  }
}

  module.exports = {getMessageData, getSenderInfo, getAllFirstnames, registerMessage, getMessageContent, updateToRead, deleteMessage}