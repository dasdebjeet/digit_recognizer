$(document).ready(() => {
    const paintCanvas = document.querySelector('.canvas');
    const context = paintCanvas.getContext('2d');


    paintCanvas.width = window.innerHeight - 160
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

    var img_url;

    // var downloadBase64File = (contentBase64) => {
    //     const linkSource = contentBase64;
    //     const downloadLink = document.createElement('a');
    //     document.body.appendChild(downloadLink);

    //     downloadLink.href = linkSource;
    //     downloadLink.target = '_self';

    //     downloadLink.download = "abc";
    //     downloadLink.click();
    // }

    const prvw_img = () => {
        img_url = paintCanvas.toDataURL('image/png')

        $(".canvas_preview_img").attr("src", img_url)
        // console.log(img_url)

        $(".down_btn").attr("href", img_url)
        // $(".down_btn").trigger('click')
    }

    let isMouseDown = false;

    const startDrawing = (event) => {
        isMouseDown = true;
        drawLine(event);
    }

    const stopDrawing = () => {
        isMouseDown = false;
        context.beginPath();

        // console.log("Stopped! Img-url:", img_url)

        if (img_url) {
            try {

                $.post("http://127.0.0.1:5000/classify_image", {
                    image_data: img_url
                }, function (data, status) {
                    console.log(data)
                    if (!data || data.length == 0) {
                        // errorMsg_display("Can't detect eyes or face, try another image")
                        return
                    }

                }).fail(() => {
                    console.log("Sever Error")
                })

            } catch (e) {
                // errorMsg_display("Upload a proper image")
            }
        }
    }



    const drawLine = event => {
        if (!isMouseDown) return;

        const x = event.offsetX;
        // const y = event.offsetY + 50;
        const y = event.offsetY;

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

    // $(".down_btn").click(() => {
    //     context.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
    //     prvw_img()
    // })




})