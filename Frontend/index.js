const socket = io("http://localhost:8080/",{"transports":["websocket"]})

const box = document.querySelector(".message");
socket.on('connect', () => {
  console.log('Connected to server');
  box.innerHTML += `<span id= "connect">Connected To Server</span> `
});
let t 
let timeInterval = 30
let count = 1
socket.on('PING', () => {
  console.log('Received PING');
   t = setInterval(()=>{
    timeInterval = timeInterval - 1
    if(timeInterval < 0){
        timeInterval = 30
        clearInterval(t)
    }

    document.getElementById("timer").innerText = `${timeInterval}.00`
  },1000)
    box.innerHTML += `<p>Received : PING ${count++} time. </p> <p id = "right" >Sent : PONG</p><hr> `
    socket.emit('msg',"PONG");
});

socket.on('disconnect', () => {
    timeInterval = 30
    count = 1
    box.innerHTML += `<span id= "disconet">Disconnected from server</span> `
    clearInterval(t)
  console.log('Disconnected from server');
});
