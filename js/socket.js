const socket = io()

socket.on('connect', () => {
    console.log(socket);
})

// Recibe la trasmision del video y datos de las posiciones del oponente
socket.on("video", (data) => {
    if (!isSockedReady) {
        isSockedReady = true;
        updateState();
    }
    // Se captura el elemento donde se va a mostrar el video
    let image = document.getElementById("img")
    // Se asignan los datos de video a la fuente del elemento image
    image.src = data.data

    // Se capturan los datos de la funciones que se deben realizar en x e y
    let moveX = data.x
    let moveY = data.y

    // Se hace validacion de que elemento se debe realizar en la posicion x
    switch (moveX) {
        case 'right_press':
            liukang_left_press();
            break;

        case 'right_release':
            liukang_left_release();
            break;

        case 'left_press':
            liukang_right_press();
            break;

        case 'left_release':
            liukang_right_release();
            break;

        default:
            break;
    }
    // Se hace validacion de que elemento se debe realizar en la posicion y
    switch (moveY) {
        case 'fist_press':
            liukang_fist_press();
            break;

        case 'kick_press':
            liukang_kick_press();
            break;

        default:
            break;
    }
})
socket.on("ready", (data) => {
    isColorReady2 = true;
    updateState()
})