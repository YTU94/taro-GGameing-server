const pool = require("../../sql/coonPool")
var request = require("request")
var jwt = require("jsonwebtoken")

module.exports = {
    addUser(req, res) {
        const code = req.body.code
        request.get(
            `https://api.weixin.qq.com/sns/jscode2session?appid=wxfb1a8fd1a3a773c8&secret=fa532b4d1817c0050b9bbe48195a3257&js_code=${code}&grant_type=authorization_code`,
            function(error, response, body) {
                const date = new Date()
                const openId = JSON.parse(body).openid
                const insertSql = "INSERT INTO `uer_list` (openId, loginAt, token) VALUES (?,?,?)"
                const checkSql = "SELECT COUNT(*) as COUNT FROM `uer_list` WHERE openId = ?"
                const addOpenTimes = "UPDATE uer_list SET openTimes=openTimes + 1, token = ? WHERE openId = ?"
                let _s = jwt.sign({openId: openId}, "261011")

                if (!openId) {
                    res.json({
                        code: 500,
                        msg: "ok",
                        data: body
                    })
                    return
                }
                pool.coonPool(res, checkSql, openId, response => {
                    if (response[0].COUNT > 0) {
                        console.log("addOpenTimes")
                        pool.coonPool(res, addOpenTimes, [_s, openId], response => {
                            res.json({
                                code: 200,
                                msg: "ok",
                                token: _s,
                                data: response
                            })
                        })
                    } else {
                        pool.coonPool(res, insertSql, [openId, date, _s], response => {
                            console.log("insert")
                            res.json({
                                code: 200,
                                msg: "ok",
                                token: _s,
                                data: response
                            })
                        })
                    }
                })
            }
        )
    }
}
