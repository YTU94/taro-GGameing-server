const { exec } = require("child_process")

module.exports = {
    doshell(req, res) {
        const shell = req.body.shell
        exec(shell, (err, stdout, stderr) => {
            res.json({
                code: 200,
                msg: "ok",
                err: err
            })
        })
    }
}
