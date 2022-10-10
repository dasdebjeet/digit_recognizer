$(document).ready(() => {
    (function (url) {
        var image = new Image();

        image.onload = function () {
            // Inside here we already have the dimensions of the loaded image
            var style = [
                // Hacky way of forcing a middle/center anchor point for the image
                'padding: ' + this.height * .5 + 'px ' + this.width * .5 + 'px;',
                'background-size: ' + this.width + 'px ' + this.height + 'px;',
                'background: url(' + url + ') no-repeat;'
            ].join(' ');

            // notice the space after %c
            console.log('%c ', style);
        };

        // Actually loads the image
        image.src = url;
    })("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAS0AAABbCAYAAAAm79OGAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMrSURBVHgB7dqhbxNRAMfxNzIwQCBBIsCgMCwIFAlYHP8AY8HWIMFsGCZB4FmQGByOjGQKiSPBzOBHQE2stMlIuq0t191ddz/2+STP7K6vl97tm3u9lgIQZGEwLu8PgC7Y2R9jDaO1MRjLBaAbXgzG2qSNZwpAENECoogWEEW0gCiiBUQRLSCKaAFRRAuI4selQKf01pZKb3Vp7LZ+KSvutIAoogVEES0gimgBUUQLiCJaQBTRAqKIFhBFtIAoogVEES0gimgBUUQLiCJaQBTRAqKIFhBFtIAoogVEES0gimgBUUQLiCJaQBTRAqIsljlb37hbHi7fmLrPs5Wt8mHje+V5Zt1/1vet8l5NzT/ra+c5T5XXznOeKnPWuU4Sr4emroEuc6cFRBEtIMrcl4ejJt2mvtt8UNbf3p26TxWHb+OfPd4qbRnO/Xf+WZckB+Zp6DOpswSb9FkN9/nXMYzO8/Lpl/Jm7f3RY3t1Z6Z5mjp3w/ds4rqqYvR6OHAMFZZvB+apcZxt/3+dlBONFv+3Xzu75cf276N//7lb4LgsD4Eop/JOq6mnWm0YXcKMGh7bo/sfS1XT5jn2cuNxu0vsKuqcu9F9qix1m1JnqVvnPDZ1LXWNOy0gimgBUU7l8nDSk74uOLyEOe6xtbHkqfNUtClNnbvD84xbRtXR1NPPpp4edu06r8OdFhDFTx5ozcVL58rV6xfG/h2O60Sj1fbTjSpLgLZ/dFrHpOOv++Ro3Gub+qwOz/P89Z2x8/QefpppnjbPXdtfF7T1BHCmHy3PeC114auASSwPgSiiBURZGIyNwVguAB3QW1sqvdWlsdv6pay40wKiiBYQRbSAKKIFRBEtIIpoAVFEC4giWkAU0QKiiBYQRbSAKKIFRBEtIIpoAVFEC4giWkAU0QKiiBYQRbSAKKIFRBEtIIpoAVFEC4giWkAU0QKiiBYQRbSAKKIFRBEtIIpoAVEWB2N7MD6P23jz9pVb5y+evVwA5uTqtQtTty9M2/it/2SzlP69AtAB/VJWLA+BKKIFRBEtIIpoAVFEC4giWkAU0QKiLE7buFf2vp7RNaAzFrb/APXdpvxFBbD3AAAAAElFTkSuQmCC");


    const paintCanvas = document.querySelector('.canvas');
    const context = paintCanvas.getContext('2d');


    if (window.innerHeight > 600) {
        // paintCanvas.width = window.innerWidth - 630
        paintCanvas.width = window.innerHeight - 180
        paintCanvas.height = window.innerHeight - 180
    } else {
        paintCanvas.width = window.innerHeight - 50
        paintCanvas.height = window.innerHeight - 50
    }

    // context.strokeStyle = "#808080"
    context.lineCap = 'round';
    context.lineWidth = 8

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

    var img_url, old_url;

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
        if (img_url && img_url != old_url) {
            try {
                $.post("http://127.0.0.1:5000/classify_image", {
                    image_data: img_url
                }, function (data, status) {
                    // console.log(data)
                    if (!data || data.length == 0) {
                        // null value returned
                        console.log("Null value recived!")
                        return
                    }

                    $(".clasification_digit_box").removeClass("clasification_digit_box_active")

                    for (var i = 0; i <= data.length; i++) {
                        $(".clasification_digit_box[data_content='" + data[i] + "']").addClass('clasification_digit_box_active')
                    }

                }).fail(() => {
                    console.log("Sever Error!")
                })

            } catch (e) {
                console.log("Server Error!")
            }
            old_url = img_url
        }
    }



    const drawLine = event => {
        if (!isMouseDown) return;

        const x = event.offsetX;
        const y = event.offsetY + 50;
        // const y = event.offsetY;

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

        $(".clasification_digit_box").removeClass("clasification_digit_box_active")
    })

    // $(".down_btn").click(() => {
    //     context.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
    //     prvw_img()
    // })




})