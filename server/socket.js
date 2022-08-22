const {getUid} = require("../utils/getInfo");
const {insertMsg2} = require('../dao/dbServerFriend')
module.exports = function (io){
    let users = {};    //socket注册用户
    io.on('connection', (socket) => {
        let uid = getUid(socket.handshake.headers.cookie);
        console.log('一个用户已连接！',uid,users);

        //用户登录
        socket.on('login',(message)=>{
            console.log(socket.id,"登录");
            socket.name = uid;
            users[uid]=socket.id;
            socket.emit("login",socket.id)
        });

        //用户发送信息
        socket.on('msg',(message)=>{
            // friendID,message,time,types,state
            let res = insertMsg2(uid,message.friendID,message.message,message.types,message.time,message.state)
            console.log(res)

            socket.to(users[message.friendID]).emit("msg",uid,message.message,message.types,message.time)
        });

        // 用户离开
        socket.on('disconnecting',()=>{
            if(users.hasOwnProperty(socket.name)){
                delete users[socket.name];
                console.log(socket.id,"离开");
            }

        });
    });
}