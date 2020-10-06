let showItem = true;

function hiddenShowPicker() {
    let colorPicker = document.getElementById("color-picker");
    let picker = document.getElementById("picker")
    if (showItem) {
        colorPicker.style.display = "none"
        picker.innerText = "Show Color picker"
    }
    else {
        colorPicker.style.display = "block"
        picker.innerText = "Hidden Color picker"
    }
    showItem = !showItem;
}

let colorPicker = new iro.ColorPicker('#color-picker', {
    width: 100,
    color: '#ffffff',
    layout: [
        {
            component: iro.ui.Slider,
            options: {
                sliderType: 'hue',
                // sliderShape: 'circle'
            }
        },
        {
            component: iro.ui.Slider,
            options: {
                sliderType: 'saturation',
                // sliderShape: 'circle'
            }
        },
        {
            component: iro.ui.Slider,
            options: {
                sliderType: 'value',
                // sliderShape: 'circle'
            }
        }

    ]
});

colorPicker.on('color:change', function (color) {
    hsv = color.hsv
    low = new cv.Mat(250, 250, 16, [hsv.h, hsv.s, hsv.v, 255]);
    high = new cv.Mat(250, 250, 16, [hsv.h+20, 255, 255, 255]);
    hsv = JSON.stringify(hsv)
    localStorage.setItem("hsvColors", hsv)
});

let hsv = localStorage.getItem("hsvColors");
if(hsv) {
    hsv = JSON.parse(hsv)
    low = new cv.Mat(250, 250, 16, [hsv.h, hsv.s, hsv.v, 255]);
    high = new cv.Mat(250, 250, 16, [hsv.h+10, 255, 255, 255]);
}