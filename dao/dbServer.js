//引入加密文件
let {encryption, verification} = require('../utils/bcrypt');
let {UserSchema,FriendSchema,MessageSchema,GroupSchema,GroupUserSchema,GroupMsgSchema} = require('../model/dbmodel')
//引入token
let {generateToken} = require('../utils/jwt')
const {getTestMessageUrl} = require("nodemailer");
const {Op} = require("sequelize");


//创建用户
async function addUser(name,mail,psw,res){
    let password = encryption(psw);
    const user = await UserSchema.create({
        name:name,
        email:mail,
        psw:password,
        time:new Date()
    }).then(result=>{
        if(result){
            //成功返回true
            res.status(200).send(true);
        }else{
            //失败返回false
            res.status(500).send(false);
        }
    });
}

//匹配用户表示元素个数
async function countUserValue(data,type,res){
    await UserSchema.count({
        where:data,
    }).then((result,err)=>{
        if(err){
            // res.status(500).send("失败！");
            res.send("失败！",500);
        }else{
            // res.status(200).send("成功！");
            res.send("成功！"+result,200);
        }
    })
}


//用户登录验证
async function userMatch(account,psw,res){
    const data = {
        'email':account
    };
    await UserSchema.findOne({
        attributes:['id','name','psw','imgurl'],
        where:data,
    }).then((result,err)=>{
        if(result){
            const psdMatch = verification(psw,result.psw)
            if(psdMatch){
                //携带token
                let token = generateToken(result.id)
                res.cookie("token",token,{
                    maxAge:24*60*60*7*1000,
                    httpOnly:true,
                })
                res.send({
                    data:{
                      imgurl: result.imgurl
                    },
                    status:200, //登录成功！
                });
            }else{
                //密码输入错误
                res.send({
                    status:201,  //密码错误！
                });
            }
        }else{
            res.send({
                status:202, //用户不存在
            });
        }
    })

}

//根据邮箱匹配用户
async function getUserByEmail(email,res){
    const data = {
        'email':email
    };
    result = await UserSchema.findOne({
        attributes:['id','name','psw','imgurl'],
        where:data,
    });
    if(result){
        res.status(500).send(false)
    }else{
        res.status(200).send(true)
    }

}

//搜索用户
async function searchUser(data,uid,res){
    console.log("数据：",data);
    let wherestr;
    if(data === 'yike'){
        wherestr = {};
    }else{
        wherestr = {
            [Op.or]:[
                {'name':{[Op.substring]:data}},
                {'email':{[Op.substring]:data}}
            ]
        }
    }
    let result = await UserSchema.findAll({
        attributes:['id','name','email','imgurl','birth','explain','sex'],
        where:wherestr,
    });
    let returnValue=[]
    if(result){
        for(let i=0;i<result.length;i++){
            let fid = result[i].id;
            let state = await FriendSchema.findOne({
                attributes:['id','state','time','markname','lastTime'],
                where:{
                    'userID':uid,
                    'friendID':fid,
                }
            });
            if(state){
                result[i].dataValues.isFriend=state.state;
                result[i].dataValues.time=state.time;
                result[i].dataValues.markname=state.markname;
                result[i].dataValues.lastTime=state.lastTime;

            }else{
                result[i].dataValues.isFriend=3;   //3为非好友
            }
        }

        res.send({
            status:200,
            data:result
        })
    }else{
        res.send({
            status:500
        })
    }

}

//判断是否是好友
async function isFriend(uid,fid,res){
    let wherestr = {
        'userID':uid,
        'friendID':fid,
        'state':0
    }
    result = await FriendSchema.findOne({
        attributes:['id'],
        where:wherestr
    });
    if(result){
        //是好友
        res.send({
            status:200,
        })
    }else{
        //不是好友
        res.send({
            status:400
        })
    }
}

//搜索群
async function searchGroup(data,res){
    let wherestr
    if(data === 'yike'){
        wherestr = {};
    }else{
        wherestr = {
            'name':{[Op.substring]:data}
        }
    }
    result = await GroupSchema.findAll({
        attributes:['id','name','imgurl'],
        where:wherestr,
    });
    if(result){
        res.send({
            //搜索到群
            status:200,
            data:result
        })
    }else{
        //没有搜到这样的群
        res.send({
            status:500
        })
    }
}

//判断是否在群内
async function isInGroup(uid,gid,res){
    let wherestr = {
        'groupID':gid,
        'userID':uid,
    }
    result = await GroupUserSchema.findOne({
        attributes:['id'],
        where:wherestr
    });
    if(result){
        //在群里
        res.send({
            status:200,
        })
    }else{
        //不在群里
        res.send({
            status:400
        })
    }
}

//根据id匹配用户
async function getUserByID(uid,res){
    const data = {
        'id':uid
    };
    result = await UserSchema.findOne({
        attributes:['name','imgurl','email','sex','birth','phone','explain','time'],
        where:data,
    });
    if(result){
        res.send({
            status:200,
            result:result
        })
    }else{
        res.send({
            status:500,
        })
    }

}


//修改用户信息  uid,sex,name,birth,explain,res
async function updateUserByID(uid,sex,name,phone,birth,explain,res){

    let updateStr = {
        'sex':sex,
        'name':name,
        'phone':phone,
        'birth':birth,
        'explain':explain,
    };
    let whereStr ={
        'id':uid
    }
    let result = await UserSchema.update(updateStr,{
        where:whereStr,
    });
    if(result){
        res.send({
            status:200,
        })
    }else{
        res.send({
            status:500,
        })
    }

}

//修改用户密码
async function updateUserPSWByID(uid,psw,res){
    let updateStr = {
        'psw':encryption(psw),
    };
    let whereStr ={
        'id':uid
    }
    let result = await UserSchema.update(updateStr,{
        where:whereStr,
    });
    if(result){
        res.send({
            status:200,
        })
    }else{
        res.send({
            status:500,
        })
    }

}


//修改用户头像
async function updateUserImgURLByID(uid,url,res){
    let updateStr = {
        'imgurl':url,
    };
    let whereStr ={
        'id':uid
    }
    let result = await UserSchema.update(updateStr,{
        where:whereStr,
    });
    if(result){
        res.send({
            status:200,
            url:url,
        })
    }else{
        res.send({
            status:500,
        })
    }

}

//获取最新消息
async function searchNews(uid,res){
    //先获取好友
    let whereStr ={
        'userID':uid,
        'state':0
    }
    let newsList = []
    // 查询所有好友
    let result = await FriendSchema.findAll({
        where:whereStr,
        include:[
            {model:UserSchema,
                where:UserSchema.id===FriendSchema.userID
            }
        ],
        order:[
            ['lastTime','DESC']
        ]
    });
    if(result){
        // 对每个好友找最新的消息
        for(let i=0;i<result.length;i++){
            let result2 = await MessageSchema.findAll({
                attributes:['userID','friendID','message','types','time','state'],
                where:{
                    [Op.or]:[
                        {'userID':uid,'friendID':result[i].friendID},
                        {'userID':result[i].friendID,'friendID':uid}
                    ]
                },
                order:[
                    ['time','DESC']
                ]
            })
            if(result2){
                let newM = {
                    'friendID':result[i].UserSchema.id,
                    'imgurl':result[i].UserSchema.imgurl,
                    'markname':result[i].markname,
                    'name':result[i].UserSchema.name,
                    'lastTime':result[i].lastTime,
                    'newMessage':result2[0].message,
                    'newMessageType':result2[0].types
                }
                newsList.push(newM)

            }
        }
        res.send({
            status:200,
            newsList
        })
    }else{
        res.send({
            status:500,
        })
    }



}

//获取好友
async function searchFriend(uid,res){
    let whereStr ={
        'userID':uid
    }
    let result = await FriendSchema.findAll({
        where:whereStr,
        include:[
            {model:UserSchema,
                where:UserSchema.id===FriendSchema.userID
            }
        ]
    });
    if(result){
        res.send({
            status:200,
            result
        })
    }else{
        res.send({
            status:500,
        })
    }
}

//初始用户信息

async function initUserInfo(uid,res){
    console.log("初始化用户！")
    let whereStr ={
        'id':uid
    }
    let result = await UserSchema.findOne({
        attributes:['name','imgurl','email','sex','birth','phone','explain','time'],
        where:whereStr,
    });
    if(result){
        res.send({
            status:200,
            result
        })
    }else{
        res.send({
            status:500,
        })
    }
}



module.exports.addUser = addUser;
module.exports.countUserValue = countUserValue;
module.exports.userMatch = userMatch;
module.exports.getUserByEmail = getUserByEmail;

module.exports.searchUser = searchUser;
module.exports.isFriend = isFriend;
module.exports.searchGroup = searchGroup;
module.exports.isInGroup = isInGroup;

module.exports.getUserByID = getUserByID;
module.exports.updateUserByID = updateUserByID;
module.exports.updateUserPSWByID = updateUserPSWByID;
module.exports.updateUserImgURLByID = updateUserImgURLByID;

module.exports.searchNews = searchNews;
module.exports.searchFriend = searchFriend;

module.exports.initUserInfo = initUserInfo;

