const mysql = require("mysql")
const db = require("../config/db")
const pool = mysql.createPool(db)

module.exports = {
    coonPool(res, sql, val, cb) {
        pool.getConnection((err, connection) => {
            if (err) throw err
            connection.query(sql, val, (error, response) => {
                if (error) {
                    res.json({
                        code: 500,
                        msg: "error",
                        data: error
                    })
                } else {
                    cb(response)
                }
                connection.release()
            })
        })
    }
}
