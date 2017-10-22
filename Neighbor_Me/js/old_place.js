let chat = io('https://www.navieclipse.com/chat');
let color= io('https://www.navieclipse.com/color'); 
let place = io('https://www.navieclipse.com/place');

let isEnter = false;
let name = '';

//画面の大きさ
let width = window.innerWidth;
let height = window.innerHeight;
let margin = (width)/10;
let boardWid = width - margin;
let centorP = boardWid/2;

//自分の座標
let myx, myy, myName;
//周りの座標
let others = [];

// C04. server_to_clientイベント・データを受信する
chat.on("server_to_client", function(data){appendMsg(data.value)});
color.on("server_to_client", function(data) {appendColor(data.value)});
place.on("server_to_client", function(data) {
  //とりあえず一回消去
  deleteMember();
  for (let i=0; i<data.values.length; i++){
    let value = data.values[i];
    console.log('name: ' + value.name);
    if(value.name == myName){
      console.log('my');
    }else{
      addMember(value.name, value.x, value.y, value.num, value.tags);
    }
  }
});

function appendMsg(text) {
    $("#chatLogs").prepend("<div>" + text + "</div>");
}

function appendColor(text) {
    $("#color").append("<div>" + text + "</div>");
}

function appendPlace(text) {
    $("#place").append("<div>" + text + "</div>");
}

function appendLog(text) {
    $("#chatLogs").prepend("<div>" + text + "</div>");
}

$("form").submit(function(e){
  let message = $("#msgForm").val();
  let tag = $("#tagForm").val();
  let selectRoom = 1; // $("#rooms").val();
  $("#msgForm").val('');
  if (isEnter) {
    updateTags(message);
    message = "タグ追加" + message;
    //データを送信する
    chat.emit("client_to_server", {value : message, tag: tag});
  } else {
    name = message;
    let entryMessage = name + "さんがログインしました";
    console.log('join');
    chat.emit("client_to_server_join", {value : selectRoom});
    console.log('join2');
    // C05. client_to_server_broadcastイベント・データを送信する
    chat.emit("client_to_server_broadcast", {value : entryMessage});
    // C06. client_to_server_personalイベント・データを送信する
    chat.emit("client_to_server_personal", {value : name});
    changeLabel();
  }
  e.preventDefault();
});

function changeLabel() {
    geoFindMe();
    myName = name;
    $(".nameLabel").text("タグ追加");
    $("#rooms").prop("disabled", true);
    $("button").text("送信");
    isEnter = true;
    setup();
}

function geoFindMe() {
  let output = document.getElementById("out");

  if (!navigator.geolocation){
    output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
    return;
  }

  function success(position) {
    let latitude  = position.coords.latitude;
    let longitude = position.coords.longitude;

    myx = latitude;
    myy = longitude;

    //データベースに登録
    place.emit("client_to_server_place", {x : myx, y : myy, name : name});

    appendLog( 'Latitude: ' + latitude + '°<br> Longitude : ' + longitude +'°' );
  };

  function error() {
    output.innerHTML = "Unable to retrieve your location";
  };

  //output.innerHTML = "<p>Locating…</p>";
  navigator.geolocation.getCurrentPosition(success, error);

}

function updateTags(text) {
  function success(position) {
    let latitude  = position.coords.latitude;
    let longitude = position.coords.longitude;
    myx = latitude;
    myy = longitude;
    //データベースを更新
    place.emit("client_to_server_place_update", {x : myx, y : myy, name : name, tag: text});
  };
  function error() {
    console.log('err');
  };
  navigator.geolocation.getCurrentPosition(success, error);
}

///////////////////////////////////////////////////////
//Aliases
let Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    Sprite = PIXI.Sprite,
    Text = PIXI.Text,
    Graphics = PIXI.Graphics;

//人です．
let Hito = function(name, num, tags, circle, color){

  this.name = name;
  this.tags = tags;
  this.num = num;
  this.circle = circle;
  this.color = color;

  this.upDate = function(x, y, tags){
    this.circle.x = x;
    this.circle.y = y;
    this.tags = tags;
  }

  this.getNum = function(){
    return this.num;
  }

  this.getCircle = function(){
    return this.circle;
  }

  this.press = function(){
    //おしたときにこの情報を出す．
    let textn = name + ':' + circle.x + ', ' + circle.y + ', tag:' + tags;
    appendLog(textn);
  }
}

///////////////////////////////////////////////////////////////
let ground = new Container();

//COLORS
let figs;
let black = 0x000000;
let choco = 0xD2691E;
let white = 0xFFF8DC;
let gray =  0x808080;
let ffff = 0xFFFFFF;

//renderer settings
let renderer = PIXI.autoDetectRenderer(boardWid, boardWid);
document.body.appendChild(renderer.view);
renderer.backgroundColor = white;
renderer.view.style.display = "block";
renderer.render(ground);

///////////////////////////////////////////////////////////
function setup() {

  let figSize = boardWid/10;
  /*
  let board = new Graphics();
  board.beginFill(white);
  board.lineStyle(0, black, 1);

  board.drawRoundedRect(0, 0, boardWid, boardWid, figSize);
  board.endFill();

  ground.addChild(board);
  */
  
  //ポインタ
  tink = new Tink(PIXI, renderer.view);
  pointer = tink.makePointer();

  //クリックん
  let points = new Graphics();
  points.beginFill(black);
  points.lineStyle(2, black, 1);
  points.drawCircle(0, 0, 15);
  points.endFill();
  let circleTexture = points.generateCanvasTexture();

  //自分の位置
  figs = new Array(1);
  let circle = new Sprite(circleTexture);
  circle.texture = circleTexture; 
  circle.x = centorP - 7.5;
  circle.y = centorP - 7.5;
  circle.circular = true;
  figs[0] = new Hito(name, 0, [''], circle, gray); 

  ground.addChild( figs[0].circle );

  //pointer.hitTestSprite( figs[0].getCircle() );

  //ループ
  gameLoop();
}

function deleteMember(){
  ground = new Container();
  //自分の位置
  figs = new Array(1);
  let points = new Graphics();
  points.beginFill(black);
  points.lineStyle(2, black, 1);
  points.drawCircle(0, 0, 15);
  points.endFill();
  let circleTexture = points.generateCanvasTexture();
  let circle = new Sprite(circleTexture);
  circle.texture = circleTexture; 
  circle.x = centorP - 7.5;
  circle.y = centorP - 7.5;
  circle.circular = true;
  figs[0] = new Hito(name, 0, [''], circle, gray); 

  ground.addChild( figs[0].circle );
}

function updateMember(num, memX, memY, tags) {

  for(let i=0; i<figs.length; i++){
    if(figs[i].getNum() == num){
      figs[i].upDate(memX, memY, tags);
      break;
    }
  }

}

function addMember(name, memX, memY, num, tags) {

  let figSize = 10;
  let points = new Graphics();
  points.beginFill(ffff);
  points.lineStyle(2, black, 1);
  points.drawCircle(5, 5, figSize);
  points.endFill();
  let circleTexture = points.generateCanvasTexture();
  let circle = new Sprite(circleTexture);
  circle.x = (myx - memX) * 1000000 + centorP - 5;
  circle.y = (myy - memY) * 1000000 + centorP - 5;
  circle.circular = true;
  //
  let Hitode =  new Hito(name , num, tags, circle, gray); 
  figs.push(Hitode);
  let ind = figs.length - 1;
  ground.addChild( figs[ind].getCircle() );
  pointer.hitTestSprite( figs[ind].getCircle() );
}

function play() {

  for(let i=1; i<figs.length; i++){
    let st = figs[i];
    if( pointer.hitTestSprite(st.getCircle()) ){
      if(pointer.isDown == true){
        st.press();
      }
    }
    //st.upDate(5, 5);
    //表示処理（座標読み取り）
  }

}

function gameLoop(){
  requestAnimationFrame(gameLoop);
  play();
  tink.update();
  renderer.render(ground);
}
///////////////////////////////////////////////////////
