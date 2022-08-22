//引入解析req.body插件
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const port = 3030
const jwt = require('./utils/jwt')
require('./config/db.js')
const {getTokenFromCookies} = require("./utils/cookieSetting");
const {decodedToken} = require("./utils/jwt");
const {getUid} = require("./utils/getInfo");


const http = require('http')
const server = http.createServer(app);
const {Server} = require("socket.io");
const whitelist = ['http://49.233.30.233:8080','http://49.233.30.233:3030','http://49.233.30.233:8005']
const io = new Server(server,{
    cors:{
        // origin: "49.233.30.233:8080",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true,
        origin:(origin,callback)=>{
            if(whitelist.includes(origin))
                return callback(null,true)
            callback(new Error("Not allowed by CORS"))
        }
    },
});



//！！！！！！！！！！公共的统一处理
app.get('/', (req, res) => {
    res.send('您好')
})

//socket.io设置
require('./server/socket')(io);



// //设置跨域访问
// app.all('*', (req, res, next) => {
//     res.header("Access-Control-Allow-Origin",  "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//     res.header("Access-Control-Allow-Credentials", "true");
//     res.header("X-Powered-By",' 3.2.1')
//     res.header("Content-Type", "application/json;charset=utf-8");
//     next();
// });



//解析前端数据
app.use(bodyParser.urlencoded({limit:'50mb',extended:true}))
app.use(bodyParser.json({limit:'50mb'}))


//token判断
app.use(function (req,res,next){
    // console.log("token判断&&&&&&&&&&&&&&&&&&&&",req.headers)
    let cookie = req.headers.cookie;
    if(typeof(cookie)!='undefined'){
        let token = getTokenFromCookies(cookie);
        if(typeof(token)!='undefined') {
            //处理token匹配
            let tokenMatch = jwt.verifyToken(token);
            // url = getImgUrl(cookie);
            if (tokenMatch === 1) {
                //通过验证
                next();
            } else {
                //未通过验证
                res.send({status: 401});
            }
        }else{
            next();
        }
    }else{
        next()
    }
})

//获取静态路径
app.use(express.static(__dirname+'/data'))



//！！！！！！！！！！导入其他的路由配置
require('./router/index')(app);
require('./router/searchRouter')(app);
require('./router/friendRouter')(app);
require('./router/filesRouter')(app);



//！！！！！！！！！！！错误路由的配置
//404页面
app.use((req,res,next)=>{
    let err = new Error('Not Found');
    err.status(404);
    next(err);
})

//出现错误处理
app.use((err,req,res,next)=>{

})


// server.listen(8000, () => {
//     console.log('您已启动端口:8000');
// });

// app.listen(port, () => {
//     console.log(`您已启动端口：${port}`)
// })
server.listen(port, () => {
    console.log(`您已启动端口：${port}`)
})
