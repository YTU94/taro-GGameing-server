const pool = require("../../sql/coonPool")
const common = require("./common")
var jwt = require("jsonwebtoken")

module.exports = {
    addKeepItem(req, res) {
        const token = req.header("x-token")
        const content = req.body.content || "-"
        const status = req.body.status || 0
        const date = new Date()
        const insertSql = "INSERT INTO `keep_list` (openId, createAt, content, status) VALUES (?,?,?,?)"
        common.tokenToOpenID(res, token).then(result => {
            let openId = result[0] && result[0].openId
            pool.coonPool(res, insertSql, [openId, date, content, status], response => {
                res.json({
                    code: 200,
                    msg: "ok",
                    data: response
                })
            })
        })
    }
}
