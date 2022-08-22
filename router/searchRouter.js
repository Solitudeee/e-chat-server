const {searchUser,isFriend,searchGroup,isInGroup,searchUserByID,searchNews,searchFriend} = require('../server/search')

module.exports = (app)=>{
    //模糊查询用户
    app.get('/search/user',(req,res)=>{
        searchUser(req,res)
    })

    //判断两个用户是否为好友
    app.get('/search/isfriend',(req,res)=>{
        isFriend(req,res)
    })

    //模糊查询群
    app.get('/search/group',(req,res)=>{
        searchGroup(req,res)
    })

    //判断用户是否在群里
    app.get('/search/isingroup',(req,res)=>{
        isInGroup(req,res)
    })

    //通过id查询用户
    app.get('/search/userbyid',(req,res)=>{
        searchUserByID(req,res)
    })

    //获取消息
    app.get('/search/news',(req,res)=>{
        searchNews(req,res)
    })

    //获取好友
    app.get('/search/friend',(req,res)=>{
        searchFriend(req,res);
    })

}

