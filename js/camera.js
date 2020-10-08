// Obtiene el elemento del video
let camera = document.getElementById('camera')

// Si genera error al cargar o ejecutar la camara
function errorCamera(error) {
    console.error(error)
}

// Funcion para ejecutar la camara
function activateCamera(message) {
    camera.srcObject = message
    camera.height = 250;
    camera.width = 250;
    camera.play()
}

// Configuración para diferentes navegadores
navigator.getUserMedia = (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);

// Se activa la captura de información desde la camara
navigator.getUserMedia({
    video: true,
    audio: false
}, activateCamera, errorCamera)

// Configuracion del elemento canvas donde se renderiza el procesado de las imagenes
let canvas = document.getElementById('videoCanvas')
let context = canvas.getContext('2d')
canvas.height = 250;
canvas.width = 250;
context.height = canvas.height;
context.width = canvas.width;

// Se define la variable de origen del procesado de las imagenes
let src = new cv.Mat(canvas.height, canvas.width, cv.CV_8UC4)
// let dest = new cv.Mat(canvas.height, canvas.width, cv.CV_8UC1)
// Se define la variable de destino del procesado de las imagenes
let dest2 = new cv.Mat(canvas.height, canvas.width, cv.CV_8UC1)

// Configuracion incial de colores maskara
let low = new cv.Mat(250, 250, 16, [50, 100, 20, 255]);
let high = new cv.Mat(250, 250, 16, [60, 255, 255, 255]);


let mask = new cv.Mat(canvas.height, canvas.width, cv.CV_8UC4)


let contours = new cv.MatVector();
let hierarchy = new cv.Mat();

let area = 0;
let x = 0;
let y = 0;

function processVideo() {

    // Mostrar la camara en un elemento canvas html
    context.drawImage(camera, 0, 0, canvas.width, canvas.height)
    src.data.set(context.getImageData(0, 0, canvas.width, canvas.height).data);

    // Rotar la camara horizontal
    cv.flip(src, src, 1)

    // Convertir los colores rbg en hsv, desde src a dest2
    cv.cvtColor(src, dest2, cv.COLOR_RGB2HSV, 0)

    // Aplicacion del rango de colores (low, high) para encontrar mascara
    cv.inRange(dest2, low, high, mask)


    // Obtención de los contornos del objeto haciendo una aproximación simple
    cv.findContours(mask, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE)
    let moveX = ""
    let moveY = ""
    for (let i = 0; i < contours.size(); ++i) {
        // Obtener el area de los contornos
        let cnt = contours.get(i)
        area = cv.contourArea(cnt, false)
        // Lanzar golpe si el area del objeto es mayor a 10000
        // if (area > 10000) {
        //     scorpio_kick_press()
        // }
        // Obtencion de las coordenadas si el area es mayor a 1500
        if (area > 1500) {
            //Obtencion de la posicion en x e y del objeto en movimiento
            M = cv.moments(cnt, false);
            if (M.m00 == 0) {
                M.m00 = 1
            }
            x = M.m10 / M.m00
            y = M.m01 / M.m00
            x = Math.floor(x)
            y = Math.floor(y)
            
            
            if (x > 155) {
                moveX = "right_press"
                scorpio_right_press()
            } else if (x < 95) {
                moveX = "left_press"
                scorpio_left_press()
            } else {
                moveX = "right_release"
                scorpio_right_release()
                scorpio_left_release()
            }
            if (y < 55) {
                moveY = "fist_press"
                scorpio_fist_press();
            } else if (y > 195) {
                moveY = "kick_press"
                scorpio_kick_press();
            }

            let center = new cv.Point(x, y)
            let countorColor = new cv.Scalar(0, 255, 0)
            cv.circle(src, center, 7, countorColor)
            let color = new cv.Scalar(Math.round(Math.random() * 255), Math.round(Math.random() * 255),
                Math.round(Math.random() * 255));
            cv.drawContours(src, contours, i, color, 1, cv.LINE_8, hierarchy, 100);

        }
        area = 0;
        if (x < 0 || x >= canvas.width) {
            scorpio_right_release()
            scorpio_left_release()
        }
    }
    cv.imshow("videoCanvas", src)

    let data = canvas.toDataURL('image/webp');

    data = {
        x: moveX,
        y: moveY,
        data: data,
        id: socket.id
    }

    socket.emit('videoStream', data)
}

setInterval(processVideo, 60)