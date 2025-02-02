import axios from "axios";
import { BACKEND_URL } from "../../config";
import { Room } from "../../components/Room";

async function getRoomId(slug: string) {
    const response = await axios.get(`${BACKEND_URL}/room/${slug}`);
    return response.data.room.id;
}

const RoomServer = async({
    params
}: {
    params: {
        slug: string;
    }
}) =>{
    const slug = (await params).slug;
    const roomId = await getRoomId(slug);

    return <Room roomId={roomId}></Room>;
}

export default RoomServer;