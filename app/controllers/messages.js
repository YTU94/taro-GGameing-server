const pool = require("../../sql/coonPool")
const common = require("./common")

module.exports = {
    messageList(req, res) {
        const page_size = req.params.pageSize || 10
        const page_num = req.params.pageNum || 1
        const offsetStart = (page_num - 1) * page_size
        const offseEnd = page_num * page_size
        const sql = "SELECT id,createAt,message,address from `messages` LIMIT ?,?"
        pool.coonPool(res, sql, [offsetStart, offseEnd], response => {
            res.json({
                code: 200,
                msg: "ok",
                data: response
            })
        })
    },
    sendMessage(req, res) {
        const token = req.header("x-token")
        const message = req.body.message || "-"
        const nickName = req.body.nickName || ""
        const address = req.body.address || ""
        const date = new Date()
        common.tokenToOpenID(res, token).then(result => {
            let openId = (result[0] && result[0].openId) || ""
            const insertSql = "INSERT INTO `messages` ( message, nickName, address, createAt, openId ) VALUES (?,?,?,?,?)"

            pool.coonPool(res, insertSql, [message, nickName, address, date, openId], response => {
                res.json({
                    code: 200,
                    msg: "ok",
                    data: response
                })
            })
        })
    }
}
