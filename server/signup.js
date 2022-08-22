let {addUser, countUserValue,getUserByEmail} = require('../dao/dbServer');


//邮箱是否占用判断
exports.judgeEmail = (req,res) => {
    let email = req.body.email;
    getUserByEmail(email,res).catch(()=>{
        res.send({
            status:503,
        })
    });
}


//用户注册
exports.signUp = (req,res)=>{
    let name = req.body.name;
    let email = req.body.email;
    let psw = req.body.psw;
    addUser(name,email,psw,res).catch(()=>{
        res.send({
            status:503,
        })
    });
}


//邮箱是否占用判断
exports.judgeValue = (req,res)=>{
    let data = req.body.data;
    let type = req.body.type;
    countUserValue(data,type,res).catch(()=>{
        res.send({
            status:503,
        })
    });
}
