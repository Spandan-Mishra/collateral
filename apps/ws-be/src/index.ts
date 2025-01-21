import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
  

  ws.on('message', function message(data) {
    ws.send("hi");
  });

});