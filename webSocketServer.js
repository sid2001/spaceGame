const {WebSocketServer} = require("ws");
const {v4:uuid} = require('uuid');
module.exports = async (httpServer)=>{
  let clients ={};
  let players ={};
  const wss = new WebSocketServer({
    server:httpServer,
    path:"/game"
  },(data)=>{
    console.log("WebSocket server started!!");
    console.log(data);
  })

  wss.broadcast = function(data) {
    for(const key in clients) {
      console.log(key);
      if(key!==data.id||data.toAll===true){
        console.log("Broadcasting");
        clients[key].sock.send(JSON.stringify(data));
      }
    }
  }

  wss.on("connection",async(ws)=>{
    const id = uuid();
    ws.id = id;
    clients[id] = {sock:ws};
    const payload = {
      type:"welcome",
      id:id
    }
    // console.log(ws);
    console.log(JSON.stringify(payload));
    ws.send(JSON.stringify(payload).toString("utf8"));
    console.log("message");
    ws.on("close",()=>{
      console.log(`${ws.username} left!!`);
      const payload = {
        type:"playerLeft",
        id:ws.id,
        username:ws.username
      }
      wss.broadcast(payload);
      delete clients[ws.id];
    })
    ws.on("message",(data)=>{
      const parsedMessage = JSON.parse(data.toString("utf8"));
      console.log(parsedMessage);
      switch(parsedMessage.type){
        case 'sync':
          parsedMessage.toAll = false;
          wss.broadcast(parsedMessage);
          break;
        case 'getPlayers':
          console.log("fetching players!!");
          const payload = {
            type:'players',
            players:players
          }
          ws.send(JSON.stringify(payload));
          break;
        case 'join':
          console.log("new Player!!");
          clients[parsedMessage.id].username = parsedMessage.username;
          parsedMessage.type = "newPlayer";
          wss.broadcast(parsedMessage);
          players[parsedMessage.id] = parsedMessage.username;
          const jpayload = {
            type:'joined'
          }
          ws.send(JSON.stringify(jpayload));
          break;
        case 'action' :
          parsedMessage.toAll = true;
          wss.broadcast(parsedMessage);
          break;
        default:
          console.log("message type not found!!",parsedMessage);
      }
    })
  })
}