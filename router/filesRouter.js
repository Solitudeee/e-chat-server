//引入附件上传插件
let multer = require('multer')
const {searchUser, isFriend, searchGroup, isInGroup,updateUserImgURLByID} = require("../server/search");
let fs = require('fs')
let path = require('path');
let mkdir = require('../utils/mkdir')
const {getUid} = require("../utils/getInfo");

//控制文件的存储
let storage = multer.diskStorage({
    //用于确定应将上传的文件存储在哪个文件夹中，如果没有则使用操作系统默认临时文件目录
    destination: function (req, file, cb) {    //前端必须最后传file才能获取到req.body
        //路径
        let url = req.body.url;
        mkdir.mkdirs('../data/'+url,err=>{
            console.log(err);
        })
        cb(null, './data/'+url)
    },
    //用于确定文件在文件夹内应命名的内容，如果没有给出，每个文件将被赋予一个不包含任何文件扩展名的随机名称。
    //应注明扩展名
    filename: function (req, file, cb) {
        // let uid = getUid(req.headers.cookie);
        // let name = req.body.name;
        // //截取文件后缀名
        // let type = file.originalname.replace(/.+\./,".");
        let imgName = getUid(req.headers.cookie)+req.body.name+file.originalname.replace(/.+\./,".");
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)+type
        // cb(null, file.fieldname + '-' + uniqueSuffix)
        // cb(null,uid+name+type);
        cb(null,imgName);
    }
})

let upload = multer({ storage: storage })
// const upload = multer({ dest: '/data/test' })




module.exports = (app)=>{
    //前端文件上传
    app.post('/files/upload', upload.array('file', 10), function (req, res, next) {
        //获取文件信息
        let data = req.files;
        //返回给前端
        res.send(data);
    })

    app.post('/profile', upload.single('file'), function (req, res, next) {

        if(res){
            updateUserImgURLByID(req,res);
        }else{
            res.send({
                status:503,
            })
        }
    })

}