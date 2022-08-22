const emailserver = require('../dao/emailserver')
const {signUp,judgeEmail} = require('../server/signup')
const {signIn,test} = require('../server/signin')
const {searchUser,updateUserByID,updateUserPSWByID,initUserInfo} = require('../server/search')

module.exports = (app)=>{
    app.get('/test1',(req,res)=>{
        res.send("这里是test1页面")
    });

    //邮箱测试
    app.post('/mail',(req,res)=>{
        emailserver.emailSigUp(req.body.email,res);
        // res.send("mail")
    })

    //用户注册
    app.post('/signup/add',(req,res)=>{
        signUp(req,res)
    })

    //邮箱是否占用判断
    app.post('/signup/judge',(req,res)=>{
        judgeEmail(req,res)
    })


    //用户登录
    app.post('/signin/match',(req,res)=>{
        signIn(req,res);
    })

    // //token测试
    // app.post('/signin/test',(req,res)=>{
    //     test(req,res);
    //
    // })

    //更改用户信息
    app.post('/user/updateUserInfo',(req,res)=>{
        updateUserByID(req,res);
    })

    //初始化用户信息
    app.get('/user/initUserInfo',(req,res)=>{

        initUserInfo(req,res);
    })


    //更改用户密码
    app.post('/user/updateUserPsw',(req,res)=>{
        updateUserPSWByID(req, res)
    })


}

