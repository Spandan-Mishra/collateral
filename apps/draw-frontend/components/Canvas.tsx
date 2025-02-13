import initCanvas from "@/draw";
import { useEffect, useRef, useState } from "react";

type Tools = "rectangle" | "circle" | "pencil";

const Canvas = ({
    socket, 
    slug

}: {
    socket: WebSocket | null,
    slug: string
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [currentTool, setCurrentTool] = useState<Tools>("rectangle");
    
    // @ts-ignore
    window.currentTool = currentTool;

    useEffect(() => {
        if (canvasRef.current) {
            initCanvas(canvasRef.current, slug, socket);
        }
    })


    return (
        <div className="overflow-hidden h-screen">
            <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
            <div className="absolute top-4 left-1/2 flex gap-2">
                <button onClick={() => setCurrentTool("rectangle")}>Rect</button>
                <button onClick={() => setCurrentTool("circle")}>Circle</button>
            </div>
        </div>
    )
}

export default Canvas;