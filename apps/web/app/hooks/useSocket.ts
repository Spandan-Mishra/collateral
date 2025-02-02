import { useEffect, useState } from "react";
import { WS_URL } from "../config";

export const useSocket = () => {
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbTZuZ2xmaDgwMDAwaTVycWd2Y24wMm44IiwiaWF0IjoxNzM4NDkxMDExfQ.LBnJLxfXw3QnXxnjJUurVdPzr4R4WAZPv8QCnAosjt4`);
        
        ws.onopen = () => {
            setLoading(false);
            setSocket(ws);
        }
        
    }, []);

    return { loading, socket };
}