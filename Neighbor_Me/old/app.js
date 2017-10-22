//import
let express = require('express');
let app = express();
let http = require('http');
let socketio = require('socket.io');
let fs = require('fs');
let ejs = require('ejs');

//テンプレートエンジンの設定
app.engine('ejs', ejs.renderFile);
 
//GET登録
app.get('/', function(req, res){
 // テンプレートファイルのレンダリング
 res.render('index.ejs');
});

//サーバ待ち状態
var server = app.listen(8000, function(){
 console.log('Server is running');
})

app.use(express.static('js'));
app.use(express.static('lib'));

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
 
// あなたの色
let color = io.of('/color').on('connection', function(socket) {
  let id = socket.id;
  let colors = ['white', 'black', 'blue'];
  let selectedColor = color[Math.floor(Math.random() * colors.length)];
  color.to(id).emit('server_to_client', {value : selectedColor});
});

//BDに位置情報と名前を紐付けて登録．
let place = io.of('/place').on('connection', function(socket) {

  socket.on('client_to_server_place', function(data) {

    let id = socket.id;
    let x = data.x;
    let y = data.y;
    let name = data.name;
    let results;
    
    //登録
    let user = new User( {name: name, x: x, y: y, tags: ["horse"]} );
    user.save( function(err){
      console.log('save');
      if(err) {
        //名前が被っている場合の処理
        console.log(err);
      }
      //座標とかを取得
      User.find({}, function(err, results){
        // S06. server_to_clientイベント・データを送信する
        if(err){
          console.log(err);
        }else{
          place.to(id).emit('server_to_client', { values: results });
        }

      });
    });

  });

  //位置情報の更新
  socket.on('client_to_server_place_update', function(data) {

    let id = socket.id;
    let x = data.x;
    let y = data.y;
    let name = data.name;
    let tag = data.tag;
    let results;

    //登録
    User.update({name: name}, {$set: {x: x}, $set: {y: y}, $push: {tags: tag}}, function(err){
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

