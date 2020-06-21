const pool = require("../../sql/coonPool")
const common = require("./common")
const { response } = require("express")

// 创建房间

module.exports = {
    creatRoom(req, res) {
        console.log("req.body", req.body)

        const length = req.body.length || 6
        const roomNumbers = "000001"
        const now = new Date()
        const sql = "INSERT INTO `undercover_room` (length, roomNumbers, createdAt) VALUES (?,?,?)"
        pool.coonPool(res, sql, [length, roomNumbers, now], (response) => {
            res.json({
                code: 200,
                msg: "success",
                data: { id: response.insertId }
            })
        })
    },
    joinRoom(req, res) {
        const id = req.body.roomId
        const token = req.header("x-token")

        common.tokenToOpenID(res, token).then((result) => {
            const openId = (result[0] && result[0].openId) || ""

            const checkSql = "SELECT userids FROM `undercover_room` WHERE id=?"
            const updateSql = "UPDATE `undercover_room` SET userIds=? WHERE id=?"
            pool.coonPool(res, checkSql, id, (response) => {
                let curUserId = response[0] && response[0].userids
                console.log("check result", response[0].userids)
                // response.userids && response.userids.split(",")
                if (curUserId) {
                    const userIdList = curUserId.split(",")
                    if (userIdList.includes(openId)) {
                        res.json({
                            code: 200,
                            msg: "success",
                            data: {
                                isInRoom: true,
                                mseeage: "你已经在房间里"
                            }
                        })
                    } else {
                        userIdList.push(openId)
                        let newUserids = userIdList.join(",")
                        pool.coonPool(res, updateSql, [newUserids, id], (response) => {
                            res.json({
                                code: 200,
                                msg: "success",
                                data: response
                            })
                        })
                    }
                } else {
                    // join id 只有一个用户
                    console.log("direct join openId", openId)

                    const userids = curUserId
                    pool.coonPool(res, updateSql, [openId, id], (response) => {
                        res.json({
                            code: 200,
                            msg: "success",
                            data: response
                        })
                    })
                }
            })
        })
    },
    outRoom(req, res) {
        const id = req.body.roomId
        const token = req.header("x-token")
        common.tokenToOpenID(res, token).then((result) => {
            const openId = (result[0] && result[0].openId) || ""

            const checkSql = "SELECT userids FROM `undercover_room` WHERE id=?"
            const updateSql = "UPDATE `undercover_room` SET userIds=? WHERE id=?"
            pool.coonPool(res, checkSql, id, (response) => {
                let curUserId = response[0] && response[0].userids
                console.log("check result", response[0].userids)
                // response.userids && response.userids.split(",")
                if (curUserId) {
                    const userIdList = curUserId.split(",")
                    const i = userIdList.indexOf(openId)
                    userIdList.splice(i, 1)
                    // userIdList.push(openId)
                    let newUserids = userIdList.join(",")
                    pool.coonPool(res, updateSql, [newUserids, id], (response) => {
                        res.json({
                            code: 200,
                            msg: "success",
                            data: response
                        })
                    })
                }
            })
        })
    },
    addWord(req, res) {
        const onlyWord = req.body.onlyWord
        const normalWord = req.body.normalWord
        const sql = "INSERT INTO `undercover_word` (onlyWord, normalWord) VALUES (?,?)"
        pool.coonPool(res, sql, [onlyWord, normalWord], (response) => {
            res.json({
                code: 200,
                msg: "success",
                data: response
            })
        })
    },
    getWord(req, res) {
        // const onlyWord = req.body.onlyWord
        // const normalWord = req.body.normalWord
        const sql = "SELECT *  FROM `undercover_word` ORDER BY RAND() LIMIT 1"
        pool.coonPool(res, sql, [], (response) => {
            res.json({
                code: 200,
                msg: "success",
                data: response
            })
        })
    }
}
