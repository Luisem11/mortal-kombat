const socket = io()

socket.on('connect', () => {
    console.log(socket.id);
})


// Recibe la trasmision del video del oponente
socket.on("video", (data) => {
    let image = document.getElementById("img")
    image.src = data.data
})


// Reciben las posiciones del jugador 2
socket.on('posiciones2', data => {
    // Hacer modificacione de las posiciones de liukan
    x = w - data.x;
    y = data.y
    
    if(y < 55){
        isWalking2 = true;
        liukang_fist_press();     
    }
    else if(y > 195){
        isWalking2 = true;
        liukang_kick_press();
    }
    
    liukangXPosition = getLiukangXPosition()

    if(x < liukangXPosition){
        //mover izquierda
        liukang_left_press()
    }
    else if(x > liukangXPosition){
        //Mover derecha
        liukang_right_press()
    }

    liukang_position(x)
    liukang_left_release()
    liukang_right_release()
})
