import { WebSocket, WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-common/config';
import { prismaClient } from '@repo/db/client';

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket;
  userId: string;
  rooms: string[]
}

const users: User[] = [];

const authenticateUser = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if(!decoded || typeof decoded !== "object") {
      return null;
    }

    return decoded.userId;
  } catch(e) {
    return null;
  }
}

wss.on('connection', function connection(ws, request) {
  const url = request.url;
  if(!url) {
    ws.close();
    return ;
  }

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";

  const userId = authenticateUser(token);

  if(userId == null) {
    ws.close();
    return ;
  }
  
  users.push({
    userId,
    rooms: [],
    ws,
  })
  
  ws.on('message', async function message(data) {
    let parsedData;
    if(typeof data !== "string") {
      parsedData = JSON.parse(data.toString());
    } else {
      parsedData = JSON.parse(data);
    }
    if (parsedData.type == "join_room") {
      const user = users.find(u => u.ws === ws);

      if(!user) {
        return ;
      }

      user?.rooms.push(parsedData.roomId);
    }

    if (parsedData.type == "leave_room") {
      const user = users.find(u => u.ws === ws);

      if(!user) {
        return ;
      }

      user.rooms = user?.rooms.filter(r => r !== parsedData.roomId);
    }

    if (parsedData.type == "chat") {
      const roomId = parsedData.roomId;
      const message = parsedData.message;

      await prismaClient.chat.create({
        data: {
          roomId,
          message,
          userId,
        }
      })

      const roomUsers = users.filter(u => u.rooms.includes(roomId));
      roomUsers.forEach(u => {
        u.ws.send(JSON.stringify({
          type: "chat",
          roomId,
          message,
        }))
      })
    }
  });

});