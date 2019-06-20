const pool = require('../../sql/coonPool')
var request = require('request');


module.exports = {

    addUser(req, res) {
        const code = req.body.code
        request.get(`https://api.weixin.qq.com/sns/jscode2session?appid=wxfb1a8fd1a3a773c8&secret=fa532b4d1817c0050b9bbe48195a3257&js_code=${code}&grant_type=authorization_code`, function (error, response, body) {
            const date = new Date()
            const openId = JSON.parse(body).openid
            const insertSql = 'INSERT INTO `uer_list` (openId, loginAt) VALUES (?,?)'
            const checkSql = 'SELECT COUNT(*) as COUNT FROM `uer_list` WHERE openId = ?'
            pool.coonPool(checkSql, openId, (response) => {
                if (response[0].COUNT > 0) {
                    res.json({
                        code: 200,
                        msg: 'ok',
                        data: response
                    })
                } else {
                    pool.coonPool(insertSql, [openId, date], (response) => {
                        res.json({
                            code: 200,
                            msg: 'ok',
                            data: response
                        })
                    })
                }
            })

        })
    }
}