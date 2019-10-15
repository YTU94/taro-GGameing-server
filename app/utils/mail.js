const nodemailer = require("nodemailer")

module.exports = {
    main(email, code) {
        return new Promise(async (resolve, reject) => {
            let transporter = nodemailer.createTransport({
                // host: "465",
                service: "qq",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: "453980450@qq.com", // 发送方的邮箱
                    pass: "aoplupybkqlybibi" //   pop3 授权码 **百度如何获取吧**
                }
            })

            let info = await transporter.sendMail({
                from: '"Fred Foo 👻" <453980450@qq.com>', // sender address
                to: email, // list of receivers
                subject: "欢迎注册√", // Subject line
                text: `${code}`, // plain text body
                html: `欢迎注册Ytu,验证码为:${code},有效期为五分钟.` // html body
            })
            if (info) resolve(info)

            console.log("Message sent: %s", info.messageId)
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

            // Preview only available when sending through an Ethereal account
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        })
    }
}
// main().catch(console.error);
