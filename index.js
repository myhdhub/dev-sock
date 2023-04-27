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
  const sockApi = new WebSocket('ws://148.251.21.118:5570');
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
          // console.log('received msg from: %s', ws);
    
          wss.clients.forEach(function each(client) {
            if(client.id == ws.id) {
                if(feedData.length > 0){
                feedData.forEach(message => {
                  client.send(message);
                });
              }
            }
           });
    
          // if(messageData.pageData) {
          // console.log('pageeee');
    
          // }
    
          // ws.close();
          // ws.pong
          // var msg = JSON.parse(messageData);
          // sendAll(messageData);
        //   wss.clients.forEach(function each(client) {
          // wssMySock.send(messageData);
        //    });
          // if(messageData.pageData) {
            // wssMySock.send(messageData);
          // }
          
      
        });
    
        // if(feedData.length > 0){
          
        //   feedData.forEach(element => {
        //     // console.log("element ===",element);
        //     for (var j=0; j<CLIENTS.length; j++) {
        //       CLIENTS[j].send(element);
        //     }
        //   });
          
        // }
      
      });

server.listen(8080, function () {
  console.log('Listening on http://0.0.0.0:8080');

});

runServer();


setInterval(() => {

  // closeSockApi();

  sockApi.close();

  runServer();

  
  // runServerSetInterval();
    
  }, 120000);

function runServer() {

  var feedData = [];
  
  // var CLIENTS=[];
  
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
        // console.log('received msg from: %s', ws);
  
        wss.clients.forEach(function each(client) {
          if(client.id == ws.id) {
              if(feedData.length > 0){
              feedData.forEach(message => {
                client.send(message);
              });
            }
          }
         });
  
        // if(messageData.pageData) {
        // console.log('pageeee');
  
        // }
  
        // ws.close();
        // ws.pong
        // var msg = JSON.parse(messageData);
        // sendAll(messageData);
      //   wss.clients.forEach(function each(client) {
        // wssMySock.send(messageData);
      //    });
        // if(messageData.pageData) {
          // wssMySock.send(messageData);
        // }
        
    
      });
  
      // if(feedData.length > 0){
        
      //   feedData.forEach(element => {
      //     // console.log("element ===",element);
      //     for (var j=0; j<CLIENTS.length; j++) {
      //       CLIENTS[j].send(element);
      //     }
      //   });
        
      // }
    
    });
  
  
  function sendAll (message) {
      for (var i=0; i<CLIENTS.length; i++) {
          CLIENTS[i].send(message);
      }
  }  
  
  
  const connect = (endpoint,isReload) => {
   
  
    try {
  
      let options = {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36"
        }
      };
  
      let client = sockApi;
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
        
        console.log("main---sock--msg",event.data);
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
        connect("ws://148.251.21.118:5570",false);
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
          
          // client.close();
  
          console.log("uint8===",JSON.parse(decodeData));
          // connect("ws://148.251.21.118:5570");
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

  connect("ws://148.251.21.118:5570", false);


  
}

function runServerSetInterval() {

  var feedData = [];
  
  // var CLIENTS=[];
  
  
  function sendAll (message) {
      for (var i=0; i<CLIENTS.length; i++) {
          CLIENTS[i].send(message);
      }
  }  
  
  // sockApi.close();

  console.log("closeeeee");
  
  const connect = (endpoint,isReload) => {
   
  
    try {
  
      let options = {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36"
        }
      };
  
      let client = sockApi;
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
        
        console.log("main---sock--msg",event.data);
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
        connect("ws://148.251.21.118:5570",false);
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
          
          // client.close();
  
          console.log("uint8===",JSON.parse(decodeData));
          // connect("ws://148.251.21.118:5570");
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

  connect("ws://148.251.21.118:5570", false);


  
}

function closeSockApi() {
  // sockApi.onopen = () => {
    sockApi.close();
    console.log("set interval close---");

  // }
}