import { HTTP_BACKEND } from "@/config";
import initCanvas from "@/draw";
import axios from "axios";
import { useEffect, useRef } from "react";

const Canvas = ({
    socket, 
    slug

}: {
    socket: WebSocket | null,
    slug: string
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null); 

    useEffect(() => {
        if (canvasRef.current) {
            initCanvas(canvasRef.current, slug, socket);
        }
    })

    return (
        <div>
            <canvas ref={canvasRef} width={1920} height={1080}></canvas>
        </div>
    )
}

export default Canvas;