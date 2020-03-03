const pool = require('../../sql/coonPool')
const request = require('request')
const fs = require('fs')
const puppeteer = require('puppeteer')

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
    },
    async screenShot(req, res) {
        const url = req.query.key
        const browser = await puppeteer.launch({
            headless: true
        })
        const page = await browser.newPage()
        await page.goto('http://robben.souche-inc.com/#/project/%E9%87%91%E8%9E%8D%E5%89%8D%E7%AB%AF/work-order/manual')
        await page.setViewport({
            width: 1200,
            height: 800
        })

        await autoScroll(page)

        await page.screenshot({
            path: '/Users/yuanjiankang/Downloads/1.png',
            fullPage: true
        })

        await browser.close()
    }
}

function autoScroll(page) {
    return page.evaluate(() => {
        return new Promise((resolve, reject) => {
            var totalHeight = 0
            var distance = 100
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight
                window.scrollBy(0, distance)
                totalHeight += distance
                if (totalHeight >= scrollHeight) {
                    clearInterval(timer)
                    resolve()
                }
            }, 100)
        })
    })
}
