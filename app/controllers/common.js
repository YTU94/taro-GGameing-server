var request = require("request")
const pool = require("../../sql/coonPool")

module.exports = {
    codeToOpenId(code) {
        return new Promise((resolve, reject) => {
            request.get(
                `https://api.weixin.qq.com/sns/jscode2session?appid=wxfb1a8fd1a3a773c8&secret=fa532b4d1817c0050b9bbe48195a3257&js_code=${code}&grant_type=authorization_code`,
                function(error, response, body) {
                    console.log(body)
                    const res = JSON.parse(body)
                    resolve(res)
                }
            )
        })
    },
    tokenToOpenID(res, t) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM `uer_list` WHERE token = ?"
            pool.coonPool(res, sql, t, response => {
                resolve(response)
            })
        })
    },
    getAccessToken() {
        return new Promise((resolve, reject) => {
            request.get(
                `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxfb1a8fd1a3a773c8&secret=fa532b4d1817c0050b9bbe48195a3257`,
                (error, response, body) => {
                    console.log(body)
                }
            )
        })
    }
}
