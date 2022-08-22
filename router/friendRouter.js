const {applyFriend,updateFriendState,deleteFriend,getMessageByUid} = require('../server/friend')

module.exports = (app)=>{
    //好友申请
    app.post('/friend/applyfriend',(req,res)=>{
        applyFriend(req,res)
    })

    //通过好友申请：修改好友状态
    app.post('/friend/updatefriendstate',(req,res)=>{
        updateFriendState(req,res);
    })
    //拒绝或删除好友
    app.post('/friend/deletefriend',(req,res)=>{
        deleteFriend(req,res)
    })

    //获取历史信息
    app.get('/friend/getMessageByUid',(req,res)=>{
        getMessageByUid(req,res);
    })

}

