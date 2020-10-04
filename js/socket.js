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
    console.log(data)
})
