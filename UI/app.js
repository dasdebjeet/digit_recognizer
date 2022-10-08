$(document).ready(() => {
    const paintCanvas = document.querySelector('.canvas');
    const context = paintCanvas.getContext('2d');


    paintCanvas.width = window.innerWidth - 450
    paintCanvas.height = window.innerHeight - 160

    // context.strokeStyle = "#808080"
    context.lineCap = 'round';
    context.lineWidth = 10

    // const colorPicker = document.querySelector('.color_picker');

    // colorPicker.addEventListener('change', event => {
    //     context.strokeStyle = event.target.value;
    // });




    // const lineWidthRange = document.querySelector('.line_range');
    // const lineWidthLabel = document.querySelector('.range_value');

    // lineWidthRange.addEventListener('input', event => {
    //     const width = event.target.value;
    //     lineWidthLabel.innerHTML = width;
    //     context.lineWidth = width;
    // });

    const prvw_img = () => {
        const img = paintCanvas.toDataURL('image/png')

        $(".canvas_preview_img").attr("src", img)
        console.log(img)
    }

    let isMouseDown = false;

    const startDrawing = (event) => {
        isMouseDown = true;
        drawLine(event);
    }

    const stopDrawing = () => {
        isMouseDown = false;
        context.beginPath();

    }



    const drawLine = event => {
        if (!isMouseDown) return;

        const x = event.offsetX;
        const y = event.offsetY + 50;

        context.lineTo(x, y);
        context.stroke();
        context.beginPath();
        context.moveTo(x, y);

        prvw_img()

    }

    paintCanvas.addEventListener('mousedown', startDrawing);
    paintCanvas.addEventListener('mouseup', stopDrawing);

    paintCanvas.addEventListener('mousemove', drawLine);
    paintCanvas.addEventListener('mouseout', stopDrawing);


    $(".clear_canvas").click(() => {
        context.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
        prvw_img()
    })
})