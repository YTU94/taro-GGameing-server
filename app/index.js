var express = require('express')
var router = express.Router()
const user = require('./controllers/user')
const keepList = require('./controllers/keepList')
const messages = require('./controllers/messages')
const shell = require('./controllers/shell')
const appleid = require('./controllers/appleidList')
const file = require('./controllers/uploadFile')
const btc = require('./controllers/btc')
const wx = require('./controllers/wx')
// user

/* GET home page. */
router.get('/a', (req, res) => res.send('Hello World! aaa'))
router.post('/api/v1/addUser', user.addUser)

router.get('/api/v1/getMailCode', user.getMailCode)
router.post('/api/v1/regist', user.regist)
router.post('/api/v1/login', user.login)

router.post('/api/v1/addKeepItem', keepList.addKeepItem)
router.get('/api/v1/keepList', keepList.keepList)
router.post('/api/v1/updateStatus', keepList.updateStatus)
router.get('/api/v1/messageList', messages.messageList)
router.post('/api/v1/sendMessage', messages.sendMessage)
router.post('/api/doshell', shell.doshell)
router.get('/api/appleidList', appleid.appleidList)
router.get('/api/otherIdList', appleid.otherIdList)

router.post('/api/v1/uploadImg', file.uploadImg)
router.get('/api/v1/getFilePath', file.getFilePath)

router.get('/api/v1/btcSearch', btc.btcSearch)
router.get('/api/v1/collectList', btc.collectList)
router.post('/api/v1/collectBtc', btc.collectBtc)

router.get('/api/v1/getWxAccessToken', wx.getWxAccessToken)

module.exports = router
