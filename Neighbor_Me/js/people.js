// io
let chat = io('https://www.navieclipse.com/chat');
//let color= io('https://www.navieclipse.com/color'); 
let place = io('https://www.navieclipse.com/place');

let name = '';

let myName = 'doi';

//自分の座標
let myx, myy;
//周りの座標
let others = [];

let range = 1000;

////////////////////////////////////////////////////////////////////////
//chat.on("server_to_client", function(data){appendMsg(data.value)});
place.on("server_to_client", function(data) {
  let num = 1;
  for (let i=0; i<data.values.length; i++){
    let value = data.values[i];
    console.log('name: ' + value.name);
    if(value.name == myName){
     // console.log('my');
    }else{
      //自分に近い人だけ表示
      //let length = (value.x - myx) * (value.x - myx);
      //length = (value.y - myy) * (value.y - myy);
      //if(length < range){
        appendPeople(value.name, value.tags, num);
      //}
    }
    if(i==1){
      $("#personName").after(value.name);
      $("#personTag").after(value.tags[0]);
      $("#personTag2").after(value.tags[1]);
    }
    num+=1;
    if (num>=6) num = 1;
  }
});

///////////////////////////////////////////////////////
//初期化
initial();
updateTags();

//
//
function person_detail(){
  console.log("ffffff");
  $('.blue.item').trigger("click");
}
$('.auther').click(function() {
  console.log(444444);
  $('.blue.item').trigger("click");
});
///////////////////////////////////////////////////////

function appendPeople(name, tags,num) {
  let output =  '<div class="ui comments">';
    output += '<div class="comment">';
    output += '<a class="avatar">';
    output += '<img src="icon' +num+'.png">';
    output += '</a>';
    output += '<div class="content">';
    output += '<a class="author" onclick= person_detail()>' + name +'</a>';
    output += '<div class="text">';
    for(let i=0; i<tags.length; i++){
      output += " " + tags[i];
    }
    output += '</div></div></div>';
    //output += '<h4 class="ui horizontal divider header"></h4>';
    $("#people").after(output);
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
  //setup();
}

function geoFindMe() {
  let output = document.getElementById("out");
  if (!navigator.geolocation){
    output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
    return;
  }
  //updateTags();
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

///////////////////////////////////////////////////////////////
//人
let Hito = function(name, x, y, tags){
  this.name = name;
  this.tags = tags;
  this.x = x;
  this.y = y;

  this.upDate = function(x, y, tags){
    this.x = x;
    this.y = y;
    this.tags = tags;
  }
}

///////////////////////////////////////////////////////////
function setup() {
  //自分の位置
  figs = new Array(1);
  figs[0] = new Hito(name, myx, myy, ['']); 
}

function deleteMember(){
  //自分の位置
  figs = new Array(1);
  figs[0] = new Hito(name, myx, myy, ['']); 
}

function addMember(name, memX, memY, tags) {
  //新しい位置
  let Hitode =  new Hito(name, memX, memY, tags); 
  figs.push(Hitode);
}

