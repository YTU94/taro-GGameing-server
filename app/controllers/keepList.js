const pool = require("../../sql/coonPool")
const common = require("./common")
var jwt = require("jsonwebtoken")

module.exports = {
    addKeepItem(req, res) {
        const token = "9"
        const content = req.body.content || "-"
        const status = req.body.status || 0
        const date = new Date()
        const insertSql = "INSERT INTO `keep_list` (openId, createAt, content, status) VALUES (?,?,?,?)"
        common.tokenToOpenID(res, token).then(result => {
            let openId = result[0] && result[0].openId
            pool.coonPool(res, insertSql, [openId || "1", date, content, status], response => {
                res.json({
                    code: 200,
                    msg: "ok",
                    data: response
                })
            })
        })
    }
}
