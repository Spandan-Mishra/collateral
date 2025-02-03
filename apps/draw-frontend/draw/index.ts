
const initCanvas = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        return ;
    }

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let clicked = false;
    let startX = 0, startY = 0;

    canvas.addEventListener('mousedown', (e) => {
        clicked = true;
        startX = e.clientX;
        startY = e.clientY;
    })

    canvas.addEventListener('mouseup', (e) => {
        clicked = false;
    })

    canvas.addEventListener('mousemove', (e) => {
        if (clicked) {
            const width = e.clientX - startX;
            const height = e.clientY - startY;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = 'white';
            ctx.strokeRect(startX, startY, width, height);
        }
    })
}

export default initCanvas;