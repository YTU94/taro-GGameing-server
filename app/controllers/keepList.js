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
    },
    keepList(req, res) {
        const token = req.header("x-token")
        const status = req.query.status || 0
        const sql = "SELECT id,createAt,content,status from `keep_list` WHERE openId = ? AND status = ?"

        common.tokenToOpenID(res, token).then(result => {
            let openId = result[0] && result[0].openId
            pool.coonPool(res, sql, [openId, status], response => {
                res.json({
                    code: 200,
                    msg: "ok",
                    data: response
                })
            })
        })
    },
    updateStatus(req, res) {
        const id = req.body.id
        const status = req.body.status
        const sql = "UPDATE `keep_list` SET status = ? WHERE id = ?"
        pool.coonPool(res, sql, [status, id], response => {
            res.json({
                code: 200,
                msg: "ok",
                data: response
            })
        })
    }
}
