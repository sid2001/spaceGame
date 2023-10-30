const {WebSocketServer} = require("ws");
const {v4:uuid} = require('uuid');
module.exports = async (httpServer)=>{
  let clients ={};
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
      if(key!==data.id){
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
        case 'join':
          console.log("new Player!!");
          clients[parsedMessage.id].username = parsedMessage.username;
          parsedMessage.type = "newPlayer";
          wss.broadcast(parsedMessage);
          break;
        case 'action' :
          wss.broadcast(parsedMessage);
          break;
        default:
          console.log("message type not found!!",parsedMessage);
      }
    })
  })
}