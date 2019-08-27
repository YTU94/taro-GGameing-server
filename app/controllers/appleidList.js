const pool = require("../../sql/coonPool")
const common = require("./common")

module.exports = {
    appleidList(req, res) {
        const sql = "SELECT * from `appleid_list` order by id desc"
        pool.coonPool(res, sql, response => {
            res.json({
                code: 200,
                msg: "ok",
                data: response
            })
        })
    }
}
