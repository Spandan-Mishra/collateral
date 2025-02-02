"use client";
import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

export const RoomClient = ({
    messages,
    roomId
}: {
    messages: {message: string}[];
    roomId: string;
}) => {
    const [chats, setChats] = useState(messages);
    const [currentMessage, setCurrentMessage] = useState("");
    const {loading, socket} = useSocket();
    
    useEffect(() => {
      if(socket && !loading) {
        socket.send(JSON.stringify({
            type: "join_room",
            roomId
        }))

        socket.onmessage = (event) => {
            const parsedData = JSON.parse(event.data);
            if (parsedData.type == "chat") {
                setChats(c => [...c, {message: parsedData.message}]);
            }
        }
      }  
      
    }, [socket, loading, roomId])
    

    return <div>
        {chats.map((c, index) => <div key={index}>{c.message}</div>)}

        <input type="text" value={currentMessage} onChange={(e) => {
            setCurrentMessage(e.target.value);
        }} />

        <button onClick={() => {
            socket?.send(JSON.stringify({
                type: "chat",
                roomId,
                message: currentMessage
            }))

            setCurrentMessage("");
        }}>Send Message</button>
    </div>
}