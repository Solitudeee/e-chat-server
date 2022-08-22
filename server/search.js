let {searchUser,isFriend,searchGroup,isInGroup,getUserByID,updateUserByID,updateUserPSWByID,updateUserImgURLByID,searchNews,searchFriend,initUserInfo} = require('../dao/dbServer');
let {getUid,getImgUrl} = require('../utils/getInfo')

//模糊查询用户
exports.searchUser = (req,res)=>{
    let keys = req.query.data;
    let uid = getUid(req.headers.cookie);
    searchUser(keys,uid,res).catch(()=>{
        res.send({
            status:503,
        })
    });
}

//判断两个用户是否为好友
exports.isFriend = (req,res)=>{
    let uid = getUid(req.headers.cookie);
    let fid = req.query.fid;
    isFriend(uid,fid,res).catch(()=>{
        res.send({
            status:503,
        })
    });
}

//模糊查询群
exports.searchGroup = (req,res)=>{
    let data = req.query.data;
    searchGroup(data,res).catch(()=>{
        res.send({
            status:503,
        })
    });
}

//判断用户是否在群里
exports.isInGroup = (req,res)=>{
    let uid = getUid(req.headers.cookie);
    let gid = req.query.gid;
    isInGroup(uid,gid,res).catch(()=>{
        res.send({
            status:503,
        })
    });
}


//根据id查询用户
exports.searchUserByID = (req,res)=>{
    let uid = getUid(req.headers.cookie);
    getUserByID(uid,res).catch(()=>{
        res.send({
            status:503,
        })
    })
}

//修改用户信息
exports.updateUserByID = (req,res)=>{
    let uid = getUid(req.headers.cookie);
    let sex = req.body.sex;
    let name = req.body.name;
    let birth = req.body.birth;
    let explain = req.body.explain;
    let phone = req.body.phone;
    updateUserByID(uid,sex,name,phone,birth,explain,res).catch(()=>{
        res.send({
            status:503
        })
    })
}

//修改用户密码
exports.updateUserPSWByID = (req,res)=>{
    let uid = getUid(req.headers.cookie);
    let psw = req.body.psw;

    updateUserPSWByID(uid,psw,res).catch(()=>{
        res.send({
            status:503,
        })
    })
}

//修改用户头像
exports.updateUserImgURLByID = (req,res)=>{
    let uid = getUid(req.headers.cookie);
    // let imgurl = req.body.name+req.file.originalname.replace(/.+\./,".");
    let imgName = getUid(req.headers.cookie)+req.body.name+req.file.originalname.replace(/.+\./,".");
    updateUserImgURLByID(uid,imgName,res).catch(()=>{
        res.send({
            status:503,
            url:imgName
        })
    })
}

//获取新消息
exports.searchNews = (req,res)=>{
    let uid = getUid(req.headers.cookie);
    searchNews(uid,res).catch(()=>{
        res.send({
            status:503,
        })
    })
}


//获取好友
exports.searchFriend = (req,res)=>{
    let uid = getUid(req.headers.cookie);
    searchFriend(uid,res).catch(()=>{
        res.send({
            status:503,
        })
    })
}


//初始化用户信息
exports.initUserInfo = (req,res)=>{
    let uid = getUid(req.headers.cookie,res)
    if(uid){
        initUserInfo(uid,res).catch(()=>{
            res.send({
                status:503,
            })
        })
    }

}