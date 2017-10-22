// io
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
let myx, myy;
//周りの座標
let others = [];

///////////////////////////////////////////////////////////////
//pixi
//Aliases
let Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    Sprite = PIXI.Sprite,
    Text = PIXI.Text,
    Graphics = PIXI.Graphics;

//表示
let ground = new Container();

//フレームカウント
let fcount = 0;

//tink 
//let isTink = true;

//COLORS
let figs;
let black = 0x000000;
let choco = 0xD2691E;
let white = 0xFFF8DC;
let gray =  0x808080;
let ffff = 0xFFFFFF;

//renderer settings
let renderer = PIXI.autoDetectRenderer(boardWid, boardWid);
document.getElementById('place').appendChild(renderer.view);

//renderer
renderer.backgroundColor = white;
renderer.view.style.display = "block";
renderer.render(ground);

//ポインタ
tink = new Tink(PIXI, renderer.view);
pointer = tink.makePointer();


//人
let Hito = function(name, tags, circle, color){

  this.name = name;
  this.tags = tags;
  this.circle = circle;
  this.color = color;

  this.upDate = function(x, y, tags){
    this.circle.x = x;
    this.circle.y = y;
    this.tags = tags;
  }

  this.getCircle = function(){
    return this.circle;
  }

  //人を選択したとき
  this.press = function(){
    console.log(5555555555555555);

    //人物の情報を更新

    //isTink = false;
    $('.blue.item').trigger("click");
    /*
    let textn = name + ': ';
    for(let i=0; i<tags.length; i++){
      textn += ' ,' + tags[i];
    }
    appendLog(textn);
    */
  }

}

////////////////////////////////////////////////////////////////////////
chat.on("server_to_client", function(data){appendMsg(data.value)});
place.on("server_to_client", function(data) {
  //消去
  deleteMember();
  for (let i=0; i<data.values.length; i++){
    let value = data.values[i];
    //console.log('name: ' + value.name);
    if(value.name == myName){
     // console.log('my');
    }else{
      //console.log(value.name);
      addMember(value.name, value.x, value.y, value.tags);
    }
  }
});

///////////////////////////////////////////////////////
//初期化
initial();
///////////////////////////////////////////////////////

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

function initial() {
  let room = 1;
  //位置情報
  geoFindMe();

  let entryMessage = myName + "さんがログインしました";
  chat.emit("client_to_server_join", {value : room});
  chat.emit("client_to_server_broadcast", {value : entryMessage});
  chat.emit("client_to_server_personal", {value : myName});
  isEnter = true;
  setup();
}

function geoFindMe() {
  let output = document.getElementById("out");
  if (!navigator.geolocation){
    output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
    return;
  }
  updateTags();
}

function updateTags() {
  function success(position) {
    let latitude  = position.coords.latitude;
    let longitude = position.coords.longitude;
    myx = latitude;
    myy = longitude;
    //データベースを更新
    place.emit("client_to_server_place_update", {name: myName, x: myx, y: myy});
  };
  function error() {
    console.log('err');
  };
  navigator.geolocation.getCurrentPosition(success, error);
}

///////////////////////////////////////////////////////////
function setup() {

  let figSize = boardWid/10;

  //クリック
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
  figs[0] = new Hito(name, [''], circle, gray); 

  ground.addChild( figs[0].circle );

  pointer.hitTestSprite( figs[0].getCircle() );

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
  figs[0] = new Hito(name, [''], circle, gray); 

  ground.addChild( figs[0].circle );
  pointer.hitTestSprite( figs[0].getCircle() );
}

function addMember(name, memX, memY, tags) {
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
  //新しい位置
  let Hitode =  new Hito(name , tags, circle, gray); 
  figs.push(Hitode);
  let ind = figs.length - 1;
  ground.addChild( figs[ind].getCircle() );
  pointer.hitTestSprite( figs[ind].getCircle() );
}

function play() {

  for(let i=0; i<figs.length; i++){
    let st = figs[i];
    if( pointer.hitTestSprite(st.getCircle()) ){
      if(pointer.isDown == true){
        st.press();
      }
    }
  }

  if(fcount++ == 180){
    updateTags();
    fcount = 0;
  }

}

function gameLoop(){
  requestAnimationFrame(gameLoop);
  play();
  //tink.update();
  renderer.render(ground);
}
