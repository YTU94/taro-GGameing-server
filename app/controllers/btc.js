const pool = require("../../sql/coonPool")
const request = require("request")

module.exports = {
    btcSearch(req, res) {
        const symbol = req.query.symbol
        request.get(`https://api.coincap.io/v2/assets?search=${symbol}`, function(error, response, body) {
            const result = JSON.parse(body)

            res.json({
                code: 0,
                msg: "ok",
                data: result.data
            })
        })
    },
    collectList(req, res) {
        const userId = req.query.userId
        const sql = "SELECT * FROM `btc` WHERE userId=? AND collected=1"
        pool.coonPool(res, sql, userId, response => {
            res.json({
                code: 0,
                msg: "ok",
                data: response
            })
        })
    },
    collectBtc(req, res) {
        const name = req.body.name
        const symbol = req.body.symbol
        const userId = req.body.userId
        const collected = req.body.collected

        const SelectSql = "SELECT * FROM `btc` WHERE `userId` = ? AND `name` = ?"
        const UpdateSql = "UPDATE `btc` SET collected = ? WHERE `userId` = ? AND `name` = ?"
        const InsertSql = "INSERT INTO `btc` (name, symbol, userId, collected) VALUES (?,?,?,?)"
        pool.coonPool(res, SelectSql, [userId, name], response => {
            console.log(response)
            if (response[0]) {
                pool.coonPool(res, UpdateSql, [collected, userId, name], response => {
                    res.json({
                        code: 0,
                        msg: "ok",
                        data: response
                    })
                })
            } else {
                pool.coonPool(res, InsertSql, [name, symbol, userId, collected], response => {
                    res.json({
                        code: 0,
                        msg: "ok",
                        data: response
                    })
                })
            }
        })
    }
}
