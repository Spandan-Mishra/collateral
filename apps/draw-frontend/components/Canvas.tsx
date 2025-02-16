import { Game } from "@/draw/Game";
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
    const [game, setGame] = useState<Game>();
    const [selectedTool, setSelectedTool] = useState<Tools>("rectangle");
    
    useEffect(() => {
        game?.setTool(selectedTool);
    }, [selectedTool, game])

    useEffect(() => {
        if (canvasRef.current) {
            const g = new Game(canvasRef.current, slug, socket!);
            setGame(g);
        }
    }, [])


    return (
        <div className="overflow-hidden h-screen">
            <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
            <div className="absolute top-4 left-1/2 flex gap-2">
                <button onClick={() => setSelectedTool("rectangle")}>Rect</button>
                <button onClick={() => setSelectedTool("circle")}>Circle</button>
                <button onClick={() => setSelectedTool("pencil")}>Pencil</button>
            </div>
        </div>
    )
}

export default Canvas;