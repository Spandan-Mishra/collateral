import axios from "axios";
import { BACKEND_URL } from "../config";
import { RoomClient } from "./RoomClient";

const getMessages = async(roomId: string) => {
    const response = await axios.get(`${BACKEND_URL}/chats/${roomId}`);
    return response.data.messages;
}

export const Room = async ({
    roomId
}: {
    roomId: string
}) => {
    const messages = await getMessages(roomId);
    return <RoomClient messages={messages} roomId={roomId} />; 
}