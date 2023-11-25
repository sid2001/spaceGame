var ws;
var connectGame = function (){
  var form = document.getElementById("form");
  form.style.display="block";
  var username = document.getElementById("userText").value;
  ws = new WebSocket(`wss://013f-182-66-218-125.ngrok-free.app/game?username=${username}`);
  ws.username = username;
  ws.onerror = err=>console.log(err);
  ws.onopen = onOpen;
  ws.onmessage = onMessage;
}
function onOpen() {
  console.log("Connection Established!!");
}

async function onMessage(data) {
 
  const parsedData = JSON.parse(data.data.toString('utf8'));
  console.log("message");
  switch(parsedData.type){
    case 'sync':
      setPosition(parsedData);
      break;
    case "welcome":
      ws.id = parsedData.id;
      const payload = {
        type:'join',
        username:ws.username,
        id:ws.id
      }
      ws.send(JSON.stringify(payload));
      break;
    case 'joined':
      const jpayload = {
        type: 'getPlayers'
      }
      ws.send(JSON.stringify(jpayload));
      break
    case 'newPlayer':
      const data = {
        username:parsedData.username,
        id:parsedData.id,
        type:'remotePlayer'
      }
      console.log("new player");
      createNewPlayer(data);
      break;
    case 'players':
      parsedData.localPlayer = ws.id;
      getPlayerSpawns(parsedData);
      break;
    case "action":
      console.log(parsedData);
      action(parsedData);
      break;
  }
}