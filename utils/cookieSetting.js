let Cookies = require('js-cookie')
let {generateToken} = require('./jwt')

const TokenName = 'tokenName'

exports.getToken = function getToken() {
    return Cookies.get(TokenName)
}

exports.setToken =  function setToken(id,url) {
    let token = generateToken(id,url)
    return Cookies.set(TokenName, token, {
        expires: 7,
        path: '/',
        secure: true,
    })
}

exports.remove = function removeToken() {
    return Cookies.remove(TokenName)
}

exports.getTokenFromCookies = function (cookieStr){
    let token = {}
    cookieStr.split(';').forEach(item => {
        if (!item) {
            return;
        }
        const arr = item.split('=');
        const key = arr[0].trim();
        token[key] = arr[1].trim();
    })
    return token['token'];
}


