const pool = require("../../sql/coonPool")
var request = require("request")
var jwt = require("jsonwebtoken")
const mail = require("../utils/mail")

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
                let _s = jwt.sign({ openId: openId }, "261011")

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
    },
    getMailCode(req, res) {
        const email = req.query.email
        const code = Math.floor(Math.random() * 11000 - 1001)
        mail.main(email, code).then(info => {
            let times = 0
            let messageId = info.messageId
            const insertSql = "INSERT INTO `regists` (email, messageId, code, times) VALUES (?,?,?,?)"
            const checkSql = "SElECT COUNT(*) as COUNT FROM `regists` WHERE email = ?"
            const addSendTimes = "UPDATE regists SET times=times + 1, code = ? WHERE email = ?"
            pool.coonPool(res, checkSql, email, response => {
                if (response[0].COUNT > 0) {
                    pool.coonPool(res, addSendTimes, [code, email], response => {
                        res.json({
                            code: 0,
                            msg: "ok",
                            data: {
                                email: email,
                                messageId: messageId,
                                code: code
                            }
                        })
                    })
                } else {
                    pool.coonPool(res, insertSql, [email, messageId, code, times], response => {
                        res.json({
                            code: 0,
                            msg: "ok",
                            data: {
                                email: email,
                                messageId: messageId,
                                code: code
                            }
                        })
                    })
                }
            })
        })
    },

    regist(req, res) {
        const date = new Date()
        const nickName = req.body.nickName
        const email = req.body.email
        const code = req.body.code
        const password = req.body.password
        const messageId = req.body.messageId
        const insertSql = "INSERT INTO `users` (email, nickName, createAt, password) VALUES (?,?,?,?)"
        const checkSql = "SElECT COUNT(*) as COUNT FROM `users` WHERE email = ?"
        const checkCode = "SELECT * FROM `regists` WHERE email = ? AND code = ?"
        pool.coonPool(res, checkCode, [email, code], response => {
            if (response[0] && response[0].messageId == messageId) {
                pool.coonPool(res, checkSql, email, response => {
                    if (response[0].COUNT > 0) {
                        res.json({
                            code: 1,
                            msg: "邮箱已注册",
                            data: response
                        })
                    } else {
                        pool.coonPool(res, insertSql, [email, nickName, date, password], response => {
                            res.json({
                                code: 0,
                                msg: "ok",
                                data: response
                            })
                        })
                    }
                })
            } else {
                res.json({
                    code: 1,
                    msg: "验证码不正确",
                    data: response
                })
            }
        })
    },
    login(req, res) {
        const email = req.body.account || ""
        const password = req.body.pass || ""
        const sql = "SELECT id, email, nickname, password FROM `users` WHERE email=? "
        pool.coonPool(res, sql, email, response => {
            if (Array.isArray(response) && response.length > 0) {
                if (response[0].password == password) {
                    delete response[0].password
                    res.json({
                        code: 0,
                        msg: "ok",
                        data: response[0]
                    })
                } else {
                    res.json({
                        code: 1,
                        msg: "密码不正确",
                        data: {}
                    })
                }
            } else {
                res.json({
                    code: 2,
                    msg: "账户不存在",
                    data: response
                })
            }
        })
    }
}
