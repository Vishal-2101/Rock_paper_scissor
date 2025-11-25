// Simple multiplayer server using Express + Socket.IO
// Run: node server.js
const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve the static client files from the project directory so index.html and assets are available
const path = require('path');
app.use(express.static(path.join(__dirname)));

const PORT = process.env.PORT || 3000;

io.on('connection', socket =>{
  console.log('client connected', socket.id);
  socket.on('create-room', code =>{
    socket.join(code);
    socket.emit('room-created', code);
  });
  socket.on('join-room', code =>{
    socket.join(code);
    socket.emit('room-joined', code);
    socket.to(code).emit('player-joined', socket.id);
  });
  socket.on('player-pick', ({code, playerIndex, pick})=>{
    // broadcast pick to room
    io.to(code).emit('player-pick', {playerIndex, pick});
  });
  socket.on('disconnect', ()=>console.log('disconnected', socket.id));
});

app.get('/', (req,res)=> res.send('RPS server running'));

server.listen(PORT, ()=> console.log('server listening on', PORT));
