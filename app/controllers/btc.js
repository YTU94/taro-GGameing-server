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
        const sql = "SELECT * FROM `btc` WHERE userId=?"
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
        const InsertSql = "INSERT INTO `btc` (name, symbol, userId) VALUES (?,?,?)"
        pool.coonPool(res, InsertSql, [name, symbol, userId], response => {
            res.json({
                code: 0,
                msg: "ok",
                data: response
            })
        })
    }
}
