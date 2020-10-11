let showItem = true;

// Obtener colores desde el localStorage
let hsv = localStorage.getItem("hsvColors");
if(hsv) {
    hsv = JSON.parse(hsv)
    low = new cv.Mat(250, 250, 16, [hsv.h, hsv.s, hsv.v, 255]);
    high = new cv.Mat(250, 250, 16, [hsv.h+25, 255, 255, 255]);
}

// Funcion para ocultar la selección de color
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

// Creacion del objeto para maniputar los colores
let colorPicker = new iro.ColorPicker('#color-picker', {
    width: 150,
    color: hsv ? hsv : '#ffffff',
    layoutDirection: "horizontal",
    layout: [
        {
            component: iro.ui.Wheel,
            options: {
                sliderType: 'hue',
                sliderShape: 'circle'
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

// Evento para modificar los colores
colorPicker.on('color:change', function (color) {
    hsv = color.hsv
    low = new cv.Mat(250, 250, 16, [hsv.h, hsv.s, hsv.v, 255]);
    high = new cv.Mat(250, 250, 16, [hsv.h+20, 255, 255, 255]);
    hsv = JSON.stringify(hsv)
    // Guardado de colores seleccionados en el localStorage
    localStorage.setItem("hsvColors", hsv)
});

