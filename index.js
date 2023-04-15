'use strict';

const express = require('express');
const path = require('path');
const { createServer } = require('http');

const WebSocket = require('ws');

const app = express();
app.use(express.static(path.join(__dirname, '/public')));

const server = createServer(app);
const wss = new WebSocket.Server({ server });
var CLIENTS=[];
wss.on('connection', function connection(ws) {
    CLIENTS.push(ws);
    ws.on('message', function message(data) {
      console.log('received: %s', data);
      sendAll(data);
    //   wss.clients.forEach(function each(client) {
    //       client.send(data);
    //    });
  
    });
  
  });

function sendAll (message) {
    for (var i=0; i<CLIENTS.length; i++) {
        CLIENTS[i].send(message);
    }
}  



// wss.on('connection', function (ws) {
//   const id = setInterval(function () {
//     ws.send(JSON.stringify(process.memoryUsage()), function () {
//       //
//       // Ignoring errors.
//       //
//     });
//   }, 100);
//   console.log('started client interval');

//   ws.on('close', function () {
//     console.log('stopping client interval');
//     clearInterval(id);
//   });
// });

server.listen(3000, function () {
  console.log('Listening on http://0.0.0.0:8080');
});