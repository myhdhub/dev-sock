'use strict';

const express = require('express');
const path = require('path');
const { createServer } = require('http');

const WebSocket = require('ws');

const app = express();
app.use(express.static(path.join(__dirname, '/public')));

const server = createServer(app);
const wss = new WebSocket.Server({ server });

//const wssMySock = new WebSocket('wss://hammerhead-app-hq3tv.ondigitalocean.app');
// const wssMySock = new WebSocket('wss://localhost:3000');
  //wssMySock.binaryType = "arraybuffer"; 

var feedData = [];

var CLIENTS=[];

wss.getUniqueID = function () {
  function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4();
};

wss.on('connection', function connection(ws) {

  ws.id = wss.getUniqueID();

    CLIENTS.push(ws);
    ws.on('message', function message(messageData) {
      let msg = JSON.parse(messageData);
      console.log('received: %s', msg);

      wss.clients.forEach(function each(client) {
        if(client.id == ws.id) {
            if(feedData.length > 0){
            feedData.forEach(message => {
              client.send(message);
            });
          }
        }
       });

    });
  
  });




function sendAll (message) {
    for (var i=0; i<CLIENTS.length; i++) {
        CLIENTS[i].send(message);
    }
}  

server.listen(8080, function () {
  console.log('Listening on http://0.0.0.0:8080');
});

const connect = (endpoint,isReload) => {
  
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

        client.send(JSON.stringify({"requestType":1,"sessionKey":"","Data":{"Firm":"ALLOW","PrivateKey":"TT@90","ApiKey":"CRIC@20"}}));

    };

    client.onmessage = (event) => {

      console.log("main--msg-",event.data);
      
      if(event.data.responseType == '4') {
        feedData.push(event.data);
      }

        sendAll(event.data);  
            
    };

    client.onclose = (reason) => {
      console.log("websocket close:", reason.code);
      
    };

    client.onerror = (error) => {
      console.log("websocket error:", error.message);
    };

    // wssMySock.onmessage = (event) => {
    //   console.log("aa",event.data);
    //   // var enc = new TextDecoder("utf-8");
                            
    //   // const decodeData = enc.decode(event.data); 
    //   // let recievedData = JSON.parse(decodeData);
    //   if(event.data.pageData) {
    //     console.log("force close");
        
    //     client.close();

    //     console.log("uint8===",JSON.parse(decodeData));
    //     // connect("ws://148.251.21.118:5570");
    //     // client.close();

    //     // connect("ws://148.251.21.118:5570");
    //     // location.href = '/'
    
    //   }
    
    // };
    
  } catch (error) {
    console.log("connect error:", error.message);
  }
};

connect("ws://148.251.21.118:5570", false);
