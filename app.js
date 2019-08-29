//搭建服务器和处理服务器中的内容
var express = require ("express");


//进入自定义模块
var todoController = require("./controller/todoController");
var app = express();  //实例化一个对象
console.log(app);
app.set("view engine","ejs");  //设置模板引擎为ejs
// app.use ('/public',express.static('public'));//前边是路径后边是对象名，这样写竟然不好使
app.use(express.static('./public'));  //为了使静态css 好使

todoController(app);//把app对象传过去之后可以在todoController之中接收并使用
app.listen(3000);//监听本机的3000端口号

