
const express = require('express');
const http = require('http');
const {Server} = require('socket.io');

const PORT = 8080;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const connectedClients = {};

io.on('connection', (socket) => {
  const clientId = socket.id;
//   console.log(clientId)
  connectedClients[clientId] = socket;

  console.log(`Client ${clientId} connected`);

  (function sendMessage(){
    let verify = setTimeout(()=>{
        console.log(`Client Disconnected ${clientId}`)
        delete connectedClients[`${clientId}`]
        socket.disconnect()
    },5000)

    socket.emit("PING","PING")
    connectedClients[`${clientId}_timer!`] = verify
  })()

  socket.on('msg', (pongMsg) => {
    if(pongMsg == "PONG"){
        resetTime(clientId)
    } 
    console.log(`Received PONG from ${clientId}`);
  });


  let setIntervalTimer = setInterval(() => {
    socket.emit("PING","PING")
    let timer = setTimeout(()=>{
        clearInterval(setIntervalTimer)
        delete connectedClients.clientId
        console.log(`client ${clientId} disconnted`)
        socket.disconnect()
    },5000)

    connectedClients[`${clientId}_timer!`] = timer
    }, 30000);

    socket.on('disconnect', () => {
        delete connectedClients[clientId];
        console.log(`Client ${clientId} disconnected`);
    });
});


app.get('/clients', (req, res) => {
  const clients = Object.keys(connectedClients);
  let clientsArray = clients.filter(el=> el[el.length-1] != "!")
  res.json({ clientsArray });
});

function resetTime(id){
    const timer = connectedClients[`${id}_timer!`]
    if(timer){
        clearTimeout(timer)
    }
}

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
