
var bodyParser= require('body-parser');  //url进行解码
var uuid = require('uuid');
var urlEncodeParser =bodyParser.urlencoded({extended:false});

// 链接数据库部分
var mysql = require('mysql');
const connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"1234",
    database:"todo"
})
connection.connect((err)=>{  //数据库正常链接
    if(err) throw  err;
    console.log("success connected....." );
})

module.exports = function (app){
    //获取数据 ，现在考虑能不能把数据库部分的内容抽离出来
    app.get('/todo',function (req,res){
        //查询数据库
        let sql = 'select * from todoapp';
        connection.query(sql,(err,results)=>{
            if(err) throw  err ;
            let backlogData =[],completeData= [];
            results.forEach(function(result){
                if(result.state==="backlog"){
                    backlogData.push(result);
                }else if (result.state==="done"){
                    completeData.push(result);
                }
            })
            res.render('todo', {backlogData:backlogData,completeData:completeData});  // 传回多个数据的时候直接以对象属性的形式传回
        })
    })

    //传递数据
    //从前台传回来数据
    app.post('/todo',urlEncodeParser,(req,res)=>{
        if(req.body.task==="insert"){
            var sql = 'insert into todoapp set  ?';
            var values={
                id : mysql.escape(uuid.v1()), //和connection.escape（string）效果一样
                state: 'backlog',
                content: mysql.escape(req.body.todo)
            }
            connection.query(sql,values,(err,data)=>{
                if(err) throw  err;

            })
        }else if(req.body.task==="update"){
            var sql ='update todoapp set state="done" where content="'+"'"+req.body.todo+"'"+'" ';  //传递回来的字符已经把单引号去掉了，所以匹配不上
            connection.query(sql,(err,res)=>{
                if(err) throw err;
            })
        }



    })

    //删除数据
    app.delete('/todo/:item',(req,res)=>{  //item 是用来接收ajax传递过来的数据，名字和那边的可以不一致
        var sql = 'delete from todoapp where content = "'+"'"+req.params.item+"'"+'" ';
        connection.query(sql,(err,res)=>{
            if(err) throw  err;
        })
    //删除数据之后没有及时更新页面
    })
}