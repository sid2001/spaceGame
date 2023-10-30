class Player {

  constructor(dir,eye,eyeball,username){
    this.username = username;
    this.eye = eye;
    this.eyeball = eyeball;
    this.dir = dir;
    this.positionX = 0;
    this.positionY = 0;
    this.isMoving = false;
    this.isMovingX = false;
    this.isMovingY = false;
    this.speed = 0;
    this.speedY = 0;
    this.speedX = 0;
    this.omega = 0.5;
    this.acc = 1.5;
    this.accX = 0;
    this.accY = 0;
    this.maxSpeed = 35;
    this.terminalSpeed = false;
    this.isFueling = false;
    this.isSteering = false;
    this.rotated = 0;
    this.inputs = {steerR:false,steerL:false};
    this.friction = 1;
    this.frictionX = 0;
    this.frictionY = 0;
    this.bCount = 0;
    this.slope = 0;
    this.isReverse = false;
    this.rMaxSpeed = 15;
    this.rIsTerminalSpeed = false;
    this.mouseX = 0;
    this.mouseY = 0;
  }
  
  steer(d) {
    // console.log("steering");

    const rotation = setInterval(()=>{
      // console.log("Rotated:",this.rotated);
      if(this.inputs.steerR===true) d = 1;
      else if(this.inputs.steerL===true) d = -1;
      this.rotated = this.rotated + d*this.omega;
      if(this.rotated>=360||rotation<=-360) this.rotated = 0;
      this.dir.style.transform = "rotate("+this.rotated+"deg)";
      if(this.isSteering===false) clearInterval(rotation);
    },0);
  }

  move(){
    console.log(this.acc);
    const translate = setInterval(()=>{
      if(this.isMoving===false) this.speed = 0.8;
      this.frictionX = Math.abs(Math.sin(this.rotated*(Math.PI/180))*this.friction);
      this.frictionY = Math.abs(Math.cos(this.rotated*(Math.PI/180))*this.friction);
      if((this.speed>=this.maxSpeed&&this.isFueling===true&&this.isReverse===false)) this.terminalSpeed=true;
      if(this.isReverse===true&&Math.abs(this.speed)>=this.rMaxSpeed) this.rIsTerminalSpeed = true;
      // console.log("speed:",this.speedX,this.speedY);
      if(this.isFueling===true) this.speed += this.acc;
      // console.log(this.acc);
      if(this.friction>=Math.abs(this.speed)&&this.isMoving===true)
       this.speed = 0;
      else{
        this.isMoving = true;
        if(this.speed<0)
        this.speed += this.friction;
        else
        this.speed -= this.friction;
      }
      if(this.terminalSpeed===true&&this.isFueling&&this.isReverse===false) this.speed = this.speed - this.acc+this.friction;
      if(this.isReverse&&this.rIsTerminalSpeed&&this.isFueling) this.speed = this.speed -this.acc -this.friction;
      this.speedX = Math.sin(this.rotated*(Math.PI/180))*this.speed;
      this.speedY = Math.cos(this.rotated*(Math.PI/180))*this.speed;
      // console.log("speed:",this.speedX,this.speedY);
      this.positionX = this.eye.offsetLeft+this.speedX;
      this.positionY = this.eye.offsetTop-this.speedY;
      // console.log("speedd: ",this.speed);
      this.eye.style.top = this.positionY+"px";
      this.eye.style.left = this.positionX + "px";

      if(this.speed===0){
        this.isMoving = false;
        clearInterval(translate);
      }
      // this.aim()
    },100);
  }

  fuel(){

    const fueling = setInterval(()=>{
      
      if(this.isMoving===false)
        this.move();
      if(this.isFueling===false){
        clearInterval(fueling);
      }
    },100);
  }

  aim(e) {
    const {clientX:mouseX,clientY:mouseY} = e;
    this.mouseX = mouseX;
    this.mouseY = mouseY;
    const eyeRadius = this.eye.offsetHeight/2;
    const eyeX = this.eye.offsetLeft + this.eye.offsetW
  }

  onkeyup(e){
    console.log("dsfds",e);
    console.log(e.code);
    if(e.code==="KeyW"){
    console.log("Up W");
    this.isFueling = false;
    this.terminalSpeed = false;
  }
    if(e.code==="KeyS"){
      console.log("Up S");
      this.isReverse = false;
      this.rIsTerminalSpeed = false;
    this.isFueling = false;
    this.acc = Math.abs(this.acc);
  }
  if(this.isSteering===true){
    if(e.code==="KeyD"){
      this.inputs.steerR = false;
    }
    else if(e.code==="KeyA")
      this.inputs.steerL = false;
    
    if(this.inputs.steerL===false&&this.inputs.steerR===false)
      this.isSteering = false;
  }
  }

  onkeydown(e){
    console.log(e);
    
    if(e.code==="KeyW"&&this.isFueling===false){
      console.log("down W");
      this.acc = Math.abs(this.acc);
      this.isFueling = true;
      this.fuel();
    }
    else if((e.code==="KeyS"&&this.isFueling===false)){
      console.log("down S");
      this.isReverse = true;
      this.acc = -1*Math.abs(this.acc);
      this.isFueling = true;
      this.fuel();
    }
    if(e.code==="KeyD"){
      if(this.inputs.steerL=== false)
        this.inputs.steerR = true;
      // isSteering = true;
      if(this.isSteering===false){
        this.isSteering = true;
        this.steer(1);  
      }
    }
    else if(e.code==="KeyA"){
      if(this.inputs.steerR === false)
      this.inputs.steerL = true;
      // isSteering = true;
      if(this.isSteering===false){
        this.isSteering = true;
        this.steer(1);  
      }
  }
  }
}
var remotePlayersCount = 0;
var localPlayer;
var remotePlayers = {dum:"df"};
// var dir = document.getElementsByClassName("direction")[0];
// var eye = document.getElementsByClassName("eye")[0];
// var eyeball = document.getElementsByClassName("eyeball")[0];
// const obj = new Player(dir,eye,eyeball);
var createNewPlayer = function newPlayer(data){
  let pl = document.createElement('pl');
  
  let eye = document.createElement("div");
  let eyeball = document.createElement("div");
  let direction = document.createElement("div");
  eye.setAttribute("class","eye");
  eyeball.setAttribute("class","eyeball");
  direction.setAttribute("class","direction");
  pl.appendChild(eye);
  eye.appendChild(eyeball);
  eye.appendChild(direction);
  document.body.appendChild(pl);
  var player = new Player(direction,eye,eyeball,data.username);
  if(data.type==='localPlayer'){
    localPlayer = player;
    pl.id = "localPlayer"
    window.onkeyup = e =>{
      localPlayer.onkeyup(e);
      const payload = {
        type:'action',
        event:'onkeyup',
        code:e.code,
        id:ws.id
      }
      ws.send(JSON.stringify(payload));
    }
    window.onkeydown = e => {
      localPlayer.onkeydown(e);
      const payload = {
        type:'action',
        event:'onkeydown',
        code:e.code,
        id:ws.id
      }
      ws.send(JSON.stringify(payload));
    }
  }
  else if(data.type==='remotePlayer'){
    console.log("remotePlayer");
    console.log(data.id);
    // let id = data.id;
    
    remotePlayers[data.id] = player;
    pl.id = "remotePlayer" + remotePlayersCount;
    remotePlayersCount++;
  }
  
}
var obj;

var remoteAction = function (data) {
  console.log(data);
  switch(data.event){
    case 'onkeydown':
      remotePlayers[data.id].onkeydown(data);
      break;
    case 'onkeyup':
      remotePlayers[data.id].onkeyup(data);
      break;
  }
}
function newPlayer(data){
  
  let eye = document.createElement("div");
  let eyeball = document.createElement("div");
  let direction = document.createElement("div");
  let bullet = document.createElement("div");
  eye.setAttribute("class","eye");
  eyeball.setAttribute("class","eyeball");
  direction.setAttribute("class","direction");
  bullet.setAttribute("class","bullet");
    
  document.getElementById("background").appendChild(eye);
  document.getElementsByClassName("eye")[0].appendChild(eyeball);
  document.getElementsByClassName("eye")[0].appendChild(direction);

  var dirr = document.getElementsByClassName("direction")[0];
  var eyee = document.getElementsByClassName("eye")[0];
  var eyeballl = document.getElementsByClassName("eyeball")[0];
  obj = new Player(dirr,eyee,eyeballl);
  window.onkeyup = e =>obj.onkeyup(e);
  window.onkeydown = e => obj.onkeydown(e);
}

var screenSize = {height:window.outerHeight,length:window.outerWidth};