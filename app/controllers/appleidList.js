const pool = require("../../sql/coonPool")
const request = require("request")

function getType(key) {
    switch (key) {
        case "baiduwangpan":
            return 1
        case "xunlei":
            return 2
        default:
            return 0
    }
}
module.exports = {
    appleidList(req, res) {
        request.get(`https://wxapp.hurbai.com/wxapp1/public/api/portal/articles?order=-id`, function(error, response, body) {
            const result = JSON.parse(body)
            const v = result.data.map(e => {
                return [e.post_title, e.post_apid, e.post_apidpass, e.post_excerpt, 0]
            })
            const clearSql = "DELETE from `appleid_list` WHERE type = 0"
            const insertSql = "INSERT INTO `appleid_list` (name, account, password, remark, type) VALUES ? "
            const sql = "SELECT * from `appleid_list` WHERE type = 0"
            pool.coonPool(res, clearSql, "", response => {
                pool.coonPool(res, insertSql, [v], response => {
                    pool.coonPool(res, sql, "", response => {
                        res.json({
                            code: 0,
                            msg: "ok",
                            data: response
                        })
                    })
                })
            })
        })
    },
    otherIdList(req, res) {
        request.get(`https://api.dgsldz.com/ymvip/get_account_list.php?token=WF@eCFwqn0$o7Pr!`, function(error, response, body) {
            const result = JSON.parse(body)
            let v = []

            for (const key in result) {
                const e = result[key]
                const type = getType(key)
                if (type > 0) {
                    const item = [e.title, e.account, e.password, e.live_time, type]
                    v.push(item)
                }
            }

            const clearSql = "DELETE from `appleid_list` WHERE type != 0"
            const insertSql = "INSERT INTO `appleid_list` (name, account, password, remark, type) VALUES ? "
            const sql = "SELECT * from `appleid_list` WHERE type > 0"
            pool.coonPool(res, clearSql, "", response => {
                pool.coonPool(res, insertSql, [v], response => {
                    pool.coonPool(res, sql, "", response => {
                        res.json({
                            code: 0,
                            msg: "ok",
                            data: response
                        })
                    })
                })
            })
        })
    }
}
