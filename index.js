'use strict';

const express = require('express');
const path = require('path');
const { createServer } = require('http');
var pm2 = require('pm2');
const WebSocket = require('ws');

const app = express();
app.use(express.static(path.join(__dirname, '/public')));

const server = createServer(app);
const wss = new WebSocket.Server({ server });

const wssMySock = new WebSocket('wss://hammerhead-app-hq3tv.ondigitalocean.app');
// const wssMySock = new WebSocket('wss://localhost:3000');
  wssMySock.binaryType = "arraybuffer"; 

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
      //   client.send("42" + JSON.stringify(["getRooms", false]));

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
      console.log("main-msg---",event.data);

        // setInterval(() => {
        //   feedData = [];
        //   client.close();
        // //   // console.log("length--", feedData.length);
        // //   if(feedData.length > 1000) {
        // //     let feedDataLength = feedData.length / 2;
        // //     feedData.splice(0, feedDataLength);
        // //   }
        // // }, 900000);
        // }, 900000);

        feedData.push(event.data);

        // if(feedData.length > 500) {
        //   feedData.shift();
        // }

        sendAll(event.data);  
        // wss.send(event.data);
        
      // }, 1000);
     
    };

    client.onclose = (reason) => {
      console.log("websocket close:", reason.code);
      // setTimeout(() => {
      //   connect("ws://148.251.21.118:5570");
      // }, 1000);
      // connect("ws://148.251.21.118:5570",false);
    };

    client.onerror = (error) => {
      console.log("websocket error:", error.message);
    };

    wssMySock.onmessage = (event) => {
      console.log("aa",event.data);
      // var enc = new TextDecoder("utf-8");
                            
      // const decodeData = enc.decode(event.data); 
      // let recievedData = JSON.parse(decodeData);
      if(event.data.pageData) {
        console.log("force close");
        
        client.close();

        console.log("uint8===",JSON.parse(decodeData));
        // connect("ws://148.251.21.118:5570");
        // client.close();

        // connect("ws://148.251.21.118:5570");
        // location.href = '/'
    
      }
    // wss.send(event.data);
    //   getMessage(event.data);
    };

    setInterval(() => {
      feedData = [];
      // client.close();
      connect("ws://148.251.21.118:5570",false);
    }, 240000);
    
    
  } catch (error) {
    console.log("connect error:", error.message);
  }
};

connect("ws://148.251.21.118:5570", false);

