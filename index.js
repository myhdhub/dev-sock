'use strict';

const express = require('express');
const path = require('path');
const { createServer } = require('http');

const WebSocket = require('ws');

const app = express();
app.use(express.static(path.join(__dirname, '/public')));

const server = createServer(app);
const wss = new WebSocket.Server({ server });

const wssSockApi = new WebSocket('wss://jellyfish-app-uati5.ondigitalocean.app');
wssSockApi.binaryType = "arraybuffer"; 

var CLIENTS=[];
wss.on('connection', function connection(ws) {
    CLIENTS.push(ws);
    ws.on('message', function message(messageData) {
      console.log('received: %s', messageData);
      sendAll(messageData);
    //   wss.clients.forEach(function each(client) {
    //       client.send(data);
    //    });

    var enc = new TextDecoder("utf-8");
                            
      const decodeData = enc.decode(messageData.data); 
      let recievedData = JSON.parse(decodeData);
      if(recievedData.pageData) {
        console.log("uint8===",JSON.parse(decodeData));
        // connect("ws://148.251.21.118:5570");
        wssSockApi.send(messageData.data);
        // client.close();

        // connect("ws://148.251.21.118:5570");
        // location.href = '/'
    
      }
  
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

server.listen(8080, function () {
  console.log('Listening on http://0.0.0.0:8080');
});