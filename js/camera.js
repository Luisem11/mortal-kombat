let camera = document.getElementById('camera')

function errorCamera(error){
    console.error(error)
}

function activateCamera(message) {
    camera.srcObject = message
    camera.height = 250;
    camera.width = 250;
    camera.play()
}

navigator.getUserMedia = (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || 
    navigator.msGetUserMedia);

navigator.getUserMedia({video: true, audio: false}, activateCamera, errorCamera)

let canvas = document.getElementById('videoCanvas')
let context = canvas.getContext('2d')
canvas.height = 250;
canvas.width = 250;
context.height = canvas.height;
context.width = canvas.width;

let src = new cv.Mat(canvas.height, canvas.width, cv.CV_8UC4)
// let dest = new cv.Mat(canvas.height, canvas.width, cv.CV_8UC1)
let dest2 = new cv.Mat(canvas.height, canvas.width, cv.CV_8UC1)

// let greenBajo = new cv.Mat(canvas.height, canvas.width, cv.CV_8UC4, [50,100,20,0])
// let greenAlto = new cv.Mat(canvas.height, canvas.width, cv.CV_8UC4, [60,255,255,0])


let low = new cv.Mat(250, 250, 16, [50, 100, 20, 255]);
let high = new cv.Mat(250, 250, 16, [60, 255, 255, 255]);


let mask = new cv.Mat(canvas.height, canvas.width, cv.CV_8UC4)
const FPS = 60;
let flag = true;
let contours = new cv.MatVector();
let hierarchy= new cv.Mat();
let begin = Date.now()
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

    // Aplicacion de la mascara de colores a dest2
    cv.inRange(dest2, low, high, mask)

    
    // Obtención de los contornos del objeto haciendo una aproximación simple
    cv.findContours(mask, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE)

    for(let i  = 0; i < contours.size(); ++i) {
        // Obtener el area de los contornos
        let cnt = contours.get(i)
        area = cv.contourArea(cnt, false)
        // Lanzar golpe si el area del objeto es mayor a 10000
        if(area > 10000) {
            scorpio_space_press()
        }
        // Obtencion de las coordenadas si el area es mayor a 1500
        else if(area >1500) {
            //Obtencion de la posicion en x e y del objeto en movimiento
            M = cv.moments(cnt, false);
            if(M.m00==0){
                M.m00=1
            }
            x = M.m10/M.m00
            y = M.m01/M.m00
            x = Math.floor(x)
            y = Math.floor(y)

            if(x > 155){
                scorpio_right_press()
            }
            else if(x < 95) {
                scorpio_left_press()
            }
            else {
                scorpio_right_release()
                scorpio_left_release()
            }

            // Emitir posiciones  de scorpion al servidor
            data = {
                x,
                y,
                id: socket.id
            }
            socket.emit('posiciones', data)
            

            let center = new cv.Point(x,y)
            let col = new cv.Scalar(0, 255, 0)
            cv.circle(src, center, 7, col)
            let color = new cv.Scalar(Math.round(Math.random() * 255), Math.round(Math.random() * 255),
            Math.round(Math.random() * 255));
            cv.drawContours(src, contours, i, color, 1, cv.LINE_8, hierarchy, 100);

        }
        area = 0;
        if(x < 0 || x >= canvas.width){
            scorpio_right_release()
            scorpio_left_release()
        }
    }
    cv.imshow("videoCanvas", src)

    if(flag) {
        flag = false
        console.log(contours)
    }

    socket.emit('videoStream', {id: socket.id, data: canvas.toDataURL('image/webp')})

    let delay = 1000/FPS - (Date.now() - begin);
    // console.log((Date.now() - begin)/1000)
    // setTimeout(processVideo, delay);
}

setInterval(processVideo, 60)