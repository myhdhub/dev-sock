'use strict';

const express = require('express');
const path = require('path');
const { createServer } = require('http');

const WebSocket = require('ws');

const app = express();
app.use(express.static(path.join(__dirname, '/public')));

const server = createServer(app);
const wss = new WebSocket.Server({ server });

const wssMySock = new WebSocket('wss://hammerhead-app-hq3tv.ondigitalocean.app');
  wssMySock.binaryType = "arraybuffer"; 

var CLIENTS=[];
wss.on('connection', function connection(ws) {
    CLIENTS.push(ws);
    ws.on('message', function message(messageData) {
      console.log('received: %s', messageData);
      var msg = JSON.parse(messageData);
      // sendAll(messageData);
    //   wss.clients.forEach(function each(client) {
      wssMySock.send(messageData);
    //    });

      if(msg.pageData) {
        console.log("uint8===",msg.pageData);
        // connect("ws://148.251.21.118:5570");
        // wssSockApi.send(messageData);
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

const connect = (endpoint) => {
  

  try {

    let options = {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36"
      }
    };

    let client = new WebSocket(endpoint, options);
    client.binaryType = "arraybuffer";

    client.onopen = () => {
      console.log("websocket open");
      //   client.send("42" + JSON.stringify(["getRooms", false]));
      client.send(JSON.stringify({"requestType":1,"sessionKey":"","Data":{"Firm":"ALLOW","PrivateKey":"TT@90","ApiKey":"CRIC@20"}}));

      // wssMySock.onmessage = (event) => {
      //   var enc = new TextDecoder("utf-8");
                              
      //   const decodeData = enc.decode(event.data); 
      //   let recievedData = JSON.parse(decodeData);
      //   if(recievedData.pageData) {
      //     client.close();

      //     client.send(JSON.stringify({"requestType":1,"sessionKey":"","Data":{"Firm":"ALLOW","PrivateKey":"TT@90","ApiKey":"CRIC@20"}}));
      //   }
      // };

    };

    client.onmessage = (event) => {
      console.log("websocket message:", event.data);
      // setTimeout(() => {
        sendAll(event.data);  
        // wss.send(event.data);
        
      // }, 1000);
     
    };

    client.onclose = (reason) => {
      console.log("websocket close:", reason.code);
      // setTimeout(() => {
      //   connect("ws://148.251.21.118:5570");
      // }, 1000);
      // connect("ws://148.251.21.118:5570");
    };

    client.onerror = (error) => {
      console.log("websocket error:", error.message);
    };

    wssMySock.onmessage = (event) => {
      var enc = new TextDecoder("utf-8");
                            
      const decodeData = enc.decode(event.data); 
      let recievedData = JSON.parse(decodeData);
      if(recievedData.pageData) {
        console.log("force close");
        
        client.close();

        console.log("uint8===",JSON.parse(decodeData));
        connect("ws://148.251.21.118:5570");
        // client.close();

        // connect("ws://148.251.21.118:5570");
        // location.href = '/'
    
      }
    // wss.send(event.data);
    //   getMessage(event.data);
    };
    
  } catch (error) {
    console.log("connect error:", error.message);
  }
};

connect("ws://148.251.21.118:5570");