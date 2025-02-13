"use client";
import useSocket from "@/hooks/useSocket";
import Canvas from "./Canvas";

const CanvasRoom = ({ slug }: { slug: string }) => {
    const {socket, loading} = useSocket(slug);
    if(loading) {
        return <div>Loading...</div>
    }    

    return <div>
        <Canvas socket={socket} slug={slug} />
    </div>
}

export default CanvasRoom;