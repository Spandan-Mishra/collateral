import { HTTP_BACKEND } from "@/config";
import axios from "axios";


export const getExistingShapes = async (roomId: string) => {
    const response = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
    const messages = response.data.messages;

    const shapes = messages.map((x: {message: string}) => {
        return JSON.parse(x.message);
    })

    return shapes;
}

export const getRoomId = async (slug: string) => {
    const response = await axios.get(`${HTTP_BACKEND}/room/${slug}`);
    return response.data.room.id;
}