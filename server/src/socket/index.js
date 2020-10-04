let socketServer = (httpServer) => {
    const io = require('socket.io')(httpServer)

    sockets = []

    // Se establece conexion de los jugadores
    io.on('connection', (socket) => {
        console.log(socket.id)

        // Se registran los socketes conectados
        sockets.push(socket)

        // Se emite el video al oponente
        socket.on('videoStream', (data) => {
            sockets.forEach(socket => {
                if(socket.id != data.id){
                    socket.emit('video', data)
                }
            })  
        
        })

        // Se recibe las posiciones de los jugadores
        socket.on('posiciones', (data) => {
            sockets.forEach(socket => {
                if(socket.id != data.id){
                    // Se emite la posicion del jugador opuesto
                    socket.emit('posiciones2', data)
                }
            })  
        
        })

        socket.on('disconnect', () => {
            sockets = sockets.filter(socket2 => socket2.id !== socket.id)
            socket.broadcast.emit('video', {id: socket.conn.id, data: null})
        })
    })


}

module.exports = {
    socketServer
}




