const pool = require("../../sql/coonPool")
const request = require("request")

module.exports = {
    appleidList(req, res) {
        request.get(`https://wxapp.hurbai.com/wxapp1/public/api/portal/articles?order=-id`, function(error, response, body) {
            const result = JSON.parse(body)
            const v = result.data.map(e => {
                return [e.post_title, e.post_apid, e.post_apidpass]
            })
            const clearSql = "TRUNCATE TABLE `appleid_list`"
            const insertSql = "INSERT INTO `appleid_list` (name, account, password) VALUES ? "
            const sql = "SELECT * from `appleid_list`"
            pool.coonPool(res, clearSql, "", response => {
                pool.coonPool(res, insertSql, [v], response => {
                    pool.coonPool(res, sql, "", response => {
                        res.json({
                            code: 200,
                            msg: "ok",
                            data: response
                        })
                    })
                })
            })
        })
    }
}
