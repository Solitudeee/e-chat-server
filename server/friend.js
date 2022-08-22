let {applyFriend,updateFriendState,deleteFriend,getMessage} = require('../dao/dbServerFriend');
const {getUid} = require("../utils/getInfo");


//好友申请
exports.applyFriend = function (req,res){
    let uid = getUid(req.headers.cookie);
    let fid = req.body.fid;
    let msg = req.body.msg;
    applyFriend(uid,fid,msg,res).catch(()=>{
        res.send({
            status:503,
        })
    });
}

//修改好友状态(通过好友申请)
exports.updateFriendState = function (req,res){
    let data = req.body;
    let uid = getUid(req.headers.cookie);
    updateFriendState(uid,data.fid,res,data.state).catch(()=>{
        res.send({
            status:503,
        })
    });
}

//拒绝或删除好友
exports.deleteFriend = function (req,res){
    let data = req.body;
    let uid = getUid(req.headers.cookie);
    deleteFriend(uid,data.fid,res).catch(()=>{
        res.send({
            status:503,
        })
    });
}

//获取历史消息
exports.getMessageByUid = function (req,res){
    let uid = getUid(req.headers.cookie);
    let fid = req.query.fid;
    getMessage(uid,fid,res).catch(()=>{
        res.send({
            status:503,
        })
    });

}