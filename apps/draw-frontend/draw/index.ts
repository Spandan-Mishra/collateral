import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import { responseCookiesToRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

type Shape = {
    type: "rectangle";
    startX: number;
    startY: number;
    width: number;
    height: number;
} | {
    type: "circle";
    startX: number;
    startY: number;
    radius: number;
}

const initCanvas = async (canvas: HTMLCanvasElement, slug: string) => {
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        return ;
    }

    let existingShapes: Shape[] = await getExistingShapes(slug);

    renderShapes(existingShapes, ctx, canvas);

    let clicked = false;
    let startX = 0, startY = 0;

    canvas.addEventListener('mousedown', (e) => {
        clicked = true;
        startX = e.clientX;
        startY = e.clientY;
    })

    canvas.addEventListener('mouseup', (e) => {
        clicked = false;
        existingShapes.push({
            type: "rectangle",
            startX,
            startY,
            width: e.clientX - startX,
            height: e.clientY - startY
        })
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
                ctx.strokeRect(shape.startX, shape.startY, shape.width, shape.height);
            }
        })
}

const getExistingShapes = async (slug: string) => {
    const roomId = await getRoomId(slug);
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