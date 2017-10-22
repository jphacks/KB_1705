//import
var express = require("express");
var cookie = require("cookie-parser");
var session = require("express-session");
var bodyParser = require("body-parser");
var app = express();
let socketio = require('socket.io');
let fs = require('fs');

let ejs = require('ejs');
app.engine('ejs', ejs.renderFile);
 
app.use(express.static('js'));
app.use(express.static('regist'));
app.use(express.static('lib'));
app.use(express.static('images'));
app.use(express.static('semantic'));

app.use(cookie());
app.use(session({ secret: "YOUR SECRET SALT", resave: true, saveUninitialized: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
 
//ルーティング
app.use("/", require("./router.js"));
 
//サーバル
let server = app.listen(8000);

/////////////////////////////////////////////////////////////////////////

//DB設定
let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
let User = require('./js/users');

//websocket
let io = socketio.listen(server);
 
//クライアントと通信
let chat = io.of('/chat').on('connection', function(socket) {

  let room = '';
  let name = '';

  //ジョイン
  socket.on('client_to_server_join', function(data) {
    room = data.value;
    socket.join(room);
  });

  // データを受信する
  socket.on('client_to_server', function(data) {
    //データを送信する
    chat.to(room).emit('server_to_client', {value : data.value});
  });

  // データを受信し、送信元以外に送信する
  socket.on('client_to_server_broadcast', function(data) {
    socket.broadcast.to(room).emit('server_to_client', {value : data.value});
  });

  // データを受信し、送信元のみに送信する
  socket.on('client_to_server_personal', function(data) {
    let id = socket.id;
    name = data.value;
    let personalMessage = name + "さんとしてログインしました"
    chat.to(room).emit('server_to_client', {value : personalMessage});
  });

  //イベントを受信し、退出メッセージを送信する
  socket.on('disconnect', function() {
    console.log('disconenct' + name);
    if (name == '') {
      //無言退出
    } else {
      let endMessage = name + "さんがログアウトしました"
      //消去
      User.remove({ name: name }, function(err, result){
        if(err) throw err;
      });
      chat.to(room).emit('server_to_client', {value : endMessage});
    }
  });

});

//BDに位置情報と名前を紐付けて登録．
let place = io.of('/place').on('connection', function(socket) {

  //位置情報の更新
  socket.on('client_to_server_place_update', function(data) {

    let id = socket.id;
    let myx = data.x;
    let myy = data.y;
    let myname = data.name;
    let results;

    //登録
    User.update({name: myname}, { $set: {x: myx} }, function(err){
      if(err) {
        console.log(err);
      }
      User.update({name: myname}, { $set: {y: myy} }, function(err){
        if(err) {
          console.log(err);
        }
        //座標とかを取得
        User.find({}, function(err, results){
          if(err){
            console.log(err);
          }else{
            place.to(id).emit('server_to_client', { values: results });
          }
        });
      });
    });
  });
  
});

