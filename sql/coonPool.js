const mysql = require('mysql') 
const db = require('../config/db')
const pool = mysql.createPool(db)

module.exports = {
    coonPool(sql, val, cb) {
        pool.getConnection((err, connection) => {
            if (err) throw err
            connection.query(sql, val, (error, response) => {
                cb(response)
                connection.release();
                if (error) console.log(error);
            })
        })
    }
}