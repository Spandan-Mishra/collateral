
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
}

export type Tools = "rectangle" | "circle" | "pencil";