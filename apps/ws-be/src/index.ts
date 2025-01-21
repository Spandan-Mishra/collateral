import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws, request) {
  const url = request.url;
  if(!url) {
    ws.close();
    return ;
  }

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token");
  
  if(!token) {
    ws.close();
    return ;
  }

  ws.on('message', function message(data) {
    ws.send("hi");
  });

});