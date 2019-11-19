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
    }
}
