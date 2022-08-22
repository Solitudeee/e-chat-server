//token
//引入token
let jwt = require("jsonwebtoken");
let secret = 'yikeshiguang';  //配置一个密钥

//生成token
exports.generateToken = (id)=>{
    let payload = {
        id:id,
        time: new Date()
    };
    let token = jwt.sign(payload,secret,{expiresIn:60*60*24*120});

    return token;
}


//解码token
exports.verifyToken = (e)=>{
    let payload;
    jwt.verify(e,secret,(err,result)=>{
        if(err){
            payload = 0;
        }else{
            payload = 1;
        }
    });

    return payload;
}

//解析token
exports.decodedToken = (token)=>{
// get the decoded payload and header
    let decoded = jwt.decode(token, {complete: true});
    // console.log("decoded:",decoded.header);
    // console.log("decoded:",decoded.payload);
    return decoded.payload

}

