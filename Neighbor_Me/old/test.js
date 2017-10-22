// Expressのライブラリをロード
var express = require('express');
// ExpressのApplicationオブジェクトを作成しておく
var app = express();
 
// EJSのロード
var ejs = require('ejs');
// テンプレートエンジンの設定
app.engine('ejs',ejs.renderFile);
 
// GETを登録する
//第１引数：アクセスしたパス、第二２引数：実行する関数
app.get('/', function(req, res){
 // テンプレートファイルのレンダリング
 res.render('index.ejs', 
 {title : 'Express + EJS' , 
 content: '大分シンプルになった！'});
});
//指定のポート番号で待ち受け状態を開始
var server = app.listen(8000, function(){
 console.log('Server is running!');
})
