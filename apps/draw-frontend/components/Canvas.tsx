import { Game } from "@/draw/Game";
import { Circle, Pencil, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import IconButton from "./IconButton";

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
            <div className="absolute top-4 w-screen flex justify-center items-center gap-2">
                <IconButton onClick={() => setSelectedTool("rectangle")} icon={<Square />} activated={selectedTool === "rectangle"} />
                <IconButton onClick={() => setSelectedTool("circle")} icon={<Circle />} activated={selectedTool === "circle"} />
                <IconButton onClick={() => setSelectedTool("pencil")} icon={<Pencil />} activated={selectedTool === "pencil"} />
            </div>
        </div>
    )
}

export default Canvas;