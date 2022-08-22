//引用发送邮件插件

const nodemailer = require("nodemailer");
//引入证书文件
let credentails = require('../config/credentials')
//创建传输方式
let transporter = nodemailer.createTransport({
    service:'qq',
    auth: {
        user: credentails.qq.user, // generated ethereal user
        pass: credentails.qq.pass, // generated ethereal password
    },
});


//注册发送邮件给邮箱
exports.emailSigUp = function (email,res){
    //发送信息内容
    let options = {
        from:'2604338508@qq.com',
        to:email,
        subject:'您的好友于秋月问候您啦！您吃了吗~ 感谢您注册我的垃圾程序，给您一个验证码：123',
        html:'<span>于秋月发来的问候!</span><a href="http://localhost:8080/">点击</a>'
    };
    //发送邮件
    transporter.sendMail(options,(err,msg)=>{
        //验证码
        let code = "520"
        if(err){
            res.send(err)
            console.log(err);
        }else{
            res.send(code)
            console.log("邮箱发送成功！");
        }
    })
}