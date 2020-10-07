const socket = io()

socket.on('connect', () => {
    console.log(socket.id);
})

let canvas2 = document.getElementById('videoCanvas2')
let context2 = canvas2.getContext('2d')
canvas2.height = 250;
canvas2.width = 250;
context2.height = canvas2.height;
context2.width = canvas2.width;

// Recibe la trasmision del video del oponente
socket.on("video", (data) => {
    let image = document.getElementById("img")
    image.src = data.data

    let moveX = data.x
    let moveY = data.y


    switch (moveX) {
        case 'right_press':
            liukang_left_press();
            break;

        case 'right_release':
            liukang_left_release();
            liukang_right_release();
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


// // Reciben las posiciones del jugador 2
// socket.on('posiciones2', data => {
//     // Hacer modificacione de las posiciones de liukan
//     x = w - data.x;
//     y = data.y

//     if (y < 55) {
//         isWalking2 = true;
//         liukang_fist_press();
//     } else if (y > 195) {
//         isWalking2 = true;
//         liukang_kick_press();
//     }

//     liukangXPosition = getLiukangXPosition()

//     if (x < liukangXPosition) {
//         //mover izquierda
//         liukang_left_press()
//     } else if (x > liukangXPosition) {
//         //Mover derecha
//         liukang_right_press()
//     }

//     liukang_position(x)
//     liukang_left_release()
//     liukang_right_release()
// })