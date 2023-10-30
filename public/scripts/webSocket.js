var ws;
var connectGame = async function connectGame(){
  var username = document.getElementById("userText").value;
  ws = new WebSocket(`ws://127.0.0.1:3000/game?username=${username}`);
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
    case "welcome":
      ws.id = parsedData.id;
      const payload = {
        type:'join',
        username:ws.username,
        id:ws.id
      }
      ws.send(JSON.stringify(payload));
      break;
    case 'newPlayer':
      const data = {
        username:parsedData.username,
        id:parsedData.id,
        type:'remotePlayer'
      }
      createNewPlayer(data);
      break;
    case "action":
      console.log(parsedData);
      remoteAction(parsedData);
      break;
  }
}