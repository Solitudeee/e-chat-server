let {userMatch} = require('../dao/dbServer');
let jwt = require('../utils/jwt')


//用户登录
exports.signIn = (req,res)=>{
    let account = req.body.account;
    let psw = req.body.psw;
    userMatch(account,psw,res)
}

//token测试
exports.test = async (req,res)=>{
    console.log("token测试", req.body.token)
    let token = req.body.token;
    console.log(token)
    let jg = jwt.verifyToken(token);
    console.log("哈哈哈"+jg)
    res.send(""+jg)
}

