const mysql= require('mysql2')
const db= mysql.createPool(
    {
        host:'localhost',
        user:'root',
        password:'',
        database:'gestion_des_notes'
    }
)
module.exports = db