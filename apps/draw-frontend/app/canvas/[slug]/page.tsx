"use client";
import initCanvas from "@/draw";
import { useEffect, useRef } from "react";

const Canvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null); 

    useEffect(() => {
        if (canvasRef.current) {
            initCanvas(canvasRef.current);
        }
    })

    return (
        <div>
            <canvas ref={canvasRef} width={1920} height={1080}></canvas>
        </div>
    )
}

export default Canvas;