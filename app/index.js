var express = require("express")
var router = express.Router()
const user = require("./controllers/user")
const keepList = require("./controllers/keepList")
// user

/* GET home page. */
router.get("/a", (req, res) => res.send("Hello World! aaa"))
router.post("/api/v1/addUser", user.addUser)
router.post("/api/v1/addKeepItem", keepList.addKeepItem)
router.get("/api/v1/keepList", keepList.keepList)
router.get("/api/v1/updateStatus", keepList.updateStatus)

module.exports = router
