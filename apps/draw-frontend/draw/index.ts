import { HTTP_BACKEND, WS_URL } from "@/config";
import axios from "axios";
import { responseCookiesToRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

type Shape = {
    type: "rectangle";
    x: number;
    y: number;
    w: number;
    h: number;
} | {
    type: "circle";
    x: number;
    y: number;
    r: number;
}

const initCanvas = async (canvas: HTMLCanvasElement, slug: string, socket: WebSocket | null) => {
    const ctx = canvas.getContext('2d');

    if (!ctx || !socket) {
        return ;
    }

    const roomId = await getRoomId(slug);
    let existingShapes: Shape[] = await getExistingShapes(roomId);
    renderShapes(existingShapes, ctx, canvas);

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if(message.type === "chat") {
            const shape = JSON.parse(message.message);
            existingShapes.push(shape);
            renderShapes(existingShapes, ctx, canvas);
        }
    }

    let clicked = false;
    let startX = 0, startY = 0;

    canvas.addEventListener('mousedown', (e) => {
        clicked = true;
        startX = e.clientX;
        startY = e.clientY;
    })

    canvas.addEventListener('mouseup', (e) => {
        clicked = false;
        const shape: Shape = {
            type: "rectangle",
            x: startX,
            y: startY,
            w: e.clientX - startX,
            h: e.clientY - startY
        }
        existingShapes.push(shape)

        socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify(shape),
            roomId
        }))
    })

    canvas.addEventListener('mousemove', (e) => {
        if (clicked) {
            const width = e.clientX - startX;
            const height = e.clientY - startY;
            renderShapes(existingShapes, ctx, canvas);
            ctx.strokeStyle = 'white';
            ctx.strokeRect(startX, startY, width, height);
        }
    })
}

const renderShapes = (existingShapes: Shape[], ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        existingShapes.forEach(shape => {
            if(shape.type == "rectangle") {
                ctx.strokeStyle = 'white';
                ctx.strokeRect(shape.x, shape.y, shape.w, shape.h);
            }
        })
}

const getExistingShapes = async (roomId: string) => {
    const response = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
    const messages = response.data.messages;

    const shapes = messages.map((x: {message: string}) => {
        return JSON.parse(x.message);
    })

    return shapes;
}

const getRoomId = async (slug: string) => {
    const response = await axios.get(`${HTTP_BACKEND}/room/${slug}`);
    return response.data.room.id;
}

export default initCanvas;