const express = require("express");
const path = require('path');
const webSocket = require("./webSocketServer");
const dotenv = require("dotenv").config();
const app = express();
const gameRoutes = require("./routes/gameRoutes.js");
app.set("view engine", "ejs");
app.set("views","views");
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,"public")))
app.get("/",(req,res)=>{
  console.log("/");
  res.json("Hello!!");
});

app.use(gameRoutes);

const httpServer = app.listen({host:process.env.HOST,port:process.env.PORT},
  async()=>{
  console.log("server started!! at port: ",process.env.PORT);
  await webSocket(httpServer);
})