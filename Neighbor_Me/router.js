//import
let router = require("express").Router();
let Tokens = require("csrf");
let tokens = new Tokens();
let mongoose = require('mongoose');
 
//データ取得
let extract = function (request) {
  return {
    name: request.body.name,
    tag: request.body.tag,
    tag2: request.body.tag2,
    _csrf: request.body._csrf
  };
};
 
//データ確認
let validate = function (data) {
  let errors = data.errors = [];
  if (!data.name) {
    errors[errors.length] = "ニックネームを入力してください";
  }
  if (!data.tag) {
    errors[errors.length] = "タグを指定してください。";
  }
  if (!data.tag2) {
    errors[errors.length] = "タグ２を指定してください。";
  }
  return errors.length === 0;
};
 
///////////////////////////////////////////////////
//get
router.get("/", function (request, response) {
  // 新規に 秘密文字 と トークン を生成
  let secret = tokens.secretSync();
  let token = tokens.create(secret);
 
  // 秘密文字はセッションに保存
  request.session._csrf = secret;
 
  // トークンはクッキーに保存
  response.cookie("_csrf", token);
 
  // 入力画面の表示
  response.render("./input.ejs");
});
 

router.post("/", function (request, response) {
  // 入力データを取得
  let data = extract(request);
 
  // 入力画面の再表示
  response.render("./input.ejs", data);
});
 
///////////////////////////////////////////////////
//confirm
router.post("/confirm", function (request, response) {
  // 入力データを取得
  let data = extract(request);
 
  // 入力データの検証
  if (validate(data) === false) {
    return response.render("./input.ejs", data);
  }
 
  response.render("./confirm.ejs", data);
});
 
///////////////////////////////////////////////////
 //complete
router.post("/complete", function (request, response) {
  let secret = request.session._csrf;
  let token = request.cookies._csrf;
  /*
  if (tokens.verify(secret, token) === false) {
    throw new Error("Invalid Token");
  }
  */
  let data = extract(request);
  if (validate(data) === false) {
    return response.render("./input.ejs", data);
  }
 
  // 登録処理
  mongoose.connect('mongodb://localhost/test');
  let User = require('./js/users');
  let user = new User( {name: data.name, tags: [data.tag, data.tag2]} );

  user.save( function(err){
    console.log('save');
    if(err) {
      //名前が被っている場合の処理
      console.log(err);
    }
    response.render("./index.ejs", data);
  });
});

router.get("/complete", function (request, response) {
  let data = extract(request);
  response.render("./index.ejs", data);
});
 
module.exports = router;
