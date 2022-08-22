const {Sequelize,DataTypes,Model} = require('sequelize')
sequelize = require('../config/db')

//用户表
class UserSchema extends Model{}

module.exports.UserSchema =  UserSchema.init({
    id:{                         //用户ID
        type:DataTypes.BIGINT,
        primaryKey:true,
        autoIncrement:true,
    },
    name:DataTypes.STRING,         //用户名
    psw:DataTypes.STRING,          //密码
    email:{                        //邮箱
        type:DataTypes.STRING,
        defaultValue:'asexual',
    },
    sex:DataTypes.STRING,          //性别
    birth:DataTypes.DATE,          //生日
    phone:DataTypes.STRING,        //电话
    explain:DataTypes.STRING,      //介绍
    imgurl:{                       //头像连接
        type:DataTypes.STRING,
        defaultValue: 'user.png'
    },
    time:DataTypes.DATE          //注册时间
},{
    tableName:'user',
    sequelize,
    createdAt:false,
    updatedAt:false,
})

//好友表
class FriendSchema extends Model{}
module.exports.FriendSchema = FriendSchema.init({
    id:{
        type:DataTypes.BIGINT,
        primaryKey:true,
        autoIncrement:true,
    },
    userID:{
        type:DataTypes.BIGINT,
        references:{
            model:UserSchema,
            key:'id'
        },
        // field:'user_id'  //自定义列名
    },
    friendID:{
        type:DataTypes.BIGINT,
        references: {
            model:UserSchema,
            key: 'id',
        }
    },
    state:DataTypes.INTEGER,          //好友状态，0已为好友 1申请中 2申请发送中
    time:DataTypes.DATE,
    markname:DataTypes.STRING,
    lastTime:DataTypes.DATE,
},{
    tableName:'friend',
    sequelize,
    createdAt:false,
    updatedAt:false
});

// UserSchema.hasMany(FriendSchema,{
//     foreignKey:'friendID',
//     sourceKey:'id'
// })
FriendSchema.belongsTo(UserSchema,{
    foreignKey:'friendID',
    targetKey:'id'

})



//一对一消息表
class MessageSchema extends Model{}
module.exports.MessageSchema =  MessageSchema.init({
    id:{
        type:DataTypes.BIGINT,
        primaryKey:true,
        autoIncrement:true,
    },
    userID:{
        type:DataTypes.BIGINT,
        references:{
            model:UserSchema,
            key:'id'
        },
    },
    friendID:{
        type:DataTypes.BIGINT,
        references: {
            model:UserSchema,
            key: 'id',
        }
    },
    message:DataTypes.STRING,
    types:DataTypes.STRING,       //内容类型，0文字，1图片链接 2音频链接
    time:DataTypes.DATE,          //发送时间
    state:DataTypes.INTEGER      //消息状态：0已读 1未读
},{
    tableName:'message',
    sequelize,
    createdAt:false,
    updatedAt:false
});


//群表
class GroupSchema extends Model{}
module.exports.GroupSchema =  GroupSchema.init({
    id:{
        type:DataTypes.BIGINT,
        primaryKey:true,
        autoIncrement:true,
    },
    userID:{
        type:DataTypes.BIGINT,
        references:{
            model:UserSchema,
            key:'id'
        },
    },
    name:DataTypes.STRING,
    imgurl:DataTypes.STRING,
    time:DataTypes.DATE,
    notice:DataTypes.STRING
},{
    tableName:'group',
    sequelize,
    createdAt:false,
    updatedAt:false
});


//群成员表
class GroupUserSchema extends Model{}
module.exports.GroupUserSchema =  GroupUserSchema.init({
    id:{
        type:DataTypes.BIGINT,
        primaryKey:true,
        autoIncrement:true,
    },
    groupID:{
        type:DataTypes.BIGINT,
        references:{
            model:GroupSchema,
            key:'id'
        },
    },
    userID:{
        type:DataTypes.BIGINT,
        references:{
            model:UserSchema,
            key:'id'
        },
    },
    name:DataTypes.STRING,
    tip:{                              //未读消息数
        type:DataTypes.INTEGER,
        defaultValue:0
    },
    time:DataTypes.DATE,              //加入实际爱你
    shield:DataTypes.INTEGER,          //是否屏蔽群消息
    lastTime:DataTypes.DATE,
},{
    tableName:'group',
    sequelize,
    createdAt:false,
    updatedAt:false
});


//群消息表
class GroupMsgSchema extends Model{}
module.exports.GroupMsgSchema =  GroupMsgSchema.init({
    id:{
        type:DataTypes.BIGINT,
        primaryKey:true,
        autoIncrement:true,
    },
    groupID:{
        type:DataTypes.BIGINT,
        references:{
            model:GroupSchema,
            key:'id'
        },
    },
    userID:{
        type:DataTypes.BIGINT,
        references:{
            model:UserSchema,
            key:'id'
        },
    },
    message:DataTypes.STRING,
    types:DataTypes.STRING,
    time:DataTypes.DATE,
},{
    tableName:'groupmsg',
    sequelize,
    createdAt:false,
    updatedAt:false
});

