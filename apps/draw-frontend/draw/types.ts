
export type Shape = {
    type: "rectangle";
    x: number;
    y: number;
    w: number;
    h: number;
} | {
    type: "circle";
    x: number;
    y: number;
    rx: number;
    ry: number;
} | {
    type: "pencil";
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

export type Tools = "rectangle" | "circle" | "pencil";