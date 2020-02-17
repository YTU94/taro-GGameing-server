const pool = require('../../sql/coonPool')
const request = require('request')

const CONFIG = {
    aw: {
        appid: 'wx451421ebed2dfdbf',
        appsecret: '69cac4ecc4b30df4e1d96a0174cf50c0'
    }
}

module.exports = {
    getWxAccessToken(req, res) {
        const key = req.query.key
        const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${CONFIG[key].appid}&secret=${CONFIG[key].appsecret}`

        request.get(url, function(error, response, body) {
            const result = JSON.parse(body)

            res.json({
                code: 0,
                msg: 'ok',
                data: result
            })
        })
    }
}
