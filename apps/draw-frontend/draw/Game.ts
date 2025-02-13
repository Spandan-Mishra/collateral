
import { getExistingShapes, getRoomId } from "./http";
import { Shape, Tools } from "./types";

export class Game {

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private roomId: string;
    private existingShapes: Shape[];
    private selectedTool: Tools;
    private socket: WebSocket;
    private clicked: boolean;
    private startX: number;
    private startY: number;

    constructor(canvas: HTMLCanvasElement, slug: string, socket: WebSocket) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
        this.roomId = "";
        this.existingShapes = [];
        this.selectedTool = "rectangle";
        this.socket = socket;
        this.clicked = false;
        this.startX = 0;
        this.startY = 0;
        this.init(slug);
        this.initSocketHandlers();
        this.initMouseHandlers();
    }

    setTool(tool: Tools) {
        this.selectedTool = tool;
    }

    async init(slug: string) {
        this.roomId = await getRoomId(slug);
        this.existingShapes = await getExistingShapes(this.roomId);
        this.renderShapes();
    }

    initSocketHandlers() {
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);

            if(message.type === "chat") {
                const shape = JSON.parse(message.message);
                this.existingShapes.push(shape);
                this.renderShapes();
            }
        }
    }

    initMouseHandlers() {
        this.canvas.addEventListener('mousedown', (e) => {
            this.clicked = true;
            this.startX = e.clientX;
            this.startY = e.clientY;
        })

        this.canvas.addEventListener('mouseup', (e: MouseEvent) => {
            this.clicked = false;
            let shape: Shape | null = null;
            if(this.selectedTool === "rectangle") {
                shape = {
                    type: "rectangle",
                    x: this.startX,
                    y: this.startY,
                    w: e.clientX - this.startX,
                    h: e.clientY - this.startY
                }
            } else {
                shape = {
                    type: "circle",
                    x: this.startX,
                    y: this.startY,
                    rx: Math.abs(e.clientX - this.startX),
                    ry: Math.abs(e.clientY - this.startY)
                }
            }
            this.existingShapes.push(shape)

            this.socket.send(JSON.stringify({
                type: "chat",
                message: JSON.stringify(shape),
                roomId: this.roomId
            }))
        })

        this.canvas.addEventListener('mousemove', (e: MouseEvent) => {
            if (this.clicked) {
                const width = e.clientX - this.startX;
                const height = e.clientY - this.startY;
                this.renderShapes();
                this.ctx.strokeStyle = 'white';

                if(this.selectedTool === "rectangle") {
                    this.ctx.strokeRect(this.startX, this.startY, width, height);
                } else {
                    this.ctx.beginPath();
                    this.ctx.ellipse(this.startX, this.startY, Math.abs(width), Math.abs(height), 0, 0, 2 * Math.PI);
                    this.ctx.stroke();
                }
            }
        })
    }

    renderShapes() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.existingShapes.forEach(shape => {
            if(shape.type == "rectangle") {
                this.ctx.strokeStyle = 'white';
                this.ctx.strokeRect(shape.x, shape.y, shape.w, shape.h);
            } else {
                this.ctx.beginPath();
                this.ctx.ellipse(shape.x, shape.y, shape.rx, shape.ry, 0, 0, 2 * Math.PI);
                this.ctx.strokeStyle = 'white';
                this.ctx.stroke();
            }
        })
    }
}