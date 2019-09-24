const pool = require("../../sql/coonPool")
const path = require("path")
const fs = require("fs")
const Busboy = require("busboy")

module.exports = {
    uploadImg(req, res) {
        //通过请求头信息创建busboy对象
        let a = ""
        let busboy = new Busboy({ headers: req.headers })

        //将流链接到busboy对象
        req.pipe(busboy)

        //监听file事件获取文件(字段名，文件，文件名，传输编码，mime类型)
        busboy.on("file", function(filedname, file, filename, encoding, mimetype) {
            //创建一个可写流
            let writeStream = fs.createWriteStream("/www/wwwroot/assets.ytuj.cn/img/" + filename)
            a = "http://assets.ytuj.cn/img/" + filename
            //监听data事件，接收传过来的文件，如果文件过大，此事件将会执行多次，此方法必须写在file方法里
            file.on("data", function(data) {
                writeStream.write(data)
            })

            //监听end事件，文件数据接收完毕，关闭这个可写流
            file.on("end", function(data) {
                writeStream.end()
            })
        })

        //监听finish完成事件,完成后重定向到百度首页
        busboy.on("finish", function() {
            res.json({
                code: 200,
                msg: "success",
                data: {
                    url: a
                }
            })
            res.end()
        })
    }
}
