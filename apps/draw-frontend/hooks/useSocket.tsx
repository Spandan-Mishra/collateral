import { HTTP_BACKEND, WS_URL } from "@/config";
import axios from "axios";
import { useEffect, useState } from "react"

const useSocket = (slug: string) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbTcwOXhsZmcwMDAwaTU0M216Y2JwOHpkIiwiaWF0IjoxNzM5MjY1NzgwfQ.i0wOES5RFZ8QA9FDRaVleqsKB7Okt-95A3Qzm3_qpR4`);

        ws.onopen = async () => {
            const response = await axios.get(`${HTTP_BACKEND}/room/${slug}`);
            const roomId = response.data.room.id;

            ws.send(JSON.stringify({
                type: "join_room",
                roomId
            }))

            setLoading(false);
            setSocket(ws);
        }
    }, [])

    return {socket, loading};
}

export default useSocket;