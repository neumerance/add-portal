const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const pluralize = require('pluralize');
const config = require('./config');
const users = [];
const connections = [];
app.get('/', function(req, res){
  res.sendFile(`${__dirname}/index.html`);
});

server.listen(process.env.PORT || config.port);
console.log(`MCGI ADD-PORTAL is running in port ${config.port}`);

io.sockets.on('connection', (socket) => {
  connections.push(socket);
  console.log('Connected: ', `${connections.length} ${pluralize('client', connections.length)} connected.`);

  socket.on('disconnect', () => {
    connections.splice(connections.indexOf(socket), 1);
    console.log('Disconnected: ', `${connections.length} ${pluralize('client', connections.length)} connected.`);
  });
});