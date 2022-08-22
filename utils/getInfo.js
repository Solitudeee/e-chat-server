let {getTokenFromCookies} = require('./cookieSetting')
let {verifyToken,decodedToken} = require('./jwt')

exports.getUid = function (cookie,res){
    if (cookie === undefined){
        res.send({
            status:401
        })
        return null
    }else{
        let token = getTokenFromCookies(cookie);
        return decodedToken(token)['id'];
    }
}

