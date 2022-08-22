//引入加密文件
let {encryption, verification} = require('../utils/bcrypt');
let {UserSchema,FriendSchema,MessageSchema,GroupSchema,GroupUserSchema,GroupMsgSchema} = require('../model/dbmodel')
//引入token
let {generateToken} = require('../utils/jwt')
const {getTestMessageUrl} = require("nodemailer");
const {Op} = require("sequelize");




//添加好友
async function buildFriend(uid,fid,state,res){

    const result = await FriendSchema.create({
        userID:uid,
        friendID:fid,
        state:state,
        time:new Date(),
        lastTime:new Date(),
    });
    return !!result;
}

//好友最后通讯时间
async function upFriendLastTime (uid,fid){
    let wherestr = {
        'userID':uid,
        'friendID':fid,
    };
    let updatestr = {
        'lastTime':new Date()
    }
    const result = await FriendSchema.update(updatestr,{
        where:wherestr,
    })
    return !!result;

}

//添加一对一消息
async function insertMsg(uid,fid,msg,type,res){
    const result = await MessageSchema.create({
        userID:uid,
        friendID:fid,
        message:msg,
        types:type,
        time:new Date(),
        state:1,
    });
    if (result){
        res.send({
            status:200
        })
    }else{
        res.send({
            status:500
        })
    }
}

//添加一对一消息
async function insertMsg2(uid,fid,msg,type,time,state){
    const result = await MessageSchema.create({
        userID:uid,
        friendID:fid,
        message:msg,
        types:type,
        time:new Date(time),
        state:state,
    });
    if(result){
        let result2 = await FriendSchema.update({
            'lastTime':new Date(time)
        },{
            where:{
                [Op.or]:[
                    {
                        'userID':uid,
                        'friendID':fid,
                    },
                    {
                        'userID':fid,
                        'friendID':uid,
                    }
                ]

            }
        });
    }
    return result
}

//好友申请
async function applyFriend(uid,fid,msg,res){
    let wherestr = {
        'userID':uid,
        'friendID':fid
    };
    const result = await FriendSchema.count({
        where:wherestr
    })
    let res1,res2;
    if(result===0){
        res1 = await buildFriend(uid,fid,2);
        res2 = await buildFriend(fid,uid,1);
    }else{
        res1 = await upFriendLastTime(uid,fid);
        res2 = await upFriendLastTime(fid,uid);
    }
    if (res1 && res2){
        insertMsg(uid,fid,msg,0,res);
    }else{
        res.send("申请失败")
    }

}

//更新好友状态   uid  fid  state
async function updateFriendState(uid,fid,res,state=0){
    let wherestr = {
        [Op.or]:[
            {
                'userID':uid,
                'friendID':fid,
            },
            {
                'userID':fid,
                'friendID':uid,
            }
        ]

    };
    let updatestr = {
        'state':state
    }
    const result = await FriendSchema.update(updatestr,{
        where:wherestr,
    })
    if (result){
        res.send({
            status:200,
        })
    }else{
        res.send({
            status:500,
        })
    }
}


//拒绝或删除好友
async function deleteFriend(uid,fid,res){
    let wherestr = {
        [Op.or]:[
            {
                'userID':uid,
                'friendID':fid,
            },
            {
                'userID':fid,
                'friendID':uid,
            }
        ]

    };
    try {
        const transaction = await sequelize.transaction();
        const deFRIENDlresult = await FriendSchema.destroy({
            where:wherestr,
        })
        const delMSGresult = await MessageSchema.destroy({
            where:wherestr,
        })
        await transaction.commit();
    } catch {
        await transaction.rollback()
    }


    if (deFRIENDlresult && delMSGresult){
        res.send({
            status:200,
        })
    }else{
        res.send({
            status:500,
        })
    }
}



//获得好友消息
async function getMessage(uid,fid,res){
    let wherestr = {
        [Op.or]:[
            {
                'userID':uid,
                'friendID':fid,
            },
            {
                'userID':fid,
                'friendID':uid,
            }
        ]

    };
    const result = await MessageSchema.findAll({
        where:wherestr,
        order:[
            ['time','ASC']
        ]
    })
    if (result){
        res.send({
            status:200,
            res:result
        })
    }else{
        res.send({
            status:500,
        })
    }
}








module.exports.applyFriend = applyFriend;
module.exports.updateFriendState= updateFriendState;
module.exports.deleteFriend = deleteFriend;
module.exports.getMessage = getMessage;
module.exports.insertMsg2 = insertMsg2